const fs = require('fs');
const filePath = '/Users/alex/imoob/src/app/propiedades/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = '<div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 order-2 lg:order-1 flex flex-col pt-2">';
const replacementStr = '<div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 order-2 lg:order-1 flex flex-col pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 bg-[#F8FAF7] rounded-3xl">';

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Replacement successful');
} else {
  console.log('Target string not found');
}
