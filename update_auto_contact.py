import re

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'r') as f:
    content = f.read()

target = """              <div className="flex items-center gap-4 mt-auto">
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
              </div>"""

replace = """              {/* Auto Specific Contact Block */}
              <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-200/50">
                
                {/* Dealer Info */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                    <Car size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Auto Dealer S.R.L.</h4>
                    <p className="text-gray-500 font-medium">Pe IMOOB din 2023</p>
                  </div>
                </div>

                {/* Buttons */}
                <button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-[17px] shadow-sm">
                  <Phone size={20} /> Vezi numărul de telefon
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-[17px] shadow-sm">
                  <Mail size={20} /> Trimite mesaj
                </button>
              </div>"""

content = content.replace(target, replace)

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Updated auto contact section")
