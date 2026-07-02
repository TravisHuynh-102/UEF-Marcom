const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/HIENHM/Downloads/teamos-ai-source/Marcom-UEF/src/app');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/text-\[9px\]/g, 'text-[10.5px]');
  content = content.replace(/text-\[10px\]/g, 'text-[11.5px]');
  content = content.replace(/text-\[11px\]/g, 'text-[12.5px]');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  }
});

console.log(`\nFinished updating ${count} files.`);
