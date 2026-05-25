import express from 'express';
import { createWireClient } from 'node-firebird-driver-wire';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const client = createWireClient();
const CONFIG_FILE_PATH = path.join(process.cwd(), 'db-config.json');

// Configuração padrão
let dbConfig = {
  host: process.env.FIREBIRD_HOST || '127.0.0.1',
  path: process.env.FIREBIRD_PATH || 'D:\\Users\\Mauricio\\Documents\\portal-do-contribuinte\\banco\\dbnovaserrana.fdb',
  username: 'SYSDBA',
  password: 'masterkey'
};

// Carregar se existir
if (fs.existsSync(CONFIG_FILE_PATH)) {
  try {
    const fileContent = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
    const parsed = JSON.parse(fileContent);
    dbConfig = { ...dbConfig, ...parsed };
    console.log('✅ Configurações de banco carregadas do db-config.json');
  } catch (err: any) {
    console.error('❌ Erro ao ler db-config.json:', err.message);
  }
}

const getDbUri = () => `${dbConfig.host}:${dbConfig.path}`;
const getDbConnectOptions = () => ({
  username: dbConfig.username,
  password: dbConfig.password
});

// Test endpoint
app.get('/api/test-db', async (req, res) => {
  console.log('=== Testando conexão com banco Firebird ===');
  console.log(`URI: ${getDbUri()}`);
  
  try {
    const attachment = await client.connect(getDbUri(), getDbConnectOptions());
    console.log('✅ Conexão estabelecida com sucesso.');

    const transaction = await attachment.startTransaction();
    console.log('✅ Transação iniciada.');

    const resultSet = await attachment.executeQuery(transaction, 'SELECT 1 FROM RDB$DATABASE');
    console.log('✅ Query executada.');

    const rows = await resultSet.fetch();
    console.log('🎉 Resultado da query:', rows);

    await resultSet.close();
    await transaction.commit();
    await attachment.disconnect();
    console.log('✅ Conexão fechada com sucesso.');

    return res.json({
      success: true,
      message: 'Conectou ao banco Firebird local e executou a query de teste com sucesso!',
      result: rows
    });
  } catch (err: any) {
    console.error('❌ Erro de conexão ou consulta com o Firebird:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Erro ao conectar ao banco Firebird local.',
      error: err.message
    });
  }
});

// Debug endpoint to list EXERCICIOIPTU columns
app.get('/api/debug-db', async (req, res) => {
  let attachment: any = null;
  let transaction: any = null;
  let resultSet: any = null;

  try {
    attachment = await client.connect(getDbUri(), getDbConnectOptions());
    transaction = await attachment.startTransaction();

    const query = `
      SELECT TRIM(RDB$FIELD_NAME) 
      FROM RDB$RELATION_FIELDS 
      WHERE UPPER(RDB$RELATION_NAME) = 'EXERCICIOIPTU'
      ORDER BY RDB$FIELD_POSITION
    `;
    resultSet = await attachment.executeQuery(transaction, query);
    const rows = await resultSet.fetch();
    const columns = rows.map(r => r[0]);

    await resultSet.close();
    resultSet = null;

    await transaction.commit();
    transaction = null;

    return res.json({
      success: true,
      columns
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  } finally {
    if (resultSet) {
      try {
        await resultSet.close();
      } catch (e) {}
    }
    if (attachment) {
      try {
        await attachment.disconnect();
      } catch (e) {}
    }
  }
});

// Obter configuração do banco
app.get('/api/config/db', (req, res) => {
  return res.json({
    success: true,
    config: dbConfig
  });
});

// Alterar configuração do banco
app.post('/api/config/db', async (req, res) => {
  const { host, path: dbPath, username, password } = req.body;

  if (!host || !dbPath || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos (host, caminho, usuário, senha) são obrigatórios.'
    });
  }

  // Tenta testar a conexão com o novo banco de dados antes de salvar
  let attachment: any = null;
  let testSuccess = false;
  let testError = '';

  const testUri = `${host}:${dbPath}`;
  const testOptions = { username, password };

  try {
    console.log(`⏳ Testando conexão com a nova configuração: ${testUri}`);
    attachment = await client.connect(testUri, testOptions);
    testSuccess = true;
    console.log('✅ Conexão de teste bem-sucedida!');
  } catch (err: any) {
    testSuccess = false;
    testError = err.message;
    console.error(`❌ Conexão de teste falhou: ${testError}`);
  } finally {
    if (attachment) {
      try {
        await attachment.disconnect();
      } catch (e) {}
    }
  }

  // Atualiza as configurações em memória e grava no arquivo
  const newConfig = { host, path: dbPath, username, password };
  
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
    dbConfig = newConfig;
    console.log('✅ Configurações salvas e aplicadas com sucesso!');
    
    return res.json({
      success: true,
      message: testSuccess 
        ? 'Configuração salva e conexão de teste estabelecida com sucesso!' 
        : 'Configuração salva, porém o teste de conexão falhou. Verifique as credenciais.',
      connected: testSuccess,
      error: testSuccess ? null : testError
    });
  } catch (err: any) {
    console.error('❌ Erro ao gravar arquivo db-config.json:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Erro ao persistir as configurações localmente.',
      error: err.message
    });
  }
});

