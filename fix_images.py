with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'r') as f:
    content = f.read()

content = content.replace('setUploadedImages(data.images || []);', '')
content = content.replace('images: uploadedImages,', '')

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'w') as f:
    f.write(content)

print("Fixed uploadedImages reference error")
