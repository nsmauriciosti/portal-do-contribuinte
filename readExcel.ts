import * as xlsx from 'xlsx';
import * as fs from 'fs';

const workbook = xlsx.readFile('Base_teste_iptu_2026.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Output only the first 50 rows to avoid giant JSON if it's large, but let's check size first.
// Let's write everything.
fs.writeFileSync('src/lib/mockDatabase.json', JSON.stringify(data, null, 2));
console.log(`Wrote ${data.length} records to src/lib/mockDatabase.json`);
