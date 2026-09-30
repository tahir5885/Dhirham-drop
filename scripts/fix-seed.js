const fs = require('fs');
const file = 'packages/database/prisma/seed.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/,\s*StockStatus\s*/g, '');
code = code.replace(/StockStatus\.IN_STOCK/g, '"IN_STOCK"');
fs.writeFileSync(file, code);
console.log('Seed updated');
