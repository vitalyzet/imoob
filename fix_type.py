with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("property.currency", "(property as any).currency")
content = content.replace("property.surface_util", "(property as any).surface_util")

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Fixed property TS errors")
