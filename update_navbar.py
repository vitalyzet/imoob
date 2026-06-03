with open('/Users/alex/imoob/src/components/layout/Navbar.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace("import { Mail, MessageSquare", "import { Car, Building2, Mail, MessageSquare")
content = content.replace("import { useAuth } from '@/context/AuthContext';", "import { useAuth } from '@/context/AuthContext';\nimport { useDomain } from '@/context/DomainContext';")

# 2. Add hook
content = content.replace("const { user, logout } = useAuth();", "const { user, logout } = useAuth();\n  const { domain, setDomain } = useDomain();")

# 3. Add switcher desktop
target_logo = """        <Link href="/" className={`text-3xl font-serif font-black tracking-tighter ${textColor}`}>
          IMOB<span style={{ color: logoDotColor }}>.</span>
        </Link>"""

replace_logo = """        <div className="flex items-center gap-6">
          <Link href="/" className={`text-3xl font-serif font-black tracking-tighter ${textColor}`}>
            IMOB<span className="text-[var(--primary)]">.</span>
          </Link>
          
          {/* Domain Switcher */}
          <div className="hidden md:flex bg-gray-100 p-1 rounded-full relative items-center cursor-pointer shadow-inner border border-gray-200/60">
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
        </div>"""

content = content.replace(target_logo, replace_logo)

# Fix logoDotColor which might be used elsewhere
content = content.replace("const logoDotColor = '#139E69';", "const logoDotColor = 'var(--primary)';")

with open('/Users/alex/imoob/src/components/layout/Navbar.tsx', 'w') as f:
    f.write(content)

print("Navbar updated.")
