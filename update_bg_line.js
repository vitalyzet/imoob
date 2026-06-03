const fs = require('fs');
const filePath = '/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the div opening tag to include inline style
content = content.replace(
  '<div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 order-2 lg:order-1 flex flex-col pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 bg-[#F8FAF7] rounded-3xl">',
  '<div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 order-2 lg:order-1 flex flex-col pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 rounded-3xl" style={{ backgroundColor: "#F8FAF7" }}>'
);

// Replace the line div with an hr element
content = content.replace(
  '<div className="w-full h-px bg-gray-200 mb-8"></div>',
  '<hr className="w-full border-t border-gray-200/80 mb-8" />'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update successful');
