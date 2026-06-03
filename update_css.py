import re

with open('/Users/alex/imoob/src/app/globals.css', 'r') as f:
    content = f.read()

theme_additions = """
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-light: var(--primary-light);
"""
content = content.replace('@theme {\n', '@theme {\n' + theme_additions)

root_vars = """
    --primary: #139E69;
    --primary-hover: #0f8a5a;
    --primary-light: #e8f4f0;
"""

# replace the existing --primary: #139E69;
content = content.replace('--primary: #139E69;', root_vars)

# Add .theme-auto
auto_theme = """
  body.theme-auto {
    --primary: #0ea5e9;
    --primary-hover: #0284c7;
    --primary-light: #e0f2fe;
  }
"""

content = content.replace('@layer base {\n  body {', auto_theme + '\n@layer base {\n  body {')

with open('/Users/alex/imoob/src/app/globals.css', 'w') as f:
    f.write(content)

print("globals.css updated with theme variables.")
