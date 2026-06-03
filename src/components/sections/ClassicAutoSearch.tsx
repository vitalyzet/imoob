'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { AUTO_MODELS, AUTO_BRANDS, MOTO_MODELS, MOTO_BRANDS, VAN_MODELS, VAN_BRANDS, TRUCK_MODELS, TRUCK_BRANDS } from '@/constants/autoModels';
import { ROMANIA_LOCATIONS } from '@/constants/romaniaCities';
import { CarFront, Calendar, Search, Car, MapPin, Bike, Truck } from 'lucide-react';

const POPULAR_BRANDS = [
  { name: 'AUDI', dbName: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
  { name: 'BMW', dbName: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { name: 'MERCEDES-BENZ', dbName: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { name: 'VOLKSWAGEN', dbName: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
  { name: 'FORD', dbName: 'Ford', logo: 'https://www.carlogos.org/car-logos/ford-logo.png' },
  { name: 'TOYOTA', dbName: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { name: 'RENAULT', dbName: 'Renault', logo: 'https://www.carlogos.org/car-logos/renault-logo.png' },
  { name: 'DACIA', dbName: 'Dacia', logo: 'https://www.carlogos.org/car-logos/dacia-logo.png' },
  { name: 'PEUGEOT', dbName: 'Peugeot', logo: 'https://www.carlogos.org/car-logos/peugeot-logo.png' },
  { name: 'SKODA', dbName: 'Skoda', logo: 'https://www.carlogos.org/car-logos/skoda-logo.png' },
];

const POPULAR_MOTO_BRANDS = [
  { name: 'YAMAHA', dbName: 'Yamaha', logo: 'https://www.carlogos.org/car-logos/yamaha-logo.png' },
  { name: 'HONDA', dbName: 'Honda', logo: 'https://www.carlogos.org/car-logos/honda-logo.png' },
  { name: 'KAWASAKI', dbName: 'Kawasaki', logo: 'https://www.carlogos.org/car-logos/kawasaki-logo.png' },
  { name: 'SUZUKI', dbName: 'Suzuki', logo: 'https://www.carlogos.org/car-logos/suzuki-logo.png' },
  { name: 'BMW', dbName: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { name: 'DUCATI', dbName: 'Ducati', logo: 'https://www.carlogos.org/car-logos/ducati-logo.png' },
  { name: 'HARLEY-DAVIDSON', dbName: 'Harley-Davidson', logo: 'https://www.carlogos.org/car-logos/harley-davidson-logo.png' },
  { name: 'KTM', dbName: 'KTM', logo: 'https://www.carlogos.org/car-logos/ktm-logo.png' },
];

const POPULAR_VAN_BRANDS = [
  { name: 'MERCEDES-BENZ', dbName: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
];

const POPULAR_TRUCK_BRANDS = [
  { name: 'MAN', dbName: 'MAN', logo: 'https://www.carlogos.org/car-logos/man-logo.png' },
  { name: 'VOLVO', dbName: 'Volvo', logo: 'https://www.carlogos.org/car-logos/volvo-logo.png' },
  { name: 'SCANIA', dbName: 'Scania', logo: 'https://www.carlogos.org/car-logos/scania-logo.png' },
  { name: 'MERCEDES-BENZ', dbName: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { name: 'DAF', dbName: 'DAF', logo: 'https://www.carlogos.org/car-logos/daf-logo.png' },
  { name: 'IVECO', dbName: 'Iveco', logo: 'https://www.carlogos.org/car-logos/iveco-logo.png' },
  { name: 'RENAULT', dbName: 'Renault', logo: 'https://www.carlogos.org/car-logos/renault-logo.png' }
];



export default function ClassicAutoSearch() {
  const router = useRouter();
  const [category, setCategory] = useState('Autoturisme');
  const [marca, setMarca] = useState('');
  const [model, setModel] = useState('');
  const [city, setCity] = useState('');
  const [yearMin, setYearMin] = useState('');
  const [transmission, setTransmission] = useState('');
  
  const [brandSearch, setBrandSearch] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const [brandCounts, setBrandCounts] = useState<Record<string, number>>({});
  const [totalResults, setTotalResults] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalResults = async () => {
      try {
        const conditions: any[] = [where('status', '==', 'active')];
        if (marca) conditions.push(where('marca', '==', marca));
        if (model) conditions.push(where('model', '==', model));
        if (city) conditions.push(where('city', '==', city));
        if (transmission) conditions.push(where('transmisie', '==', transmission));
        
        const q = query(collection(db, 'anuncios_auto'), ...conditions);
        const snapshot = await getCountFromServer(q);
        setTotalResults(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching total results:", error);
      }
    };
    fetchTotalResults();
  }, [marca, model, city, transmission]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts: Record<string, number> = {};
        const popBrands = category === 'Motociclete' ? POPULAR_MOTO_BRANDS 
          : category === 'Camioane' ? POPULAR_TRUCK_BRANDS
          : POPULAR_BRANDS;
        await Promise.all(popBrands.map(async (b) => {
          const q = query(
            collection(db, 'anuncios_auto'), 
            where('status', '==', 'active'), 
            where('marca', '==', b.dbName)
          );
          try {
            const snapshot = await getCountFromServer(q);
            counts[b.dbName] = snapshot.data().count;
          } catch(e) {
            counts[b.dbName] = 0;
          }
        }));
        setBrandCounts(counts);
      } catch (error) {
        console.error("Error fetching car counts:", error);
      }
    };
    fetchCounts();
  }, [category]);

  const availableModels = useMemo(() => {
    const modelsDict = category === 'Motociclete' ? MOTO_MODELS 
      : category === 'Camioane' ? TRUCK_MODELS
      : AUTO_MODELS;
    const brandKey = Object.keys(modelsDict).find(k => k.toLowerCase() === marca.toLowerCase());
    if (!brandKey) return [];
    return modelsDict[brandKey];
  }, [marca, category]);

  const filteredBrands = useMemo(() => {
    const term = brandSearch.toLowerCase();
    const sourceBrands = category === 'Motociclete' ? MOTO_BRANDS 
      : category === 'Camioane' ? TRUCK_BRANDS
      : AUTO_BRANDS;
    const popBrands = category === 'Motociclete' ? POPULAR_MOTO_BRANDS 
      : category === 'Camioane' ? POPULAR_TRUCK_BRANDS
      : POPULAR_BRANDS;
    
    const matches = sourceBrands.filter(b => b.toLowerCase().includes(term));
    
    const mapped = matches.map(brandName => {
      const popular = popBrands.find(p => p.dbName.toLowerCase() === brandName.toLowerCase());
      if (popular) return { name: brandName, isPopular: true, dbName: brandName };
      return { name: brandName, isPopular: false, dbName: brandName };
    });

    if (!term) {
      return mapped.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    return mapped;
  }, [brandSearch, category]);

  useEffect(() => {
    setBrandCounts(prev => {
      const missing = filteredBrands.filter(b => prev[b.dbName] === undefined);
      if (missing.length > 0) {
        missing.forEach(async (b) => {
          const q = query(
            collection(db, 'anuncios_auto'), 
            where('status', '==', 'active'), 
            where('marca', '==', b.dbName)
          );
          try {
            const snapshot = await getCountFromServer(q);
            setBrandCounts(p => ({ ...p, [b.dbName]: snapshot.data().count }));
          } catch(e) {
            setBrandCounts(p => ({ ...p, [b.dbName]: 0 }));
          }
        });
      }
      return prev;
    });
  }, [filteredBrands]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (marca) params.append('marca', marca.toLowerCase());
    if (model) params.append('model', model.toLowerCase());
    if (city) params.append('city', city);
    if (yearMin) params.append('an_min', yearMin);
    if (transmission) params.append('transmisie', transmission);
    
    router.push(`/auto?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden backdrop-blur-2xl bg-black/25 border border-white/10 pointer-events-auto">
      
      {/* Column 1: Categories */}
      <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10">
        <div className="p-3 border-b border-white/10 bg-white/5">
          <span className="text-white font-semibold text-sm px-3">Vehicul</span>
        </div>
        <ul className="h-64 overflow-y-auto no-scrollbar py-2 custom-scrollbar">
          {['Autoturisme', 'Motociclete', 'Camioane'].map((item) => {
            const getIcon = (cat: string) => {
              switch(cat) {
                case 'Autoturisme': return <CarFront size={16} />;
                case 'Motociclete': return <Bike size={16} />;
                case 'Camioane': return <Truck size={16} />;
                default: return <CarFront size={16} />;
              }
            };
            return (
              <li key={item}>
                <button 
                  onClick={() => {
                    setCategory(item);
                    setMarca('');
                    setModel('');
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                    category === item 
                      ? 'bg-[var(--primary)]/20 text-[#5ae4c0] font-medium border-l-3 border-[#5ae4c0]' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span className={category === item ? "text-[#5ae4c0]" : "text-white/50"}>
                    {getIcon(item)}
                  </span>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Column 2: Brands */}
      <div className="flex-[1.5] border-b md:border-b-0 md:border-r border-white/10 h-64 flex flex-col">
        <div className="p-3 border-b border-white/10 shrink-0">
          <div className="relative">
            <CarFront size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Caută marca..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#5ae4c0] transition-colors"
            />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto no-scrollbar py-2 custom-scrollbar">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brandObj) => {
              const b = brandObj.name;
              const urlName = b.toLowerCase().replace(/\s+/g, '-');
              const isPopular = brandObj.isPopular;
              const popBrands = category === 'Motociclete' ? POPULAR_MOTO_BRANDS 
                : category === 'Camioane' ? POPULAR_TRUCK_BRANDS
                : POPULAR_BRANDS;
              const logo = `https://www.carlogos.org/car-logos/${urlName}-logo.png`;
              
              return (
                <li key={b}>
                  <button 
                    onClick={() => {
                      setMarca(b);
                      setModel('');
                    }}
                    className={`w-full text-left px-6 py-2.5 text-sm transition-colors flex items-center justify-between gap-3 ${
                      marca === b 
                        ? 'bg-[var(--primary)]/20 text-[#5ae4c0] font-medium border-l-3 border-[#5ae4c0]' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-white/90 rounded-md p-1 flex items-center justify-center shrink-0 shadow-sm">
                        {imageErrors[b] ? (
                          category === 'Motociclete' ? <Bike size={16} className="text-slate-500" /> 
                          : category === 'Camioane' ? <Truck size={16} className="text-slate-500" /> 
                          : <CarFront size={16} className="text-slate-500" />
                        ) : (
                          <img 
                            src={isPopular ? popBrands.find(pb => pb.dbName === b)?.logo : logo} 
                            alt={b} 
                            className={`max-w-full max-h-full object-contain ${marca !== b && 'opacity-80 group-hover:opacity-100'}`}
                            onError={() => setImageErrors(prev => ({ ...prev, [b]: true }))}
                          />
                        )}
                      </div>
                      <span>{b}</span>
                    </div>
                    <span className="text-[12px] text-white/50 font-medium">
                      {brandCounts[b] !== undefined ? brandCounts[b] : '...'}
                    </span>
                  </button>
                </li>
              );
            })
          ) : (
            <li className="px-6 py-4 text-sm text-white/50">Nu am găsit nicio marcă.</li>
          )}
        </ul>
      </div>

      {/* Column 3: Filters & Action */}
      <div className="flex-[1.5] h-64 flex flex-col relative">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-white/60 font-bold uppercase tracking-wider">Model</label>
            <select 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!marca}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors disabled:opacity-50 appearance-none"
            >
              <option value="" className="text-gray-800">Toate modelele</option>
              {availableModels.map(m => (
                <option key={m} value={m} className="text-gray-800">{m}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            {/* Year */}
            <div className="flex-[0.8] space-y-1.5">
              <label className="text-[11px] text-white/60 font-bold uppercase tracking-wider">An Minim</label>
              <select 
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors appearance-none"
              >
                <option value="" className="text-gray-800">Oricare</option>
                {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y} className="text-gray-800">{y}</option>
                ))}
              </select>
            </div>
            
            {/* Transmission */}
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] text-white/60 font-bold uppercase tracking-wider">Transmisie</label>
              <select 
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors appearance-none"
              >
                <option value="" className="text-gray-800">Oricare</option>
                <option value="automata" className="text-gray-800">Automată</option>
                <option value="manuala" className="text-gray-800">Manuală</option>
              </select>
            </div>

            {/* City */}
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] text-white/60 font-bold uppercase tracking-wider">Locație</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                  type="text"
                  list="romania-cities"
                  placeholder="Caută orașul..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-8 pr-3 text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#5ae4c0] transition-colors"
                />
                <datalist id="romania-cities">
                  {ROMANIA_LOCATIONS.map((loc, index) => (
                    <option key={`${loc.name}-${loc.county || index}-${index}`} value={loc.name}>
                      {loc.name} {loc.isCounty ? '' : `(${loc.county})`}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button 
          onClick={handleSearch}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-4 font-bold text-lg transition-colors flex items-center justify-center gap-2 mt-auto"
        >
          CAUTĂ AUTO
          {totalResults !== null && (
            <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-sm font-black shadow-sm border border-white/10">
              {totalResults}
            </span>
          )}
        </button>
      </div>
      
    </div>
  );
}
