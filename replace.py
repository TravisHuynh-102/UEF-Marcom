import os
import re

files_to_update = [
    'src/app/login/page.tsx',
    'src/app/settings/page.tsx',
    'src/app/layout.tsx',
    'src/components/layout/header.tsx',
    'src/components/layout/sidebar.tsx',
    'src/context/role-context.tsx',
    'src/lib/mock-data.ts',
    'package.json'
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    content = content.replace('teamos.ai', 'uef.edu.vn')
    content = content.replace('TeamOS AI', 'UEF Marcom')
    content = content.replace('TeamOS Workspace', 'UEF Marcom Workspace')
    content = content.replace('TeamOS', 'UEF Marcom')
    content = content.replace('teamos-role', 'uef-marcom-role')
    content = content.replace('teamos-ai', 'uef-marcom')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done replacing text.")
