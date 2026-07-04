const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/Özgür/.gemini/antigravity-ide/brain/695dd754-d167-44f8-8ae7-0c239c2aa807/scratch';
const files = fs.readdirSync(brainDir);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.js')) {
    const filePath = path.join(brainDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let hasMatch = false;
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes('delete') || line.toLowerCase().includes('sil')) {
        if (!hasMatch) {
          console.log(`--- Matches in ${file} ---`);
          hasMatch = true;
        }
        console.log(`${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
