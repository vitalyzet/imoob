with open('/Users/alex/imoob/src/components/sections/Hero.tsx', 'r') as f:
    content = f.read()

content = content.replace("React.cloneElement(spec.icon as React.ReactElement, { size: 80, className: 'text-white' })", "React.cloneElement(spec.icon as React.ReactElement, { size: 80, className: 'text-white' } as any)")

with open('/Users/alex/imoob/src/components/sections/Hero.tsx', 'w') as f:
    f.write(content)

print("Fixed hero type")
