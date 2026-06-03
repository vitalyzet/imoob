import re

with open('/Users/alex/imoob/src/app/Profil/my-ads/page.tsx', 'r') as f:
    content = f.read()

search_btn = r'<button className="p-2 text-gray-400 hover:text-amber-500 hover:bg-white hover:shadow-sm rounded-\[10px\] transition-all"><Pencil size=\{16\} /></button>'
replace_btn = '<Link href={`/editar-anuncio/${ad.id}`} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-white hover:shadow-sm rounded-[10px] transition-all"><Pencil size={16} /></Link>'

content = re.sub(search_btn, replace_btn, content)

with open('/Users/alex/imoob/src/app/Profil/my-ads/page.tsx', 'w') as f:
    f.write(content)

print("Updated my-ads with edit link")
