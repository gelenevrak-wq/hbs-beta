const fs = require('fs');
const content = fs.readFileSync('app/dashboard/warehouses/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('toLowerCase')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
