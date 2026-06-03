with open('/Users/alex/imoob/src/components/layout/PremiumHeader.tsx', 'r') as f:
    content = f.read()

# 1. Add imports
content = content.replace("import { Search, Heart, User, Menu, X, ChevronDown, Bell, Globe } from 'lucide-react';", 
"import { Search, Heart, User, Menu, X, ChevronDown, Bell, Globe, Car, Building2 } from 'lucide-react';\nimport { useDomain } from '@/context/DomainContext';")

# 2. Add hook
content = content.replace("const [scrolled, setScrolled] = useState(false);", 
"const [scrolled, setScrolled] = useState(false);\n  const { domain, setDomain } = useDomain();")

# 3. Inject switch next to Desktop Navigation
nav_target = """          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">"""

switch_html = """          {/* Domain Switcher */}
          <div className="hidden md:flex bg-gray-100 p-1 rounded-full relative items-center cursor-pointer shadow-inner border border-gray-200/60 mx-4">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                domain === 'imobiliare' ? 'left-1' : 'left-[calc(50%+3px)]'
              }`}
            />
            <button
              onClick={() => setDomain('imobiliare')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-black transition-colors ${
                domain === 'imobiliare' ? 'text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Building2 size={14} /> IMOBILIARE
            </button>
            <button
              onClick={() => setDomain('auto')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-black transition-colors ${
                domain === 'auto' ? 'text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Car size={14} /> AUTO
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">"""

content = content.replace(nav_target, switch_html)

# 4. Make dynamic color logic inside the header for logos and hovers
# Replace bg-[#139E69] with bg-[var(--primary)]
content = content.replace('bg-[#139E69]', 'bg-[var(--primary)]')
content = content.replace('text-[#139E69]', 'text-[var(--primary)]')

with open('/Users/alex/imoob/src/components/layout/PremiumHeader.tsx', 'w') as f:
    f.write(content)

print("PremiumHeader updated.")
