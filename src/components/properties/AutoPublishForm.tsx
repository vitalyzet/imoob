'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { compressImage } from '@/lib/imageCompression';
import { ROMANIA_LOCATIONS as LOCATIONS_DATA } from '@/constants/romaniaCities';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/layout/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, ArrowRight, ArrowLeft, X, Check, CheckCircle2, Camera, Loader2,
  Fuel, Cog, Gauge, Calendar, MapPin, Palette, Search, ChevronDown, Info, TrendingUp, Star, Wallet,
  Bike, Truck, CarFront
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

import { 
  AUTO_BRANDS, AUTO_MODELS, 
  MOTO_BRANDS, MOTO_MODELS,
  VAN_BRANDS, VAN_MODELS,
  TRUCK_BRANDS, TRUCK_MODELS
} from '@/constants/autoModels';

const BRAND_LOGOS: Record<string, string> = {
  'Abarth': 'https://www.carlogos.org/car-logos/abarth-logo.png',
  'Alfa Romeo': 'https://www.carlogos.org/car-logos/alfa-romeo-logo.png',
  'Aprilia': 'https://www.carlogos.org/motorcycle-logos/aprilia-logo.png',
  'Aston Martin': 'https://www.carlogos.org/car-logos/aston-martin-logo.png',
  'Audi': 'https://www.carlogos.org/car-logos/audi-logo.png',
  'Bentley': 'https://www.carlogos.org/car-logos/bentley-logo.png',
  'BMW': 'https://www.carlogos.org/car-logos/bmw-logo.png',
  'Bugatti': 'https://www.carlogos.org/car-logos/bugatti-logo.png',
  'Cadillac': 'https://www.carlogos.org/car-logos/cadillac-logo.png',
  'Chevrolet': 'https://www.carlogos.org/car-logos/chevrolet-logo.png',
  'Chrysler': 'https://www.carlogos.org/car-logos/chrysler-logo.png',
  'Citroën': 'https://www.carlogos.org/car-logos/citroen-logo.png',
  'Cupra': 'https://www.carlogos.org/car-logos/cupra-logo.png',
  'Dacia': 'https://www.carlogos.org/car-logos/dacia-logo.png',
  'Daewoo': 'https://www.carlogos.org/car-logos/daewoo-logo.png',
  'Daihatsu': 'https://www.carlogos.org/car-logos/daihatsu-logo.png',
  'Dodge': 'https://www.carlogos.org/car-logos/dodge-logo.png',
  'Ducati': 'https://www.carlogos.org/car-logos/ducati-logo.png',
  'Ferrari': 'https://www.carlogos.org/car-logos/ferrari-logo.png',
  'Fiat': 'https://www.carlogos.org/car-logos/fiat-logo.png',
  'Ford': 'https://www.carlogos.org/car-logos/ford-logo.png',
  'Harley-Davidson': 'https://www.carlogos.org/car-logos/harley-davidson-logo.png',
  'Honda': 'https://www.carlogos.org/car-logos/honda-logo.png',
  'Husqvarna': 'https://www.carlogos.org/motorcycle-logos/husqvarna-logo.png',
  'Hyundai': 'https://www.carlogos.org/car-logos/hyundai-logo.png',
  'Indian': 'https://www.carlogos.org/motorcycle-logos/indian-logo.png',
  'Infiniti': 'https://www.carlogos.org/car-logos/infiniti-logo.png',
  'Isuzu': 'https://www.carlogos.org/car-logos/isuzu-logo.png',
  'Iveco': 'https://www.carlogos.org/car-logos/iveco-logo.png',
  'Jaguar': 'https://www.carlogos.org/car-logos/jaguar-logo.png',
  'Jeep': 'https://www.carlogos.org/car-logos/jeep-logo.png',
  'Kawasaki': 'https://www.carlogos.org/car-logos/kawasaki-logo.png',
  'Kia': 'https://www.carlogos.org/car-logos/kia-logo.png',
  'KTM': 'https://www.carlogos.org/car-logos/ktm-logo.png',
  'Lamborghini': 'https://www.carlogos.org/car-logos/lamborghini-logo.png',
  'Lancia': 'https://www.carlogos.org/car-logos/lancia-logo.png',
  'Land Rover': 'https://www.carlogos.org/car-logos/land-rover-logo.png',
  'Lexus': 'https://www.carlogos.org/car-logos/lexus-logo.png',
  'Lotus': 'https://www.carlogos.org/car-logos/lotus-logo.png',
  'Maserati': 'https://www.carlogos.org/car-logos/maserati-logo.png',
  'Maybach': 'https://www.carlogos.org/car-logos/maybach-logo.png',
  'Mazda': 'https://www.carlogos.org/car-logos/mazda-logo.png',
  'McLaren': 'https://www.carlogos.org/car-logos/mclaren-logo.png',
  'Mercedes-Benz': 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
  'Mini': 'https://www.carlogos.org/car-logos/mini-logo.png',
  'Mitsubishi': 'https://www.carlogos.org/car-logos/mitsubishi-logo.png',
  'Nissan': 'https://www.carlogos.org/car-logos/nissan-logo.png',
  'Opel': 'https://www.carlogos.org/car-logos/opel-logo.png',
  'Peugeot': 'https://www.carlogos.org/car-logos/peugeot-logo.png',
  'Piaggio': 'https://www.carlogos.org/motorcycle-logos/piaggio-logo.png',
  'Pontiac': 'https://www.carlogos.org/car-logos/pontiac-logo.png',
  'Porsche': 'https://www.carlogos.org/car-logos/porsche-logo.png',
  'Renault': 'https://www.carlogos.org/car-logos/renault-logo.png',
  'Rolls-Royce': 'https://www.carlogos.org/car-logos/rolls-royce-logo.png',
  'Rover': 'https://www.carlogos.org/car-logos/rover-logo.png',
  'Royal Enfield': 'https://www.carlogos.org/motorcycle-logos/royal-enfield-logo.png',
  'Saab': 'https://www.carlogos.org/car-logos/saab-logo.png',
  'Seat': 'https://www.carlogos.org/car-logos/seat-logo.png',
  'Skoda': 'https://www.carlogos.org/car-logos/skoda-logo.png',
  'Smart': 'https://www.carlogos.org/car-logos/smart-logo.png',
  'SsangYong': 'https://www.carlogos.org/car-logos/ssangyong-logo.png',
  'Subaru': 'https://www.carlogos.org/car-logos/subaru-logo.png',
  'Suzuki': 'https://www.carlogos.org/car-logos/suzuki-logo.png',
  'Tesla': 'https://www.carlogos.org/car-logos/tesla-logo.png',
  'Toyota': 'https://www.carlogos.org/car-logos/toyota-logo.png',
  'Triumph': 'https://www.carlogos.org/motorcycle-logos/triumph-logo.png',
  'Vespa': 'https://www.carlogos.org/motorcycle-logos/vespa-logo.png',
  'Volkswagen': 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
  'Volvo': 'https://www.carlogos.org/car-logos/volvo-logo.png',
  'Yamaha': 'https://www.carlogos.org/car-logos/yamaha-logo.png',
  'Kawasaki': 'https://www.carlogos.org/car-logos/kawasaki-logo.png',
  'Ducati': 'https://www.carlogos.org/car-logos/ducati-logo.png',
  'Harley-Davidson': 'https://www.carlogos.org/car-logos/harley-davidson-logo.png',
  'KTM': 'https://www.carlogos.org/car-logos/ktm-logo.png',
  'MAN': 'https://www.carlogos.org/car-logos/man-logo.png',
  'Scania': 'https://www.carlogos.org/car-logos/scania-logo.png',
  'DAF': 'https://www.carlogos.org/car-logos/daf-logo.png',
  'John Deere': 'https://logowik.com/content/uploads/images/john-deere.jpg',
  'New Holland': 'https://logowik.com/content/uploads/images/new-holland.jpg',
  'Caterpillar': 'https://logowik.com/content/uploads/images/caterpillar.jpg',
  'JCB': 'https://logowik.com/content/uploads/images/jcb.jpg',
  'CLAAS': 'https://logowik.com/content/uploads/images/claAS.jpg',
  'Fendt': 'https://logowik.com/content/uploads/images/fendt.jpg',
  'Case IH': 'https://logowik.com/content/uploads/images/case-ih.jpg',
  'Massey Ferguson': 'https://logowik.com/content/uploads/images/massey-ferguson.jpg',
};

