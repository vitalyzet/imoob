'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property } from '@/lib/types';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyRowCard from '@/components/properties/PropertyRowCard';
import { cities, propertyTypes } from '@/lib/data';
import { Search, SlidersHorizontal, LayoutGrid, List, Loader2, Check, Bell, MapPin, X, ChevronDown, ChevronRight, Building2, Bed, Home, Map, Briefcase, Store, Factory, Hotel, Building } from 'lucide-react';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { PropertyStatus, PropertyType } from '@/lib/types';
import { ROMANIA_LOCATIONS } from '@/constants/romaniaCities';

export default function PropertiesClient({ initialProperties }: { initialProperties: Property[] }) {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isChanging, setIsChanging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [firebaseProperties, setFirebaseProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { saveSearch } = useSavedSearches();
  
  const [filters, setFilters] = useState({
    city: searchParams?.get('city') || '',
    type: searchParams?.get('type') || '',
    minPrice: searchParams?.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
    maxPrice: 10000000,
    bedrooms: 0,
    status: searchParams?.get('status') || 'for-sale',
    isNewConstruction: searchParams?.get('new') === 'true',
  });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationQuery, setLocationQuery] = useState(searchParams?.get('city') || '');
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocationQuery(filters.city);
  }, [filters.city]);

  const filteredLocations = useMemo(() => {
    if (!locationQuery) return ROMANIA_LOCATIONS.slice(0, 15);
    const lowercaseQuery = locationQuery.toLowerCase();
    return ROMANIA_LOCATIONS.filter(c => 
      c.name.toLowerCase().includes(lowercaseQuery) || 
      (c.county && c.county.toLowerCase().includes(lowercaseQuery))
    ).slice(0, 15);
  }, [locationQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (selectedType: string) => {
    switch (selectedType) {
      case 'Locuințe': case 'Locuință': return <Home size={18} />;
      case 'Apartamente': return <Building2 size={18} />;
      case 'Garsoniere': return <Bed size={18} />;
      case 'Case / Vile': return <Home size={18} />;
      case 'Terenuri': return <Map size={18} />;
      case 'Birouri': case 'Birou': return <Briefcase size={18} />;
      case 'Spații comerciale': case 'Spațiu comercial': return <Store size={18} />;
      case 'Spații industriale': case 'Industrial': return <Factory size={18} />;
      case 'Hoteluri / Pensiuni': return <Hotel size={18} />;
      case 'Ansambluri': return <Building size={18} />;
      case 'Afaceri': case 'Afacere': return <Briefcase size={18} />;
      case 'Cameră de închiriat': return <Bed size={18} />;
      default: return <Home size={18} />;
    }
  };

  const getShortTypeLabel = (selectedType: string) => {
    const label = propertyTypes.find(t => t.value === selectedType)?.label || selectedType;
    if (label === 'Cameră de închiriat') return 'Cameră';
    if (label === 'Hoteluri / Pensiuni') return 'Hoteluri';
    if (label === 'Spații comerciale') return 'Comerciale';
    if (label === 'Spații industriale') return 'Industriale';
    return label;
  };

  useEffect(() => {
    setFilters({
      city: searchParams?.get('city') || '',
      type: searchParams?.get('type') || '',
      minPrice: searchParams?.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
      maxPrice: searchParams?.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 10000000,
      bedrooms: searchParams?.get('bedrooms') ? Number(searchParams.get('bedrooms')) : 0,
      status: searchParams?.get('status') || 'for-sale',
      isNewConstruction: searchParams?.get('new') === 'true',
    });
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'anuncios'), where('status', '==', 'active'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const isAdExpired = (d: any) => {
        if (d.status === 'expired' || d.status === 'inactive') return true;
        if (d.createdAt) {
          const created = d.createdAt.toDate ? d.createdAt.toDate() : new Date(d.createdAt);
          const expiry = new Date(created);
          expiry.setDate(expiry.getDate() + 30);
          return new Date() > expiry;
        }
        return false;
      };

      const mapped = snapshot.docs.filter(doc => !isAdExpired(doc.data())).map(doc => {
        const d = doc.data();
        let status = (d.operation === 'vender' || d.operation === 'vanzare') ? 'for-sale' : 'for-rent';
        if (d.type === 'camera') {
          status = 'for-rent';
        }
        const isNewConstruction = d.condition === 'new';
        
        let typeName = d.type || 'Inmueble';
        const displayCity = d.localitate || d.city || d.judet || 'România';
        if (typeName === 'camera') typeName = 'Cameră';
        
        return {
          id: doc.id,
          title: `${typeName} de ${status === 'for-sale' ? 'Vânzare' : 'Închiriat'} în ${displayCity}`,
          slug: doc.id,
          description: d.description ? d.description.substring(0, 160) + '...' : 'Sin descripción.',
          longDescription: d.description || '',
          price: Number(d.price) || 0,
          oldPrice: d.oldPrice ? Number(d.oldPrice) : null,
          currency: 'EUR',
          type: (d.type || 'apartment') as PropertyType,
          status: status as PropertyStatus,
          location: {
            address: d.address || '',
            city: d.localitate || d.city || d.judet || '',
            state: d.judet || '',
            country: 'România',
            zipCode: d.zipCode || '',
            lat: 0,
            lng: 0,
          },
          features: {
            bedrooms: parseInt(d.rooms) || parseInt(d.bedrooms) || 0,
            bathrooms: parseInt(d.baths) || parseInt(d.bai) || parseInt(d.bathrooms) || 0,
            area: parseFloat(d.area) || parseFloat(d.suprafataUtila) || 0,
            garage: 0,
            yearBuilt: 2024,
            floors: Number(d.floor) || 1,
          },
          images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'],
          amenities: d.amenities || [],
          roommateDetails: d.type === 'camera' ? {
            cautaColeg: d.cautaColeg || false,
            nrPersoaneActual: d.nrPersoaneActual || '',
            preferinteColeg: d.preferinteColeg || '',
            cheltuieliIncluse: d.cheltuieliIncluse || 'nu',
            frigiderPersonal: d.frigiderPersonal || 'la comun',
            cameraCuCheie: d.cameraCuCheie || 'nu',
            animaleAceptate: d.animaleAceptate || 'nu'
          } : undefined,
          featured: d.promoType === 'gold',
          promoType: d.promoType || null,
          isNewConstruction: isNewConstruction,
          createdAt: d.createdAt?.toMillis ? new Date(d.createdAt.toMillis()).toISOString() : new Date().toISOString(),
          agent: {
            id: d.email || 'anon',
            name: d.name || 'Propietario',
            role: 'Particular',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
            phone: d.phone || '',
            email: d.email || '',
          }
        } as Property;
      });

      mapped.sort((a, b) => {
        const getPriority = (type: string | null | undefined) => {
          if (type === 'gold') return 3;
          if (type === 'standard') return 2;
          if (type === 'normal') return 1;
          return 0;
        };
        const priorityA = getPriority(a.promoType);
        const priorityB = getPriority(b.promoType);
        if (priorityA !== priorityB) return priorityB - priorityA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setFirebaseProperties(mapped);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching real-time properties:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProperties = useMemo(() => {
    const baseProperties = firebaseProperties.length > 0 ? firebaseProperties : initialProperties;
    
    return baseProperties.filter(property => {
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

      if (filters.city) {
        const sCity = normalize(filters.city);
        if (sCity !== 'romania') {
          const pCity = normalize(property.location.city);
          const pState = normalize(property.location.state || '');
          if (pCity !== sCity && pState !== sCity) return false;
        }
      }
      
      if (filters.type && filters.type !== 'Toate tipurile') {
        const pType = normalize(property.type || '');
        const sType = normalize(filters.type);
        
        if (sType === 'locuinte' || sType === 'locuinta') {
          const residentialTypes = ['apartament', 'apartment', 'casa', 'house', 'vila', 'villa', 'garsoniera', 'studio'];
          const isResidential = residentialTypes.some(rt => pType.includes(rt));
          if (!isResidential) return false;
        } else {
          let cleanSType = sType
            .replace(' / vile', '')
            .replace(' / pensiuni', '')
            .replace('spatii ', '')
            .replace('spatiul ', '')
            .replace('camera de inchiriat', 'camera')
            .trim();
          
          const s1 = cleanSType.endsWith('e') ? cleanSType.slice(0, -1) : cleanSType;
          const p1 = pType.endsWith('e') ? pType.slice(0, -1) : pType;

          if (!pType.includes(s1) && !sType.includes(p1)) return false;
        }
      }

      if (property.price < filters.minPrice || property.price > filters.maxPrice) return false;
      if (filters.bedrooms && property.features.bedrooms < filters.bedrooms) return false;
      
      if (filters.isNewConstruction) {
        if (!property.isNewConstruction) return false;
      } else {
        if (property.status !== filters.status) return false;
        if (property.isNewConstruction) return false;
      }
      
      return true;
    });
  }, [initialProperties, filters, firebaseProperties]);

  const typeCounts = useMemo(() => {
    const baseProperties = firebaseProperties.length > 0 ? firebaseProperties : initialProperties;
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    // Filter properties ignoring type
    const baseFiltered = baseProperties.filter(property => {
      if (filters.city) {
        const sCity = normalize(filters.city);
        if (sCity !== 'romania') {
          const pCity = normalize(property.location.city);
          const pState = normalize(property.location.state || '');
          if (pCity !== sCity && pState !== sCity) return false;
        }
      }
      if (property.price < filters.minPrice || property.price > filters.maxPrice) return false;
      if (filters.bedrooms && property.features.bedrooms < filters.bedrooms) return false;
      if (filters.isNewConstruction) {
        if (!property.isNewConstruction) return false;
      } else {
        if (property.status !== filters.status) return false;
        if (property.isNewConstruction) return false;
      }
      return true;
    });

    const counts: Record<string, number> = {};
    
    propertyTypes.forEach(typeObj => {
      const sType = normalize(typeObj.value);
      let count = 0;
      
      baseFiltered.forEach(property => {
        const pType = normalize(property.type || '');
        if (sType === 'locuinte' || sType === 'locuinta') {
          const residentialTypes = ['apartament', 'apartment', 'casa', 'house', 'vila', 'villa', 'garsoniera', 'studio'];
          const isResidential = residentialTypes.some(rt => pType.includes(rt));
          if (isResidential) count++;
        } else {
          let cleanSType = sType
            .replace(' / vile', '')
            .replace(' / pensiuni', '')
            .replace('spatii ', '')
            .replace('spatiul ', '')
            .replace('camera de inchiriat', 'camera')
            .trim();
          
          const s1 = cleanSType.endsWith('e') ? cleanSType.slice(0, -1) : cleanSType;
          const p1 = pType.endsWith('e') ? pType.slice(0, -1) : pType;

          if (pType.includes(s1) || sType.includes(p1)) count++;
        }
      });
      counts[typeObj.value] = count;
    });
    
    counts['Toate tipurile'] = baseFiltered.length;
    
    return counts;
  }, [initialProperties, filters, firebaseProperties]);

  const fullLocationName = useMemo(() => {
    if (!filters.city) return 'România';
    const loc = ROMANIA_LOCATIONS.find(l => l.name === filters.city);
    if (!loc) return filters.city;
    if (loc.isCounty || loc.name === loc.county) return loc.name;
    return `${loc.name}, ${loc.county}`;
  }, [filters.city]);

  const breadcrumbOperation = useMemo(() => {
    if (filters.isNewConstruction) return 'Ansambluri noi';
    return filters.status === 'for-sale' ? 'Vânzare' : 'Închiriere';
  }, [filters]);

  const breadcrumbType = useMemo(() => {
    if (!filters.type) return 'Toate proprietățile';
    return propertyTypes.find(t => t.value === filters.type)?.label || filters.type;
  }, [filters.type]);

  return (
    <div className="flex flex-col">
      <div className="w-full bg-white border-y border-gray-200/70 mb-6">
        <div className="max-w-[1700px] mx-auto px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl md:text-3xl text-gray-800 font-medium tracking-tight">
                Proprietăți în <span className="font-bold text-black">{fullLocationName}</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 font-medium tracking-wide">
                ({filteredProperties.length.toLocaleString('ro-RO')} proprietăți găsite)
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 pt-1 flex-wrap">
              <span className="font-medium text-gray-400">Ești în:</span>
              <span className="text-gray-500">Vindu24</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-gray-500">{breadcrumbOperation}</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-gray-500">{breadcrumbType}</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-[#139E69] font-medium">{fullLocationName}</span>
            </div>
          </div>
          
          <div>
            <button 
              type="button"
              onClick={() => {
                if (isSaving || saveSuccess) return;
                setIsSaving(true);
                setTimeout(() => {
                  saveSearch(filters);
                  setIsSaving(false);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                }, 1000);
              }}
              className={`flex items-center justify-center gap-0 hover:gap-3 p-3 hover:px-6 rounded-full text-sm font-bold transition-all duration-300 shadow-sm active:scale-95 group overflow-hidden ${
                saveSuccess ? 'bg-[#139E69] text-white' : 'bg-[#4567c1] hover:bg-[#3b58a5] text-white'
              }`}
            >
              {isSaving ? <Loader2 size={20} className="animate-spin shrink-0" /> : saveSuccess ? <Check size={20} className="shrink-0" /> : <Bell size={20} className="group-hover:animate-swing shrink-0" />}
              <span className={`w-0 group-hover:w-[130px] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden`}>
                {isSaving ? 'Se salvează...' : saveSuccess ? 'S-a salvat!' : 'Salvează căutarea'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 pb-20">
          <div className="lg:hidden mb-4">
            <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-center gap-2 bg-[#139E69] text-white py-3 font-semibold rounded-full shadow-sm">
              <SlidersHorizontal size={18} />
              {showFilters ? 'Ascunde Filtre' : 'Arată Filtre'}
            </button>
          </div>

          <div className={`lg:w-1/4 min-w-[280px] ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] sticky top-32">
              <header className="mb-10">
                <h3 className="font-bold text-2xl text-[#333] mb-2 flex items-center gap-3">Filtre</h3>
                <p className="text-gray-400 text-sm font-medium">Rafinează căutarea de proprietăți</p>
              </header>
              <div className="space-y-10">
                <div>
                  <h4 className="text-[#f25c1a] font-bold text-sm uppercase tracking-widest mb-5">Locație</h4>
                  <div className="relative" ref={locationDropdownRef}>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><MapPin size={18} /></div>
                      <input type="text" placeholder="Caută orașul..." value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); setShowLocationDropdown(true); if (e.target.value === '') setFilters({...filters, city: ''}); }} onFocus={() => setShowLocationDropdown(true)} className="w-full h-12 pl-11 pr-10 border border-gray-200 bg-gray-50 rounded-xl text-[#333] font-medium focus:outline-none focus:border-[#139E69] focus:ring-4 focus:ring-[#139E69]/5 transition-all" />
                      {locationQuery ? <button onClick={() => { setLocationQuery(''); setFilters({...filters, city: ''}); setShowLocationDropdown(true); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"><X size={16} /></button> : <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><ChevronDown size={16} /></div>}
                    </div>
                    {showLocationDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                        <ul className="max-h-[280px] overflow-y-auto py-2 custom-scrollbar">
                          {filteredLocations.map((loc) => (
                            <li key={loc.name}>
                              <button onClick={() => { setFilters({...filters, city: loc.name}); setLocationQuery(loc.name); setShowLocationDropdown(false); }} className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${filters.city === loc.name ? 'bg-[#139E69]/10 text-[#139E69] font-bold border-l-2 border-[#139E69]' : 'text-gray-700 hover:bg-gray-50'}`}><MapPin size={16} className={filters.city === loc.name ? 'text-[#139E69]' : 'text-gray-400'} /><span className="truncate">{loc.name}{!loc.isCounty && loc.name !== loc.county && <span className="ml-1.5 text-gray-400 font-normal">{loc.county}</span>}</span></button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#f25c1a] font-bold text-sm uppercase tracking-widest mb-5">Tip Proprietate</h4>
                  <div className="relative" ref={typeDropdownRef}>
                    <button type="button" onClick={() => setShowTypeDropdown(!showTypeDropdown)} className="w-full h-12 px-4 border border-gray-200 bg-gray-50 rounded-xl text-[#333] font-bold text-base focus:outline-none focus:border-[#139E69] focus:ring-4 focus:ring-[#139E69]/5 transition-all flex items-center justify-between overflow-hidden">
                      <div className="flex items-center gap-3 min-w-0 flex-1">{filters.type ? <><span className="text-[#139E69] shrink-0">{getTypeIcon(filters.type)}</span><span className="truncate">{getShortTypeLabel(filters.type)}</span></> : <span className="font-medium text-gray-500 truncate">Toate tipurile</span>}</div>
                      <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-2 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showTypeDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                        <ul className="max-h-[280px] overflow-y-auto py-2 custom-scrollbar">
                          <li><button onClick={() => { setFilters({...filters, type: ''}); setShowTypeDropdown(false); }} className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${filters.type === '' ? 'bg-[#139E69]/10 text-[#139E69] font-bold border-l-2 border-[#139E69]' : 'text-gray-700 hover:bg-gray-50'}`}><LayoutGrid size={18} /><span className="flex-1">Toate tipurile</span><span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{typeCounts['Toate tipurile']}</span></button></li>
                          {propertyTypes.map((type) => (<li key={type.value}><button onClick={() => { setFilters({...filters, type: type.value}); setShowTypeDropdown(false); }} className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${filters.type === type.value ? 'bg-[#139E69]/10 text-[#139E69] font-bold border-l-2 border-[#139E69]' : 'text-gray-700 hover:bg-gray-50'}`}>{getTypeIcon(type.value)}<span className="flex-1">{type.label}</span><span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{typeCounts[type.value] || 0}</span></button></li>))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#f25c1a] font-bold text-sm uppercase tracking-widest mb-5">Preț</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <select className="w-full h-12 pl-4 pr-10 border border-gray-200 bg-white rounded-xl text-[#333] font-medium focus:outline-none appearance-none" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}>
                      <option value="0">Minim</option>
                      {Array.from({ length: 48 }, (_, i) => 50000 + i * 20000).map(p => <option key={p} value={p}>{p.toLocaleString('ro-RO')} €</option>)}
                    </select>
                    <select className="w-full h-12 pl-4 pr-10 border border-gray-200 bg-white rounded-xl text-[#333] font-medium focus:outline-none appearance-none" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}>
                      <option value="10000000">Maxim</option>
                      {Array.from({ length: 48 }, (_, i) => 50000 + i * 20000).map(p => <option key={p} value={p}>{p.toLocaleString('ro-RO')} €</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-[#f25c1a] font-bold text-sm uppercase tracking-widest mb-5">Camere</h4>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(num => (<button key={num} onClick={() => setFilters({...filters, bedrooms: num})} className={`flex-1 h-10 rounded-lg text-xs font-black border transition-all ${filters.bedrooms === num ? 'border-[#139E69] bg-[#EAF5EE] text-[#139E69]' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}>{num === 0 ? 'Toy.' : `${num}+`}</button>))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button type="button" className="w-full py-4 bg-[#4567c1]/10 text-[#4567c1] hover:bg-[#4567c1]/20 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 min-h-[56px]">
                    {isChanging ? "Se încarcă..." : `Vezi ${filteredProperties.length.toLocaleString('ro-RO')} rezultate`}
                  </button>
                  <button type="button" onClick={() => { setIsChanging(true); setFilters({ city: '', type: '', minPrice: 0, maxPrice: 10000000, bedrooms: 0, status: 'for-sale', isNewConstruction: false }); setTimeout(() => setIsChanging(false), 1000); }} className="w-full py-3 text-gray-400 hover:text-[#f25c1a] font-bold text-xs uppercase tracking-widest">Șterge filtrele</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[800px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-8">
              <div className="flex items-center gap-2">
                {['Cumpără', 'Închiriază', 'Ansambluri noi'].map((tab, idx) => (
                  <button key={tab} onClick={() => setFilters({ ...filters, status: idx === 0 ? 'for-sale' : 'for-rent', isNewConstruction: idx === 2 })} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${((idx === 0 && filters.status === 'for-sale' && !filters.isNewConstruction) || (idx === 1 && filters.status === 'for-rent' && !filters.isNewConstruction) || (idx === 2 && filters.isNewConstruction)) ? 'border-2 border-black text-black bg-white shadow-sm' : 'text-gray-500 hover:text-black border-2 border-transparent'}`}>{tab}</button>
                ))}
              </div>
              <div className="flex items-center gap-6">
                <select className="font-bold text-black bg-white border border-gray-100 rounded-lg px-4 py-1.5 appearance-none">
                  <option>Cele mai noi</option>
                  <option>Preț crescător</option>
                  <option>Preț descrescător</option>
                </select>
                <div className="hidden sm:flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#139E69]' : 'text-gray-400'}`}><LayoutGrid size={16} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-[#139E69]' : 'text-gray-400'}`}><List size={16} /></button>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-300 ${isChanging || isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px] text-gray-400 font-bold">Buscando las mejores propiedades...</div>
              ) : filteredProperties.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map(property => <PropertyCard key={property.id} property={property} />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-8 w-full">
                    {filteredProperties.map(property => <PropertyRowCard key={property.id} property={property} />)}
                  </div>
                )
              ) : (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm h-[400px] flex flex-col items-center justify-center">
                  <h3 className="font-serif text-2xl text-black font-bold mb-2">Nu există rezultate</h3>
                  <p className="text-gray-600">Încearcă să ajustezi filtrele pentru a găsi proprietăți.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
