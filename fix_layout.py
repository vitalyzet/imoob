import re

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

# 1. We want to remove the current Breadcrumbs wrapper AND the orphaned Actions-Right block.
# Look at lines 222-250 roughly.
pattern_to_remove = r'      \{\/\* Breadcrumbs \*\/\}.*?      <div className="bg-white w-full border-b border-gray-200 pb-12 pt-6">'
replacement = r'''      <div className="bg-white w-full border-b border-gray-200 pb-12 pt-4">'''

new_content = re.sub(pattern_to_remove, replacement, content, flags=re.DOTALL)

# 2. We need to inject the breadcrumbs INSIDE the new white wrapper.
# Let's find: `      <div className="container mx-auto px-6">\n        \n        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-0">`
breadcrumbs_code = r'''      <div className="container mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-6 font-medium">
          <Link href="/" className="hover:text-[#139E69] transition-colors">imoob</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <Link href="/propiedades" className="hover:text-[#139E69] transition-colors">Proprietăți</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-400 truncate">{property.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-0">'''

search_container = r'      <div className="container mx-auto px-6">\n\s*<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-0">'
new_content = re.sub(search_container, breadcrumbs_code, new_content)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(new_content)

print("Layout fixed.")
