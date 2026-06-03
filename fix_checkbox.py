with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'r') as f:
    lines = f.readlines()

checkbox_html = '''                             <label className="flex items-center gap-2 mt-3 cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 checked={formData.pretNegociabil}
                                 onChange={(e) => updateField('pretNegociabil', e.target.checked)}
                                 className="w-4 h-4 rounded border-gray-300 text-[#139E69] focus:ring-[#139E69]"
                               />
                               <span className="text-[13px] text-gray-600 font-medium">Prețul este negociabil</span>
                             </label>\n'''

# We will look for lines that contain "€</span>" followed by a line with "</div>"
for i in range(len(lines)):
    if '€</span>' in lines[i] and '</div>' in lines[i+1]:
        # Insert checkbox after the </div>
        lines[i+1] = lines[i+1] + checkbox_html

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'w') as f:
    f.writelines(lines)

print("Inserted checkboxes correctly.")
