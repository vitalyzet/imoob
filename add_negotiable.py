with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'r') as f:
    content = f.read()

# 1. Add to initial state
content = content.replace("price: '',", "price: '',\n    pretNegociabil: false as boolean,")

# 2. Define the checkbox HTML
checkbox_html = '''
                         <label className="flex items-center gap-2 mt-3 cursor-pointer">
                           <input 
                             type="checkbox" 
                             checked={formData.pretNegociabil}
                             onChange={(e) => updateField('pretNegociabil', e.target.checked)}
                             className="w-4 h-4 rounded border-gray-300 text-[#139E69] focus:ring-[#139E69]"
                           />
                           <span className="text-[13px] text-gray-600 font-medium">Prețul este negociabil</span>
                         </label>'''

# We need to insert this right after the price input container. The price input container ends with `</div>`
# Let's use regex to find the exact structure.
# The structure around 1015:
#                         <div className="relative flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#139E69] focus-within:ring-1 focus-within:ring-[#139E69] transition-all">
#                           <input ... />
#                           {formData.price && <CheckCircle2 ... />}
#                           <span className="px-4 text-gray-500 font-bold border-l border-gray-100">€</span>
#                         </div>

import re

# Match the div containing the price input and append the checkbox after it
pattern = r'(<span className="px-4 text-gray-500 font-bold border-l border-gray-100">€</span>\s*</div>)'

content = re.sub(pattern, r'\1' + checkbox_html, content)

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'w') as f:
    f.write(content)

print("Added pretNegociabil to form")
