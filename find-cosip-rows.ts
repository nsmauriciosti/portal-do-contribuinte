import { createWireClient } from 'node-firebird-driver-wire';
import dotenv from 'dotenv';

dotenv.config();

const client = createWireClient();
const fbHost = process.env.FIREBIRD_HOST || '127.0.0.1';
const fbPath = process.env.FIREBIRD_PATH || 'D:\\Users\\Mauricio\\Documents\\portal-do-contribuinte\\banco\\dbnovaserrana.fdb';
const uri = `${fbHost}:${fbPath}`;
const connectOptions = {
  username: 'SYSDBA',
  password: 'masterkey'
};

async function test() {
  try {
    const attachment = await client.connect(uri, connectOptions);
    const transaction = await attachment.startTransaction();

    console.log('--- Searching COMPOSICAOCALCULO for COSIP/ILUM/CIP/LUZ ---');
    const query = `
      SELECT DISTINCT COD_COMPOSICAO, TRIM(DES_COMPOSICAO)
      FROM COMPOSICAOCALCULO 
      WHERE UPPER(DES_COMPOSICAO) LIKE '%COSIP%'
         OR UPPER(DES_COMPOSICAO) LIKE '%ILUM%'
         OR UPPER(DES_COMPOSICAO) LIKE '%CIP%'
         OR UPPER(DES_COMPOSICAO) LIKE '%LUZ%'
      ORDER BY COD_COMPOSICAO
    `;
    const resultSet = await attachment.executeQuery(transaction, query);
    const rows = await resultSet.fetch();
    console.log('Found rows:');
    rows.forEach(r => console.log(`Code: ${r[0]}, Description: ${r[1]}`));
    await resultSet.close();

    await transaction.commit();
    await attachment.disconnect();
  } catch (err: any) {
    console.error('Error in test:', err);
  }
}

test();
