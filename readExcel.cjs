const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('Base_teste_iptu_2026.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

fs.writeFileSync('src/lib/mockDatabase.json', JSON.stringify(data, null, 2));
console.log(`Wrote ${data.length} records to src/lib/mockDatabase.json`);
