with open('/Users/alex/imoob/src/components/properties/GalleryModal.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace("import ContactForm from './ContactForm';", "import ContactForm from './ContactForm';\nimport { useDomain } from '@/context/DomainContext';\nimport AutoContactCard from './AutoContactCard';")

# 2. Add hook
content = content.replace("const [activeTab, setActiveTab] = useState<'fotos' | 'mapa' | 'street'>('fotos');", "const [activeTab, setActiveTab] = useState<'fotos' | 'mapa' | 'street'>('fotos');\n  const { domain } = useDomain();")

# 3. Conditional rendering of right panel
target_panel = """            <div className="w-[360px] flex-shrink-0 flex flex-col h-full bg-white relative z-10 hidden lg:flex">
              {/* Desktop Header for Contact Sidebar */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors border border-gray-200 shadow-sm">
                    <Heart size={16} /> Favorit
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors border border-gray-200 shadow-sm">
                    <Share2 size={16} /> Trimite
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Desktop Contact Content */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0 shadow-md">
                    <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-[18px] tracking-tight">{agent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[14px] font-bold text-emerald-600">{agent.phone}</span>
                      <span className="text-gray-300">·</span>
                      <button className="text-[13px] font-bold text-emerald-600 hover:underline">Vezi telefon</button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-[16px]">Solicită informații</h4>
                  <ContactForm />
                  
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-emerald-500 rounded-2xl text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors">
                      <Phone size={18} />
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-emerald-500 rounded-2xl text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors">
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>"""

replace_panel = """            <div className="w-[360px] flex-shrink-0 flex flex-col h-full bg-white relative z-10 hidden lg:flex">
              {/* Desktop Header for Contact Sidebar */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors border border-gray-200 shadow-sm">
                    <Heart size={16} /> Favorit
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors border border-gray-200 shadow-sm">
                    <Share2 size={16} /> Trimite
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Desktop Contact Content */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {domain === 'auto' ? (
                  <AutoContactCard />
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0 shadow-md">
                        <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-[18px] tracking-tight">{agent.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[14px] font-bold text-emerald-600">{agent.phone}</span>
                          <span className="text-gray-300">·</span>
                          <button className="text-[13px] font-bold text-emerald-600 hover:underline">Vezi telefon</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 text-[16px]">Solicită informații</h4>
                      <ContactForm />
                      
                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-emerald-500 rounded-2xl text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors">
                          <Phone size={18} />
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-emerald-500 rounded-2xl text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors">
                          <MessageCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>"""

content = content.replace(target_panel, replace_panel)

with open('/Users/alex/imoob/src/components/properties/GalleryModal.tsx', 'w') as f:
    f.write(content)

print("GalleryModal right panel updated.")
