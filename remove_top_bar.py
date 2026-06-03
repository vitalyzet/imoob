with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

import re
# We want to remove the entire `<!-- Top Action Bar -->` section from lines 234 to 282.
# The section starts with `      {/* Top Action Bar */}` and ends with `      </div>\n\n      <div className="bg-white w-full border-b border-gray-200 pb-12 pt-6">`
pattern = r'      \{\/\* Top Action Bar \*\/}.*?      <\/div>\n\n'
new_content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(new_content)

print("Removed Top Action Bar.")
