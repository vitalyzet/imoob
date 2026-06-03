import os

files = [
    '/Users/alex/imoob/src/app/propiedades/client.tsx',
    '/Users/alex/imoob/src/components/sections/LatestAds.tsx',
    '/Users/alex/imoob/src/components/sections/FeaturedProperties.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Apply the same resilient fallback logic we put in [slug]/page.tsx
    content = content.replace('bedrooms: Number(d.rooms) || 0,', 'bedrooms: parseInt(d.rooms) || parseInt(d.bedrooms) || 0,')
    content = content.replace('bathrooms: Number(d.baths) || 0,', 'bathrooms: parseInt(d.baths) || parseInt(d.bai) || parseInt(d.bathrooms) || 0,')
    content = content.replace('area: Number(d.area) || 0,', 'area: parseFloat(d.area) || parseFloat(d.suprafataUtila) || 0,')
    
    with open(file, 'w') as f:
        f.write(content)

print("Parsing fixed in client, LatestAds and FeaturedProperties")
