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

    console.log('--- Printing relations matching EXERCICIO ---');
    const query = `
      SELECT DISTINCT TRIM(RDB$RELATION_NAME) 
      FROM RDB$RELATION_FIELDS 
      WHERE UPPER(RDB$RELATION_NAME) LIKE '%EXERCICIO%'
    `;
    const resultSet = await attachment.executeQuery(transaction, query);
    const rows = await resultSet.fetch();
    console.log('Relations:', rows.map(r => r[0]));
    await resultSet.close();

    await transaction.commit();
    await attachment.disconnect();
  } catch (err: any) {
    console.error('Error in test:', err);
  }
}

test();