const POPULAR_BRANDS_MAP: Record<string, string[]> = {
  'Auto': ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Toyota', 'Renault', 'Dacia', 'Peugeot', 'Skoda', 'Opel', 'Hyundai'],
  'Moto': ['Yamaha', 'Honda', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'Harley-Davidson', 'KTM'],
  'Camioane': ['MAN', 'Volvo', 'Scania', 'Mercedes-Benz', 'DAF', 'Iveco', 'Renault']
};

const BODY_TYPES_MAP: Record<string, { id: string, label: string, icon: any }[]> = {
  'Auto': [
    { id: 'micro', label: 'Micro', icon: CarFront },
    { id: 'hatchback', label: 'Hatchback', icon: CarFront },
    { id: 'sedan', label: 'Sedan', icon: CarFront },
    { id: 'coupe', label: 'Coupe', icon: CarFront },
    { id: 'cabrio', label: 'Cabrio', icon: CarFront },
    { id: 'break', label: 'Break', icon: CarFront },
    { id: 'monovolum', label: 'Monovolum', icon: CarFront },
    { id: 'suv', label: 'SUV', icon: CarFront },
    { id: 'pickup', label: 'Pick-Up', icon: CarFront },
    { id: 'wagon', label: 'Wagon', icon: CarFront },
    { id: 'mpv', label: 'MPV', icon: CarFront },
    { id: 'offroad', label: 'Off-Road', icon: CarFront },
    { id: 'minivan', label: 'Minivan', icon: CarFront },
  ],
  'Moto': [
    { id: 'sport', label: 'Sport', icon: Bike },
    { id: 'touring', label: 'Touring', icon: Bike },
    { id: 'naked', label: 'Naked', icon: Bike },
    { id: 'chopper', label: 'Chopper/Cruiser', icon: Bike },
    { id: 'enduro', label: 'Enduro', icon: Bike },
    { id: 'scuter', label: 'Scuter', icon: Bike },
    { id: 'atv', label: 'ATV/Quad', icon: Bike },
  ],
  'Camioane': [
    { id: 'autotractor', label: 'Autotractor', icon: Truck },
    { id: 'basculanta', label: 'Basculantă', icon: Truck },
    { id: 'duba', label: 'Dubă', icon: Truck },
    { id: 'platforma', label: 'Platformă', icon: Truck },
    { id: 'remorca', label: 'Remorcă', icon: Truck },
    { id: 'semiremorca', label: 'Semiremorcă', icon: Truck },
    { id: 'specializata', label: 'Specializată', icon: Truck },
  ]
};

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
  { num: 5, title: 'Vizibilitate' },
  { num: 6, title: 'Preț și publicare' },
];

