with open('/Users/alex/imoob/src/components/layout/Footer.tsx', 'r') as f:
    content = f.read()

# 1. Add hook
content = content.replace("import { usePathname } from 'next/navigation';", "import { usePathname } from 'next/navigation';\nimport { useDomain } from '@/context/DomainContext';")
content = content.replace("const pathname = usePathname();", "const pathname = usePathname();\n  const { domain } = useDomain();")

# 2. Update category section
target_categories = """          {/* Columna 2 - Categorii */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">CATEGORII</h4>
            <ul className="space-y-3">
              <li><Link href="/propiedades?category=vanzari" className="text-gray-600 text-sm hover:text-teal-500 transition-colors duration-300">Vânzări</Link></li>
              <li><Link href="/propiedades?category=inchirieri" className="text-gray-600 text-sm hover:text-teal-500 transition-colors duration-300">Închirieri</Link></li>
              <li><Link href="/propiedades?category=apartamente" className="text-gray-600 text-sm hover:text-teal-500 transition-colors duration-300">Apartamente</Link></li>
              <li><Link href="/propiedades?category=case" className="text-gray-600 text-sm hover:text-teal-500 transition-colors duration-300">Case</Link></li>
              <li><Link href="/propiedades?category=terenuri" className="text-gray-600 text-sm hover:text-teal-500 transition-colors duration-300">Terenuri</Link></li>
            </ul>
          </div>"""

replace_categories = """          {/* Columna 2 - Categorii */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">CATEGORII</h4>
            <ul className="space-y-3">
              {domain === 'imobiliare' ? (
                <>
                  <li><Link href="/propiedades?category=vanzari" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Vânzări</Link></li>
                  <li><Link href="/propiedades?category=inchirieri" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Închirieri</Link></li>
                  <li><Link href="/propiedades?category=apartamente" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Apartamente</Link></li>
                  <li><Link href="/propiedades?category=case" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Case</Link></li>
                  <li><Link href="/propiedades?category=terenuri" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Terenuri</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/auto?category=autoturisme" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Autoturisme</Link></li>
                  <li><Link href="/auto?category=motociclete" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Motociclete</Link></li>
                  <li><Link href="/auto?category=autoutilitare" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Autoutilitare</Link></li>
                  <li><Link href="/auto?category=camioane" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Camioane</Link></li>
                  <li><Link href="/auto?category=piese" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Piese Auto</Link></li>
                </>
              )}
            </ul>
          </div>"""

content = content.replace(target_categories, replace_categories)

# Replace remaining text-teal-500 with text-[var(--primary)]
content = content.replace('text-teal-500', 'text-[var(--primary)]')
content = content.replace('hover:text-teal-500', 'hover:text-[var(--primary)]')
content = content.replace('hover:border-teal-500', 'hover:border-[var(--primary)]')
content = content.replace('hover:bg-teal-500', 'hover:bg-[var(--primary)]')

with open('/Users/alex/imoob/src/components/layout/Footer.tsx', 'w') as f:
    f.write(content)

print("Footer updated.")
