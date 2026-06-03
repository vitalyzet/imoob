with open('/Users/alex/imoob/src/components/sections/Testimonials.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { testimonials } from '@/lib/data';", "const testimonials = [{ name: 'Alex', role: 'User', content: 'Great platform!', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a' }];")

with open('/Users/alex/imoob/src/components/sections/Testimonials.tsx', 'w') as f:
    f.write(content)

print("Fixed testimonials.")
