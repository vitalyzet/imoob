with open('/Users/alex/imoob/src/app/admin/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("d.status ===", "(d as any).status ===")
content = content.replace("d.userId ===", "(d as any).userId ===")
content = content.replace("a.createdAt", "(a as any).createdAt")
content = content.replace("b.createdAt", "(b as any).createdAt")

with open('/Users/alex/imoob/src/app/admin/page.tsx', 'w') as f:
    f.write(content)

print("Fixed admin/page.tsx again")
