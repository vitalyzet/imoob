with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("property.features?.garage", "(property.features as any)?.garage")
content = content.replace("property.features?.parking", "(property.features as any)?.parking")

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Fixed property page.")
