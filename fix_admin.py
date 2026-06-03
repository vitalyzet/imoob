with open('/Users/alex/imoob/src/app/admin/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (!a.createdAt || !b.createdAt) return 0;", "if (!(a as any).createdAt || !(b as any).createdAt) return 0;")
content = content.replace("return b.createdAt.toMillis() - a.createdAt.toMillis();", "return (b as any).createdAt.toMillis() - (a as any).createdAt.toMillis();")

with open('/Users/alex/imoob/src/app/admin/page.tsx', 'w') as f:
    f.write(content)

print("Fixed admin/page.tsx")
