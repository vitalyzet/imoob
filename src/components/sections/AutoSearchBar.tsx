'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, CarFront, Calendar, Gauge, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { AUTO_MODELS, AUTO_BRANDS } from '@/constants/autoModels';
import { ROMANIA_LOCATIONS } from '@/constants/romaniaCities';

const POPULAR_BRANDS = [
  { name: 'AUDI', dbName: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
  { name: 'BMW', dbName: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { name: 'CITROEN', dbName: 'Citroen', logo: 'https://www.carlogos.org/car-logos/citroen-logo.png' },
  { name: 'CUPRA', dbName: 'Cupra', logo: 'https://cdn.worldvectorlogo.com/logos/cupra.svg' },
  { name: 'FORD', dbName: 'Ford', logo: 'https://www.carlogos.org/car-logos/ford-logo.png' },
  { name: 'HYUNDAI', dbName: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
  { name: 'KIA', dbName: 'Kia', logo: 'https://www.carlogos.org/car-logos/kia-logo.png' },
  { name: 'LAND ROVER', dbName: 'Land Rover', logo: 'https://www.carlogos.org/car-logos/land-rover-logo.png' },
  { name: 'MERCEDES-BENZ', dbName: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { name: 'NISSAN', dbName: 'Nissan', logo: 'https://www.carlogos.org/car-logos/nissan-logo.png' },
  { name: 'OPEL', dbName: 'Opel', logo: 'https://www.carlogos.org/car-logos/opel-logo.png' },
  { name: 'PEUGEOT', dbName: 'Peugeot', logo: 'https://www.carlogos.org/car-logos/peugeot-logo.png' },
  { name: 'PORSCHE', dbName: 'Porsche', logo: 'https://www.carlogos.org/car-logos/porsche-logo.png' },
  { name: 'RENAULT', dbName: 'Renault', logo: 'https://www.carlogos.org/car-logos/renault-logo.png' },
  { name: 'SEAT', dbName: 'Seat', logo: 'https://www.carlogos.org/car-logos/seat-logo.png' },
  { name: 'TOYOTA', dbName: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { name: 'VOLKSWAGEN', dbName: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
];

export default function AutoSearchBar() {
  const router = useRouter();
  const [marca, setMarca] = useState('');
  const [model, setModel] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [location, setLocation] = useState('');
  
  const [brandCounts, setBrandCounts] = useState<Record<string, number>>({});
  const [modelCounts, setModelCounts] = useState<Record<string, number>>({});

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const filteredLocations = useMemo(() => {
    if (!location) return ROMANIA_LOCATIONS.slice(0, 15);
    const lowercaseQuery = location.toLowerCase();
    return ROMANIA_LOCATIONS.filter(c => 
      c.name.toLowerCase().includes(lowercaseQuery) || 
      (c.county && c.county.toLowerCase().includes(lowercaseQuery))
    ).slice(0, 15);
  }, [location]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts: Record<string, number> = {};
        await Promise.all(POPULAR_BRANDS.map(async (b) => {
          const q = query(
            collection(db, 'anuncios_auto'), 
            where('status', '==', 'active'), 
            where('marca', '==', b.dbName)
          );
          try {
            const snapshot = await getCountFromServer(q);
            counts[b.name] = snapshot.data().count;
          } catch(e) {
            counts[b.name] = 0;
          }
        }));
        setBrandCounts(counts);
      } catch (error) {
        console.error("Error fetching car counts:", error);
      }
    };
    fetchCounts();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setShowBrandDropdown(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    if (showBrandDropdown || showModelDropdown || showLocationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showBrandDropdown, showModelDropdown, showLocationDropdown]);

  const filteredBrands = useMemo(() => {
    const matches = AUTO_BRANDS.filter(b => b.toLowerCase().includes(marca.toLowerCase()));
    
    const mapped = matches.map(brandName => {
      const popular = POPULAR_BRANDS.find(p => p.dbName.toLowerCase() === brandName.toLowerCase());
      if (popular) return { ...popular, isPopular: true };
      
      const urlName = brandName.toLowerCase().replace(/\s+/g, '-');
      return {
        name: brandName.toUpperCase(),
        dbName: brandName,
        logo: `https://www.carlogos.org/car-logos/${urlName}-logo.png`,
        isPopular: false
      };
    });

    if (!marca) {
      return mapped.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    return mapped;
  }, [marca]);

  // Fetch counts dynamically for non-popular brands that appear in the filtered list
  useEffect(() => {
    setBrandCounts(prev => {
      const missing = filteredBrands.filter(b => prev[b.name] === undefined);
      if (missing.length > 0) {
        missing.forEach(async (b) => {
          const q = query(
            collection(db, 'anuncios_auto'), 
            where('status', '==', 'active'), 
            where('marca', '==', b.dbName)
          );
          try {
            const snapshot = await getCountFromServer(q);
            setBrandCounts(p => ({ ...p, [b.name]: snapshot.data().count }));
          } catch(e) {
            setBrandCounts(p => ({ ...p, [b.name]: 0 }));
          }
        });
      }
      return prev;
    });
  }, [filteredBrands]);

  const availableModels = useMemo(() => {
    const brandKey = Object.keys(AUTO_MODELS).find(k => k.toLowerCase() === marca.toLowerCase());
    if (!brandKey) return [];
    return AUTO_MODELS[brandKey];
  }, [marca]);

  useEffect(() => {
    const fetchModelCounts = async () => {
      if (!marca || availableModels.length === 0) {
        setModelCounts({});
        return;
      }
      
      const brandKey = Object.keys(AUTO_MODELS).find(k => k.toLowerCase() === marca.toLowerCase());
      if (!brandKey) return;

      try {
        const counts: Record<string, number> = {};
        // We only fetch counts when they are needed to avoid too many requests
        await Promise.all(availableModels.map(async (m) => {
          const q = query(
            collection(db, 'anuncios_auto'), 
            where('status', '==', 'active'), 
            where('marca', '==', brandKey),
            where('model', '==', m)
          );
          try {
            const snapshot = await getCountFromServer(q);
            counts[m] = snapshot.data().count;
          } catch(e) {
            counts[m] = 0;
          }
        }));
        setModelCounts(counts);
      } catch (error) {
        console.error("Error fetching model counts:", error);
      }
    };
    
    fetchModelCounts();
  }, [marca, availableModels]);

  const filteredModels = useMemo(() => {
    if (!model) return availableModels;
    return availableModels.filter(m => m.toLowerCase().includes(model.toLowerCase()));
  }, [model, availableModels]);

  const handleSearch = () => {
    // Construct query parameters
    const params = new URLSearchParams();
    if (marca) params.append('marca', marca.toLowerCase());
    if (model) params.append('model', model.toLowerCase());
    if (yearMin) params.append('an_min', yearMin);
    if (location) params.append('location', location);
    
    router.push(`/auto?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-3xl p-3 md:p-4 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.3)] border border-white/20 relative z-20 pointer-events-auto"
      >
        <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row shadow-inner border border-white/50 gap-2">
          
          {/* Marca */}
          <div className="flex-1 relative flex items-center h-14 md:h-16 px-4 bg-gray-50 rounded-xl border border-transparent hover:border-[var(--primary)]/30 focus-within:bg-white focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 transition-all group" ref={brandDropdownRef}>
            {(() => {
              const popularBrand = POPULAR_BRANDS.find(b => b.name.toLowerCase() === marca.toLowerCase());
              const isValidBrand = AUTO_BRANDS.find(b => b.toLowerCase() === marca.toLowerCase());
              
              if (popularBrand) {
                return (
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <img src={popularBrand.logo} alt={popularBrand.name} className="max-w-full max-h-full object-contain opacity-90" />
                  </div>
                );
              } else if (isValidBrand) {
                const urlName = isValidBrand.toLowerCase().replace(/\s+/g, '-');
                const dynamicLogo = `https://www.carlogos.org/car-logos/${urlName}-logo.png`;
                return (
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {imageErrors[isValidBrand.toUpperCase()] ? (
                      <CarFront size={20} className="text-[var(--primary)] shrink-0" />
                    ) : (
                      <img 
                        src={dynamicLogo} 
                        alt={isValidBrand} 
                        className="max-w-full max-h-full object-contain opacity-90" 
                        onError={() => setImageErrors(prev => ({ ...prev, [isValidBrand.toUpperCase()]: true }))}
                      />
                    )}
                  </div>
                );
              }
              
              return <CarFront size={20} className="text-gray-400 group-focus-within:text-[var(--primary)] shrink-0" />;
            })()}
            <input 
              type="text"
              placeholder="Marca (ex: BMW)"
              value={marca}
              onChange={(e) => {
                setMarca(e.target.value);
                setShowBrandDropdown(true);
              }}
              onFocus={() => setShowBrandDropdown(true)}
              className="w-full h-full bg-transparent border-none outline-none text-gray-800 font-bold px-3 text-[15px] placeholder:font-medium placeholder:text-gray-400"
            />
            {marca && (
              <button 
                type="button"
                onClick={() => { setMarca(''); setModel(''); }} 
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Șterge marca"
              >
                <X size={16} />
              </button>
            )}
            {showBrandDropdown && filteredBrands.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-200/60 py-2 z-[70] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                {filteredBrands.map((b, index) => {
                  const showPopularHeader = !marca && index === 0 && b.isPopular;
                  const showRestoHeader = !marca && !b.isPopular && (index === 0 || filteredBrands[index - 1].isPopular);

                  return (
                    <React.Fragment key={b.name}>
                      {showPopularHeader && (
                        <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur z-10">
                          Mărci Populare
                        </div>
                      )}
                      {showRestoHeader && (
                        <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur z-10 border-t border-gray-100 mt-1 pt-3">
                          Resto de marcas
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setMarca(b.name);
                          setShowBrandDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50/80 flex items-center justify-between transition-colors group/item relative overflow-hidden"
                      >
                        {/* Hover indicator line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300 ease-out" />
                        
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-6 flex items-center justify-center shrink-0">
                            {imageErrors[b.name] ? (
                              <CarFront size={16} className="text-gray-400" />
                            ) : (
                              <img 
                                src={b.logo} 
                                alt={b.name} 
                                className="max-w-full max-h-full object-contain opacity-90 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:scale-105" 
                                onError={() => setImageErrors(prev => ({ ...prev, [b.name]: true }))}
                              />
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className={`text-[14px] font-bold tracking-tight ${marca.toLowerCase() === b.name.toLowerCase() ? 'text-sky-600' : 'text-slate-800'}`}>
                              {b.name}
                            </span>
                            {marca.toLowerCase() === b.name.toLowerCase() && <Check size={16} className="text-sky-600 ml-2" />}
                          </div>
                        </div>
                        <span className="text-[13px] text-slate-400 font-medium">
                          {brandCounts[b.name] !== undefined ? brandCounts[b.name] : '...'}
                        </span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200 my-auto"></div>

          {/* Model */}
          <div className="flex-1 relative flex items-center h-14 md:h-16 px-4 bg-gray-50 rounded-xl border border-transparent hover:border-[var(--primary)]/30 focus-within:bg-white focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 transition-all group" ref={modelDropdownRef}>
            <CarFront size={20} className="text-gray-400 group-focus-within:text-[var(--primary)] shrink-0" />
            <input 
              type="text"
              placeholder={marca ? "Toate modelele" : "Alege marca întâi"}
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setShowModelDropdown(true);
              }}
              onFocus={() => {
                if (marca) setShowModelDropdown(true);
              }}
              className="w-full h-full bg-transparent border-none outline-none text-gray-800 font-bold px-3 text-[15px] placeholder:font-medium placeholder:text-gray-400"
            />
            {model && (
              <button 
                type="button"
                onClick={() => setModel('')} 
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Șterge modelul"
              >
                <X size={16} />
              </button>
            )}
            {showModelDropdown && marca && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-200/60 py-2 z-[70] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                {!model && (() => {
                  const selectedBrandObj = POPULAR_BRANDS.find(b => b.name.toLowerCase() === marca.toLowerCase());
                  const totalBrandCount = selectedBrandObj && brandCounts[selectedBrandObj.name] !== undefined ? brandCounts[selectedBrandObj.name] : '...';
                  
                  return (
                    <button
                      onClick={() => {
                        setModel('');
                        setShowModelDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50/80 flex items-center justify-between transition-colors group/item relative overflow-hidden border-b border-gray-100 mb-1"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300 ease-out" />
                      <div className="flex items-center">
                        <span className={`text-[14px] font-bold tracking-tight ml-2 ${!model ? 'text-sky-600' : 'text-slate-800'}`}>Toate modelele</span>
                        {!model && <Check size={16} className="text-sky-600 ml-2" />}
                      </div>
                      <span className="text-[13px] text-sky-500 font-medium">{totalBrandCount}</span>
                    </button>
                  );
                })()}
                {filteredModels.length > 0 ? (
                  filteredModels.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setModel(m);
                        setShowModelDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50/80 flex items-center justify-between transition-colors group/item relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300 ease-out" />
                      <div className="flex items-center">
                        <span className={`text-[14px] font-bold tracking-tight ml-2 ${model === m ? 'text-sky-600' : 'text-slate-800'}`}>{m}</span>
                        {model === m && <Check size={16} className="text-sky-600 ml-2" />}
                      </div>
                      <span className="text-[13px] text-slate-400 font-medium">
                        {modelCounts[m] !== undefined ? modelCounts[m] : '...'}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] text-gray-500 font-medium">Nu am găsit modele.</div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200 my-auto"></div>

          {/* An Minim */}
          <div className="flex-[0.7] relative flex items-center h-14 md:h-16 px-4 bg-gray-50 rounded-xl border border-transparent hover:border-[var(--primary)]/30 focus-within:bg-white focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 transition-all group">
            <Calendar size={20} className="text-gray-400 group-focus-within:text-[var(--primary)] shrink-0" />
            <select 
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none text-gray-800 font-bold px-3 text-[15px] appearance-none"
            >
              <option value="">An min.</option>
              {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200 my-auto"></div>

          {/* Locatie */}
          <div className="flex-[0.7] relative flex items-center h-14 md:h-16 px-4 bg-gray-50 rounded-xl border border-transparent hover:border-[var(--primary)]/30 focus-within:bg-white focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 transition-all group" ref={locationDropdownRef}>
            <MapPin size={20} className="text-gray-400 group-focus-within:text-[var(--primary)] shrink-0" />
            <input 
              type="text"
              placeholder="Oraș (ex: București)"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              className="w-full h-full bg-transparent border-none outline-none text-gray-800 font-bold px-3 text-[15px] placeholder:font-medium placeholder:text-gray-400"
            />
            {location && (
              <button 
                type="button"
                onClick={() => setLocation('')} 
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Șterge orașul"
              >
                <X size={16} />
              </button>
            )}
            {showLocationDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 md:min-w-[250px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-200/60 py-2 z-[70] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setLocation(c.name);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50/80 flex items-center justify-between transition-colors group/item relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300 ease-out" />
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-gray-400 group-hover/item:text-[var(--primary)] transition-colors shrink-0" />
                        <span className="truncate text-[14px] font-bold text-slate-800">
                          {c.name}
                          {!c.isCounty && c.name !== c.county && (
                            <span className="ml-1.5 text-gray-400 font-medium">{c.county}</span>
                          )}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] text-gray-500 font-medium">Nu am găsit acest oraș.</div>
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button 
            onClick={handleSearch}
            className="h-14 md:h-16 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-8 font-black text-[16px] transition-colors flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-[var(--primary)]/30"
          >
            <Search size={20} strokeWidth={3} />
            <span className="hidden md:inline">Caută Auto</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
