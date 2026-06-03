const fs = require('fs');
const filePath = '/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '<PropertyGallery';
const endMarker = '<div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start mt-0">';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-8 mt-6">
          
          {/* LEFT COLUMN: Info Panel */}
          <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 order-2 lg:order-1 flex flex-col pt-2">
            <h1 className="text-[28px] lg:text-[34px] font-black text-[#1a1a1a] leading-[1.15] tracking-tight mb-4 capitalize">
              {propertyTypeLabel} {property.operation === 'inchiriere' ? 'de închiriat' : 'de vânzare'} în {property.location.localitate || property.location.city}
            </h1>
            
            <div className="flex items-center gap-2 text-gray-500 mb-5">
              <MapPin size={18} strokeWidth={2} />
              <span className="text-[15px]">{(() => {
                if (property.location.hideExactAddress) {
                  return [property.location.localitate, property.location.judet ? \`Județul \${property.location.judet}\` : ''].filter(Boolean).join(', ');
                }
                const parts = [];
                if (property.location.strada) parts.push(property.location.strada);
                if (property.location.numar) parts.push(\`nr. \${property.location.numar}\`);
                if (property.location.bloc) parts.push(\`bl. \${property.location.bloc}\`);
                
                const addressStr = parts.join(', ');
                return [addressStr, property.location.localitate].filter(Boolean).join(', ') || 'Locație necunoscută';
              })()}</span>
            </div>
            
            <div className="flex items-center text-[13px] text-gray-500 mb-8 font-medium">
              <span>ID # {property.id.substring(0, 8).toUpperCase()}</span>
              <span className="mx-3 text-gray-300">|</span>
              <span className="flex items-center gap-1.5 text-orange-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                {property.views} personas están viendo esta propiedad
              </span>
            </div>

            <div className="w-full h-px bg-gray-200 mb-8"></div>

            <div className="mb-8">
              <h2 className="text-[32px] font-black text-[#1a1a1a] tracking-tight">Precio {formattedPrice}</h2>
              <p className="text-[14px] text-gray-500 mt-1.5">Llega en <span className="font-bold text-gray-700">Uber</span> a tu visita, cortesía de IMOOB</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-10">
              <div className="flex items-center gap-2.5 text-gray-500">
                <Bed size={20} strokeWidth={1.5} className="text-gray-400" />
                <span className="text-[14px] font-medium">{property.features.bedrooms} habitaciones</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500">
                <Bath size={20} strokeWidth={1.5} className="text-gray-400" />
                <span className="text-[14px] font-medium">{property.features.bathrooms} baños</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500">
                <ParkingSquare size={20} strokeWidth={1.5} className="text-gray-400" />
                <span className="text-[14px] font-medium">2 parqueos</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500">
                <Square size={20} strokeWidth={1.5} className="text-gray-400" />
                <span className="text-[14px] font-medium">{property.features.area} m² totales</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500">
                <Box size={20} strokeWidth={1.5} className="text-gray-400" />
                <span className="text-[14px] font-medium">No amueblado</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500">
                <Zap size={20} strokeWidth={1.5} className="text-gray-400" />
                <span className="text-[14px] font-medium">Sin línea blanca</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-auto">
              <a 
                href={\`tel:\${property.agent.phone}\`}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[15px] font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center text-center"
              >
                Apelează agentul
              </a>
              <a 
                href={\`https://wa.me/\${property.agent.phone.replace(/[^0-9]/g, '')}\`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-black hover:bg-stone-800 text-white text-[15px] font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center text-center relative"
              >
                Chat WhatsApp
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#f97316] rounded-full border-2 border-white shadow-sm"></div>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Gallery */}
          <div className="w-full flex-1 order-1 lg:order-2">
            <PropertyGallery 
              images={property.images} 
              title={property.title} 
              agent={property.agent}
              propertyInfo={{
                price: \`\${property.currency === 'USD' ? 'U$S' : '€'} \${property.price.toLocaleString('ro-RO')}\`,
                size: \`\${property.surface_util} m²\`,
                location: \`\${property.location.localitate}, \${property.location.judet}\`
              }}
            />
          </div>
        </div>

        `;
  
  const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Replacement successful');
} else {
  console.log('Markers not found');
}
