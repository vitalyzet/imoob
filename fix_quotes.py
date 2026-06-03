with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('backgroundImage: "url("data:image/svg+xml', 'backgroundImage: "url(\'data:image/svg+xml')
content = content.replace('fill-rule=\'evenodd\'/%3E%3C/svg%3E\")"', 'fill-rule=\'evenodd\'/%3E%3C/svg%3E\')"')

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Fixed quotes")
