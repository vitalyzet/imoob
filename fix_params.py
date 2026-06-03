with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'r') as f:
    content = f.read()

target = "export default function AutoDetailsPage({ params }: { params: { slug: string } }) {\n  // Mock data for the auto based on slug\n  const title = params.slug.replace"

replacement = """export default async function AutoDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Mock data for the auto based on slug
  const title = slug.replace"""

content = content.replace(target, replacement)

with open('/Users/alex/imoob/src/app/auto/[slug]/page.tsx', 'w') as f:
    f.write(content)

print("Fixed params promise in auto details page.")
