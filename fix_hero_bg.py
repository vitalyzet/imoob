import re

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'r') as f:
    content = f.read()

# 1. Wrap the hero section
# We find: <div className="container mx-auto px-6 py-4"> right after Top Action Bar
search_container = r'<div className="container mx-auto px-6 py-4">\s*<div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-8 mt-6">'
replace_container = r'''<div className="bg-white w-full border-b border-gray-200 pb-12 pt-6">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-0">'''

content = re.sub(search_container, replace_container, content)

# 2. Modify the Left Column to remove background and padding
search_left_col = r'<div className="w-full lg:w-\[480px\] xl:w-\[540px\] shrink-0 order-2 lg:order-1 flex flex-col pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 rounded-3xl" style={{ backgroundColor: "#F8FAF7" }}>'
replace_left_col = r'<div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 order-2 lg:order-1 flex flex-col pt-2">'

content = content.replace(search_left_col, replace_left_col)

# 3. Find the end of the hero section to close the new full-width wrapper
# The hero section ends right before: <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start mt-0">
search_end = r'(\s*)<div className="grid grid-cols-1 gap-5 lg:grid-cols-\[minmax\(0,1fr\)_380px\] lg:items-start mt-0">'
replace_end = r'\1</div>\n\1<div className="container mx-auto px-6 py-8">\n\1<div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start mt-0">'

# Since we opened `<div className="bg-white w-full..."><div className="container...">`, we need to close BOTH before opening the container for the lower grid.
# Wait, the original code had:
#       <div className="container mx-auto px-6 py-4">
#         <div className="flex flex-col ...">...</div>
#         <div className="grid grid-cols-1 ...">...</div>
# So the hero and the grid were in the SAME container!
# If I change the container structure:
search_hero_end = r'        </div>\n\n        <div className="grid grid-cols-1 gap-5 lg:grid-cols-\[minmax\(0,1fr\)_380px\] lg:items-start mt-0">'
replace_hero_end = r'''        </div>
      </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start mt-0">'''

content = re.sub(search_hero_end, replace_hero_end, content)

with open('/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Hero wrapper and styling updated successfully.")
