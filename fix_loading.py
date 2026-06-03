import re

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'r') as f:
    content = f.read()

search_render = r'return \(\n    <div className="min-h-screen bg-\[#FAFAFA\]">'
replace_render = '''  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#139E69]/20 border-t-[#139E69] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold">Se încarcă datele anunțului...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">'''

if 'if (isDataLoading)' not in content:
    content = content.replace('return (\n    <div className="min-h-screen bg-[#FAFAFA]">', replace_render)

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'w') as f:
    f.write(content)

print("Added loading state block")
