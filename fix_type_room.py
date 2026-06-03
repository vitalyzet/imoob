with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("property.roommateDetails.bucatarie", "(property.roommateDetails as any).bucatarie")
content = content.replace("property.roommateDetails.baie", "(property.roommateDetails as any).baie")
content = content.replace("property.roommateDetails.masinaSpalat", "(property.roommateDetails as any).masinaSpalat")

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Fixed property roommate TS errors")
