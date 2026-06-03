with open('/Users/alex/imoob/src/components/properties/AutoCard.tsx', 'r') as f:
    content = f.read()

content = content.replace("export default function AutoCard({ auto }: AutoCardProps) {", "export default function AutoCard({ auto }: AutoCardProps) {\n  const slug = auto.title.toLowerCase().replace(/\\s+/g, '-');")
content = content.replace("<motion.div", f"<Link href={{`/auto/${{slug}}`}} className=\"block h-full\">\n    <motion.div")
content = content.replace("</motion.div>", "</motion.div>\n    </Link>")

with open('/Users/alex/imoob/src/components/properties/AutoCard.tsx', 'w') as f:
    f.write(content)

print("AutoCard wrapped in Link")
