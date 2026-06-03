import re

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

# 1. Add date logic before return statement
search_return = r'  return \(\n    <div'
replace_return = r'''  const formattedDate = property.createdAt 
    ? new Date(property.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : 'Recientemente';

  return (
    <div'''

content = re.sub(search_return, replace_return, content)

# 2. Add the UI part next to ID
search_id = r'              <span>ID # \{property.id.substring\(0, 8\).toUpperCase\(\)\}</span>\n              <span className="mx-3 text-gray-300">\|</span>'
replace_id = r'''              <span>ID # {property.id.substring(0, 8).toUpperCase()}</span>
              <span className="mx-3 text-gray-300">|</span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <Calendar size={14} className="text-gray-400" />
                Publicado el {formattedDate}
              </span>
              <span className="mx-3 text-gray-300">|</span>'''

content = re.sub(search_id, replace_id, content)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Added publication date successfully.")
