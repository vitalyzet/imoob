import re

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

search_pattern = r'''        \{\/\* Breadcrumbs \*\/\}
        <div className="flex items-center gap-2 text-\[13px\] text-gray-500 mb-6 font-medium">
          <Link href="/" className="hover:text-\[\#139E69\] transition-colors">imoob<\/Link>
          <ChevronRight size=\{14\} className="text-gray-300" \/>
          <Link href="/propiedades" className="hover:text-\[\#139E69\] transition-colors">Proprietăți<\/Link>
          <ChevronRight size=\{14\} className="text-gray-300" \/>
          <span className="text-gray-400 truncate">\{property.title\}<\/span>
        <\/div>'''

replace_code = r'''        {/* Breadcrumbs & Top Actions */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            <Link href="/" className="hover:text-[#139E69] transition-colors">imoob</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/propiedades" className="hover:text-[#139E69] transition-colors">Proprietăți</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-400 truncate">{property.title}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-[12px] font-bold hover:bg-gray-50 transition-all hover:shadow-sm">
              <Heart size={14} className="text-[#f25c1a]" fill="#f25c1a" />
              Favorit
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-[12px] font-bold hover:bg-gray-50 transition-all hover:shadow-sm">
              <Share2 size={14} className="text-gray-500" />
              Trimite
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-[12px] font-bold hover:bg-gray-50 transition-all hover:shadow-sm">
              <Flag size={14} className="text-gray-500" />
              Raportează
            </button>
          </div>
        </div>'''

new_content = re.sub(search_pattern, replace_code, content)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(new_content)

print("Added actions back.")
