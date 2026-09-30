const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/,\s*StockStatus\s*/g, '');
  code = code.replace(/StockStatus\.IN_STOCK/g, '"IN_STOCK"');
  fs.writeFileSync(file, code);
  console.log(`Updated ${file}`);
}

fixFile('apps/crawlers/src/scheduler.ts');
fixFile('apps/crawlers/src/services/ingestion.ts');