// Endpoint de busca de imóveis no Firebird
app.get('/api/imoveis', async (req, res) => {
  const { cpfCnpj, inscricao } = req.query;

  if (!cpfCnpj && !inscricao) {
    return res.status(400).json({
      success: false,
      message: 'Você deve fornecer cpfCnpj ou inscricao para a busca.'
    });
  }

  let attachment: any = null;
  let transaction: any = null;
  let resultSet: any = null;

  try {
    attachment = await client.connect(getDbUri(), getDbConnectOptions());
    transaction = await attachment.startTransaction();

    let query = '';
    let params: any[] = [];

    if (cpfCnpj) {
      const cleanCpfCnpj = String(cpfCnpj).replace(/\D/g, '');
      // Query otimizada buscando por NRO_CUC utilizando índices em pessoafisica e cuc
      query = `
        SELECT 
          v.INSCRICAO,
          v.TIPO_LOGRA_IMO,
          v.DES_LOGRA_IMO,
          v.NUM_PREDIAL_IMO,
          v.COMPLEMENTO_IMO,
          v.COD_BAIRRO,
          v.DES_BAIRRO_IMO,
          v.NRO_CUC,
          v.CNPJ_CPF,
          v.NOME,
          v.AREA_TOT_CONSTRUIDA,
          v.TIPO,
          COALESCE(bci2.IPTU_CALC, 0)
        FROM VW_IMOBILIARIO v
        LEFT JOIN bcichave bch2 ON bch2.des_mascarainscricao = v.INSCRICAO
        LEFT JOIN BCI bci2 ON bci2.SEQ_LOTE = bch2.SEQ_LOTE AND bci2.IDT_UNIDADE = bch2.IDT_UNIDADE
        WHERE v.NRO_CUC IN (
          SELECT pf.nro_cuc FROM pessoafisica pf WHERE pf.nro_cpf = ?
          UNION
          SELECT cu.nro_cuc FROM cuc cu WHERE cu.nro_cgc = ? OR cu.nro_cgc || cu.nro_complementocgc = ?
        )
      `;
      params = [cleanCpfCnpj, cleanCpfCnpj, cleanCpfCnpj];
    } else {
      // Query buscando por INSCRICAO (inscrição imobiliária)
      query = `
        SELECT 
          v.INSCRICAO,
          v.TIPO_LOGRA_IMO,
          v.DES_LOGRA_IMO,
          v.NUM_PREDIAL_IMO,
          v.COMPLEMENTO_IMO,
          v.COD_BAIRRO,
          v.DES_BAIRRO_IMO,
          v.NRO_CUC,
          v.CNPJ_CPF,
          v.NOME,
          v.AREA_TOT_CONSTRUIDA,
          v.TIPO,
          COALESCE(bci2.IPTU_CALC, 0)
        FROM VW_IMOBILIARIO v
        LEFT JOIN bcichave bch2 ON bch2.des_mascarainscricao = v.INSCRICAO
        LEFT JOIN BCI bci2 ON bci2.SEQ_LOTE = bch2.SEQ_LOTE AND bci2.IDT_UNIDADE = bch2.IDT_UNIDADE
        WHERE v.INSCRICAO = ?
      `;
      params = [String(inscricao)];
    }

    console.log(`Executing Firebird Query for ${cpfCnpj ? 'CPF/CNPJ' : 'Inscricao'}:`);
    console.log(query);
    console.log('Params:', params);

    resultSet = await attachment.executeQuery(transaction, query, params);
    const rows = await resultSet.fetch();

    const formattedRows = rows.map((row: any[]) => {
      const insc = typeof row[0] === 'string' ? row[0].trim() : String(row[0] || '');
      return {
        id: insc,
        inscricao_imobiliaria: insc,
        tipo_logradouro: typeof row[1] === 'string' ? row[1].trim() : row[1] || '',
        nome_logradouro: typeof row[2] === 'string' ? row[2].trim() : row[2] || '',
        numero_predial: typeof row[3] === 'string' ? row[3].trim() : row[3] || 'S/N',
        complemento: typeof row[4] === 'string' ? row[4].trim() : row[4] || '',
        codigo_bairro: row[5] !== null && row[5] !== undefined ? String(row[5]).trim() : '',
        nome_bairro: typeof row[6] === 'string' ? row[6].trim() : row[6] || '',
        numero_cadastro_contribuinte: row[7] !== null && row[7] !== undefined ? String(row[7]).trim() : '',
        cpf_cnpj_proprietario: typeof row[8] === 'string' ? row[8].trim() : row[8],
        nome_proprietario: typeof row[9] === 'string' ? row[9].trim() : row[9],
        area_total_construida: typeof row[10] === 'number' ? row[10] : Number(row[10]) || 0,
        tipo_imovel: row[11] ? 'PREDIAL' : 'TERRITORIAL',
        valor_iptu_2026: typeof row[12] === 'number' ? row[12] : Number(row[12]) || 0
      };
    });

    await resultSet.close();
    resultSet = null;

    await transaction.commit();
    transaction = null;

    return res.json({
      success: true,
      data: formattedRows
    });
  } catch (err: any) {
    console.error('❌ Erro de consulta ao Firebird:', err.message);
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error('Erro no rollback da transação:', rollbackErr);
      }
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao consultar banco de dados Firebird.',
      error: err.message
    });
  } finally {
    if (resultSet) {
      try {
        await resultSet.close();
      } catch (e) {}
    }
    if (attachment) {
      try {
        await attachment.disconnect();
      } catch (e) {}
    }
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor de API rodando na porta ${PORT} (http://localhost:${PORT})`);
  console.log(`Firebird URI: ${getDbUri()}`);
});
