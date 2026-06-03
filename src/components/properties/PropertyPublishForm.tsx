'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, Building2, Car, Store, Briefcase, Factory, Trees, ArrowRight, ArrowLeft, X, Check, 
  CheckCircle2, Upload, MapPin, Info, Star, TrendingUp, Wallet, CreditCard, Loader2, Bed, 
  Box, ChevronDown, Map, MapPinned, Search, MapPin as MapPinIcon, LayoutGrid, List, Filter
} from 'lucide-react';
import { AMENITIES_GROUPS } from '@/constants/amenities';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore';
import { compressImage } from '@/lib/imageCompression';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/layout/Logo';

const JUDETE_ROMANIA = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila',
  'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța',
  'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara',
  'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt',
  'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea',
  'Vâlcea', 'Vaslui', 'Vrancea'
];

const propertyTypes = [
  { 
    id: 'apartament', 
    label: 'Apartament', 
    icon: Building2,
    definition: 'Apartamente în blocuri rezidențiale, garsoniere, duplex-uri sau penthouse-uri pregătite pentru locuit.'
  },
  { 
    id: 'casa', 
    label: 'Casă', 
    icon: Home,
    definition: 'Case individuale, vile, case de vacanță sau cabane cu spații private.'
  },
  { 
    id: 'teren', 
    label: 'Teren', 
    icon: Trees,
    definition: 'Loturi de pământ extravilan, parcele sau terenuri intravilane pentru construcții.'
  },
  { 
    id: 'comercial', 
    label: 'Spațiu comercial', 
    icon: Store,
    definition: 'Birouri, magazine, restaurante sau depozite destinate activităților economice.'
  },
  {
    id: 'camera',
    label: 'Cameră de închiriat',
    icon: Bed,
    definition: 'Închirierea unei camere individuale într-un apartament sau casă, cu spații comune partajate.'
  }
];

