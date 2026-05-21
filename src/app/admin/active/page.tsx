'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Building2, Car, MapPin, CalendarDays, Clock, Fuel, Gauge, LayoutGrid, Filter } from 'lucide-react';

type AdType = 'all' | 'imobiliare' | 'auto';

export default function ActiveAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AdType>('all');

  useEffect(() => {
    const fetchActiveAds = async () => {
      setLoading(true);
      try {
        const [imobSnap, autoSnap] = await Promise.all([
          getDocs(query(collection(db, 'anuncios'), where('status', '==', 'active'))),
          getDocs(query(collection(db, 'anuncios_auto'), where('status', '==', 'active')))
        ]);

        const imobAds = imobSnap.docs.map(d => ({
          id: d.id,
          _collection: 'anuncios',
          _domain: 'imobiliare' as const,
          ...d.data()
        }));
        const autoAds = autoSnap.docs.map(d => ({
          id: d.id,
          _collection: 'anuncios_auto',
          _domain: 'auto' as const,
          ...d.data()
        }));

        const all = [...imobAds, ...autoAds].sort((a, b) => {
          const aT = (a as any).createdAt?.seconds || 0;
          const bT = (b as any).createdAt?.seconds || 0;
          return bT - aT;
        });

        setAds(all);
      } catch (err) {
        console.error('Error fetching active ads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAds();
  }, []);

  const getExpiryDate = (ad: any) => {
    if (!ad.createdAt?.seconds) return null;
    const created = new Date(ad.createdAt.seconds * 1000);
    const expiry = new Date(created);
    expiry.setDate(expiry.getDate() + 30);
    return expiry;
  };

  const getDaysLeft = (ad: any) => {
    const expiry = getExpiryDate(ad);
    if (!expiry) return null;
    const now = new Date();
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const filteredAds = ads.filter(ad => {
    if (filter === 'all') return true;
    return ad._domain === filter;
  });

  const imobCount = ads.filter(a => a._domain === 'imobiliare').length;
  const autoCount = ads.filter(a => a._domain === 'auto').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Anunțuri Active</h2>
          <p className="text-slate-500 mt-1">Toate anunțurile active cu data de expirare.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-emerald-100">
            <Building2 size={16} /> {imobCount} Imobiliare
          </div>
          <div className="bg-sky-50 text-sky-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-sky-100">
            <Car size={16} /> {autoCount} Auto
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {([
          { id: 'all' as AdType, label: 'Toate', count: ads.length, color: 'slate' },
          { id: 'imobiliare' as AdType, label: 'Imobiliare', count: imobCount, icon: Building2, color: 'emerald' },
          { id: 'auto' as AdType, label: 'Auto', count: autoCount, icon: Car, color: 'sky' },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 ${
              filter === tab.id
                ? tab.id === 'auto' 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : tab.id === 'imobiliare'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-white shadow-lg'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
              filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p>Se încarcă anunțurile...</p>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 border-dashed">
          <p className="text-slate-500 text-lg font-medium">Niciun anunț activ în această categorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAds.map((ad) => {
            const isAuto = ad._domain === 'auto';
            const daysLeft = getDaysLeft(ad);
            const expiryDate = getExpiryDate(ad);
            const isExpiringSoon = daysLeft !== null && daysLeft <= 5;
            const createdDate = ad.createdAt?.seconds 
              ? new Date(ad.createdAt.seconds * 1000).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—';
            const expiryStr = expiryDate 
              ? expiryDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—';

            return (
              <div
                key={ad.id}
                className={`bg-white rounded-2xl border overflow-hidden flex flex-col sm:flex-row transition-all duration-300 ${
                  isAuto 
                    ? 'border-sky-100 hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.12)]' 
                    : 'border-slate-100 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Image */}
                <div className="relative w-full sm:w-[180px] h-36 sm:h-auto flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&h=300&q=80'}
                    alt="Ad"
                    className="w-full h-full object-cover"
                  />
                  {/* Domain badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1 shadow-lg backdrop-blur-md ${
                      isAuto ? 'bg-sky-500/90' : 'bg-emerald-500/90'
                    }`}>
                      {isAuto ? <><Car size={10} /> Auto</> : <><Building2 size={10} /> Imob</>}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-[16px] font-black text-slate-800 leading-tight truncate">
                      {isAuto 
                        ? `${ad.marca || 'Vehicul'} ${ad.model || ''}` 
                        : `${ad.propertyType || ad.type || 'Proprietate'} — ${ad.operation || 'vânzare'}`
                      }
                    </h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mt-1">
                      <MapPin size={12} className={isAuto ? 'text-sky-400' : 'text-emerald-400'} />
                      {ad.location?.localitate || ad.location?.city || ad.city || '—'}
                    </div>
                    {/* Meta badges */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {isAuto ? (
                        <>
                          {ad.an && <span className="flex items-center gap-1 bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md"><CalendarDays size={10} /> {ad.an}</span>}
                          {ad.combustibil && <span className="flex items-center gap-1 bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md"><Fuel size={10} /> {ad.combustibil}</span>}
                          {ad.rulaj && <span className="flex items-center gap-1 bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md"><Gauge size={10} /> {Number(ad.rulaj).toLocaleString()} km</span>}
                        </>
                      ) : (
                        <>
                          {ad.area && <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md"><LayoutGrid size={10} /> {ad.area} m²</span>}
                          {ad.rooms && <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">{ad.rooms} cam</span>}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className={`text-[20px] font-black whitespace-nowrap px-3 py-1.5 rounded-xl border shrink-0 ${
                    isAuto 
                      ? 'text-sky-600 bg-sky-50 border-sky-100' 
                      : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                  }`}>
                    {ad.price ? `${Number(ad.price).toLocaleString('ro-RO')} €` : 'Consultă'}
                  </div>

                  {/* Expiry */}
                  <div className={`flex flex-col items-center px-5 py-3 rounded-xl border shrink-0 min-w-[130px] ${
                    isExpiringSoon 
                      ? 'bg-red-50 border-red-100' 
                      : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={12} className={isExpiringSoon ? 'text-red-400' : 'text-slate-400'} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isExpiringSoon ? 'text-red-500' : 'text-slate-500'}`}>
                        Expiră
                      </span>
                    </div>
                    <span className={`text-[14px] font-black ${isExpiringSoon ? 'text-red-600' : 'text-slate-700'}`}>
                      {expiryStr}
                    </span>
                    {daysLeft !== null && (
                      <span className={`text-[10px] font-bold mt-0.5 ${
                        isExpiringSoon ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {daysLeft === 0 ? 'Expiră azi!' : `${daysLeft} zile rămase`}
                      </span>
                    )}
                  </div>

                  {/* Created date */}
                  <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 shrink-0 min-w-[110px]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CalendarDays size={12} className="text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Publicat
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-slate-600">
                      {createdDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      {!loading && ads.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-500">
            Total: <span className="text-slate-800">{ads.length}</span> anunțuri active
          </span>
          <div className="flex gap-4 text-[12px] font-bold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <Building2 size={14} /> {imobCount} Imobiliare
            </span>
            <span className="flex items-center gap-1.5 text-sky-600">
              <Car size={14} /> {autoCount} Auto
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
