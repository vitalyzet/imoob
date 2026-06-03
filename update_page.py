with open('/Users/alex/imoob/src/app/page.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = content.replace("import RecommendedSearches from '@/components/sections/RecommendedSearches';", "")
content = content.replace("import FeaturedProperties from '@/components/sections/FeaturedProperties';", "import DomainView from '@/components/sections/DomainView';")

# Replace components
content = content.replace("<FeaturedProperties />\n      <RecommendedSearches />", "<DomainView />")

with open('/Users/alex/imoob/src/app/page.tsx', 'w') as f:
    f.write(content)

print("page.tsx updated.")
