'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AutoCard from '@/components/properties/AutoCard';
import { Search, CarFront, Calendar, Fuel, SlidersHorizontal, X, Loader2, LayoutGrid, List, MapPin, Gauge, Tag } from 'lucide-react';
import Link from 'next/link';


export default function AutoResultsContent() {
  const searchParams = useSearchParams();
  const [allAutos, setAllAutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Unified keyword search
  const [keyword, setKeyword] = useState(
    [searchParams.get('marca'), searchParams.get('model')].filter(Boolean).join(' ')
  );
  // Advanced filters
  const [yearMin, setYearMin] = useState(searchParams.get('an_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('pret_max') || '');
  const [combustibil, setCombustibil] = useState(searchParams.get('combustibil') || '');
  const [caroserie, setCaroserie] = useState('');
  const [transmisie, setTransmisie] = useState('');
  const [stare, setStare] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch all active autos once
  useEffect(() => {
    const fetchAutos = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'anuncios_auto'),
          where('status', '==', 'active')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllAutos(data);
      } catch (err) {
        console.error('Error fetching autos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAutos();
  }, []);

  // Client-side filtering with unified keyword
  const filtered = useMemo(() => {
    return allAutos.filter(auto => {
      // Keyword search — match against marca, model, city, an, combustibil, caroserie
      if (keyword.trim()) {
        const words = keyword.toLowerCase().split(/\s+/);
        const haystack = [
          auto.marca, auto.model, auto.city, auto.an,
          auto.combustibil, auto.caroserie, auto.culoare, auto.stare
        ].filter(Boolean).join(' ').toLowerCase();
        if (!words.every(w => haystack.includes(w))) return false;
      }
      // Advanced filters
      if (yearMin && Number(auto.an) < Number(yearMin)) return false;
      if (yearMax && Number(auto.an) > Number(yearMax)) return false;
      if (priceMin && Number(auto.price) < Number(priceMin)) return false;
      if (priceMax && Number(auto.price) > Number(priceMax)) return false;
      if (combustibil && (auto.combustibil || '').toLowerCase() !== combustibil.toLowerCase()) return false;
      if (caroserie && (auto.caroserie || '').toLowerCase() !== caroserie.toLowerCase()) return false;
      if (transmisie && (auto.transmisie || '').toLowerCase() !== transmisie.toLowerCase()) return false;
      if (stare && (auto.stare || '').toLowerCase() !== stare.toLowerCase()) return false;
      return true;
    });
  }, [allAutos, keyword, yearMin, yearMax, priceMin, priceMax, combustibil, caroserie, transmisie, stare]);

  const clearAll = () => {
    setKeyword(''); setYearMin(''); setYearMax(''); setPriceMin(''); setPriceMax(''); setCombustibil(''); setCaroserie(''); setTransmisie(''); setStare('');
  };

  const hasFilters = keyword || yearMin || priceMax || combustibil;

  // Map auto data for AutoCard
  const mapForCard = (auto: any) => ({
    id: auto.id,
    title: `${auto.marca || ''} ${auto.model || ''}`.trim() || 'Vehicul',
    price: Number(auto.price) || 0,
    oldPrice: auto.oldPrice ? Number(auto.oldPrice) : null,
    pretNegociabil: auto.pretNegociabil || false,
    year: auto.an || '',
    mileage: auto.rulaj ? Number(auto.rulaj).toLocaleString('ro-RO') : '—',
    fuel: auto.combustibil || '',
    transmission: auto.transmisie || auto.cutie || '',
    location: auto.city || '',
    image: auto.images?.[0] || '',
    promoType: auto.promoType || (auto.isPromoted ? 'standard' : null),
  });

  return (
    <div className="min-h-screen bg-[#f7f8fa] pt-[72px]">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">

          {/* Unified Search Bar — only visible in grid mode */}
          {viewMode === 'grid' && <div className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]/80 p-2 flex flex-col md:flex-row gap-2 mb-5">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-5 h-[56px] border-2 border-transparent focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-400/10 transition-all">
              <Search size={20} className="text-[#94a3b8] shrink-0" />
              <input
                type="text"
                placeholder="Caută: marcă, model, oraș, an... (ex: BMW Golf București 2020)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[#0f172a] font-bold text-[15px] placeholder:font-medium placeholder:text-[#94a3b8]"
              />
              {keyword && <button onClick={() => setKeyword('')} className="text-[#94a3b8] hover:text-[#334155] transition-colors"><X size={18} /></button>}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-[56px] px-6 rounded-xl font-bold text-[13px] transition-all flex items-center gap-2 shrink-0 ${
                showFilters || yearMin || priceMax || combustibil
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-white text-[#64748b] border border-[#e2e8f0] hover:bg-[#f1f5f9]'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filtre avansate
              {(yearMin || priceMax || combustibil) && <span className="w-5 h-5 bg-white/20 text-white rounded-full text-[10px] font-black flex items-center justify-center">{[yearMin, priceMax, combustibil].filter(Boolean).length}</span>}
            </button>
          </div>}

          {/* Advanced Filters — only in grid mode */}
          {viewMode === 'grid' && showFilters && (
            <div className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]/80 p-5 mb-5 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">An minim fabricație</label>
                  <select
                    value={yearMin}
                    onChange={(e) => setYearMin(e.target.value)}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-3 text-[13px] font-bold text-[#334155] focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none appearance-none"
                  >
                    <option value="">Orice an</option>
                    {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Preț maxim</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="ex: 15.000"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-3 pr-10 text-[13px] font-bold text-[#334155] focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] font-bold text-[13px]">€</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Combustibil</label>
                  <select
                    value={combustibil}
                    onChange={(e) => setCombustibil(e.target.value)}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl px-3.5 py-3 text-[13px] font-bold text-[#334155] focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none appearance-none"
                  >
                    <option value="">Orice combustibil</option>
                    <option value="Benzină">Benzină</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="GPL">GPL</option>
                  </select>
                </div>
              </div>
              {(yearMin || priceMax || combustibil) && (
                <button
                  onClick={() => { setYearMin(''); setPriceMax(''); setCombustibil(''); }}
                  className="mt-4 flex items-center gap-1.5 text-[12px] text-[#94a3b8] hover:text-rose-400 font-semibold transition-colors"
                >
                  <X size={13} /> Resetează filtrele avansate
                </button>
              )}
            </div>
          )}

          {/* Results count + active pills + view toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[#64748b] text-[14px] font-medium">
                {loading ? 'Se încarcă...' : (
                  <>
                    <strong className="text-[#0f172a]">{filtered.length}</strong> vehicul{filtered.length !== 1 ? 'e' : ''} găsit{filtered.length !== 1 ? 'e' : ''}
                  </>
                )}
              </p>
              {hasFilters && (
                <div className="flex flex-wrap gap-2 items-center sm:border-l sm:border-gray-200 sm:pl-4">
                  {keyword && (
                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-sky-100/60">
                      🔍 {keyword} <button onClick={() => setKeyword('')}><X size={11} /></button>
                    </span>
                  )}
                  {yearMin && (
                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-sky-100/60">
                      Din {yearMin} <button onClick={() => setYearMin('')}><X size={11} /></button>
                    </span>
                  )}
                  {priceMax && (
                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-sky-100/60">
                      Max {Number(priceMax).toLocaleString('ro-RO')} € <button onClick={() => setPriceMax('')}><X size={11} /></button>
                    </span>
                  )}
                  {combustibil && (
                    <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-sky-100/60">
                      {combustibil} <button onClick={() => setCombustibil('')}><X size={11} /></button>
                    </span>
                  )}
                  <button onClick={clearAll} className="text-[11px] text-[#94a3b8] hover:text-rose-400 font-semibold transition-colors underline">
                    Șterge tot
                  </button>
                </div>
              )}
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-[#f1f5f9] rounded-lg p-0.5 gap-0.5 self-start sm:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#94a3b8] hover:text-[#64748b]'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#94a3b8] hover:text-[#64748b]'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#94a3b8]">
            <Loader2 size={32} className="animate-spin mb-3" />
            <span className="font-bold text-[14px]">Se caută vehicule...</span>
          </div>
        ) : viewMode === 'grid' ? (
          filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mb-4">
                <CarFront size={28} className="text-[#94a3b8]" />
              </div>
              <h3 className="text-[18px] font-black text-[#334155] mb-2">Niciun vehicul găsit</h3>
              <p className="text-[#94a3b8] font-medium text-[14px] mb-4 max-w-md">
                Nu am găsit anunțuri care să corespundă criteriilor tale. Încearcă să modifici filtrele.
              </p>
              {hasFilters && (
                <button onClick={clearAll} className="bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-sky-600 transition-colors">
                  Resetează filtrele
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(auto => (
                <AutoCard key={auto.id} auto={mapForCard(auto)} />
              ))}
            </div>
          )
        ) : (
          /* LIST VIEW — sidebar always visible */
          <div className="flex gap-6">
            {/* Left Sidebar Filters */}
            <div className="w-[260px] shrink-0 hidden lg:block">
              <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-5 sticky top-[88px] space-y-5">
                <h3 className="text-[14px] font-black text-[#0f172a] flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-sky-500" />
                  Filtre avansate
                </h3>

                {/* Keyword search inside sidebar */}
                <div>
                  <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Căutare</label>
                  <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-transparent transition-all">
                    <Search size={14} className="text-[#94a3b8] shrink-0" />
                    <input
                      type="text"
                      placeholder="Marcă, model, oraș..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-[12px] font-bold text-[#334155] placeholder:font-medium placeholder:text-[#94a3b8]"
                    />
                    {keyword && <button onClick={() => setKeyword('')} className="text-[#94a3b8] hover:text-[#334155]"><X size={13} /></button>}
                  </div>
                </div>

                {/* Preț */}
                <div>
                  <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Preț (€)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                      className="w-1/2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-bold text-[#334155] outline-none focus:ring-2 focus:ring-sky-400" />
                    <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                      className="w-1/2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-bold text-[#334155] outline-none focus:ring-2 focus:ring-sky-400" />
                  </div>
                </div>

                {/* An */}
                <div>
                  <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">An fabricație</label>
                  <div className="flex gap-2">
                    <select value={yearMin} onChange={e => setYearMin(e.target.value)}
                      className="w-1/2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-2 text-[12px] font-bold text-[#334155] outline-none focus:ring-2 focus:ring-sky-400 appearance-none">
                      <option value="">De la</option>
                      {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={yearMax} onChange={e => setYearMax(e.target.value)}
                      className="w-1/2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-2 text-[12px] font-bold text-[#334155] outline-none focus:ring-2 focus:ring-sky-400 appearance-none">
                      <option value="">Până la</option>
                      {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* Combustibil */}
                <div>
                  <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Combustibil</label>
                  <select value={combustibil} onChange={e => setCombustibil(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-bold text-[#334155] outline-none focus:ring-2 focus:ring-sky-400 appearance-none">
                    <option value="">Orice</option>
                    <option value="Benzină">Benzină</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="GPL">GPL</option>
                  </select>
                </div>

                {/* Caroserie */}
                <div>
                  <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Caroserie</label>
                  <select value={caroserie} onChange={e => setCaroserie(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-bold text-[#334155] outline-none focus:ring-2 focus:ring-sky-400 appearance-none">
                    <option value="">Orice</option>
                    <option value="sedan">Sedan</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="suv">SUV</option>
                    <option value="break">Break / Wagon</option>
                    <option value="coupe">Coupé</option>
                    <option value="cabrio">Cabrio</option>
                    <option value="monovolum">Monovolum</option>
                    <option value="pickup">Pick-Up</option>
                    <option value="minivan">Minivan</option>
                  </select>
                </div>

                {/* Transmisie */}
                <div>
                  <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Transmisie</label>
                  <select value={transmisie} onChange={e => setTransmisie(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-bold text-[#334155] outline-none focus:ring-2 focus:ring-sky-400 appearance-none">
                    <option value="">Orice</option>
                    <option value="Manuală">Manuală</option>
                    <option value="Automată">Automată</option>
                    <option value="Semi-automată">Semi-automată</option>
                  </select>
                </div>

                {/* Stare */}
                <div>
                  <label className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1.5 block">Stare</label>
                  <div className="flex flex-col gap-1.5">
                    {['Nou', 'Rulat', 'Avariat'].map(s => (
                      <button key={s} onClick={() => setStare(stare === s ? '' : s)}
                        className={`text-left px-3 py-2 rounded-lg text-[12px] font-bold transition-all border ${
                          stare === s ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:border-[#cbd5e1]'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                {hasFilters && (
                  <button onClick={clearAll} className="w-full text-center text-[11px] text-[#94a3b8] hover:text-rose-400 font-semibold transition-colors pt-2 border-t border-[#f1f5f9]">
                    Resetează toate filtrele
                  </button>
                )}
              </div>
            </div>

            {/* List Results or Empty */}
            <div className="flex-1 flex flex-col gap-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-2xl border border-[#e2e8f0]/80">
                  <div className="w-14 h-14 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mb-3">
                    <CarFront size={24} className="text-[#94a3b8]" />
                  </div>
                  <h3 className="text-[16px] font-black text-[#334155] mb-1">Niciun vehicul găsit</h3>
                  <p className="text-[#94a3b8] font-medium text-[13px] max-w-sm">
                    Modifică filtrele din stânga pentru a găsi vehicule.
                  </p>
                </div>
              ) : filtered.map(auto => {
                const d = mapForCard(auto);
                return (
                  <Link key={auto.id} href={`/auto/${auto.id}`} className="bg-white rounded-2xl border border-[#e2e8f0]/80 hover:border-sky-200 hover:shadow-lg transition-all flex overflow-hidden group relative">
                    {/* Promotion Ribbon for List View */}
                    {auto.promoType && (
                      <div className="absolute top-4 left-0 z-20">
                        <div className="bg-[#0ea5e9] text-white px-3 py-1.5 rounded-r-lg shadow-md flex items-center gap-1.5 font-bold text-[12px]">
                          <Tag size={12} /> Promoción
                        </div>
                      </div>
                    )}
                    <div className="w-[260px] h-[180px] shrink-0 overflow-hidden bg-[#f1f5f9] relative">
                      {d.image ? (
                        <img src={d.image} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><CarFront size={40} className="text-[#cbd5e1]" /></div>
                      )}
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[17px] font-black text-[#0f172a] mb-1.5 group-hover:text-sky-600 transition-colors">{d.title}</h3>
                        <div className="flex items-center gap-4 text-[12px] text-[#64748b] font-medium mb-3">
                          {d.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-[#94a3b8]" />{d.location}</span>}
                          {d.year && <span className="flex items-center gap-1"><Calendar size={12} className="text-[#94a3b8]" />{d.year}</span>}
                          {d.fuel && <span className="flex items-center gap-1"><Fuel size={12} className="text-[#94a3b8]" />{d.fuel}</span>}
                          {d.mileage && d.mileage !== '—' && <span className="flex items-center gap-1"><Gauge size={12} className="text-[#94a3b8]" />{d.mileage} km</span>}
                        </div>
                        {d.transmission && <span className="inline-flex items-center bg-[#f1f5f9] text-[#475569] px-2.5 py-1 rounded-md text-[11px] font-bold">{d.transmission}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f1f5f9]">
                        <span className="text-[20px] font-black text-[#0f172a]">{d.price ? `${d.price.toLocaleString('ro-RO')} €` : '—'}</span>
                        {d.pretNegociabil && <span className="text-[11px] font-bold text-emerald-500">Negociabil</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
