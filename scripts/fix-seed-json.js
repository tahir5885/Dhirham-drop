const fs = require('fs');
const file = 'packages/database/prisma/seed.ts';
let code = fs.readFileSync(file, 'utf8');

// Find all `attributes: { ... }` blocks and wrap the value in JSON.stringify
code = code.replace(/attributes:\s*({[^}]*})/g, (match, p1) => {
  return `attributes: JSON.stringify(${p1})`;
});

fs.writeFileSync(file, code);
console.log('Seed updated for JSON.stringify');
