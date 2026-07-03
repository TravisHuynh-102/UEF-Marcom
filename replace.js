const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/app/login/page.tsx',
    'src/app/settings/page.tsx',
    'src/app/layout.tsx',
    'src/components/layout/header.tsx',
    'src/components/layout/sidebar.tsx',
    'src/context/role-context.tsx',
    'src/lib/mock-data.ts',
    'package.json'
];

for (const filePath of filesToUpdate) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(/teamos\.ai/g, 'uef.edu.vn');
    content = content.replace(/TeamOS AI/g, 'UEF Marcom');
    content = content.replace(/TeamOS Workspace/g, 'UEF Marcom Workspace');
    content = content.replace(/TeamOS/g, 'UEF Marcom');
    content = content.replace(/teamos-role/g, 'uef-marcom-role');
    content = content.replace(/teamos-ai/g, 'uef-marcom');

    fs.writeFileSync(filePath, content, 'utf-8');
}

console.log("Done replacing text.");
