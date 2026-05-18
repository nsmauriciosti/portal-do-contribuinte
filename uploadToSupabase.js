import fs from 'fs';
import xml2js from 'xml2js';
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase (Mesmas chaves fornecidas)
const SUPABASE_URL = 'https://spabase.mauriciosti.xyz';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyNjcxNzUwLCJleHAiOjE5MzAzNTE3NTB9.7BQUzk9cmOqag-XgfrR7lro7wE7YFj2v5U3pMyFPsrg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'portal_contribuintes' }
});

async function uploadData() {
  console.log('Lendo Base_IPTU_Semantico.xml...');
  const xml = fs.readFileSync('Base_IPTU_Semantico.xml', 'utf-8');
  
  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(xml, async (err, result) => {
    if (err) throw err;
    
    const imoveis = result.Base_IPTU.Imovel;
    console.log(`Lidos ${imoveis.length} registros. Preparando mapeamento...`);

    // Mapeando para as colunas do SQL
    const records = imoveis.map(item => ({
      inscricao_imobiliaria: item.Inscricao_Imobiliaria || '',
      tipo_logradouro: item.Tipo_Logradouro || '',
      nome_logradouro: item.Nome_Logradouro || '',
      numero_predial: item.Numero_Predial || '',
      complemento: item.Complemento || '',
      codigo_bairro: item.Codigo_Bairro || '',
      nome_bairro: item.Nome_Bairro || '',
      numero_cadastro_contribuinte: item.Numero_Cadastro_Contribuinte || '',
      cpf_cnpj_proprietario: item.CPF_CNPJ_Proprietario || '',
      nome_proprietario: item.Nome_Proprietario || '',
      area_total_construida: Number(item.Area_Total_Construida) || 0,
      tipo_imovel: item.Tipo_Imovel || '',
      valor_iptu_2026: Number(item.Valor_IPTU_2026) || 0
    }));

    console.log('Iniciando Upload em Lotes (1000 por vez) para o Supabase...');
    
    const BATCH_SIZE = 1000;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('imoveis').insert(batch);
      
      if (error) {
        console.error(`Erro no lote ${i} - ${i + BATCH_SIZE}:`, error.message);
      } else {
        console.log(`Lote inserido: ${i} a ${i + batch.length}`);
      }
    }

    console.log('✅ Upload Finalizado com Sucesso!');
  });
}

uploadData();
