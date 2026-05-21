'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ROMANIA_LOCATIONS as LOCATIONS_DATA } from '@/constants/romaniaCities';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, ArrowRight, ArrowLeft, X, Check, CheckCircle2, Camera, Loader2,
  Fuel, Cog, Gauge, Calendar, MapPin, Palette, Search, ChevronDown
} from 'lucide-react';

const ACCENT = '#0ea5e9';

// Build searchable location strings from imported data
const ROMANIA_LOCATIONS = LOCATIONS_DATA.map(l => `${l.name}, ${l.county}`);

// Known Romanian cities (orașe) — these get colored icons
const CITIES = new Set([
  'București','Sector 1','Sector 2','Sector 3','Sector 4','Sector 5','Sector 6',
  'Alba Iulia','Sebeș','Aiud','Cugir','Blaj','Arad','Lipova','Ineu',
  'Pitești','Mioveni','Câmpulung','Curtea de Argeș','Bacău','Onești','Moinești','Comănești',
  'Oradea','Salonta','Marghita','Beiuș','Bistrița','Beclean','Năsăud',
  'Botoșani','Dorohoi','Brașov','Făgăraș','Săcele','Codlea','Zărnești','Râșnov','Predeal',
  'Brăila','Buzău','Râmnicu Sărat','Reșița','Caransebeș',
  'Călărași','Oltenița','Cluj-Napoca','Turda','Dej','Gherla',
  'Constanța','Medgidia','Mangalia','Năvodari','Cernavodă','Eforie',
  'Sfântu Gheorghe','Târgu Secuiesc','Târgoviște','Moreni',
  'Craiova','Băilești','Calafat','Galați','Tecuci','Giurgiu',
  'Târgu Jiu','Motru','Miercurea Ciuc','Odorheiu Secuiesc','Gheorgheni','Toplița',
  'Deva','Hunedoara','Petroșani','Lupeni','Vulcan','Orăștie','Brad',
  'Slobozia','Fetești','Urziceni','Iași','Pașcani',
  'Voluntari','Pantelimon','Buftea','Popești-Leordeni','Bragadiru','Otopeni',
  'Baia Mare','Sighetu Marmației','Borșa','Drobeta-Turnu Severin','Orșova',
  'Târgu Mureș','Reghin','Sighișoara','Târnăveni',
  'Piatra Neamț','Roman','Slatina','Caracal','Balș','Corabia',
  'Ploiești','Câmpina','Sinaia','Bușteni','Azuga','Breaza','Vălenii de Munte',
  'Satu Mare','Carei','Zalău','Sibiu','Mediaș','Cisnădie',
  'Suceava','Fălticeni','Rădăuți','Câmpulung Moldovenesc','Vatra Dornei','Gura Humorului',
  'Alexandria','Roșiorii de Vede','Turnu Măgurele',
  'Timișoara','Lugoj','Tulcea','Vaslui','Bârlad','Huși',
  'Râmnicu Vâlcea','Drăgășani','Focșani','Adjud'
]);

// Strip ALL diacritics for search (handles both Unicode variants of ș/ț)
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f\u0327\u0328]/g, '').toLowerCase();

// Fuzzy match: each char of query must appear in order, allowing skips
const fuzzyMatch = (text: string, query: string) => {
  const t = normalize(text);
  const q = normalize(query);
  if (t.includes(q)) return true;
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti);
    if (idx === -1) return false;
    ti = idx + 1;
  }
  return true;
};

import { AUTO_BRANDS, AUTO_MODELS } from '@/constants/autoModels';
const BODY_TYPES = [
  { id: 'micro', label: 'Micro', icon: Car },
  { id: 'hatchback', label: 'Hatchback', icon: Car },
  { id: 'sedan', label: 'Sedan', icon: Car },
  { id: 'coupe', label: 'Coupe', icon: Car },
  { id: 'cabrio', label: 'Cabrio', icon: Car },
  { id: 'break', label: 'Break', icon: Car },
  { id: 'monovolum', label: 'Monovolum', icon: Car },
  { id: 'suv', label: 'SUV', icon: Car },
  { id: 'pickup', label: 'Pick-Up', icon: Car },
  { id: 'wagon', label: 'Wagon', icon: Car },
  { id: 'mpv', label: 'MPV', icon: Car },
  { id: 'offroad', label: 'Off-Road', icon: Car },
  { id: 'minivan', label: 'Minivan', icon: Car },
];

