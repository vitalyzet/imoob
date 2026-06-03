import re

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

# 1. Update getPropertyData to include pretNegociabil
content = content.replace("price: Number(d.price) || 0,", "price: Number(d.price) || 0,\n      pretNegociabil: d.pretNegociabil || false,")

# 2. Replace the Uber message with the negociable message
uber_msg = 'Llega en <span className="font-black text-slate-700">Uber</span> a tu visita, cortesía de IMOOB'
negociable_msg = '{property.pretNegociabil ? "Preț negociabil" : ""}'

content = content.replace(uber_msg, negociable_msg)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Removed Uber message and added pretNegociabil to page.tsx")
