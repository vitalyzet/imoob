'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useDomain } from '@/context/DomainContext';
import AutoSearchBar from './AutoSearchBar';
import ClassicAutoSearch from './ClassicAutoSearch';
import { useRouter } from 'next/navigation';
import { Search, Heart, Building2, Building, Home, Map, Briefcase, Store, Factory, Hotel, MapPin, Bed, ChevronDown, Check, Warehouse, Car } from 'lucide-react';
import { ROMANIA_LOCATIONS } from '@/constants/romaniaCities';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Hero() {
  const { domain } = useDomain();
  const router = useRouter();
  
  const [operation, setOperation] = useState('Cumpără');
  const [type, setType] = useState('Toate tipurile');
  const [city, setCity] = useState(''); // Default to empty (no city selected)
  const [firebaseProperties, setFirebaseProperties] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState<'classic' | 'professional'>('classic');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('propertyCardStyle') as 'classic' | 'professional';
      if (savedMode) setSearchMode(savedMode);

      const handleStyleChange = (e: CustomEvent) => {
        setSearchMode(e.detail);
      };
      window.addEventListener('card-style-changed', handleStyleChange as EventListener);
      return () => {
        window.removeEventListener('card-style-changed', handleStyleChange as EventListener);
      };
    }
  }, []);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  
  // Location Autocomplete State
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = useMemo(() => {
    if (!city) return ROMANIA_LOCATIONS.slice(0, 15);
    const lowercaseQuery = city.toLowerCase();
    return ROMANIA_LOCATIONS.filter(c => 
      c.name.toLowerCase().includes(lowercaseQuery) || 
      (c.county && c.county.toLowerCase().includes(lowercaseQuery))
    ).slice(0, 15);
  }, [city]);

  // Close location dropdown on click outside
  useEffect(() => {
    const handleClickOutsideLocation = (e: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    if (showLocationDropdown) {
      document.addEventListener('click', handleClickOutsideLocation);
      return () => document.removeEventListener('click', handleClickOutsideLocation);
    }
  }, [showLocationDropdown]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setShowTypeDropdown(false);
      }
    };
    if (showTypeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showTypeDropdown]);

  useEffect(() => {
    // Set up real-time listener for counting active ads
    const q = query(collection(db, 'anuncios'), where('status', '==', 'active'), limit(100));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mapped = snapshot.docs.map(doc => doc.data());
      console.log(`[Hero] Real-time loaded ${mapped.length} properties for counting`);
      setFirebaseProperties(mapped);
    }, (error) => {
      console.error("Error fetching real-time hero counts:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleOperationChange = (newOperation: string) => {
    setOperation(newOperation);
    if (newOperation === 'Ansambluri noi') {
      const validTypes = ['Locuințe', 'Birouri', 'Spații industriale'];
      if (!validTypes.includes(type)) setType('Locuințe');
    } else if (newOperation === 'Afaceri') {
      const validTypes = ['Birou', 'Spațiu comercial', 'Industrial', 'Afacere'];
      if (!validTypes.includes(type)) setType('Birou');
    } else if (newOperation === 'Cumpără') {
      const validTypes = ['Locuință', 'Toate tipurile', 'Apartamente', 'Garsoniere', 'Case / Vile', 'Terenuri', 'Birouri', 'Spații comerciale', 'Spații industriale', 'Ansambluri', 'Hoteluri / Pensiuni'];
      if (!validTypes.includes(type)) setType('Toate tipurile');
    } else if (newOperation === 'Închiriază') {
      const validTypes = ['Locuință', 'Toate tipurile', 'Apartamente', 'Garsoniere', 'Case / Vile', 'Cameră de închiriat', 'Terenuri', 'Birouri', 'Spații comerciale', 'Spații industriale', 'Ansambluri', 'Hoteluri / Pensiuni'];
      if (!validTypes.includes(type)) setType('Toate tipurile');
    }
  };

  const getResultLabel = (count: number, propertyType: string) => {
    if (count === 0) return 'rezultate';
    if (propertyType === 'Toate tipurile' || propertyType === 'Toate') return count === 1 ? 'proprietate' : 'proprietăți';
    if (propertyType === 'Cameră de închiriat') return count === 1 ? 'cameră' : 'camere';
    if (propertyType === 'Apartamente') return count === 1 ? 'apartament' : 'apartamente';
    if (propertyType === 'Garsoniere') return count === 1 ? 'garsonieră' : 'garsoniere';
    if (propertyType === 'Case / Vile') return count === 1 ? 'casă' : 'case';
    if (propertyType === 'Terenuri') return count === 1 ? 'teren' : 'terenuri';
    if (propertyType === 'Birouri') return count === 1 ? 'birou' : 'birouri';
    if (propertyType === 'Spații comerciale') return count === 1 ? 'spațiu' : 'spații';
    return count === 1 ? 'proprietate' : 'proprietăți';
  };

  const resultCount = useMemo(() => {
    if (!firebaseProperties.length) return 0;

    return firebaseProperties.filter(p => {
      const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

      // 1. City/Judet matching (Robust accent-insensitive)
      if (city) {
        const pCity = normalize(p.city || p.localitate || '');
        const pJudet = normalize(p.judet || '');
        const targetCity = normalize(city).replace(/^judetul\s+/i, '').trim();
        if (pCity !== targetCity && pJudet !== targetCity) return false;
      }
      
      // 2. Operation matching
      // Special case: Rooms are always for rent
      const isRoom = normalize(p.type || '').includes('camera');
      const op = operation === 'Închiriază' ? 'inchiriere' : (operation === 'Cumpără' ? 'vanzare' : '');

      if (operation === 'Închiriază' || operation === 'Alquilar') {
        if (!isRoom && p.operation !== 'inchiriere' && p.operation !== 'alquiler') return false;
      } else if (operation === 'Cumpără' || operation === 'Comprar') {
        if (isRoom || (p.operation !== 'vanzare' && p.operation !== 'vender')) return false;
      } else if (operation === 'Ansambluri noi' || operation === 'Obra nueva') {
        if (p.condition !== 'new') return false;
      } else if (operation === 'Afaceri' || operation === 'Compartir') {
        if (operation === 'Compartir' && !isRoom) return false;
        if (operation === 'Afaceri' && p.operation !== 'traspaso') return false;
      }
      
      // 3. Type matching
      if (type !== 'Toate' && type !== 'Toate tipurile') {
        const pType = normalize(p.type || '');
        const sType = normalize(type);
        
        // Map complex UI names to DB names
        let cleanSType = sType
          .replace(' / vile', '')
          .replace(' / pensiuni', '')
          .replace('spatii ', '')
          .replace('spatiul ', '')
          .replace('camera de inchiriat', 'camera') // Explicit map for room
          .trim();
        
        // Singular/Plural robust matching
        const s1 = cleanSType.endsWith('e') ? cleanSType.slice(0, -1) : cleanSType;
        const p1 = pType.endsWith('e') ? pType.slice(0, -1) : pType;

        if (!pType.includes(s1) && !sType.includes(p1)) return false;
      }
      
      return true;
    }).length;
  }, [city, operation, type, firebaseProperties]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (type !== 'Toate' && type !== 'Toate tipurile') {
      params.append('type', type);
    }
    // Also pass the operation if needed
    if (operation === 'Închiriază' || operation === 'Alquilar') params.append('status', 'for-rent');
    if (operation === 'Cumpără' || operation === 'Comprar') params.append('status', 'for-sale');
    if (operation === 'Ansambluri noi' || operation === 'Obra nueva') params.append('new', 'true');
    if (operation === 'Compartir') {
      params.append('status', 'for-rent');
      params.set('type', 'Cameră de închiriat');
    }
    
    router.push(`/propiedades?${params.toString()}`);
  };

  const getTypeIcon = (selectedType: string) => {
    switch (selectedType) {
      case 'Apartamente': return <Building size={18} className="text-[var(--primary)] mr-2" />;
      case 'Garsoniere': return <Bed size={18} className="text-[var(--primary)] mr-2" />;
      case 'Cameră de închiriat': return <Bed size={18} className="text-[var(--primary)] mr-2" />;
      case 'Case / Vile': return <Home size={18} className="text-[var(--primary)] mr-2" />;
      case 'Terenuri': return <Map size={18} className="text-[var(--primary)] mr-2" />;
      case 'Birouri':
      case 'Birou': return <Briefcase size={18} className="text-[var(--primary)] mr-2" />;
      case 'Spații comerciale':
      case 'Spațiu comercial': return <Store size={18} className="text-[var(--primary)] mr-2" />;
      case 'Spații industriale':
      case 'Industrial': return <Factory size={18} className="text-[var(--primary)] mr-2" />;
      case 'Afacere': return <Building size={18} className="text-[var(--primary)] mr-2" />;
      case 'Locuințe': return <Home size={18} className="text-[var(--primary)] mr-2" />;
      case 'Ansambluri': return <Building2 size={18} className="text-[var(--primary)] mr-2" />;
      case 'Hoteluri / Pensiuni': return <Hotel size={18} className="text-[var(--primary)] mr-2" />;
      case 'Toate tipurile':
      case 'Toate':
      case 'Locuință':
      default: return <Home size={18} className="text-gray-500 mr-2" />;
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center pt-20 bg-slate-900">
      {/* Background Image & Overlay to match Auth Page Style */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${domain === 'imobiliare' ? 'opacity-100' : 'opacity-0'}`}>
          <Image 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=60&w=1080" 
            alt="Luxury Home Background" 
            fill
            priority
            className="object-cover object-center opacity-20"
            sizes="100vw"
          />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${domain === 'auto' ? 'opacity-100' : 'opacity-0'}`}>
          <Image 
            src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=60&w=1080" 
            alt="Luxury Car Background" 
            fill
            priority
            className="object-cover object-center opacity-30"
            sizes="100vw"
          />
        </div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-[#f25c1a] rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
      </div>

      <div className="container relative z-40 mx-auto px-6 h-full flex flex-col items-center justify-center pt-10 pb-32 pointer-events-none">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans text-white mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-light text-center pointer-events-auto leading-tight">
          {domain === 'imobiliare' ? (
            searchMode === 'classic' ? (
              <>Închiriere și vânzare de apartamente și case în <span className="inline-block bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[var(--primary)]/20 transform hover:scale-105 transition-transform">România</span></>
            ) : (
              <>Aici găsești toate anunțurile imobiliare de pe <span className="inline-block bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[var(--primary)]/20 transform hover:scale-105 transition-transform">toată piața</span></>
            )
          ) : (
             <>Găsește mașina perfectă din mii de anunțuri <span className="inline-block bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl font-bold ml-1 -rotate-1 shadow-lg shadow-[var(--primary)]/20 transform hover:scale-105 transition-transform">Auto</span></>
          )}
        </h1>

        {/* Search Interactive Element */}
        {domain === 'auto' ? (
          searchMode === 'classic' ? <ClassicAutoSearch /> : <AutoSearchBar />
        ) : searchMode === 'classic' ? (
          <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden backdrop-blur-2xl bg-black/25 border border-white/10 pointer-events-auto">
          
          {/* Column 1: Operation */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10">
            <ul className="h-64 overflow-y-auto no-scrollbar py-2 custom-scrollbar">
              {['Ansambluri noi', 'Cumpără', 'Închiriază', 'Afaceri'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => handleOperationChange(item)}
                    className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${
                      operation === item 
                        ? 'bg-[var(--primary)]/20 text-[#28a975] font-medium border-l-3 border-[#139E69]' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Extends to the search button */}
          <div className="flex-[2] flex flex-col md:flex-row">
            
            {/* Column 2A: Property Types */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 h-64 flex flex-col">
              {operation === 'Ansambluri noi' ? (
                <ul className="flex-1 overflow-y-auto no-scrollbar py-2 custom-scrollbar">
                  {['Locuințe', 'Birouri', 'Spații industriale'].map((item) => (
                    <li key={item}>
                      <button 
                        onClick={() => setType(item)}
                        className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${
                          type === item 
                            ? 'bg-[var(--primary)]/20 text-[#28a975] font-medium border-l-3 border-[#139E69]' 
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : operation === 'Afaceri' ? (
                <ul className="flex-1 overflow-y-auto no-scrollbar py-2 custom-scrollbar">
                  {['Birou', 'Spațiu comercial', 'Industrial', 'Afacere'].map((item) => (
                    <li key={item}>
                      <button 
                        onClick={() => setType(item)}
                        className={`w-full text-left px-6 py-2.5 text-sm transition-colors ${
                          type === item 
                            ? 'bg-[var(--primary)]/20 text-[#28a975] font-medium border-l-3 border-[#139E69]' 
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex-1 overflow-y-auto no-scrollbar py-2 custom-scrollbar">
                  {[
                    { label: 'Apartamente', icon: <Building2 size={16} /> },
                    { label: 'Garsoniere', icon: <Building size={16} /> },
                    { label: 'Case / Vile', icon: <Home size={16} /> },
                    ...(operation === 'Închiriază' ? [{ label: 'Cameră de închiriat', icon: <Bed size={16} />, isNew: true }] : []),
                    { label: 'Terenuri', icon: <Map size={16} /> },
                    { label: 'Birouri', icon: <Briefcase size={16} /> },
                    { label: 'Spații comerciale', icon: <Store size={16} /> },
                    { label: 'Spații industriale', icon: <Factory size={16} /> },
                    { label: 'Ansambluri', icon: <Building2 size={16} /> },
                    { label: 'Hoteluri / Pensiuni', icon: <Hotel size={16} /> }
                  ].map((item) => (
                    <li key={item.label}>
                      <button 
                        onClick={() => setType(item.label)}
                        className={`w-full text-left px-6 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                          type === item.label 
                            ? 'bg-[var(--primary)]/20 text-[#28a975] font-medium border-l-3 border-[#139E69]' 
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="opacity-70">{item.icon}</span>
                        {item.label}
                        {item.isNew && (
                          <span className="bg-amber-400 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-auto">
                            Nou
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Column 2B: Location */}
            <div className="flex-1 h-64 flex flex-col border-b md:border-b-0 relative">
              {/* Sticky Search Input for Classic Mode */}
              <div className="p-3 border-b border-white/10 shrink-0">
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Caută orașul..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#139E69] transition-colors"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                 <ul className="absolute inset-0 overflow-y-auto no-scrollbar py-2 custom-scrollbar">
                  {filteredCities.map((c) => (
                    <li key={c.name}>
                      <button 
                        onClick={() => setCity(c.name)}
                        className={`w-full text-left px-6 py-2.5 text-sm transition-colors flex items-center gap-3 ${
                          city === c.name 
                            ? 'bg-[var(--primary)]/20 text-[#28a975] font-medium border-l-3 border-[#139E69]' 
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <MapPin size={16} className="text-[#f25c1a] opacity-80 shrink-0" />
                        <span className="truncate">
                          {c.name}
                          {!c.isCounty && c.name !== c.county && (
                            <span className="ml-1.5 opacity-50 font-normal">{c.county}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleSearch}
                className="w-full bg-[var(--primary)] hover:bg-[#0f8256] text-white py-4 font-bold text-lg transition-colors flex items-center justify-center gap-2 mt-auto"
              >
                CAUTĂ
                <span className="bg-white/20 text-white text-sm px-2.5 py-0.5 rounded-full font-semibold ml-1">
                  {resultCount} {getResultLabel(resultCount, type)}
                </span>
              </button>
            </div>
            
          </div>
        </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-2 relative z-20 pointer-events-auto">
            <div className="w-full flex flex-col md:flex-row bg-white rounded-xl shadow-2xl p-1.5 md:p-2 gap-2">
            {/* Operation Tabs */}
            <div className="flex bg-white p-1 gap-1 items-center md:border-r border-gray-200 overflow-x-auto no-scrollbar">
              {['Cumpără', 'Închiriază', 'Ansambluri noi', 'Afaceri'].map((item) => (
                <button 
                  key={item}
                  onClick={() => handleOperationChange(item)}
                  className={`px-4 py-3 text-[15px] font-bold rounded-lg transition-colors whitespace-nowrap ${
                    operation === item 
                      ? 'bg-[#dcfce7] text-[var(--primary)]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Location Search Input */}
            <div className="relative flex-1 flex items-center bg-white rounded-lg group" ref={locationDropdownRef}>
              <div className="pl-4 pr-2 text-gray-400 shrink-0">
                <MapPin size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Caută orașul (ex: București, Cluj...)"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setShowLocationDropdown(true);
                }}
                onFocus={() => setShowLocationDropdown(true)}
                className="w-full h-full py-3.5 px-2 text-[15px] font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#5ae4c0]/30 rounded-lg"
              />
              
              {/* Location Dropdown Professional */}
              {showLocationDropdown && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 md:w-[320px] bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-[70] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 custom-scrollbar">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCity(c.name);
                          setShowLocationDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#e8f5ee] flex items-center gap-3 transition-colors text-[14px] text-gray-800 font-semibold group/item"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover/item:bg-white flex items-center justify-center shrink-0 transition-colors">
                          <MapPin size={14} className="text-[var(--primary)]" />
                        </div>
                        <span className="truncate">
                          {c.name}
                          {!c.isCounty && c.name !== c.county && (
                            <span className="ml-1.5 text-gray-400 font-normal">{c.county}</span>
                          )}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-[14px] text-gray-500 text-center flex flex-col items-center gap-2">
                      <MapPin size={24} className="text-gray-300" />
                      Nu am găsit acest oraș
                    </div>
                  )}
                </div>
              )}
              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#5ae4c0] hover:bg-[#43dcae] text-[#0f2c23] px-6 font-bold text-[15px] transition-colors flex items-center justify-center gap-2 rounded-lg"
              >
                <Search size={18} />
                Caută
                {resultCount > 0 && (
                  <span className="bg-[#0f2c23]/10 text-[#0f2c23] text-sm px-2 py-0.5 rounded-full font-bold ml-1">
                    {resultCount} {getResultLabel(resultCount, type)}
                  </span>
                )}
              </button>
            </div>
            </div>

            {/* Permanent Property Types Row */}
            <div className="w-full bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 px-4 py-3 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-wrap gap-2.5">
                {(() => {
                  let currentOptions: {value: string, label: string, icon: any, isNew?: boolean}[] = [];
                  
                  if (operation === 'Ansambluri noi') {
                    currentOptions = [
                      { value: 'Locuințe', label: 'Locuințe', icon: <Home size={14} strokeWidth={1.8} /> },
                      { value: 'Birouri', label: 'Birouri', icon: <Briefcase size={14} strokeWidth={1.8} /> },
                      { value: 'Spații industriale', label: 'Spații ind.', icon: <Factory size={14} strokeWidth={1.8} /> }
                    ];
                  } else if (operation === 'Afaceri') {
                    currentOptions = [
                      { value: 'Birou', label: 'Birou', icon: <Briefcase size={14} strokeWidth={1.8} /> },
                      { value: 'Spațiu comercial', label: 'Spațiu com.', icon: <Store size={14} strokeWidth={1.8} /> },
                      { value: 'Industrial', label: 'Industrial', icon: <Factory size={14} strokeWidth={1.8} /> },
                      { value: 'Afacere', label: 'Afacere', icon: <Building size={14} strokeWidth={1.8} /> }
                    ];
                  } else {
                    currentOptions = [
                      { value: 'Toate tipurile', label: 'Toate tipurile', icon: <Home size={14} strokeWidth={1.8} /> },
                      { value: 'Apartamente', label: 'Apartamente', icon: <Building size={14} strokeWidth={1.8} /> },
                      { value: 'Garsoniere', label: 'Garsoniere', icon: <Bed size={14} strokeWidth={1.8} /> },
                      { value: 'Case / Vile', label: 'Case / Vile', icon: <Home size={14} strokeWidth={1.8} /> }
                    ];
                    
                    if (operation === 'Închiriază') {
                      currentOptions.push({ value: 'Cameră de închiriat', label: 'Camere', icon: <Bed size={14} strokeWidth={1.8} />, isNew: true });
                    }
                    
                    currentOptions.push(
                      { value: 'Terenuri', label: 'Terenuri', icon: <Map size={14} strokeWidth={1.8} /> },
                      { value: 'Birouri', label: 'Birouri', icon: <Briefcase size={14} strokeWidth={1.8} /> },
                      { value: 'Spații comerciale', label: 'Spații com.', icon: <Store size={14} strokeWidth={1.8} /> }
                    );
                  }

                  return currentOptions.map((item, index) => {
                    const isActive = type === item.value || (item.value === 'Toate tipurile' && (type === 'Locuință' || type === 'Toate'));
                    return (
                      <button
                        key={item.value}
                        onClick={() => { setType(item.value); }}
                        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 outline-none whitespace-nowrap ${
                          isActive 
                            ? 'bg-[var(--primary)] text-white shadow-[0_2px_12px_rgba(19,158,105,0.5)]' 
                            : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                        {item.isNew && (
                          <span className="bg-amber-400 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Nou
                          </span>
                        )}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Soft Wave (Flat on left, curved on right) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block w-full h-[80px] md:h-[130px]">
          <path d="M0,60 L500,60 C900,60 1100,20 1440,10 L1440,120 L0,120 Z" fill="#ffffff" />
        </svg>
      </div>

      {/* Under-Wave Secondary Menu */}
      <div className="absolute bottom-0 left-0 w-full bg-white z-30 pb-4 pt-2 px-6">
        <div className="container mx-auto flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-gray-500 font-medium">
          <button 
            onClick={() => {
              setSearchMode('classic');
              localStorage.setItem('propertyCardStyle', 'classic');
              window.dispatchEvent(new CustomEvent('card-style-changed', { detail: 'classic' }));
            }}
            className={`flex items-center gap-2 transition-colors ${searchMode === 'classic' ? 'text-[var(--primary)] font-bold' : 'hover:text-[var(--primary)]'}`}
          >
            <Search size={16} /> Căutare clasică
          </button>
          <button 
            onClick={() => {
              setSearchMode('professional');
              localStorage.setItem('propertyCardStyle', 'professional');
              window.dispatchEvent(new CustomEvent('card-style-changed', { detail: 'professional' }));
            }}
            className={`flex items-center gap-2 transition-colors ${searchMode === 'professional' ? 'text-[var(--primary)] font-bold' : 'hover:text-[var(--primary)]'}`}
          >
            <div className="flex gap-0.5"><div className="w-1 h-3 bg-current"/><div className="w-1 h-3 bg-current"/><div className="w-1 h-3 bg-current"/></div>
            Căutare profesională
          </button>
          <button className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors">
            <Heart size={16} /> {domain === 'auto' ? 'Căutările mele Auto' : 'Căutările mele'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.4); 
        }
        .no-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
      `}</style>
    </div>
  );
}
