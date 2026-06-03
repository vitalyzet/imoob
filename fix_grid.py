import re

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

search_grid = r'<div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-10">\s*<div className="flex items-center gap-2\.5 text-gray-500">.*?</div>\s*</div>'

replace_grid = r'''<div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-10">
              {Number(property.features?.bedrooms) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Bed size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.bedrooms} {Number(property.features.bedrooms) === 1 ? 'habitación' : 'habitaciones'}</span>
                </div>
              )}
              {Number(property.features?.bathrooms) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Bath size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.bathrooms} {Number(property.features.bathrooms) === 1 ? 'baño' : 'baños'}</span>
                </div>
              )}
              {Number(property.features?.garage) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <ParkingSquare size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.garage} {Number(property.features.garage) === 1 ? 'parqueo' : 'parqueos'}</span>
                </div>
              )}
              {Number(property.features?.area) > 0 && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Square size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{property.features.area} m²</span>
                </div>
              )}
              {property.amenities?.some(a => a.toLowerCase().includes('mobilat') || a.toLowerCase().includes('amuebla')) && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Box size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">Amueblado</span>
                </div>
              )}
              {property.amenities?.some(a => a.toLowerCase().includes('utilat') || a.toLowerCase().includes('electro') || a.toLowerCase().includes('línea') || a.toLowerCase().includes('linea')) && (
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Zap size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">Línea blanca</span>
                </div>
              )}
            </div>'''

new_content = re.sub(search_grid, replace_grid, content, flags=re.DOTALL)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(new_content)

print("Grid updated with conditional renders.")