export default function PropertyPublishForm({ editId }: { editId?: string }) {
  const router = useRouter();
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const submitAd = async () => {
    setIsFinalSubmitting(true);

    try {
      if (isEditing && editId) {
        const updateData = formData;
        await updateDoc(doc(db, 'anuncios', editId), {
          ...updateData,
          updatedAt: serverTimestamp(),
          status: 'pending'
        });
      } else {
        const baseSlug = `${formData.type || ''}-${formData.rooms ? formData.rooms + '-camere-' : ''}${formData.localitate || formData.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const generatedSlug = baseSlug ? `${baseSlug}-${Math.random().toString(36).substring(2, 8)}` : `prop-${Date.now()}`;

        await addDoc(collection(db, 'anuncios'), {
          ...formData,
          slug: generatedSlug,
          userId: user?.uid || '',
          email: formData.email || user?.email || '',
          name: formData.name || user?.displayName || 'Anónimo',
          createdAt: serverTimestamp(),
          status: 'pending',
          isPromoted: false,
          promoType: null,
          promoExpiresAt: null
        });
      }
      router.push('/Profil/my-ads');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Hubo un error al publicar el anuncio.");
      setIsFinalSubmitting(false);
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
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
  }, [editId, user, router]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    } else if (user) {
      const fetchWallet = async () => {
        const uSnap = await getDoc(doc(db, 'users', user.uid));
        if (uSnap.exists()) {
          setWalletBalance(uSnap.data().walletBalance || 0);
        }
      };
      fetchWallet();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !isEditing) {
      const fetchUserData = async () => {
        try {
          const userSnap = await getDoc(doc(db, 'users', user.uid));
          if (userSnap.exists()) {
            const data = userSnap.data();
            setFormData(prev => ({
              ...prev,
              name: prev.name || data.name || user.displayName || '',
              phone: prev.phone || data.phone || '',
              email: prev.email || data.email || user.email || ''
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              name: prev.name || user.displayName || '',
              email: prev.email || user.email || ''
            }));
          }
        } catch (err) {
          console.error("Error fetching user data in PropertyPublishForm:", err);
        }
      };
      fetchUserData();
    }
  }, [user, isEditing]);

  const [formData, setFormData] = useState({
    type: 'apartament',
    operation: 'vanzare',
    subType: 'apartament',
    price: '',
    pretNegociabil: false as boolean,
    area: '',
    yearBuilt: '',
    condition: '',
    energyCertificate: '',
    rooms: '2',
    baths: '1',
    compartimentare: 'decomandat',
    confort: '2',
    tipImobil: 'bloc',
    nrNiveluri: '',
    tipLocuinta: '',
    suprafataTeren: '',
    tipTeren: '',
    clasificareTeren: '',
    frontStradal: '',
    categorieComercial: '',
    pretPeMp: 'total' as 'mp' | 'total',
    subsol: false as boolean,
    demisol: false as boolean,
    mansardaCheck: false as boolean,
    comisionCumparator: 'nu' as 'nu' | 'da',
    comisionProcent: '0%',
    judet: '',
    localitate: '',
    strada: '',
    numar: '',
    bloc: '',
    scara: '',
    etaj: '',
    apartament: '',
    codPostal: '',
    floor: '',
    door: '',
    hideExactAddress: false as boolean,
    description: '',
    amenities: [] as string[],
    name: '',
    email: '',
    phone: '',
    images: [] as string[],
    cautaColeg: true as boolean,
    nrPersoaneActual: '1' as string,
    preferinteColeg: 'Fără preferințe' as string,
    cheltuieliIncluse: 'nu' as string,
    frigiderPersonal: 'la comun' as string,
    cameraCuCheie: 'da' as string,
    animaleAceptate: 'nu' as string,
    bucatarie: 'la comun' as string,
    baie: 'la comun' as string,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Límite de 8 fotos gratis
    if (formData.images.length + files.length > 8) {
      alert("Has alcanzado el límite máximo de 8 fotos gratis permitidas por anuncio.");
      return;
    }
    
    setIsUploading(true);

    const newImageUrls: string[] = [];

    await Promise.all(Array.from(files).map(async (rawFile) => {
        try {
            const file = await compressImage(rawFile);
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, contentType: file.type })
            });

            const data = await res.json();
            if (data.uploadUrl) {
                const uploadRes = await fetch(data.uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': file.type },
                    body: file
                });
                
                if (uploadRes.ok) {
                    newImageUrls.push(data.finalUrl);
                }
            }
        } catch (err) {
            console.error('Failed to upload file:', file.name, err);
        }
    }));

    updateField('images', [...(formData.images || []), ...newImageUrls]);
    setIsUploading(false);
  };


  const updateField = async (field: string, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'type' && value === 'camera') {
        next.operation = 'inchiriere';
      }
      return next;
    });

    if (user && ['name', 'phone', 'email'].includes(field)) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          [field]: value
        });
      } catch (err) {
        console.error(`Error autosaving user field ${field}:`, err);
      }
    }
  };

  // Format number with thousand separators (e.g., 3000 -> 3,000)
  const formatNumber = (val: string) => {
    if (!val) return '';
    return Number(val).toLocaleString('en-US');
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));

  const stepsInfo = [
    { num: 1, title: 'Tipo de inmueble' },
    { num: 2, title: 'Información esencial' },
    { num: 3, title: 'Ubicación' },
    { num: 4, title: 'Multimedia' },
    { num: 5, title: 'Detalles y descripción' },
    { num: 6, title: 'Contacto y publicar' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20">
      {/* Navbar Minimalist */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
               <div className="w-2.5 h-2.5 rounded-full bg-[#139E69]" />
               <span className="text-sm font-bold text-gray-700">Particular</span>
            </div>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors">
              <span className="font-bold text-sm">Salir</span>
              <X size={20} />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-4xl mt-12">
        {/* Progress Header - Hidden on Step 1 */}
        {currentStep > 1 && (
          <div className="mb-10">
            {/* Step circles with connecting lines */}
            <div className="flex items-center justify-between relative">
              {stepsInfo.map((step, i) => (
                <div key={step.num} className="flex items-center flex-1 last:flex-none">
                  {/* Step circle + label */}
                  <div className="flex flex-col items-center relative z-10">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500 ${
                        step.num < currentStep 
                          ? 'bg-[#139E69] text-white shadow-md shadow-[#139E69]/20' 
                          : step.num === currentStep 
                            ? 'bg-[#139E69] text-white ring-4 ring-[#139E69]/15 shadow-lg shadow-[#139E69]/25' 
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {step.num < currentStep ? <Check size={14} strokeWidth={3} /> : step.num}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 whitespace-nowrap transition-colors duration-300 ${
                      step.num <= currentStep ? 'text-[#139E69]' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {/* Connecting line */}
                  {i < stepsInfo.length - 1 && (
                    <div className="flex-1 h-[2px] mx-1.5 mt-[-18px] relative">
                      <div className="absolute inset-0 bg-gray-200 rounded-full" />
                      <div 
                        className={`absolute inset-y-0 left-0 bg-[#139E69] rounded-full transition-all duration-700 ease-out ${
                          step.num < currentStep ? 'w-full' : 'w-0'
                        }`} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Form Content */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-14"
            >
              {currentStep === 1 && (
                <div className="space-y-10 max-w-2xl mx-auto">
                   <header className="text-center">
                      <h1 className="text-[28px] font-black text-[#1a1a2e] mb-3 tracking-tight">Ce vrei să publici?</h1>
                      <p className="text-gray-500 text-[15px]">Alege tipul de proprietate pentru a continua.</p>
                   </header>

                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                     {propertyTypes.map((pt) => {
                       const Icon = pt.icon;
                       const isActive = formData.type === pt.id;
                       return (
                         <button 
                           key={pt.id} 
                           onClick={() => updateField('type', pt.id)}
                           className={`relative flex flex-col items-center justify-center gap-2.5 py-7 px-4 rounded-2xl transition-all duration-200 border cursor-pointer ${
                             isActive 
                               ? 'bg-[#f0faf5] border-[#139E69] shadow-sm' 
                               : 'border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-sm'
                           }`}
                         >
                           <div className={`transition-colors duration-200 ${
                             isActive ? 'text-[#139E69]' : 'text-gray-400'
                           }`}>
                             <Icon size={26} strokeWidth={1.8} />
                           </div>
                           <span className={`text-[13px] font-bold transition-colors ${isActive ? 'text-[#139E69]' : 'text-gray-600'}`}>
                             {pt.label}
                           </span>
                           {isActive && (
                             <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#139E69] rounded-full flex items-center justify-center">
                               <Check size={12} className="text-white" strokeWidth={3} />
                             </div>
                           )}
                         </button>
                       );
                     })}
                   </div>

                   {/* Inline Definition */}
                   {(() => {
                     const activeType = propertyTypes.find(t => t.id === formData.type);
                     return activeType ? (
                       <div className="flex items-start gap-4 p-5 bg-gray-50/80 rounded-xl border border-gray-100">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#139E69] shrink-0 shadow-sm">
                           {(() => { const I = activeType.icon; return <I size={20} strokeWidth={1.8} />; })()}
                         </div>
                         <div>
                           <p className="text-[13px] font-bold text-gray-800 mb-0.5">{activeType.label}</p>
                           <p className="text-[13px] text-gray-500 leading-relaxed">{activeType.definition}</p>
                         </div>
                       </div>
                     ) : null;
                   })()}

                   {/* CTA */}
                   <div className="pt-6 flex justify-center">
                      <button 
                        onClick={() => { if (isEditing && Number(currentStep) === 3) submitAd(); else nextStep(); }}
                        className="flex items-center gap-2.5 bg-[#139E69] hover:bg-[#0f8a5a] text-white px-10 py-4 rounded-xl font-bold transition-all text-[15px] group active:scale-[0.98] shadow-lg shadow-[#139E69]/15"
                      >
                        Continuă <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                   </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                   <header>
                      <h1 className="text-[22px] font-black text-[#1a1a2e] mb-1">Detalii proprietate</h1>
                      <p className="text-gray-500 text-[14px]">Completează informațiile esențiale despre proprietatea ta.</p>
                   </header>

                   {/* Tip tranzacție */}
                   <section>
                     <h3 className="text-[13px] font-bold text-gray-800 mb-3">Tip tranzacție <span className="text-red-400">*</span></h3>
                     <div className="flex gap-2">
                       {[{id: 'vanzare', label: 'De vânzare'}, {id: 'inchiriere', label: 'De închiriat'}].map((op) => {
                         // Force disable "De vânzare" if room is selected
                         if (formData.type === 'camera' && op.id === 'vanzare') return null;

                         return (
                         <button
                           key={op.id}
                           onClick={() => updateField('operation', op.id)}
                           className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all border ${
                             formData.operation === op.id 
                               ? 'bg-[#139E69] text-white border-[#139E69]' 
                               : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                           }`}
                         >
                           {op.label}
                         </button>
                       )})}
                     </div>
                   </section>

                   {!['teren', 'comercial'].includes(formData.type) && (
                     <>
                   <hr className="border-gray-100" />

                   {/* Condiții specifice pentru Cameră */}
                   {formData.type === 'camera' && (
                     <section className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-6">
                       <h3 className="text-[15px] font-black text-[#1a1a2e] flex items-center gap-2">
                         <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">👥</span>
                         Detalii Caută Coleg
                       </h3>
                       
                       <div className="space-y-4">
                         <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                           <div>
                             <p className="text-[13px] font-bold text-gray-800">Cauți coleg(i) de apartament?</p>
                             <p className="text-[12px] text-gray-500">Mărește vizibilitatea anunțului prin opțiunea asta</p>
                           </div>
                           <button
                             type="button"
                             onClick={() => updateField('cautaColeg', !formData.cautaColeg)}
                             className={`w-12 h-6 rounded-full transition-colors relative ${formData.cautaColeg ? 'bg-[#139E69]' : 'bg-gray-200'}`}
                           >
                             <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.cautaColeg ? 'translate-x-6.5 left-0.5' : 'left-0.5'}`} />
                           </button>
                         </div>

                         {formData.cautaColeg && (
                           <>
                             <div>
                               <label className="text-[13px] font-bold text-gray-800 mb-2 block">Câte persoane locuiesc curent?</label>
                               <div className="flex gap-2">
                                 {['0', '1', '2', '3+'].map(n => (
                                   <button
                                     key={n}
                                     onClick={() => updateField('nrPersoaneActual', n)}
                                     className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all border ${
                                       formData.nrPersoaneActual === n
                                         ? 'bg-white text-[#139E69] border-[#139E69] shadow-sm'
                                         : 'bg-white text-gray-500 border-gray-200'
                                     }`}
                                   >
                                     {n}
                                   </button>
                                 ))}
                               </div>
                             </div>

                             <div>
                               <label className="text-[13px] font-bold text-gray-800 mb-2 block">Profilul colegului căutat</label>
                               <div className="flex flex-wrap gap-2">
                                 {['Fără preferințe', 'Studenți', 'Salariați', 'Numai Fete', 'Numai Băieți', 'Cuplu'].map(n => (
                                   <button
                                     key={n}
                                     onClick={() => updateField('preferinteColeg', n)}
                                     className={`px-4 py-2 text-[12px] font-bold rounded-full transition-all border ${
                                       formData.preferinteColeg === n
                                         ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                         : 'bg-white text-gray-600 border-gray-200'
                                     }`}
                                   >
                                     {n}
                                   </button>
                                 ))}
                               </div>
                             </div>

                             {/* Extra Options for Roommates Grid */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 border-t border-gray-100 pt-6">
                               <div>
                                 <label className="text-[13px] font-bold text-gray-800 mb-2 block">Facturi (Lumină, Apă, Gaz)</label>
                                 <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                   {['Incluse în preț', 'Se plătesc separat'].map(opt => {
                                      const val = opt === 'Incluse în preț' ? 'da' : 'nu';
                                      return (
                                     <button
                                       key={val}
                                       type="button"
                                       onClick={() => updateField('cheltuieliIncluse', val)}
                                       className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                                         formData.cheltuieliIncluse === val
                                           ? 'bg-white text-emerald-600 shadow-sm border border-gray-200/60'
                                           : 'text-gray-500 hover:bg-gray-100'
                                       }`}
                                     >
                                       {opt}
                                     </button>
                                   )})}
                                 </div>
                               </div>

                               <div>
                                 <label className="text-[13px] font-bold text-gray-800 mb-2 block">Uzul frigiderului</label>
                                 <div className="flex flex-wrap gap-1.5">
                                    {['La comun', 'Frigider personal', 'Raft separat'].map(opt => {
                                      const val = opt === 'La comun' ? 'la comun' : (opt === 'Frigider personal' ? 'separat' : 'raft');
                                      return (
                                        <button
                                          key={val}
                                          type="button"
                                          onClick={() => updateField('frigiderPersonal', val)}
                                          className={`px-3 py-1.5 text-[12px] font-bold rounded-lg transition-all border ${
                                            formData.frigiderPersonal === val
                                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                 </div>
                               </div>

                               <div>
                                 <label className="text-[13px] font-bold text-gray-800 mb-2 block">Cameră sigură (cu cheie)</label>
                                 <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                    {['Da, are yală', 'Fără yală'].map(opt => {
                                       const val = opt === 'Da, are yală' ? 'da' : 'nu';
                                       return (
                                        <button
                                          key={val}
                                          type="button"
                                          onClick={() => updateField('cameraCuCheie', val)}
                                          className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                                            formData.cameraCuCheie === val
                                              ? 'bg-white text-emerald-600 shadow-sm border border-gray-200/60'
                                              : 'text-gray-500 hover:bg-gray-100'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                       )
                                    })}
                                 </div>
                               </div>

                               <div>
                                 <label className="text-[13px] font-bold text-gray-800 mb-2 block">Animale de companie</label>
                                 <div className="flex flex-wrap gap-1.5">
                                    {['Nu sunt permise', 'Da, permise', 'Talie mică'].map(opt => {
                                      const val = opt === 'Nu sunt permise' ? 'nu' : (opt === 'Da, permise' ? 'da' : 'mici');
                                      return (
                                        <button
                                          key={val}
                                          type="button"
                                          onClick={() => updateField('animaleAceptate', val)}
                                          className={`px-3 py-1.5 text-[12px] font-bold rounded-lg transition-all border ${
                                            formData.animaleAceptate === val
                                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                 </div>
                               </div>

                               <div>
                                 <label className="text-[13px] font-bold text-gray-800 mb-2 block">Bucătărie</label>
                                 <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                   {['La comun', 'Kitchinetă priv.'].map(opt => {
                                      const val = opt === 'La comun' ? 'la comun' : 'privat';
                                      return (
                                     <button
                                       key={val}
                                       type="button"
                                       onClick={() => updateField('bucatarie', val)}
                                       className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                                         formData.bucatarie === val
                                           ? 'bg-white text-emerald-600 shadow-sm border border-gray-200/60'
                                           : 'text-gray-500 hover:bg-gray-100'
                                       }`}
                                     >
                                       {opt}
                                     </button>
                                   )})}
                                 </div>
                               </div>

                               <div>
                                 <label className="text-[13px] font-bold text-gray-800 mb-2 block">Baie / Duș</label>
                                 <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                   {['La comun', 'Baie privată'].map(opt => {
                                      const val = opt === 'La comun' ? 'la comun' : 'privat';
                                      return (
                                     <button
                                       key={val}
                                       type="button"
                                       onClick={() => updateField('baie', val)}
                                            className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                                          formData.baie === val
                                            ? 'bg-white text-emerald-600 shadow-sm border border-gray-200/60'
                                            : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    )})}
                                 </div>
                               </div>

                             </div>
                            </>
                          )}
                       </div>
                     </section>
                   )}

                   {/* Nr. camere + Nr. băi */}
                   <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {formData.type !== 'camera' && (
                     <div>
                       <h3 className="text-[13px] font-bold text-gray-800 mb-3">Nr. camere <span className="text-red-400">*</span></h3>
                       <div className="flex gap-1.5">
                         {['1', '2', '3', '4', '5+'].map((n) => (
                           <button
                             key={n}
                             onClick={() => updateField('rooms', n)}
                             className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all border ${
                               formData.rooms === n
                                 ? 'bg-[#e8f4f0] text-[#139E69] border-[#139E69]/30'
                                 : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                             }`}
                           >
                             {n}
                           </button>
                         ))}
                       </div>
                     </div>
                     )}
                     <div className={formData.type === 'camera' ? 'col-span-1 sm:col-span-2' : ''}>
                       <h3 className="text-[13px] font-bold text-gray-800 mb-3">Nr. băi</h3>
                       <div className="flex gap-1.5">
                         {['1', '2+'].map((n) => (
                           <button
                             key={n}
                             onClick={() => updateField('baths', n)}
                             className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all border ${
                               formData.baths === n
                                 ? 'bg-[#e8f4f0] text-[#139E69] border-[#139E69]/30'
                                 : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                             }`}
                           >
                             {n}
                           </button>
                         ))}
                       </div>
                     </div>
                   </section>
                     </>
                   )}

                   {/* === APARTAMENT-ONLY fields === */}
                   {formData.type === 'apartament' && (
                     <>
                       {/* Compartimentare */}
                       <section>
                         <h3 className="text-[13px] font-bold text-gray-800 mb-3">Compartimentare</h3>
                         <div className="flex flex-wrap gap-2">
                           {['Decomandat', 'Semidecomandat', 'Nedecomandat', 'Circular'].map((c) => (
                             <button
                               key={c}
                               onClick={() => updateField('compartimentare', c.toLowerCase())}
                               className={`px-4 py-2.5 text-[13px] font-bold rounded-lg transition-all border ${
                                 formData.compartimentare === c.toLowerCase()
                                   ? 'bg-[#e8f4f0] text-[#139E69] border-[#139E69]/30'
                                   : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                               }`}
                             >
                               {c}
                             </button>
                           ))}
                         </div>
                       </section>

                       {/* Confort */}
                       <section>
                         <h3 className="text-[13px] font-bold text-gray-800 mb-3">Confort</h3>
                         <div className="flex gap-1.5 max-w-xs">
                           {['1', '2', '3', 'Lux'].map((c) => (
                             <button
                               key={c}
                               onClick={() => updateField('confort', c.toLowerCase())}
                               className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all border ${
                                 formData.confort === c.toLowerCase()
                                   ? 'bg-[#e8f4f0] text-[#139E69] border-[#139E69]/30'
                                   : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                               }`}
                             >
                               {c}
                             </button>
                           ))}
                         </div>
                       </section>

                       <hr className="border-gray-100" />

                       {/* Etaj + Nr. Niveluri + Tip imobil */}
                       <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Etaj <span className="text-red-400">*</span></h3>
                           <div className="relative">
                             <select
                               className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] appearance-none"
                               value={formData.floor}
                               onChange={(e) => updateField('floor', e.target.value)}
                             >
                               <option value="" disabled hidden>Alege</option>
                               <option value="demisol">Demisol</option>
                               <option value="parter">Parter</option>
                               {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                 <option key={n} value={String(n)}>Etaj {n}</option>
                               ))}
                               <option value="mansarda">Mansardă</option>
                             </select>
                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Nr. niveluri</h3>
                           <input
                             type="text"
                             inputMode="numeric"
                             className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                             placeholder="nr. etaje"
                             value={formData.nrNiveluri}
                             onChange={(e) => updateField('nrNiveluri', e.target.value.replace(/[^0-9]/g, ''))}
                           />
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Tip imobil</h3>
                           <div className="relative">
                             <select
                               className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] appearance-none"
                               value={formData.tipImobil}
                               onChange={(e) => updateField('tipImobil', e.target.value)}
                             >
                               <option value="bloc">Bloc de apartamente</option>
                               <option value="casa">Casă / Vilă</option>
                               <option value="duplex">Duplex</option>
                               <option value="penthouse">Penthouse</option>
                             </select>
                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                           </div>
                         </div>
                       </section>
                     </>
                   )}

                   {/* === CASĂ-ONLY fields === */}
                   {formData.type === 'casa' && (
                     <>
                       <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Tip locuință <span className="text-red-400">*</span></h3>
                           <div className="relative">
                             <select
                               className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] appearance-none"
                               value={formData.tipLocuinta}
                               onChange={(e) => updateField('tipLocuinta', e.target.value)}
                             >
                               <option value="" disabled hidden>Alege</option>
                               <option value="individuala">Casă individuală</option>
                               <option value="vila">Vilă</option>
                               <option value="duplex">Duplex</option>
                               <option value="triplex">Triplex</option>
                               <option value="insiruita">Casă înșiruită</option>
                               <option value="altele">Altele</option>
                             </select>
                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Nr. niveluri peste parter</h3>
                           <input
                             type="text"
                             inputMode="numeric"
                             className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                             placeholder="nr. etaje"
                             value={formData.nrNiveluri}
                             onChange={(e) => updateField('nrNiveluri', e.target.value.replace(/[^0-9]/g, ''))}
                           />
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Suprafață utilă <span className="text-red-400">*</span></h3>
                           <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                             <input
                               type="text"
                               inputMode="numeric"
                               className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                               placeholder="0"
                               value={formatNumber(formData.area)}
                               onChange={(e) => updateField('area', e.target.value.replace(/[^0-9]/g, ''))}
                             />
                             {formData.area && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                             <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">mp</span>
                           </div>
                         </div>
                       </section>

                       {/* Suprafață teren */}
                       <section>
                         <h3 className="text-[13px] font-bold text-gray-800 mb-3">Suprafață teren <span className="text-red-400">*</span></h3>
                         <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69] max-w-xs">
                           <input
                             type="text"
                             inputMode="numeric"
                             className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                             placeholder="0"
                             value={formatNumber(formData.suprafataTeren)}
                             onChange={(e) => updateField('suprafataTeren', e.target.value.replace(/[^0-9]/g, ''))}
                           />
                           {formData.suprafataTeren && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                           <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">mp</span>
                         </div>
                       </section>

                       {/* Checkboxes: Subsol, Demisol, Mansardă */}
                       <section>
                         <div className="flex flex-wrap gap-5">
                           {[
                             { key: 'subsol', label: 'Subsol' },
                             { key: 'demisol', label: 'Demisol' },
                             { key: 'mansardaCheck', label: 'Mansardă' },
                           ].map((item) => (
                             <label key={item.key} className="flex items-center gap-2.5 cursor-pointer group">
                               <div
                                 onClick={() => updateField(item.key, !formData[item.key as keyof typeof formData])}
                                 className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                   formData[item.key as keyof typeof formData]
                                     ? 'bg-[#139E69] border-[#139E69]'
                                     : 'border-gray-300 group-hover:border-gray-400'
                                 }`}
                               >
                                 {formData[item.key as keyof typeof formData] && <Check size={12} className="text-white" strokeWidth={3} />}
                               </div>
                               <span className="text-[13px] font-bold text-gray-700">{item.label}</span>
                             </label>
                           ))}
                         </div>
                       </section>
                     </>
                   )}

                   {/* === TEREN-ONLY fields === */}
                   {formData.type === 'teren' && (
                     <>
                       {/* Tip teren + Clasificare teren + Suprafață teren */}
                       <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Tip teren <span className="text-red-400">*</span></h3>
                           <div className="relative">
                             <select
                               className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] appearance-none"
                               value={formData.tipTeren}
                               onChange={(e) => updateField('tipTeren', e.target.value)}
                             >
                               <option value="" disabled hidden>Alege</option>
                               <option value="constructii">Construcții</option>
                               <option value="agricol">Agricol</option>
                               <option value="padure">Pădure</option>
                               <option value="livada">Livadă</option>
                               <option value="faneata">Fâneață</option>
                               <option value="pasune">Pășune</option>
                               <option value="helesteu">Heleșteu</option>
                               <option value="industrial">Industrial</option>
                               <option value="altele">Altele</option>
                             </select>
                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Clasificare teren <span className="text-red-400">*</span></h3>
                           <div className="relative">
                             <select
                               className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] appearance-none"
                               value={formData.clasificareTeren}
                               onChange={(e) => updateField('clasificareTeren', e.target.value)}
                             >
                               <option value="" disabled hidden>Alege</option>
                               <option value="intravilan">Intravilan</option>
                               <option value="extravilan">Extravilan</option>
                             </select>
                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Suprafață teren <span className="text-red-400">*</span></h3>
                           <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                             <input
                               type="text"
                               inputMode="numeric"
                               className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                               placeholder="0"
                               value={formatNumber(formData.suprafataTeren)}
                               onChange={(e) => updateField('suprafataTeren', e.target.value.replace(/[^0-9]/g, ''))}
                             />
                             {formData.suprafataTeren && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                             <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">mp</span>
                           </div>
                         </div>
                       </section>

                       {/* Front stradal + Preț solicitat */}
                       <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Front stradal <span className="text-red-400">*</span></h3>
                           <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                             <input
                               type="text"
                               inputMode="numeric"
                               className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                               placeholder="0"
                               value={formatNumber(formData.frontStradal)}
                               onChange={(e) => updateField('frontStradal', e.target.value.replace(/[^0-9]/g, ''))}
                             />
                             {formData.frontStradal && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                             <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">m</span>
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Preț solicitat <span className="text-red-400">*</span></h3>
                           <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                             <input
                               type="text"
                               inputMode="numeric"
                               className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                               placeholder="0"
                               value={formatNumber(formData.price)}
                               onChange={(e) => updateField('price', e.target.value.replace(/[^0-9]/g, ''))}
                             />
                             {formData.price && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                             {/* mp / total toggle */}
                             <div className="flex border-l border-gray-200 shrink-0">
                               {['mp', 'total'].map((m) => (
                                 <button
                                   key={m}
                                   onClick={() => updateField('pretPeMp', m as 'mp' | 'total')}
                                   className={`h-12 px-3 text-[12px] font-bold transition-all ${
                                     formData.pretPeMp === m
                                       ? 'bg-[#e8f4f0] text-[#139E69]'
                                       : 'bg-gray-50 text-gray-400 hover:text-gray-600'
                                   }`}
                                 >
                                   {m}
                                 </button>
                               ))}
                             </div>
                             <span className="h-12 min-w-[40px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">€</span>
                           </div>
                             <label className="flex items-center gap-2 mt-3 cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 checked={formData.pretNegociabil}
                                 onChange={(e) => updateField('pretNegociabil', e.target.checked)}
                                 className="w-4 h-4 rounded border-gray-300 text-[#139E69] focus:ring-[#139E69]"
                               />
                               <span className="text-[13px] text-gray-600 font-medium">Prețul este negociabil</span>
                             </label>
                         </div>
                       </section>
                     </>
                   )}
                   {/* === SPAȚIU COMERCIAL-ONLY fields === */}
                   {formData.type === 'comercial' && (
                     <>
                       <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Categorie <span className="text-red-400">*</span></h3>
                           <div className="relative">
                             <select
                               className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] appearance-none"
                               value={formData.categorieComercial}
                               onChange={(e) => updateField('categorieComercial', e.target.value)}
                             >
                               <option value="" disabled hidden>Alege</option>
                               <option value="birou">Birou</option>
                               <option value="comercial">Spațiu comercial</option>
                               <option value="industrial">Spațiu industrial</option>
                               <option value="depozit">Depozit / Hală</option>
                               <option value="hotel">Hotel / Pensiune</option>
                               <option value="restaurant">Restaurant / Bar</option>
                               <option value="productie">Spațiu de producție</option>
                               <option value="showroom">Showroom</option>
                               <option value="altele">Altele</option>
                             </select>
                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Suprafață utilă <span className="text-red-400">*</span></h3>
                           <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                             <input
                               type="text"
                               inputMode="numeric"
                               className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                               placeholder="0"
                               value={formatNumber(formData.area)}
                               onChange={(e) => updateField('area', e.target.value.replace(/[^0-9]/g, ''))}
                             />
                             {formData.area && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                             <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">mp</span>
                           </div>
                         </div>
                         <div>
                           <h3 className="text-[13px] font-bold text-gray-800 mb-3">Preț solicitat <span className="text-red-400">*</span></h3>
                           <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                             <input
                               type="text"
                               inputMode="numeric"
                               className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                               placeholder="0"
                               value={formatNumber(formData.price)}
                               onChange={(e) => updateField('price', e.target.value.replace(/[^0-9]/g, ''))}
                             />
                             {formData.price && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                             <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">€</span>
                           </div>
                             <label className="flex items-center gap-2 mt-3 cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 checked={formData.pretNegociabil}
                                 onChange={(e) => updateField('pretNegociabil', e.target.checked)}
                                 className="w-4 h-4 rounded border-gray-300 text-[#139E69] focus:ring-[#139E69]"
                               />
                               <span className="text-[13px] text-gray-600 font-medium">Prețul este negociabil</span>
                             </label>
                         </div>
                       </section>
                     </>
                   )}

                   {/* Shared bottom: only for apartament/casa */}
                   {['apartament', 'casa'].includes(formData.type) && (
                     <>
                   <hr className="border-gray-100" />

                   {/* Preț + An construcție */}
                   <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     {/* Suprafață utilă - only for apartament (casa has it above) */}
                     {formData.type === 'apartament' && (
                       <div>
                         <h3 className="text-[13px] font-bold text-gray-800 mb-3">Suprafață utilă <span className="text-red-400">*</span></h3>
                         <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                           <input
                             type="text"
                             inputMode="numeric"
                             className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                             placeholder="0"
                             value={formatNumber(formData.area)}
                             onChange={(e) => updateField('area', e.target.value.replace(/[^0-9]/g, ''))}
                           />
                           {formData.area && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                           <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">mp</span>
                         </div>
                       </div>
                     )}
                     <div>
                       <h3 className="text-[13px] font-bold text-gray-800 mb-3">Preț solicitat <span className="text-red-400">*</span></h3>
                       <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#139E69]/10 focus-within:border-[#139E69]">
                         <input
                           type="text"
                           inputMode="numeric"
                           className="flex-1 min-w-0 h-12 px-4 bg-white text-gray-900 font-bold text-[15px] placeholder:text-gray-300 outline-none border-none"
                           placeholder="0"
                           value={formatNumber(formData.price)}
                           onChange={(e) => updateField('price', e.target.value.replace(/[^0-9]/g, ''))}
                         />
                         {formData.price && <CheckCircle2 size={16} className="shrink-0 text-[#139E69] mx-2" />}
                         <span className="h-12 min-w-[50px] flex items-center justify-center shrink-0 bg-gray-50 text-gray-500 font-semibold text-[13px] border-l border-gray-200">€</span>
                       </div>
                             <label className="flex items-center gap-2 mt-3 cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 checked={formData.pretNegociabil}
                                 onChange={(e) => updateField('pretNegociabil', e.target.checked)}
                                 className="w-4 h-4 rounded border-gray-300 text-[#139E69] focus:ring-[#139E69]"
                               />
                               <span className="text-[13px] text-gray-600 font-medium">Prețul este negociabil</span>
                             </label>
                     </div>

                     <div>
                       <h3 className="text-[13px] font-bold text-gray-800 mb-3">Anul construcției</h3>
                       <input
                         type="text"
                         inputMode="numeric"
                         className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-900 font-bold text-[15px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                         placeholder="ex: 2005"
                         value={formData.yearBuilt}
                         onChange={(e) => updateField('yearBuilt', e.target.value.replace(/[^0-9]/g, ''))}
                       />
                     </div>
                   </section>
                     </>
                   )}

                   {/* Navigation */}
                   <div className="pt-8 border-t border-gray-100 flex justify-between">
                       <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all text-[14px] group">
                         <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Înapoi
                       </button>
                       <button onClick={() => { if (isEditing && Number(currentStep) === 3) submitAd(); else nextStep(); }} className="flex items-center gap-2.5 bg-[#139E69] hover:bg-[#0f8a5a] text-white px-8 py-3.5 rounded-xl font-bold transition-all text-[14px] group active:scale-[0.98] shadow-lg shadow-[#139E69]/15">
                         Continuă <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                       </button>
                    </div>
                </div>
              )}

              {Number(currentStep) === 3 && (
                <div className="space-y-10">
                  <header>
                    <h1 className="text-2xl font-black text-[#333] mb-2">Localizare</h1>
                    <p className="text-[#666] text-base">Adresa exactă ne ajută să evaluăm mai bine proprietatea ta.</p>
                  </header>

                  <div className="space-y-8">
                    {/* Județ + Localitate */}
                    <div>
                      <h3 className="text-[#f25c1a] font-bold text-lg mb-5">Adresă</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <h3 className="text-[13px] font-bold text-gray-800 mb-2">Județ <span className="text-red-400">*</span></h3>
                          <div className="relative">
                            <select
                              className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] appearance-none"
                              value={formData.judet}
                              onChange={(e) => updateField('judet', e.target.value)}
                            >
                              <option value="" disabled hidden>Alege județul</option>
                              {JUDETE_ROMANIA.map((j) => (
                                <option key={j} value={j}>{j}</option>
                              ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-[13px] font-bold text-gray-800 mb-2">Localitate <span className="text-red-400">*</span></h3>
                          <input
                            type="text"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                            placeholder="ex: Slatina, Cluj-Napoca..."
                            value={formData.localitate}
                            onChange={(e) => updateField('localitate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Strada + Număr */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="sm:col-span-2">
                        <h3 className="text-[13px] font-bold text-gray-800 mb-2">Strada</h3>
                        <input
                          type="text"
                          className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                          placeholder="ex: Bulevardul Nicolae Titulescu"
                          value={formData.strada}
                          onChange={(e) => updateField('strada', e.target.value)}
                        />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-bold text-gray-800 mb-2">Număr</h3>
                        <input
                          type="text"
                          className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                          placeholder="nr."
                          value={formData.numar}
                          onChange={(e) => updateField('numar', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Bloc / Scara / Etaj / Apartament */}
                    <div>
                      <h3 className="text-[#f25c1a] font-bold text-lg mb-5">Detalii bloc</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                        <div>
                          <h3 className="text-[13px] font-bold text-gray-800 mb-2">Bloc</h3>
                          <input
                            type="text"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                            placeholder="bloc"
                            value={formData.bloc}
                            onChange={(e) => updateField('bloc', e.target.value)}
                          />
                        </div>
                        <div>
                          <h3 className="text-[13px] font-bold text-gray-800 mb-2">Scara</h3>
                          <input
                            type="text"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                            placeholder="sc."
                            value={formData.scara}
                            onChange={(e) => updateField('scara', e.target.value)}
                          />
                        </div>
                        <div>
                          <h3 className="text-[13px] font-bold text-gray-800 mb-2">Etaj</h3>
                          <input
                            type="text"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                            placeholder="et."
                            value={formData.etaj}
                            onChange={(e) => updateField('etaj', e.target.value)}
                          />
                        </div>
                        <div>
                          <h3 className="text-[13px] font-bold text-gray-800 mb-2">Apartament</h3>
                          <input
                            type="text"
                            className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                            placeholder="ap."
                            value={formData.apartament}
                            onChange={(e) => updateField('apartament', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cod Poștal */}
                    <div className="max-w-xs">
                      <h3 className="text-[13px] font-bold text-gray-800 mb-2">Cod Poștal</h3>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-[13px] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] placeholder:text-gray-300"
                        placeholder="ex: 230001"
                        value={formData.codPostal}
                        onChange={(e) => updateField('codPostal', e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* Hide address toggle */}
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div
                        onClick={() => updateField('hideExactAddress', !formData.hideExactAddress)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          formData.hideExactAddress
                            ? 'bg-[#f25c1a] border-[#f25c1a] shadow-lg shadow-[#f25c1a]/20'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}
                      >
                        {formData.hideExactAddress && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-[#333]">Ascunde adresa exactă</span>
                        <span className="text-[12px] text-gray-500 font-medium">Publicul va vedea doar zona și localitatea, nu strada sau numărul.</span>
                      </div>
                    </label>
                  </div>

                  {/* Confirmation banner */}
                  {formData.judet && formData.localitate && (
                    <div className="flex items-center gap-3 p-4 bg-[#e8f5ee] rounded-xl border border-[#139E69]/20">
                      <div className="w-8 h-8 rounded-full bg-[#139E69]/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={16} className="text-[#139E69]" />
                      </div>
                      <p className="text-sm font-semibold text-[#139E69]">
                        Localizare: <span className="font-black">{formData.localitate}</span>, județul <span className="font-black">{formData.judet}</span>
                        {formData.strada && <span> · {formData.strada}{formData.numar ? ` nr. ${formData.numar}` : ''}</span>}
                      </p>
                    </div>
                  )}

                  <div className="pt-10 border-t border-gray-100 flex justify-between">
                      <button 
                        onClick={prevStep}
                        className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-6 py-3 font-bold transition-all text-base group"
                      >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Înapoi
                      </button>
                      <button 
                        onClick={() => { if (isEditing && Number(currentStep) === 3) submitAd(); else nextStep(); }}
                        className="flex items-center gap-3 bg-[#139E69] hover:bg-[#0f8256] text-white px-10 py-4 rounded-[20px] font-black transition-all shadow-lg text-base group"
                      >
                        Continuă <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              )}

              {currentStep === 4 && !isEditing && (
                <div className="space-y-10">
                  <header>
                    <h1 className="text-2xl font-black text-[#333] mb-2">Fotos de la propiedad</h1>
                    <p className="text-[#666] text-base">Los anuncios con fotos reales reciben hasta un 80% más de visitas.</p>
                  </header>

                  <div 
                    onClick={() => {
                      if (formData.images.length < 8) {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`border-3 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all relative ${
                      isUploading ? 'border-orange-300 bg-orange-50' : 
                      formData.images.length >= 8 ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed' : 'border-gray-200 bg-gray-50 hover:border-[#139E69] cursor-pointer'
                    }`}
                  >
                    <input 
                      type="file" 
                      hidden 
                      ref={fileInputRef} 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      disabled={formData.images.length >= 8 || isUploading}
                    />
                    
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={40} className="text-[#f25c1a] animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-[#f25c1a] mb-2">Subiendo imágenes...</h3>
                        <p className="text-orange-400 font-medium">Por favor, no cierres la ventana.</p>
                      </div>
                    ) : (
                      <div className="group">
                        <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-[#139E69] mb-6 group-hover:scale-110 transition-transform mx-auto">
                           <Upload size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-[#333] mb-2">Sube tus fotos aquí</h3>
                        <p className="text-gray-500 max-w-sm">Arrastra las imágenes o haz clic para seleccionarlas. Recomiendamos formato horizontal.</p>
                      </div>
                    )}
                  </div>

                  {/* Image Previews */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {formData.images.map((url, idx) => (
                         <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={url} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                           <button 
                             onClick={() => updateField('images', formData.images.filter((_, i) => i !== idx))}
                             className="absolute top-2 right-2 bg-white text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:scale-110 transition-all border border-red-100"
                           >
                             <X size={16} strokeWidth={3} />
                           </button>
                           {idx === 0 && (
                              <span className="absolute bottom-2 left-2 bg-[#139E69] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                                Portada
                              </span>
                           )}
                         </div>
                      ))}
                    </div>
                  )}


                  <div className="pt-12 border-t border-gray-100 flex justify-between">
                      <button onClick={prevStep} className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-6 py-3 font-bold transition-all text-base group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Anterior
                      </button>
                      <button onClick={() => { if (isEditing && Number(currentStep) === 3) submitAd(); else nextStep(); }} className="flex items-center gap-3 bg-[#139E69] hover:bg-[#0f8256] text-white px-10 py-4 rounded-[20px] font-black transition-all shadow-lg text-base group">
                        Siguiente <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-10">
                  <header>
                    <h1 className="text-2xl font-black text-[#333] mb-2">Describe tu propiedad</h1>
                    <p className="text-[#666] text-base">Cuenta lo que hace especial a tu vivienda.</p>
                  </header>

                  <div className="space-y-12">
                    {AMENITIES_GROUPS.map((group) => (
                      <section key={group.title} className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-[#f25c1a] rounded-full"></div>
                          <h3 className="text-[#333] font-black text-lg">{group.title}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const isSelected = formData.amenities.includes(item.id);
                            
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  const amenities = isSelected
                                    ? formData.amenities.filter(a => a !== item.id)
                                    : [...formData.amenities, item.id];
                                  updateField('amenities', amenities);
                                }}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${
                                  isSelected
                                    ? 'border-[#139E69] bg-[#139E69]/5 shadow-md shadow-[#139E69]/5'
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-[#139E69] text-white' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'
                                }`}>
                                  <Icon size={20} />
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-[13px] font-bold transition-colors ${
                                    isSelected ? 'text-gray-900' : 'text-gray-700'
                                  }`}>
                                    {item.id}
                                  </span>
                                </div>
                                {isSelected && (
                                  <div className="ml-auto">
                                    <Check size={16} className="text-[#139E69]" strokeWidth={3} />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    ))}

                    <hr className="border-gray-100" />

                    <section>
                      <h3 className="text-[#f25c1a] font-bold text-lg mb-6">Descripción larga</h3>
                      <textarea 
                        rows={8}
                        className="w-full p-6 border border-gray-200 rounded-2xl bg-white text-[#333] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] font-medium resize-none text-lg"
                        placeholder="Describe el barrio, los acabados, la comunidad..."
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                      ></textarea>
                    </section>
                  </div>

                  <div className="pt-12 border-t border-gray-100 flex justify-between">
                      <button onClick={prevStep} className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-6 py-3 font-bold transition-all text-base group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Anterior
                      </button>
                      <button onClick={() => { if (isEditing && Number(currentStep) === 3) submitAd(); else nextStep(); }} className="flex items-center gap-3 bg-[#139E69] hover:bg-[#0f8256] text-white px-10 py-4 rounded-[20px] font-black transition-all shadow-lg text-base group">
                        Siguiente <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-10">
                   <header className="text-center">
                     <div className="w-20 h-20 bg-[#EAF5EE] text-[#139E69] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} />
                     </div>
                     <h1 className="text-2xl font-black text-[#333] mb-3">¡Casi listo!</h1>
                     <p className="text-[#666] text-lg">Confirma tus datos de contacto para finalizar.</p>
                   </header>

                   <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <label className="block font-bold text-gray-500 text-sm uppercase tracking-wider mb-2">Nombre</label>
                            <input 
                              type="text" 
                              className="w-full h-14 px-5 border border-gray-200 rounded-xl bg-white text-[#333] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] font-bold"
                              placeholder="Tu nombre completo"
                              value={formData.name}
                              onChange={(e) => updateField('name', e.target.value)}
                            />
                         </div>
                         <div>
                            <label className="block font-bold text-gray-500 text-sm uppercase tracking-wider mb-2">Teléfono</label>
                            <input 
                              type="tel" 
                              className="w-full h-14 px-5 border border-gray-200 rounded-xl bg-white text-[#333] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] font-bold"
                              placeholder="+34 000 000 000"
                              value={formData.phone}
                              onChange={(e) => updateField('phone', e.target.value)}
                            />
                         </div>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 text-sm uppercase tracking-wider mb-2">Email</label>
                        <input 
                          type="email" 
                          className="w-full h-14 px-5 border border-gray-200 rounded-xl bg-white text-[#333] focus:ring-2 focus:ring-[#139E69]/10 focus:border-[#139E69] font-bold"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                        />
                      </div>
                   </div>

                   <div className="flex items-center gap-4 p-6 bg-[#fcfcfc] rounded-2xl border border-gray-200">
                      <Star className="text-[#ffb400] shrink-0" fill="#ffb400" />
                      <p className="text-sm text-gray-600 font-medium">Revisaremos tu anuncio manualmente para asegurar la calidad de la plataforma. Se publicará en menos de 24h.</p>
                   </div>

                   <div className="pt-12 border-t border-gray-100 flex justify-between items-center">
                      <button onClick={prevStep} className="text-gray-500 font-bold hover:text-black transition-colors" disabled={isFinalSubmitting}>Atrás</button>
                      <button 
                        onClick={submitAd}
                        disabled={isFinalSubmitting}
                        className={`text-white px-12 py-5 rounded-[16px] font-black transition-all shadow-xl text-[16px] uppercase tracking-wider flex items-center justify-center gap-3 ${
                          'bg-[#139E69] hover:bg-[#0f8256]'
                        } ${(isFinalSubmitting || formData.images.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isFinalSubmitting ? (
                          <>
                            <Loader2 size={24} className="animate-spin" />
                            Publicando...
                          </>
                        ) : (
                          'Publicar'
                        )}
                      </button>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Help footer */}
        <div className="mt-12 text-center text-gray-400 font-medium text-sm">
          <span>¿Tienes dudas? Consulta nuestro </span>
          <Link href="#" className="text-[#139E69] font-bold hover:underline">Centro de ayuda</Link>
          <span> o </span>
          <Link href="#" className="text-[#139E69] font-bold hover:underline">contacta con nosotros</Link>.
        </div>
      </main>
    </div>
  );
}

