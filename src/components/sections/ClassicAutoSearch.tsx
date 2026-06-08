'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { AUTO_MODELS, AUTO_BRANDS, MOTO_MODELS, MOTO_BRANDS, VAN_MODELS, VAN_BRANDS, TRUCK_MODELS, TRUCK_BRANDS } from '@/constants/autoModels';
import { ROMANIA_LOCATIONS } from '@/constants/romaniaCities';
import { CarFront, Calendar, Search, Car, MapPin, Bike, Truck, CheckCircle2, X } from 'lucide-react';

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
  
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('auto-category-changed', { detail: category }));
  }, [category]);
  
  const [brandSearch, setBrandSearch] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const filteredCities = useMemo(() => {
    if (!city) return ROMANIA_LOCATIONS.slice(0, 15);
    const lowercaseQuery = city.toLowerCase();
    return ROMANIA_LOCATIONS.filter(c => 
      c.name.toLowerCase().includes(lowercaseQuery) || 
      (c.county && c.county.toLowerCase().includes(lowercaseQuery))
    ).slice(0, 15);
  }, [city]);
  
  const [brandCounts, setBrandCounts] = useState<Record<string, number>>({});
  const [totalResults, setTotalResults] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalResults = async () => {
      try {
        const domainFilter = category === 'Motociclete' ? 'moto' : category === 'Camioane' ? 'camioane' : 'auto';
        const conditions: any[] = [
          where('status', '==', 'active'),
          where('domain', '==', domainFilter)
        ];
        if (marca) conditions.push(where('marca', '==', marca));
        if (model) conditions.push(where('model', '==', model));
        const cleanCity = city ? city.split(',')[0].trim() : '';
        if (cleanCity) {
          const variations = Array.from(new Set([
            cleanCity,
            city,
            cleanCity.toLowerCase(),
            city.toLowerCase()
          ]));
          conditions.push(where('city', 'in', variations));
        }
        if (yearMin) conditions.push(where('anFabricatie', '>=', Number(yearMin)));
        if (transmission) conditions.push(where('transmisie', '==', transmission));
        
        const q = query(collection(db, 'anuncios_auto'), ...conditions);
        const snapshot = await getCountFromServer(q);
        setTotalResults(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching total results:", error);
      }
    };
    fetchTotalResults();
  }, [marca, model, city, transmission, category, yearMin]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const counts: Record<string, number> = {};
        const popBrands = category === 'Motociclete' ? POPULAR_MOTO_BRANDS 
          : category === 'Camioane' ? POPULAR_TRUCK_BRANDS
          : POPULAR_BRANDS;
        await Promise.all(popBrands.map(async (b) => {
          const domainFilter = category === 'Motociclete' ? 'moto' : category === 'Camioane' ? 'camioane' : 'auto';
          const q = query(
            collection(db, 'anuncios_auto'), 
            where('status', '==', 'active'), 
            where('domain', '==', domainFilter),
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
          const domainFilter = category === 'Motociclete' ? 'moto' : category === 'Camioane' ? 'camioane' : 'auto';
          const q = query(
            collection(db, 'anuncios_auto'), 
            where('status', '==', 'active'), 
            where('domain', '==', domainFilter),
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
    const cleanCity = city ? city.split(',')[0].trim() : '';
    if (cleanCity) params.append('city', cleanCity);
    if (yearMin) params.append('an_min', yearMin);
    if (transmission) params.append('transmisie', transmission);
    if (category === 'Motociclete') params.append('domain', 'moto');
    else if (category === 'Camioane') params.append('domain', 'camioane');
    else params.append('domain', 'auto');
    
    router.push(`/auto?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-xl backdrop-blur-2xl bg-black/25 border border-white/10 pointer-events-auto">
      
      {/* Column 1: Categories */}
      <div className="flex-1 md:flex-[0.7] border-b md:border-b-0 md:border-r border-white/10">
        <div className="p-3 border-b border-white/10 bg-white/5 hidden md:block">
          <span className="text-white font-semibold text-sm px-3">Vehicul</span>
        </div>
        <ul className="flex overflow-x-auto md:h-[19rem] md:flex-col md:overflow-y-auto no-scrollbar py-2 md:py-2 px-2 md:px-0 gap-2 md:gap-0 custom-scrollbar">
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
              <li key={item} className="shrink-0 md:shrink">
                <button 
                  onClick={() => {
                    setCategory(item);
                    setMarca('');
                    setModel('');
                  }}
                  className={`w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 md:px-6 py-2.5 text-[13px] md:text-sm transition-all rounded-full md:rounded-none ${
                    category === item 
                      ? 'bg-[var(--primary)] md:bg-[var(--primary)]/20 text-white md:text-[#5ae4c0] font-bold md:font-medium md:border-l-3 md:border-[#5ae4c0]' 
                      : 'bg-white/5 md:bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  <span className={category === item ? "text-white md:text-[#5ae4c0]" : "text-white/50"}>
                    {getIcon(item)}
                  </span>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Column 2: Brands (Desktop only) */}
      <div className="hidden md:flex flex-[1.7] border-r border-white/10 h-[19rem] flex-col">
        <div className="p-3 border-b border-white/10 shrink-0 flex gap-2">
          <div className="relative flex-[1.2]">
            <CarFront size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Caută marca..."
              value={marca || brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                if (marca) {
                  setMarca('');
                  setModel('');
                }
              }}
              className="w-full h-full bg-white/5 border border-white/10 rounded-lg py-3 pl-9 pr-8 text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#5ae4c0] transition-colors"
            />
            {marca && (
              <button
                type="button"
                onClick={() => {
                  setMarca('');
                  setModel('');
                  setBrandSearch('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 group z-10"
              >
                <CheckCircle2 size={14} className="text-[#5ae4c0] group-hover:hidden transition-all" />
                <X size={14} className="text-white/50 hover:text-white hidden group-hover:block transition-all" />
              </button>
            )}
          </div>
          <div className="relative flex-1">
            <select 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!marca}
              className="w-full h-full bg-white/5 border border-white/10 rounded-lg py-3 pl-3 pr-8 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors disabled:opacity-50 appearance-none"
            >
              <option value="" className="text-gray-800">Toate modelele</option>
              {availableModels.map(m => (
                <option key={m} value={m} className="text-gray-800">{m}</option>
              ))}
            </select>
            {model && (
              <button
                type="button"
                onClick={() => setModel('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 group z-10"
              >
                <CheckCircle2 size={14} className="text-[#5ae4c0] group-hover:hidden transition-all" />
                <X size={14} className="text-white/50 hover:text-white hidden group-hover:block transition-all" />
              </button>
            )}
          </div>
          <div className="relative flex-[0.8]">
            <select 
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
              className="w-full h-full bg-white/5 border border-white/10 rounded-lg py-3 pl-3 pr-8 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors appearance-none"
            >
              <option value="" className="text-gray-800">An Minim</option>
              {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y} className="text-gray-800">{y}</option>
              ))}
            </select>
            {yearMin && (
              <button
                type="button"
                onClick={() => setYearMin('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 group z-10"
              >
                <CheckCircle2 size={14} className="text-[#5ae4c0] group-hover:hidden transition-all" />
                <X size={14} className="text-white/50 hover:text-white hidden group-hover:block transition-all" />
              </button>
            )}
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
      <div className="flex-[1.5] md:h-[19rem] flex flex-col relative">
        <div className="flex-1 flex flex-col relative z-10">
          
          <div className="flex gap-4 shrink-0 mb-4 md:hidden p-4 pb-0">
            {/* Marca (Mobile Only) */}
            <div className="flex-1 space-y-1.5 md:hidden">
              <div className="relative">
                <select 
                  value={marca}
                  onChange={(e) => {
                    setMarca(e.target.value);
                    setModel('');
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-3 pr-8 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors appearance-none"
                >
                <option value="" className="text-gray-800">Toate mărcile</option>
                {filteredBrands.map(b => (
                  <option key={b.name} value={b.name} className="text-gray-800">
                    {b.name} {brandCounts[b.name] !== undefined ? `(${brandCounts[b.name]})` : ''}
                  </option>
                ))}
              </select>
                {marca && (
                  <button
                    type="button"
                    onClick={() => {
                      setMarca('');
                      setModel('');
                      setBrandSearch('');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 group z-10"
                  >
                    <CheckCircle2 size={14} className="text-[#5ae4c0] group-hover:hidden transition-all" />
                    <X size={14} className="text-white/50 hover:text-white hidden group-hover:block transition-all" />
                  </button>
                )}
              </div>
            </div>

            {/* Model */}
            <div className="flex-1 space-y-1.5 md:hidden">
              <div className="relative">
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!marca}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 md:py-2.5 pl-3 pr-8 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors disabled:opacity-50 appearance-none"
                >
                <option value="" className="text-gray-800">Toate modelele</option>
                {availableModels.map(m => (
                  <option key={m} value={m} className="text-gray-800">{m}</option>
                ))}
              </select>
                {model && (
                  <button
                    type="button"
                    onClick={() => setModel('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 group z-10"
                  >
                    <CheckCircle2 size={14} className="text-[#5ae4c0] group-hover:hidden transition-all" />
                    <X size={14} className="text-white/50 hover:text-white hidden group-hover:block transition-all" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 shrink-0 p-4 pt-0 md:p-3 md:border-b md:border-white/10 md:gap-2">
            {/* Year (Mobile Only) */}
            <div className="flex-[0.5] space-y-1.5 md:hidden">
              <div className="relative">
                <select 
                  value={yearMin}
                  onChange={(e) => setYearMin(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-3 pr-8 text-[13px] text-white focus:outline-none focus:border-[#5ae4c0] transition-colors appearance-none"
                >
                <option value="" className="text-gray-800">Oricare an</option>
                {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y} className="text-gray-800">{y}</option>
                ))}
              </select>
                {yearMin && (
                  <button
                    type="button"
                    onClick={() => setYearMin('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 group z-10"
                  >
                    <CheckCircle2 size={14} className="text-[#5ae4c0] group-hover:hidden transition-all" />
                    <X size={14} className="text-white/50 hover:text-white hidden group-hover:block transition-all" />
                  </button>
                )}
              </div>
            </div>
            
            {/* City Input */}
            <div className="flex-1 space-y-1.5">
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                  type="text"
                  placeholder="Caută orașul..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-full bg-white/5 border border-white/10 rounded-lg py-3 pl-9 pr-8 text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#5ae4c0] transition-colors"
                />
                {city && (
                  <button
                    type="button"
                    onClick={() => setCity('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 group z-10"
                  >
                    <CheckCircle2 size={14} className="text-[#5ae4c0] group-hover:hidden transition-all" />
                    <X size={14} className="text-white/50 hover:text-white hidden group-hover:block transition-all" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Locations List */}
          <div className="flex-1 overflow-hidden relative md:mx-0 mx-[-1rem]">
            <ul className="absolute inset-0 overflow-y-auto no-scrollbar py-2 custom-scrollbar border-t border-white/10 md:border-none">
              {filteredCities.map((loc, index) => (
                <li key={`${loc.name}-${loc.county || index}-${index}`}>
                  <button
                    type="button"
                    onClick={() => setCity(`${loc.name}, ${loc.county}`)}
                    className={`w-full text-left px-6 py-3 text-[14px] transition-colors flex items-center gap-3 border-b border-white/5 last:border-b-0 ${
                      city.includes(loc.name)
                        ? 'bg-[var(--primary)]/20 text-[#5ae4c0] font-medium border-l-3 border-[#5ae4c0]' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <MapPin size={16} className="text-[var(--primary)] shrink-0" />
                    <span className="truncate">
                      {loc.name}
                      {!loc.isCounty && loc.name !== loc.county && (
                        <span className="ml-1.5 opacity-50 font-normal">{loc.county}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Action Button */}
        <button 
          onClick={handleSearch}
          className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 md:py-4 font-bold text-[15px] md:text-lg transition-colors flex items-center justify-center gap-2 mt-2 md:mt-auto rounded-b-xl md:rounded-bl-none md:rounded-br-xl"
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
