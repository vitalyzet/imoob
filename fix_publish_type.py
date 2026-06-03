with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'r') as f:
    content = f.read()

content = content.replace("currentStep === 3", "Number(currentStep) === 3")

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'w') as f:
    f.write(content)

print("Fixed Publish Form type")