const AUTO_FEATURES = [
  "ABS","ESP","Aer condiționat","Climatronic","Navigație GPS",
  "Scaune încălzite","Scaune ventilate","Senzori parcare","Cameră marșarier",
  "Cameră 360","Faruri LED","Faruri Matrix","Trapă panoramic",
  "Tapițerie piele","Volan încălzit","Sistem audio premium","Apple CarPlay",
  "Android Auto","Keyless GO","Keyless Entry","Head-up Display",
  "Lane Assist","Front Assist","Blind Spot Monitor","Cârlig remorcare"
];

const stepsInfo = [
  { num: 1, title: 'Tip vehicul' },
  { num: 2, title: 'Specificații' },
  { num: 3, title: 'Dotări' },
  { num: 4, title: 'Multimedia' },
  { num: 5, title: 'Preț și publicare' },
];

export default function AutoPublishForm() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAllBody, setShowAllBody] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityRef = React.useRef<HTMLDivElement>(null);
  const [modelSearch, setModelSearch] = useState('');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const modelRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityDropdownOpen(false);
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setModelDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  React.useEffect(() => {
    if (user) {
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
          console.error("Error fetching user data in AutoPublishForm:", err);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const [formData, setFormData] = useState({
    marca: '', model: '', an: '', rulaj: '',
    combustibil: '', transmisie: '', caroserie: '',
    motor: '', putere: '', culoare: '', stare: 'Rulat',
    price: '', pretNegociabil: false, city: '',
    description: '', features: [] as string[],
    images: [] as string[], name: '', phone: '', email: ''
  });

  const updateField = async (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

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

  const toggleFeature = (f: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f]
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (formData.images.length + files.length > 8) {
      alert("Maxim 8 fotografii permise."); return;
    }
    setIsUploading(true);
    const newUrls: string[] = [];
    await Promise.all(Array.from(files).map(async (file) => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type })
        });
        const data = await res.json();
        if (data.uploadUrl) {
          const uploadRes = await fetch(data.uploadUrl, {
            method: 'PUT', headers: { 'Content-Type': file.type }, body: file
          });
          if (uploadRes.ok) newUrls.push(data.finalUrl);
        }
      } catch (err) { console.error(err); }
    }));
    updateField('images', [...formData.images, ...newUrls]);
    setIsUploading(false);
  };

  const removeImage = (i: number) => {
    updateField('images', formData.images.filter((_, idx) => idx !== i));
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'anuncios_auto'), {
        ...formData, userId: user?.uid || 'anonymous',
        createdAt: serverTimestamp(), status: 'pending', domain: 'auto'
      });
      router.push('/Profil/my-ads');
    } catch (e) {
      console.error(e); alert('Eroare la publicare');
    } finally { setIsSubmitting(false); }
  };

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, 5));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none font-medium text-gray-800";
  const labelCls = "block text-[13px] font-bold text-gray-800 mb-2";

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-black">
            IMOB<span style={{color: ACCENT}}>.</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3 bg-sky-50 px-4 py-2 rounded-full border border-sky-100">
              <Car size={14} className="text-sky-500" />
              <span className="text-sm font-bold text-sky-700">Vehicul</span>
            </div>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors">
              <span className="font-bold text-sm">Ieși</span>
              <X size={20} />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-4xl mt-12">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {stepsInfo.map((step, i) => (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500 ${
                    step.num < currentStep
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : step.num === currentStep
                        ? 'bg-sky-500 text-white ring-4 ring-sky-500/15 shadow-lg shadow-sky-500/25'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}>
                    {step.num < currentStep ? <Check size={14} strokeWidth={3} /> : step.num}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 whitespace-nowrap transition-colors duration-300 ${
                    step.num <= currentStep ? 'text-sky-500' : 'text-gray-400'
                  }`}>{step.title}</span>
                </div>
                {i < stepsInfo.length - 1 && (
                  <div className="flex-1 h-[2px] mx-1.5 mt-[-18px] relative">
                    <div className="absolute inset-0 bg-gray-200 rounded-full" />
                    <div className={`absolute inset-y-0 left-0 bg-sky-500 rounded-full transition-all duration-700 ease-out ${
                      step.num < currentStep ? 'w-full' : 'w-0'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
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

              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="space-y-10 max-w-2xl mx-auto">
                  <header className="text-center">
                    <h1 className="text-[28px] font-black text-[#1a1a2e] mb-3 tracking-tight">Ce vehicul vinzi?</h1>
                    <p className="text-gray-500 text-[15px]">Completează informațiile de bază ale vehiculului tău.</p>
                  </header>

                  {/* Body type grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {(showAllBody ? BODY_TYPES : BODY_TYPES.slice(0, 6)).map((bt) => {
                      const isActive = formData.caroserie === bt.id;
                      return (
                        <button key={bt.id} onClick={() => updateField('caroserie', bt.id)}
                          className={`relative flex flex-col items-center justify-center gap-2 py-6 px-3 rounded-2xl transition-all duration-200 border cursor-pointer ${
                            isActive ? 'bg-sky-50 border-sky-400 shadow-sm' : 'border-gray-200/80 bg-white hover:border-gray-300'
                          }`}>
                          <Car size={24} strokeWidth={1.8} className={isActive ? 'text-sky-500' : 'text-gray-400'} />
                          <span className={`text-[12px] font-bold ${isActive ? 'text-sky-500' : 'text-gray-600'}`}>{bt.label}</span>
                          {isActive && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                              <Check size={12} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!showAllBody && (
                    <button
                      onClick={() => setShowAllBody(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-gray-500 hover:text-sky-500 transition-colors group"
                    >
                      <span>Mai multe tipuri</span>
                      <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  )}

                  <hr className="border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Marcă <span className="text-red-400">*</span></label>
                      <select value={formData.marca} onChange={(e) => { updateField('marca', e.target.value); updateField('model', ''); setModelSearch(''); }} className={inputCls}>
                        <option value="">Selectează marca</option>
                        {AUTO_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div ref={modelRef} className="relative">
                      <label className={labelCls}>Model <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        placeholder={formData.marca ? `Caută model ${formData.marca}...` : 'Selectează mai întâi marca'}
                        value={modelDropdownOpen ? modelSearch : formData.model}
                        onChange={(e) => {
                          setModelSearch(e.target.value);
                          updateField('model', e.target.value);
                          setModelDropdownOpen(true);
                        }}
                        onFocus={() => { setModelDropdownOpen(true); setModelSearch(formData.model); }}
                        className={inputCls}
                      />
                      {modelDropdownOpen && formData.marca && (() => {
                        const models = AUTO_MODELS[formData.marca] || [];
                        const filtered = models.filter(m => 
                          m.toLowerCase().includes((modelSearch || '').toLowerCase())
                        );
                        if (filtered.length === 0 && !modelSearch) return null;
                        return (
                          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                            {filtered.length > 0 ? filtered.map(m => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => { updateField('model', m); setModelSearch(m); setModelDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-[13px] font-medium hover:bg-sky-50 transition-colors flex items-center justify-between ${
                                  formData.model === m ? 'bg-sky-50 text-sky-700 font-bold' : 'text-gray-700'
                                }`}
                              >
                                {m}
                                {formData.model === m && <span className="text-sky-500 text-[11px] font-bold">✓</span>}
                              </button>
                            )) : modelSearch && (
                              <div className="px-4 py-3 text-[12px] text-gray-400 font-medium">
                                Se va folosi: <span className="text-gray-700 font-bold">&quot;{modelSearch}&quot;</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    <div>
                      <label className={labelCls}>An fabricație <span className="text-red-400">*</span></label>
                      <input type="number" placeholder="ex: 2021" value={formData.an}
                        onChange={(e) => updateField('an', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Rulaj (km) <span className="text-red-400">*</span></label>
                      <input type="number" placeholder="ex: 85000" value={formData.rulaj}
                        onChange={(e) => updateField('rulaj', e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  <section>
                    <h3 className="text-[13px] font-bold text-gray-800 mb-3">Stare vehicul <span className="text-red-400">*</span></h3>
                    <div className="flex gap-2">
                      {['Nou','Rulat','Avariat'].map(s => (
                        <button key={s} onClick={() => updateField('stare', s)}
                          className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all border ${
                            formData.stare === s ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}>{s}</button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <header>
                    <h1 className="text-[22px] font-black text-[#1a1a2e] mb-1">Specificații tehnice</h1>
                    <p className="text-gray-500 text-[14px]">Completează datele tehnice ale vehiculului tău.</p>
                  </header>

                  <section>
                    <h3 className="text-[13px] font-bold text-gray-800 mb-3">Combustibil <span className="text-red-400">*</span></h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[{id:'Benzină',icon:Fuel},{id:'Diesel',icon:Fuel},{id:'Hibrid',icon:Fuel},{id:'Electric',icon:Fuel}].map(f => (
                        <button key={f.id} onClick={() => updateField('combustibil', f.id)}
                          className={`py-3 text-[13px] font-bold rounded-xl transition-all border ${
                            formData.combustibil === f.id ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}>{f.id}</button>
                      ))}
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  <section>
                    <h3 className="text-[13px] font-bold text-gray-800 mb-3">Transmisie <span className="text-red-400">*</span></h3>
                    <div className="flex gap-2">
                      {['Manuală','Automată'].map(t => (
                        <button key={t} onClick={() => updateField('transmisie', t)}
                          className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all border ${
                            formData.transmisie === t ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}>{t}</button>
                      ))}
                    </div>
                  </section>

                  <hr className="border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Capacitate motor (cm³)</label>
                      <input type="number" placeholder="ex: 1998" value={formData.motor}
                        onChange={(e) => updateField('motor', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Putere (CP)</label>
                      <input type="number" placeholder="ex: 150" value={formData.putere}
                        onChange={(e) => updateField('putere', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Culoare</label>
                      <input type="text" placeholder="ex: Negru Metalic" value={formData.culoare}
                        onChange={(e) => updateField('culoare', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <header>
                    <h1 className="text-[22px] font-black text-[#1a1a2e] mb-1">Dotări și echipamente</h1>
                    <p className="text-gray-500 text-[14px]">Bifează opțiunile pe care le are mașina ta.</p>
                  </header>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {AUTO_FEATURES.map((feature) => {
                      const isOn = formData.features.includes(feature);
                      return (
                        <button key={feature} onClick={() => toggleFeature(feature)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                            isOn ? 'bg-sky-50 border-sky-400 text-sky-700' : 'border-gray-200/80 hover:border-gray-300 text-gray-600'
                          }`}>
                          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isOn ? 'bg-sky-500' : 'border-2 border-gray-300'}`}>
                            {isOn && <Check size={13} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className="font-bold text-[12px] leading-tight">{feature}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <header>
                    <h1 className="text-[22px] font-black text-[#1a1a2e] mb-1">Fotografii</h1>
                    <p className="text-gray-500 text-[14px]">Anunțurile cu poze sunt vizualizate de 3x mai des.</p>
                  </header>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-0 left-0 w-full bg-sky-500 text-white text-[10px] font-bold py-1 text-center uppercase tracking-wider">
                            Foto Principală
                          </div>
                        )}
                      </div>
                    ))}
                    <label className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-sky-400 hover:bg-sky-50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group">
                      {isUploading ? (
                        <Loader2 size={24} className="animate-spin text-sky-500" />
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Camera size={20} />
                          </div>
                          <span className="text-[12px] font-bold text-gray-500">Adaugă foto</span>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                    </label>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-sky-50/60 rounded-xl border border-sky-100">
                    <Camera size={18} className="text-sky-500 mt-0.5 shrink-0" />
                    <p className="text-[13px] text-gray-600 leading-relaxed">
                      Poți încărca <strong>maxim 8 fotografii</strong>. Prima imagine va fi setată automat ca fotografie principală a anunțului.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <header>
                    <h1 className="text-[22px] font-black text-[#1a1a2e] mb-1">Preț, contact și publicare</h1>
                    <p className="text-gray-500 text-[14px]">Ultimul pas! Completează prețul și datele de contact.</p>
                  </header>

                  <section className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                    <label className={labelCls}>Preț (Euro) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input type="number" value={formData.price}
                        onChange={(e) => updateField('price', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-6 pr-14 py-4 text-2xl font-black focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">€</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-bold mt-1.5 block">Fără puncte sau virgule (ex: 23950)</span>
                    <label className="flex items-center gap-3 mt-4 cursor-pointer">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${formData.pretNegociabil ? 'bg-sky-500' : 'bg-white border-2 border-gray-300'}`}>
                        {formData.pretNegociabil && <Check size={14} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.pretNegociabil}
                        onChange={(e) => updateField('pretNegociabil', e.target.checked)} />
                      <span className="font-bold text-gray-700 text-[14px]">Preț negociabil</span>
                    </label>
                  </section>

                  <hr className="border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div ref={cityRef} className="relative">
                      <label className={labelCls}>Oraș / Județ <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Caută oraș sau județ..."
                          value={cityDropdownOpen ? citySearch : (formData.city || citySearch)}
                          onFocus={() => { setCityDropdownOpen(true); setCitySearch(''); }}
                          onChange={(e) => { setCitySearch(e.target.value); setCityDropdownOpen(true); }}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-3.5 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none font-medium text-gray-800"
                        />
                        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {cityDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-[260px] overflow-y-auto scrollbar-hide">
                          {(() => {
                            const q = normalize(citySearch);
                            const filtered = ROMANIA_LOCATIONS.filter(c => fuzzyMatch(c, citySearch))
                              .sort((a, b) => {
                                const aN = normalize(a.split(', ')[0]);
                                const bN = normalize(b.split(', ')[0]);
                                const aExact = aN.includes(q) ? (aN.startsWith(q) ? 0 : 1) : 2;
                                const bExact = bN.includes(q) ? (bN.startsWith(q) ? 0 : 1) : 2;
                                return aExact - bExact;
                              })
                              .slice(0, 50);
                            if (filtered.length === 0) return (
                              <div className="px-4 py-6 text-center text-[13px] text-gray-400 font-medium">Niciun rezultat găsit</div>
                            );
                            return filtered.map(c => {
                              const [name, county] = c.split(', ');
                              return (
                                <button key={c} type="button"
                                  onClick={() => { updateField('city', c); setCitySearch(c); setCityDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-sky-50 transition-colors flex items-center gap-3 ${
                                    formData.city === c ? 'bg-sky-50 text-sky-600' : 'text-gray-700'
                                  }`}>
                                  <MapPin size={14} className={`shrink-0 ${CITIES.has(name) ? 'text-sky-400' : 'text-gray-300'}`} />
                                  <span className="font-bold">{name}</span>
                                  <span className="text-[12px] text-gray-400 font-medium">{county}</span>
                                  {formData.city === c && <Check size={14} className="ml-auto text-sky-500" />}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Nume vânzător</label>
                      <input type="text" value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Telefon <span className="text-red-400">*</span></label>
                      <input type="tel" value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Descriere anunț</label>
                    <textarea rows={5} value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className={`${inputCls} resize-none`}
                      placeholder="Descrie mașina ta... (istoric service, defecte optice, piese schimbate)" />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
                {currentStep > 1 ? (
                  <button onClick={prevStep}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-[14px] transition-colors px-4 py-3">
                    <ArrowLeft size={16} /> Înapoi
                  </button>
                ) : <div />}

                {currentStep < 5 ? (
                  <button onClick={nextStep}
                    className="flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-xl font-bold transition-all text-[15px] group active:scale-[0.98] shadow-lg shadow-sky-500/15">
                    Continuă <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button onClick={handlePublish} disabled={isSubmitting}
                    className="flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-xl font-bold transition-all text-[15px] group active:scale-[0.98] shadow-lg shadow-sky-500/15 disabled:opacity-50">
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Se publică...</>
                    ) : (
                      <>Publică anunțul <CheckCircle2 size={18} /></>
                    )}
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
