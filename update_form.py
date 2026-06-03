import re

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'r') as f:
    content = f.read()

# 1. Rename function and add props
content = content.replace('export default function PublicarAnuncioPage() {', 'export default function PropertyPublishForm({ editId }: { editId?: string }) {')

# 2. Add isEditing, isDataLoading and useEffect
search_hooks = r'  const \[currentStep, setCurrentStep\] = useState\(1\);\n  const \{ user, loading \} = useAuth\(\);'
replace_hooks = '''  const [currentStep, setCurrentStep] = useState(1);
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(!!editId);

  useEffect(() => {
    if (editId && user) {
      setIsEditing(true);
      const fetchAd = async () => {
        try {
          const docRef = doc(db, 'anuncios', editId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().userId === user.uid) {
            const data = docSnap.data();
            setFormData(prev => ({...prev, ...data}));
            setUploadedImages(data.images || []);
          } else {
            alert("No tienes permiso para editar este anuncio o no existe.");
            router.push('/Profil/my-ads');
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchAd();
    } else {
      setIsDataLoading(false);
    }
  }, [editId, user, router]);'''

content = re.sub(search_hooks, replace_hooks, content)

# 3. Update submitAd wallet check to skip if editing
search_wallet = r'if \(formData\.promoTier !== \'free\'\) \{'
replace_wallet = r'if (formData.promoTier !== \'free\' && !isEditing) {'
content = content.replace(search_wallet, replace_wallet)

# 4. Update submitAd logic
search_submit = r'await addDoc\(collection\(db, \'anuncios\'\), \{\s*\.\.\.formData,\s*userId: user\?\.uid \|\| \'\',\s*email: formData\.email \|\| user\?\.email \|\| \'\',\s*name: formData\.name \|\| user\?\.displayName \|\| \'Anónimo\',\s*createdAt: serverTimestamp\(\),\s*status: \'pending\',\s*isPromoted: formData\.promoTier !== \'free\',\s*promoType: formData\.promoTier === \'gold\' \? \'gold\' : \(formData\.promoTier === \'standard\' \? \'standard\' : null\),\s*promoExpiresAt: formData\.promoTier !== \'free\' \? Date\.now\(\) \+ \(parseInt\(formData\.promoDuration\) \* 24 \* 60 \* 60 \* 1000\) : null\s*\}\);'

replace_submit = '''      if (isEditing && editId) {
        const { promoTier, promoDuration, ...updateData } = formData;
        await updateDoc(doc(db, 'anuncios', editId), {
          ...updateData,
          images: uploadedImages,
          updatedAt: serverTimestamp(),
          status: 'pending'
        });
      } else {
        await addDoc(collection(db, 'anuncios'), {
          ...formData,
          images: uploadedImages,
          userId: user?.uid || '',
          email: formData.email || user?.email || '',
          name: formData.name || user?.displayName || 'Anónimo',
          createdAt: serverTimestamp(),
          status: 'pending',
          isPromoted: formData.promoTier !== 'free',
          promoType: formData.promoTier === 'gold' ? 'gold' : (formData.promoTier === 'standard' ? 'standard' : null),
          promoExpiresAt: formData.promoTier !== 'free' ? Date.now() + (parseInt(formData.promoDuration) * 24 * 60 * 60 * 1000) : null
        });
      }'''

content = re.sub(search_submit, replace_submit, content)

# 5. Handle image uploads saving in local state before submit. Wait, the form already does this via `uploadedImages`. Let's ensure the submit passes `images: uploadedImages`. Oh wait, I just added it in replace_submit. Let's make sure it's not added twice if it was already there.
# The original code was:
#       await addDoc(collection(db, 'anuncios'), {
#         ...formData,
# but the images array might be inside formData. Let's check how images were originally added.
# Usually it's `...formData, images: uploadedImages`. I added `images: uploadedImages` to both. Let's remove any `images:` from formData update if necessary, but it's safe to just override it.

# 6. Change titles
content = content.replace("<h1>Publicar un nuevo anuncio</h1>", "{isEditing ? <h1>Editează Anunțul</h1> : <h1>Publicar un nuevo anuncio</h1>}")
content = content.replace("Publică Anunțul", "{isEditing ? 'Salvează Modificările' : 'Publică Anunțul'}")
# Hide promo section if editing
content = content.replace('currentStep === 4 && (', 'currentStep === 4 && !isEditing && (')
content = content.replace('currentStep === 4 && isFinalSubmitting', '(currentStep === 4 || (isEditing && currentStep === 3)) && isFinalSubmitting')

# If editing, we skip step 4 (Promo)
content = content.replace('onClick={nextStep}', 'onClick={() => { if (isEditing && currentStep === 3) submitAd(); else nextStep(); }}')

with open('/Users/alex/imoob/src/components/properties/PropertyPublishForm.tsx', 'w') as f:
    f.write(content)

print("Updated PropertyPublishForm.tsx")
