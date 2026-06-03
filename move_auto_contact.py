with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'r') as f:
    content = f.read()

# 1. Import AutoContactCard
content = content.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport AutoContactCard from '@/components/properties/AutoContactCard';")

# 2. Remove Dealer block from Left Column
left_target = """              {/* Auto Specific Contact Block */}
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

content = content.replace(left_target, "")

# 3. Add to Right Column above Safety Tips
right_target = """          <div>
             {/* Safety Tips */}"""

right_replace = """          <div>
             <AutoContactCard />
             {/* Safety Tips */}"""

content = content.replace(right_target, right_replace)

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Moved contact block to right column.")