export default function AutoPublishForm({ editId }: { editId?: string }) {
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
  const [brandSearch, setBrandSearch] = useState('');
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const brandRef = React.useRef<HTMLDivElement>(null);
  const [modelSearch, setModelSearch] = useState('');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const modelRef = React.useRef<HTMLDivElement>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  // Close dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityDropdownOpen(false);
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) setBrandDropdownOpen(false);
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
              email: prev.email || data.email || user.email || '',
              city: prev.city || data.location || ''
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              name: prev.name || user.displayName || '',
              email: prev.email || user.email || ''
            }));
          }
          const uSnap = await getDoc(doc(db, 'users', user.uid));
          if (uSnap.exists()) {
            setWalletBalance(uSnap.data().walletBalance || 0);
          }
        } catch (err) {
          console.error("Error fetching user data in AutoPublishForm:", err);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const [formData, setFormData] = useState({
    domainType: 'Auto',
    marca: '', model: '', an: '', rulaj: '',
    combustibil: '', transmisie: '', caroserie: '',
    motor: '', putere: '', culoare: '', stare: 'Rulat', garantie: 'Fără garanție',
    nrLocuri: '', nrUsi: '', greutate: '', nrCilindri: '', tractiune: '',
    tipVanzator: 'Particular' as 'Particular' | 'Firmă',
    price: '', pretNegociabil: false, inPromotie: false, city: '',
    description: '', features: [] as string[],
    images: [] as string[], name: '', phone: '', email: '',
    promoTier: 'free' as 'free' | 'standard' | 'gold',
    promoDuration: '15' as '15' | '30'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(!!editId);

  React.useEffect(() => {
    if (editId && user) {
      setIsEditing(true);
      const fetchAd = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'anuncios_auto', editId));
          if (docSnap.exists() && docSnap.data().userId === user.uid) {
            const data = docSnap.data();
            setFormData(prev => ({
              ...prev,
              ...data,
              city: prev.city || data.location || data.city || ''
            }));
          } else {
            alert("Nu aveți permisiunea de a edita acest anunț.");
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
    let finalCost = 0;

    if (formData.promoTier !== 'free') {
      const baseCost = formData.promoTier === 'standard' ? 3 : 6;
      const durationMultiplier = formData.promoDuration === '30' ? 2 : 1;
      finalCost = baseCost * durationMultiplier;
      if (walletBalance < finalCost) {
        alert("Fonduri insuficiente în portofel.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (user && formData.promoTier !== 'free') {
        const newTx = {
          id: 'tx_publish_' + Date.now(),
          label: `Promovare la Publicare ${formData.promoTier === 'gold' ? 'GOLD VIP' : 'STANDARD'} (${formData.promoDuration}z): ${formData.marca} ${formData.model}`,
          am: `-${finalCost.toFixed(2)}€`,
          date: new Date().toLocaleString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'out',
          category: 'promo',
          timestamp: Date.now()
        };
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          walletBalance: increment(-finalCost),
          walletHistory: arrayUnion(newTx)
        });
      }
      const baseSlug = `${formData.marca || ''}-${formData.model || ''}-${formData.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const generatedSlug = baseSlug ? `${baseSlug}-${Math.random().toString(36).substring(2, 8)}` : `auto-${Date.now()}`;

      if (isEditing && editId) {
        await updateDoc(doc(db, 'anuncios_auto', editId), {
          ...formData,
          slug: formData.slug || generatedSlug,
          price: Number(String(formData.price).replace(/[.,\s]/g, '')) || 0,
          rulaj: Number(String(formData.rulaj).replace(/[.,\s]/g, '')) || 0,
          an: Number(String(formData.an).replace(/[.,\s]/g, '')) || 0,
          motor: formData.motor ? Number(String(formData.motor).replace(/[.,\s]/g, '')) : '',
          putere: formData.putere ? Number(String(formData.putere).replace(/[.,\s]/g, '')) : '',
          lastEdited: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'anuncios_auto'), {
          ...formData,
          slug: generatedSlug,
          price: Number(String(formData.price).replace(/[.,\s]/g, '')) || 0,
          rulaj: Number(String(formData.rulaj).replace(/[.,\s]/g, '')) || 0,
          an: Number(String(formData.an).replace(/[.,\s]/g, '')) || 0,
          motor: formData.motor ? Number(String(formData.motor).replace(/[.,\s]/g, '')) : '',
          putere: formData.putere ? Number(String(formData.putere).replace(/[.,\s]/g, '')) : '',
          userId: user?.uid || 'anonymous',
          createdAt: serverTimestamp(), status: 'pending', domain: formData.domainType.toLowerCase(),
          isPromoted: formData.promoTier !== 'free',
          promoType: formData.promoTier === 'gold' ? 'gold' : (formData.promoTier === 'standard' ? 'standard' : null),
          promoExpiresAt: formData.promoTier !== 'free' ? Date.now() + (parseInt(formData.promoDuration) * 24 * 60 * 60 * 1000) : null
        });
      }
      router.push('/Profil/my-ads');
    } catch (e) {
      console.error(e); alert('Eroare la publicare');
    } finally { setIsSubmitting(false); }
  };

  const nextStep = () => setCurrentStep(p => Math.min(p + 1, 6));
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none font-medium text-gray-800";
  const labelCls = "block text-[13px] font-bold text-gray-800 mb-2";

  if (isDataLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-sky-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
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

                  {/* Domain Type Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-8">
                    {[
                      { id: 'Auto', icon: CarFront },
                      { id: 'Moto', icon: Bike },
                      { id: 'Camioane', icon: Truck }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev, 
                            domainType: type.id, 
                            marca: '', model: '', caroserie: '' 
                          }));
                          setBrandSearch(''); setModelSearch('');
                        }}
                        className={`py-4 px-2 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 ${
                          formData.domainType === type.id 
                            ? 'bg-sky-50 border-sky-400 text-sky-600 shadow-sm' 
                            : 'bg-white border-gray-100 hover:border-gray-300 text-gray-500'
                        }`}
                      >
                        <type.icon size={22} className={formData.domainType === type.id ? 'text-sky-500' : 'text-gray-400'} />
                        <span className="text-[12px] font-black tracking-tight">{type.id}</span>
                      </button>
                    ))}
                  </div>

                  {/* Body type grid */}
                  {(() => {
                    const currentBodyTypes = BODY_TYPES_MAP[formData.domainType] || BODY_TYPES_MAP['Auto'];
                    return (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                          {(showAllBody ? currentBodyTypes : currentBodyTypes.slice(0, 5)).map((bt) => {
                            const isActive = formData.caroserie === bt.id;
                            return (
                              <button key={bt.id} onClick={() => updateField('caroserie', bt.id)}
                                className={`relative flex flex-col items-center justify-center gap-2 py-6 px-3 rounded-2xl transition-all duration-200 border cursor-pointer ${
                                  isActive ? 'bg-sky-50 border-sky-400 shadow-sm' : 'border-gray-200/80 bg-white hover:border-gray-300'
                                }`}>
                                <bt.icon size={24} strokeWidth={1.8} className={isActive ? 'text-sky-500' : 'text-gray-400'} />
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

                        {!showAllBody && currentBodyTypes.length > 5 && (
                          <button
                            onClick={() => setShowAllBody(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-gray-500 hover:text-sky-500 transition-colors group"
                          >
                            <span>Mai multe tipuri</span>
                            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                          </button>
                        )}
                      </>
                    );
                  })()}

                  <hr className="border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div ref={brandRef} className="relative">
                      <label className={labelCls}>Marcă <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        placeholder="Caută marca..."
                        value={brandDropdownOpen ? brandSearch : formData.marca}
                        onChange={(e) => {
                          setBrandSearch(e.target.value);
                          setBrandDropdownOpen(true);
                        }}
                        onFocus={() => { setBrandDropdownOpen(true); setBrandSearch(formData.marca); }}
                        className={inputCls}
                      />
                      {brandDropdownOpen && (() => {
                        const search = (brandSearch || '').toLowerCase();
                        
                        let currentBrands = AUTO_BRANDS;
                        if (formData.domainType === 'Moto') currentBrands = MOTO_BRANDS;
                        else if (formData.domainType === 'Camioane') currentBrands = TRUCK_BRANDS;

                        const popularOrder = POPULAR_BRANDS_MAP[formData.domainType] || [];
                        const popularFiltered = popularOrder.filter(b =>
                          b.toLowerCase().includes(search)
                        );
                        const popularSet = new Set(popularOrder);
                        const restFiltered = currentBrands
                          .filter(b => !popularSet.has(b) && b.toLowerCase().includes(search))
                          .sort((a, b) => {
                            if (a === 'Altele') return 1;
                            if (b === 'Altele') return -1;
                            return a.localeCompare(b);
                          });
                        const hasResults = popularFiltered.length > 0 || restFiltered.length > 0;
                        return (
                          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                            {popularFiltered.length > 0 && (
                              <>
                                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/80 sticky top-0">Mărci populare</div>
                                {popularFiltered.map(b => (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => { updateField('marca', b); updateField('model', ''); setModelSearch(''); setBrandSearch(b); setBrandDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-[13px] font-medium hover:bg-sky-50 transition-colors flex items-center gap-3 ${
                                      formData.marca === b ? 'bg-sky-50 text-sky-700 font-bold' : 'text-gray-700'
                                    }`}
                                  >
                                    {BRAND_LOGOS[b] && !logoErrors[b] ? (
                                      <img src={BRAND_LOGOS[b]} alt={b} className="w-5 h-5 object-contain shrink-0" onError={() => setLogoErrors(prev => ({...prev, [b]: true}))} />
                                    ) : (
                                      <Car size={16} className="text-gray-300 shrink-0" />
                                    )}
                                    <span className="flex-1">{b}</span>
                                    {formData.marca === b && <span className="text-sky-500 text-[11px] font-bold">✓</span>}
                                  </button>
                                ))}
                              </>
                            )}
                            {popularFiltered.length > 0 && restFiltered.length > 0 && (
                              <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/80 sticky top-0 border-t border-gray-100">Toate mărcile</div>
                            )}
                            {restFiltered.map(b => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => { updateField('marca', b); updateField('model', ''); setModelSearch(''); setBrandSearch(b); setBrandDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-[13px] font-medium hover:bg-sky-50 transition-colors flex items-center gap-3 ${
                                  formData.marca === b ? 'bg-sky-50 text-sky-700 font-bold' : 'text-gray-700'
                                }`}
                              >
                                {b === 'Altele' ? (
                                  <div className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full border border-gray-200 shrink-0">
                                    <span className="text-[10px] font-black text-gray-500">?</span>
                                  </div>
                                ) : BRAND_LOGOS[b] && !logoErrors[b] ? (
                                  <img src={BRAND_LOGOS[b]} alt={b} className="w-5 h-5 object-contain shrink-0" onError={() => setLogoErrors(prev => ({...prev, [b]: true}))} />
                                ) : (
                                  <Car size={16} className="text-gray-300 shrink-0" />
                                )}
                                <span className={`flex-1 ${b === 'Altele' ? 'italic text-gray-500 font-normal' : ''}`}>
                                  {b === 'Altele' ? 'Altele (Altă marcă)' : b}
                                </span>
                                {formData.marca === b && <span className="text-sky-500 text-[11px] font-bold">✓</span>}
                              </button>
                            ))}
                            {!hasResults && brandSearch && (
                              <div className="px-4 py-3 text-[12px] text-gray-400 font-medium">
                                Se va folosi: <span className="text-gray-700 font-bold">&quot;{brandSearch}&quot;</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
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
                        let currentModels = AUTO_MODELS[formData.marca] || [];
                        if (formData.domainType === 'Moto') currentModels = MOTO_MODELS[formData.marca] || [];
                        else if (formData.domainType === 'Camioane') currentModels = TRUCK_MODELS[formData.marca] || [];

                        const filtered = currentModels.filter(m => 
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
                      <input type="text" inputMode="numeric" placeholder="ex: 2021" value={formData.an}
                        onChange={(e) => updateField('an', e.target.value.replace(/[^0-9]/g, ''))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Rulaj (km) <span className="text-red-400">*</span></label>
                      <input type="text" inputMode="numeric" placeholder="ex: 85000" value={formData.rulaj}
                        onChange={(e) => updateField('rulaj', e.target.value.replace(/[^0-9]/g, ''))} className={inputCls} />
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

                  <section className="mt-6">
                    <h3 className="text-[13px] font-bold text-gray-800 mb-3">Garanție (opțional)</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Fără garanție','3 luni','6 luni','12 luni (1 an)','24 luni (2 ani)'].map(g => (
                        <button key={g} onClick={() => updateField('garantie', formData.garantie === g ? '' : g)}
                          className={`flex-1 min-w-[120px] py-3 px-2 text-[13px] font-bold rounded-xl transition-all border ${
                            formData.garantie === g ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}>{g}</button>
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
                      <input type="text" inputMode="numeric" placeholder="ex: 1998" value={formData.motor}
                        onChange={(e) => updateField('motor', e.target.value.replace(/[^0-9]/g, ''))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Putere (CP)</label>
                      <input type="text" inputMode="numeric" placeholder="ex: 150" value={formData.putere}
                        onChange={(e) => updateField('putere', e.target.value.replace(/[^0-9]/g, ''))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Culoare</label>
                      <input type="text" placeholder="ex: Negru Metalic" value={formData.culoare}
                        onChange={(e) => updateField('culoare', e.target.value)} className={inputCls} />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Masă / Greutate (kg) <span className="text-gray-400 font-normal text-xs">(opțional)</span></label>
                      <input type="text" inputMode="numeric" placeholder="ex: 1500" value={formData.greutate}
                        onChange={(e) => updateField('greutate', e.target.value.replace(/[^0-9]/g, ''))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Număr cilindri <span className="text-gray-400 font-normal text-xs">(opțional)</span></label>
                      <input type="text" inputMode="numeric" placeholder="ex: 4" value={formData.nrCilindri}
                        onChange={(e) => updateField('nrCilindri', e.target.value.replace(/[^0-9]/g, ''))} className={inputCls} />
                    </div>
                  </div>

                  <section className="mt-5">
                    <h3 className="text-[13px] font-bold text-gray-800 mb-3">Tracțiune <span className="text-gray-400 font-normal text-xs">(opțional)</span></h3>
                    <div className="flex gap-2">
                      {['Față','Spate','4x4'].map(t => (
                        <button key={t} onClick={() => updateField('tractiune', formData.tractiune === t ? '' : t)}
                          className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all border ${
                            formData.tractiune === t ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}>{t}</button>
                      ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <section>
                      <h3 className="text-[13px] font-bold text-gray-800 mb-3">Număr uși <span className="text-gray-400 font-normal text-xs">(opțional)</span></h3>
                      <div className="flex gap-2">
                        {['2/3','4/5','6+'].map(u => (
                          <button key={u} onClick={() => updateField('nrUsi', formData.nrUsi === u ? '' : u)}
                            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all border ${
                              formData.nrUsi === u ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}>{u}</button>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-[13px] font-bold text-gray-800 mb-3">Număr locuri <span className="text-gray-400 font-normal text-xs">(opțional)</span></h3>
                      <div className="flex flex-wrap gap-2">
                        {['2','4','5','7','8+'].map(l => (
                          <button key={l} onClick={() => updateField('nrLocuri', formData.nrLocuri === l ? '' : l)}
                            className={`flex-1 min-w-[40px] py-3 text-[13px] font-bold rounded-xl transition-all border ${
                              formData.nrLocuri === l ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}>{l}</button>
                        ))}
                      </div>
                    </section>
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
              {currentStep === 5 && (() => {
                const finalCost = formData.promoTier === 'free' ? 0 : (formData.promoTier === 'standard' ? 3 : 6) * (formData.promoDuration === '30' ? 2 : 1);
                const isInsufficient = formData.promoTier !== 'free' && walletBalance < finalCost;

                return (
                  <div className="space-y-6">
                    <header className="mb-2">
                      <h1 className="text-2xl font-black text-[#1a1a2e] mb-1">Alege vizibilitatea</h1>
                      <p className="text-gray-500 text-sm">Anunțurile premium primesc de până la <strong>10x mai multe contacte</strong>.</p>
                    </header>

                    {/* Duration Toggle */}
                    <div className="flex items-center p-1 bg-slate-100/90 rounded-[14px] mb-4 w-full max-w-[260px] mx-auto shadow-inner border border-slate-200/60">
                      <button
                        onClick={() => updateField('promoDuration', '15')}
                        className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${formData.promoDuration === '15' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        15 Zile
                      </button>
                      <button
                        onClick={() => updateField('promoDuration', '30')}
                        className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${formData.promoDuration === '30' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        30 Zile
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Básico */}
                      <button
                        onClick={() => updateField('promoTier', 'free')}
                        className={`relative flex items-center justify-between p-4 sm:p-5 rounded-[24px] border-2 transition-all duration-300 text-left w-full ${
                          formData.promoTier === 'free'
                            ? 'border-gray-800 bg-gray-50/50 shadow-sm'
                            : 'border-gray-100/80 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-colors duration-300 ${formData.promoTier === 'free' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-400'}`}>
                            <Info size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                            <span className={`text-[15px] font-black transition-colors ${formData.promoTier === 'free' ? 'text-gray-900' : 'text-gray-700'}`}>Bază</span>
                            <p className="text-[11px] font-bold text-gray-400 mt-0.5">Apare în rezultatele normale.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-[15px] font-extrabold text-gray-900">Gratuit</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.promoTier === 'free' ? 'border-gray-800 bg-gray-800' : 'border-gray-200'
                          }`}>
                            <Check size={14} className={`text-white transition-opacity ${formData.promoTier === 'free' ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                          </div>
                        </div>
                      </button>

                      {/* Standard */}
                      <button 
                        onClick={() => updateField('promoTier', 'standard')}
                        className={`relative flex items-center justify-between p-4 sm:p-5 rounded-[24px] border-2 transition-all duration-300 text-left w-full ${
                          formData.promoTier === 'standard'
                            ? 'border-[#0ea5e9] bg-sky-50/20 shadow-lg shadow-sky-500/5'
                            : 'border-gray-100/80 bg-white hover:border-[#0ea5e9]/40 hover:shadow-lg hover:shadow-sky-500/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-colors duration-300 ${formData.promoTier === 'standard' ? 'bg-[#0ea5e9] text-white' : 'bg-gray-50 text-gray-400'}`}>
                            <TrendingUp size={20} strokeWidth={2.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-[15px] font-black transition-colors ${formData.promoTier === 'standard' ? 'text-[#0ea5e9]' : 'text-gray-900'}`}>Standard (5x Vizibilitate)</span>
                            <span className="text-[11px] font-bold text-gray-400 mt-0.5">Preț: <span className="text-gray-900 font-extrabold ml-0.5">{formData.promoDuration === '30' ? '6.00€' : '3.00€'}</span></span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            formData.promoTier === 'standard' ? 'border-[#0ea5e9] bg-[#0ea5e9]' : 'border-gray-200'
                          }`}>
                            <Check size={14} className={`text-white transition-opacity ${formData.promoTier === 'standard' ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                          </div>
                        </div>
                      </button>

                      {/* Gold VIP */}
                      <div className="relative mt-2">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md z-20 border-2 border-white">Recomandat</div>
                        <button 
                          onClick={() => updateField('promoTier', 'gold')}
                          className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-[24px] border-2 transition-all duration-300 text-left group ${
                            formData.promoTier === 'gold'
                              ? 'border-amber-400 bg-gradient-to-br from-[#FFFAF0] to-[#FFF5EB] shadow-xl shadow-orange-500/10'
                              : 'border-amber-200 hover:border-amber-400 bg-white hover:bg-gradient-to-br hover:from-[#FFFAF0] hover:to-[#FFF5EB] hover:shadow-xl hover:shadow-orange-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-4 relative z-10 w-full justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[16px] flex items-center justify-center text-white shadow-md shadow-amber-500/20 transition-transform duration-300 ${formData.promoTier === 'gold' ? 'scale-110' : 'group-hover:scale-110'}`}>
                                <Star size={20} fill="currentColor" strokeWidth={0} />
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-[15px] font-black drop-shadow-sm transition-colors ${formData.promoTier === 'gold' ? 'text-amber-700' : 'text-amber-600'}`}>Gold VIP (10x Vizibilitate)</span>
                                <span className="text-[11px] font-bold text-amber-700/60 mt-0.5">Preț: <span className="text-amber-600 font-extrabold ml-0.5">{formData.promoDuration === '30' ? '12.00€' : '6.00€'}</span></span>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              formData.promoTier === 'gold' ? 'border-amber-500 bg-amber-500' : 'border-amber-200 bg-white'
                            }`}>
                              <Check size={14} className={`text-white transition-opacity ${formData.promoTier === 'gold' ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Wallet Check & Warning */}
                    <AnimatePresence>
                      {formData.promoTier !== 'free' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`mt-2 flex flex-col gap-3 p-5 rounded-2xl border-2 transition-colors ${isInsufficient ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-100'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-[14px] flex items-center justify-center text-gray-500 shadow-sm">
                                  <Wallet size={18} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Portofelul Meu</span>
                                  <span className={`text-[15px] font-extrabold ${isInsufficient ? 'text-red-500' : 'text-gray-900'}`}>{walletBalance.toFixed(2)}€ disponibili</span>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Cost Promo</span>
                                <span className="text-[15px] font-extrabold text-sky-500">{finalCost.toFixed(2)}€</span>
                              </div>

                            </div>

                            {isInsufficient && (
                              <div className="flex items-start gap-2 pt-3 border-t border-red-100/50">
                                <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-[12px] font-bold text-red-500 leading-tight">Nu ai suficiente fonduri pentru acest plan. Alege planul Gratuit sau încarcă portofelul din contul tău după crearea anunțului.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })()}

              {/* STEP 6 */}
              {currentStep === 6 && (
                <div className="space-y-8">
                  <header>
                    <h1 className="text-[22px] font-black text-[#1a1a2e] mb-1">Preț, contact și publicare</h1>
                    <p className="text-gray-500 text-[14px]">Ultimul pas! Completează prețul și datele de contact.</p>
                  </header>

                  {/* Promotion Summary */}
                  {formData.promoTier !== 'free' && (() => {
                    const finalCost = formData.promoTier === 'standard' ? 3 : 6 * (formData.promoDuration === '30' ? 2 : 1);
                    return (
                      <div className={`flex items-center gap-4 p-5 rounded-2xl border ${
                        formData.promoTier === 'gold'
                          ? 'bg-[#FFF9F5] border-amber-200'
                          : 'bg-sky-50/20 border-sky-200'
                      }`}>
                        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-sm ${
                          formData.promoTier === 'gold' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-sky-500 text-white'
                        }`}>
                          {formData.promoTier === 'gold' ? <Star size={20} fill="currentColor" strokeWidth={0} /> : <TrendingUp size={20} strokeWidth={2.5} />}
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-gray-800">
                            Plan: {formData.promoTier === 'gold' ? 'Gold VIP (10x)' : 'Standard (5x)'} - {formData.promoDuration} Zile
                          </p>
                          <p className="text-xs text-gray-500 font-bold">
                            <span className="text-sky-500 font-extrabold">{finalCost.toFixed(2)}€</span> se vor deduce la publicare.
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <section className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                    <label className={labelCls}>Preț (Euro) <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input type="text" inputMode="numeric" value={formData.price}
                        onChange={(e) => updateField('price', e.target.value.replace(/[^0-9]/g, ''))}
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
                    <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${formData.inPromotie ? 'bg-rose-500' : 'bg-white border-2 border-gray-300 group-hover:border-rose-300'}`}>
                        {formData.inPromotie && <Check size={14} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.inPromotie}
                        onChange={(e) => updateField('inPromotie', e.target.checked)} />
                      <span className="font-bold text-gray-700 text-[14px]">Vehicul în Promoție</span>
                    </label>
                  </section>

                  <hr className="border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className={labelCls}>Oraș / Județ <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          placeholder="Ex: București, Ilfov"
                          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Seller Type Toggle */}
                    <div>
                      <label className={labelCls}>Tip vânzător <span className="text-red-400">*</span></label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['Particular', 'Firmă'] as const).map(tip => {
                          const isActive = formData.tipVanzator === tip;
                          return (
                            <button
                              key={tip}
                              type="button"
                              onClick={() => updateField('tipVanzator', tip)}
                              className={`relative flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 transition-all duration-200 font-bold text-[13px] ${
                                isActive
                                  ? 'border-sky-400 bg-sky-50 text-sky-700 shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                              }`}
                            >
                              {tip === 'Particular' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                  <circle cx="12" cy="7" r="4"/>
                                </svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                                  <path d="M10 6h4"/>
                                  <path d="M10 10h4"/>
                                  <path d="M10 14h4"/>
                                  <path d="M10 18h4"/>
                                </svg>
                              )}
                              {tip}
                              {isActive && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                                  <Check size={10} className="text-white" strokeWidth={3} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Nume vânzător</label>
                      <input type="text" value={formData.name} readOnly
                        className="w-full bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-0 outline-none font-medium" />
                    </div>
                    <div>
                      <label className={labelCls}>Telefon <span className="text-red-400">*</span></label>
                      <input type="tel" value={formData.phone} readOnly
                        className="w-full bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-0 outline-none font-medium" />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" value={formData.email} readOnly
                        className="w-full bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-0 outline-none font-medium" />
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

                {currentStep < 6 ? (
                  <button onClick={() => {
                    if (currentStep === 5) {
                      const finalCost = formData.promoTier === 'free' ? 0 : (formData.promoTier === 'standard' ? 3 : 6) * (formData.promoDuration === '30' ? 2 : 1);
                      if (formData.promoTier !== 'free' && walletBalance < finalCost) {
                        alert("Fonduri insuficiente în portofel.");
                        return;
                      }
                    }
                    nextStep();
                  }}
                    className="flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-xl font-bold transition-all text-[15px] group active:scale-[0.98] shadow-lg shadow-sky-500/15">
                    Continuă <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <button onClick={handlePublish} disabled={isSubmitting}
                    className="flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-xl font-bold transition-all text-[15px] group active:scale-[0.98] shadow-lg shadow-sky-500/15 disabled:opacity-50">
                    {isSubmitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Se publică...</>
                    ) : (
                      <>{formData.promoTier === 'free' ? 'Publică anunțul' : 'Plătește și Publică'} <CheckCircle2 size={18} /></>
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
