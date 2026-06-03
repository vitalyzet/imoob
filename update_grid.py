import re

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

# Replace the garage block
search_garage = r'              \{Number\(property\.features\?\.garage\) > 0 && \(\s*<div className="flex items-center gap-2\.5 text-gray-500">\s*<ParkingSquare size=\{20\} strokeWidth=\{1\.5\} className="text-gray-400" />\s*<span className="text-\[14px\] font-medium">\{property\.features\.garage\} \{Number\(property\.features\.garage\) === 1 \? \'parqueo\' : \'parqueos\'\}</span>\s*</div>\s*\)\}'

replace_garage = r'''              {(Number(property.features?.garage) > 0 || Number(property.features?.parking) > 0 || property.amenities?.some(a => a.toLowerCase().includes('parcare') || a.toLowerCase().includes('garaj') || a.toLowerCase().includes('garage') || a.toLowerCase().includes('parking'))) && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <ParkingSquare size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">
                    {Number(property.features?.garage || property.features?.parking) > 0 
                      ? `${property.features?.garage || property.features?.parking} ${Number(property.features?.garage || property.features?.parking) === 1 ? 'parqueo' : 'parqueos'}` 
                      : 'Garaje / Parqueo'}
                  </span>
                </div>
              )}'''

content = re.sub(search_garage, replace_garage, content)

# Add the Etaj block right after the area block
search_area = r'              \{Number\(property\.features\?\.area\) > 0 && \(\s*<div className="flex items-center gap-2\.5 text-gray-500">\s*<Square size=\{20\} strokeWidth=\{1\.5\} className="text-gray-400" />\s*<span className="text-\[14px\] font-medium">\{property\.features\.area\} m²</span>\s*</div>\s*\)\}'

replace_area = r'''              {Number(property.features?.area) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Square size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.area} m²</span>
                </div>
              )}
              {property.location?.etaj && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Layers3 size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">Etaj {property.location.etaj}</span>
                </div>
              )}'''

content = re.sub(search_area, replace_area, content)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Added etaj and expanded garaje logic.")
