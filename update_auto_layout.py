import re

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'r') as f:
    content = f.read()

# I will rewrite the return statement to match the requested layout.
new_return = """  return (
    <div 
      className="bg-[#f4f4f4] min-h-screen pt-[72px]"
      style={{ 
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 11 50 11c-10.639 0-16.035 2.333-25.753 5.928H0v3h21.184zM0 16.5c2.493-.726 5.12-1.688 8.214-2.922C16.88 10.457 21.6 8 30 8c8.397 0 13.12 2.457 21.786 5.578C54.88 14.812 57.507 15.773 60 16.5h40V0H0v16.5z' fill='%23000000' fill-opacity='0.025' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        backgroundSize: "80px 16px"
      }}
    >
      <div className="bg-white w-full border-b border-gray-200 pb-12 pt-4">
        <div className="container mx-auto px-6">
          
          {/* Breadcrumbs & Top Actions */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
              <Link href="/" className="hover:text-[var(--primary)] transition-colors">imoob</Link>
              <span className="text-gray-300">/</span>
              <Link href="/auto" className="hover:text-[var(--primary)] transition-colors">Auto</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400 truncate">{auto.title}</span>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-600 hover:text-[var(--primary)] transition-colors">
                <Share2 size={18} /> Distribuie
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-600 hover:text-red-500 transition-colors">
                <Heart size={18} /> Salvează
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 mb-0">
            
            {/* LEFT COLUMN: Info Panel (Match image exactly) */}
            <div className="w-full lg:w-[540px] xl:w-[620px] shrink-0 order-2 lg:order-1 flex flex-col pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 rounded-3xl" style={{ backgroundColor: "#F8FAF7" }}>
              <h1 className="text-[28px] lg:text-[34px] font-black text-[#1a1a1a] leading-[1.15] tracking-tight mb-4 capitalize">
                {auto.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-500 mb-5">
                <MapPin size={18} strokeWidth={2} />
                <span className="text-[15px]">{auto.location}</span>
              </div>
              
              <div className="flex items-center text-[13px] text-gray-500 mb-8 font-medium">
                <span>ID # 92XHOXGV</span>
                <span className="mx-3 text-gray-300">|</span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <Calendar size={14} className="text-gray-400" />
                  Publicado el 19 de abril de 2026
                </span>
                <span className="mx-3 text-gray-300">|</span>
                <span className="flex items-center gap-1.5 text-orange-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                  194 personas están viendo este auto
                </span>
              </div>

              <hr className="w-full border-t border-gray-200/80 mb-8" />

              <div className="mb-8">
                <h2 className="text-[32px] font-black text-[#1a1a1a] tracking-tight">Precio {new Intl.NumberFormat('de-DE').format(auto.price)} €</h2>
                {auto.pretNegociabil && <p className="text-[14px] text-[var(--primary)] font-medium mt-1.5 flex items-center gap-1.5"><CheckCircle2 size={14} /> Preț negociabil</p>}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 mb-10">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Gauge size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{auto.mileage} km</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Fuel size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{auto.fuel}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Cog size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">{auto.transmission}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Calendar size={20} strokeWidth={1.5} className="text-gray-400" />
                  <span className="text-[14px] font-medium">An: {auto.year}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <a 
                  href="#"
                  className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white text-[15px] font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center text-center"
                >
                  Apelează agentul
                </a>
                <a 
                  href="#"
                  className="flex-1 bg-black hover:bg-stone-800 text-white text-[15px] font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center text-center relative"
                >
                  Chat WhatsApp
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#f97316] rounded-full border-2 border-white shadow-sm"></div>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Gallery */}
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start mt-0">
          <div>
            {/* Description */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Descriere vehicul</h3>
              <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                {auto.description}
              </p>
            </div>

            {/* Technical Specs */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-6">Specificații Tehnice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Capacitate motor</span>
                  <span className="text-gray-900 font-bold">{auto.engine}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Putere</span>
                  <span className="text-gray-900 font-bold">{auto.power}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Tip Caroserie</span>
                  <span className="text-gray-900 font-bold">{auto.bodyType}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Culoare</span>
                  <span className="text-gray-900 font-bold">{auto.color}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h3 className="text-xl font-black text-gray-900 mb-6">Dotări</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {auto.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[var(--primary)]" />
                    <span className="text-gray-700 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
             {/* Safety Tips */}
             <div className="bg-[var(--primary)]/5 p-6 rounded-3xl border border-[var(--primary)]/10">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[var(--primary)]" /> Sfaturi de siguranță
                </h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Nu trimite niciodată bani în avans. Verifică întotdeauna autovehiculul în persoană și seria de șasiu (VIN) înainte de a face o plată.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

start_idx = content.find("  return (")
content = content[:start_idx] + new_return

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Auto layout updated to match property layout exactly.")
