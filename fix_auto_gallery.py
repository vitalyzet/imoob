with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'r') as f:
    content = f.read()

# Import PropertyGallery
if "import PropertyGallery" not in content:
    content = content.replace("import AutoContactCard from '@/components/properties/AutoContactCard';", "import AutoContactCard from '@/components/properties/AutoContactCard';\nimport PropertyGallery from '@/components/properties/PropertyGallery';")

# Find the gallery block
target = """            {/* RIGHT COLUMN: Gallery */}
            <div className="w-full flex-1 order-1 lg:order-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-full min-h-[400px] rounded-3xl overflow-hidden">
                <div className="md:col-span-3 relative h-full">
                  <Image src={auto.images[0]} alt="Main" fill className="object-cover" />
                </div>
                <div className="hidden md:flex flex-col gap-3 h-full">
                  <div className="relative flex-1 rounded-xl overflow-hidden">
                    <Image src={auto.images[1]} alt="Sub 1" fill className="object-cover" />
                  </div>
                  <div className="relative flex-1 rounded-xl overflow-hidden">
                    <Image src={auto.images[2]} alt="Sub 2" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                      <span className="text-white font-bold text-lg">+12 foto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>"""

replace = """            {/* RIGHT COLUMN: Gallery */}
            <div className="w-full flex-1 order-1 lg:order-2">
              <PropertyGallery 
                images={auto.images} 
                title={auto.title} 
                agent={{
                  name: 'Auto Dealer S.R.L.',
                  phone: '+40 700 000 000',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
                  role: 'Dealer Autorizat'
                }}
                propertyInfo={{
                  price: `${new Intl.NumberFormat('de-DE').format(auto.price)} €`,
                  size: `${auto.mileage} km`,
                  location: auto.location
                }}
              />
            </div>"""

content = content.replace(target, replace)

# Note: since I am using PropertyGallery, I should make sure its internal color uses CSS variables if possible, 
# but it currently uses hardcoded #139E69 for the "Ver más fotos" button. I will fix that in PropertyGallery itself.

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Auto details updated with PropertyGallery.")
