with open('/Users/alex/imoob/src/components/sections/Hero.tsx', 'r') as f:
    content = f.read()

# 1. Add imports
content = content.replace("import Image from 'next/image';", 
"import Image from 'next/image';\nimport { useDomain } from '@/context/DomainContext';\nimport AutoSearchBar from './AutoSearchBar';")

# 2. Add hook
content = content.replace("export default function Hero() {",
"export default function Hero() {\n  const { domain } = useDomain();")

# 3. Dynamic background
bg_target = """        <Image 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Home Background" 
          fill
          priority
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />"""

bg_replace = """        <div className={`absolute inset-0 transition-opacity duration-1000 ${domain === 'imobiliare' ? 'opacity-100' : 'opacity-0'}`}>
          <Image 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Home Background" 
            fill
            priority
            className="object-cover object-center opacity-20"
            sizes="100vw"
          />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${domain === 'auto' ? 'opacity-100' : 'opacity-0'}`}>
          <Image 
            src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Car Background" 
            fill
            priority
            className="object-cover object-center opacity-30"
            sizes="100vw"
          />
        </div>"""

content = content.replace(bg_target, bg_replace)

# 4. Update title and search box based on domain
search_box_target_start = "{searchMode === 'classic' ? ("
search_box_target_end = "          </div>\n        )}\n      </div>"

# I will use regex or careful replace to wrap the titles and search bars
import re

# Let's replace the title
title_target = """        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans text-white mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-light text-center pointer-events-auto leading-tight">
          {searchMode === 'classic' ? (
            <>Închiriere și vânzare de apartamente și case în <span className="inline-block bg-[#139E69] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[#139E69]/20 transform hover:scale-105 transition-transform">România</span></>
          ) : (
            <>Aici găsești toate anunțurile imobiliare de pe <span className="inline-block bg-[#139E69] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[#139E69]/20 transform hover:scale-105 transition-transform">toată piața</span></>
          )}
        </h1>"""

title_replace = """        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans text-white mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-light text-center pointer-events-auto leading-tight">
          {domain === 'imobiliare' ? (
            searchMode === 'classic' ? (
              <>Închiriere și vânzare de apartamente și case în <span className="inline-block bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[var(--primary)]/20 transform hover:scale-105 transition-transform">România</span></>
            ) : (
              <>Aici găsești toate anunțurile imobiliare de pe <span className="inline-block bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[var(--primary)]/20 transform hover:scale-105 transition-transform">toată piața</span></>
            )
          ) : (
             <>Găsește mașina perfectă din mii de anunțuri <span className="inline-block bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[var(--primary)]/20 transform hover:scale-105 transition-transform">Auto</span></>
          )}
        </h1>"""

content = content.replace(title_target, title_replace)

# 5. Swap the search blocks:
# Right below the title, there is: {searchMode === 'classic' ? (
# I will use string replace to inject the domain check.
search_start = "        {searchMode === 'classic' ? ("
new_search_start = """        {domain === 'auto' ? (
          <AutoSearchBar />
        ) : searchMode === 'classic' ? ("""

content = content.replace(search_start, new_search_start)

# Update some #139E69 to var(--primary)
content = content.replace('bg-[#139E69]', 'bg-[var(--primary)]')
content = content.replace('text-[#139E69]', 'text-[var(--primary)]')

with open('/Users/alex/imoob/src/components/sections/Hero.tsx', 'w') as f:
    f.write(content)

print("Hero updated.")
