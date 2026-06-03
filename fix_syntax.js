const fs = require('fs');
let s = fs.readFileSync('src/app/publicar-anuncio/page.tsx', 'utf8');

s = s.replace(
  `: 'text-gray-500 hover:bg-gray-100'\n                                     )})}`,
  `: 'text-gray-500 hover:bg-gray-100'\n                                       }\`\n                                     >\n                                       {opt}\n                                     </button>\n                                   )})}`
);

fs.writeFileSync('src/app/publicar-anuncio/page.tsx', s);
