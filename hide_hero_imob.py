with open('/Users/alex/imoob/src/components/sections/Hero.tsx', 'r') as f:
    content = f.read()

# 1. Hide Contextual Specification Box
target_box = "{searchMode === 'professional' && (() => {"
replace_box = "{domain === 'imobiliare' && searchMode === 'professional' && (() => {"
content = content.replace(target_box, replace_box)

# 2. Hide Under-Wave Secondary Menu buttons
target_menu = """      {/* Under-Wave Secondary Menu */}
      <div className="absolute bottom-0 left-0 w-full bg-white z-30 pb-4 pt-2 px-6">
        <div className="container mx-auto flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-gray-500 font-medium">"""

replace_menu = """      {/* Under-Wave Secondary Menu */}
      <div className="absolute bottom-0 left-0 w-full bg-white z-30 pb-4 pt-2 px-6">
        <div className="container mx-auto flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-gray-500 font-medium">
          {domain === 'auto' ? (
            <button className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors">
              <Heart size={16} /> Căutările mele Auto
            </button>
          ) : (
            <>
"""

# I need to find the end of that flex container to close the fragment
content = content.replace(target_menu, replace_menu)

# Close the fragment
target_end_menu = """            <Heart size={16} /> Căutările mele
          </button>
        </div>
      </div>"""

replace_end_menu = """            <Heart size={16} /> Căutările mele
          </button>
          </>
          )}
        </div>
      </div>"""
content = content.replace(target_end_menu, replace_end_menu)

with open('/Users/alex/imoob/src/components/sections/Hero.tsx', 'w') as f:
    f.write(content)

print("Hero Imob content hidden.")
