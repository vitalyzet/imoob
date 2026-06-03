with open('/Users/alex/imoob/src/components/layout/Navbar.tsx', 'r') as f:
    content = f.read()

mobile_target = """        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">"""

mobile_replace = """        {/* Mobile Toggle & Domain */}
        <div className="flex lg:hidden items-center gap-4">
          <div className="flex bg-gray-100/50 p-1 rounded-full relative items-center cursor-pointer shadow-inner">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                domain === 'imobiliare' ? 'left-1' : 'left-[calc(50%+3px)]'
              }`}
            />
            <button
              onClick={() => setDomain('imobiliare')}
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                domain === 'imobiliare' ? 'text-[var(--primary)]' : 'text-gray-400'
              }`}
            >
              <Building2 size={16} />
            </button>
            <button
              onClick={() => setDomain('auto')}
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                domain === 'auto' ? 'text-[var(--primary)]' : 'text-gray-400'
              }`}
            >
              <Car size={16} />
            </button>
          </div>
          """

content = content.replace(mobile_target, mobile_replace)

# Fix #139E69 in Navbar.tsx
content = content.replace('text-[#139E69]', 'text-[var(--primary)]')
content = content.replace('bg-[#139E69]', 'bg-[var(--primary)]')
content = content.replace('hover:text-[#139E69]', 'hover:text-[var(--primary)]')

with open('/Users/alex/imoob/src/components/layout/Navbar.tsx', 'w') as f:
    f.write(content)

print("Navbar mobile updated.")
