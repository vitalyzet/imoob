with open('/Users/alex/imoob/src/components/properties/PropertyGallery.tsx', 'r') as f:
    content = f.read()

content = content.replace("bg-[#139E69]", "bg-[var(--primary)]")
content = content.replace("hover:bg-[#0f8256]", "hover:bg-[var(--primary-hover)]")

with open('/Users/alex/imoob/src/components/properties/PropertyGallery.tsx', 'w') as f:
    f.write(content)

print("Fixed gallery colors.")
