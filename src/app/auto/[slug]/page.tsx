'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AutoContactCard from '@/components/properties/AutoContactCard';
import PropertyGallery from '@/components/properties/PropertyGallery';
import { MapPin, Calendar, Gauge, Fuel, Cog, Car, Heart, Share2, CheckCircle2, Loader2, AlertTriangle, Eye, Flag, Users } from 'lucide-react';

export default function AutoDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [auto, setAuto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchAuto = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'anuncios_auto', slug);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setAuto({ id: snap.id, ...snap.data() });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching auto:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAuto();
  }, [slug]);

  // Live viewer counter that fluctuates
  const [liveViewers, setLiveViewers] = useState(Math.floor(Math.random() * 10) + 3);
  const [liveFavorites, setLiveFavorites] = useState(Math.floor(Math.random() * 15) + 5);
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setLiveViewers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, Math.min(18, prev + change));
      });
    }, Math.floor(Math.random() * 4000) + 4000);
    const favInterval = setInterval(() => {
      setLiveFavorites(prev => prev + 1);
    }, Math.floor(Math.random() * 20000) + 25000);
    return () => { clearInterval(viewerInterval); clearInterval(favInterval); };
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] pt-[72px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 size={40} className="animate-spin" />
          <span className="font-bold">Se încarcă anunțul...</span>
        </div>
      </div>
    );
  }

  if (error || !auto) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] pt-[72px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500 bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <AlertTriangle size={40} className="text-amber-400" />
          <h2 className="text-xl font-black text-gray-800">Anunțul nu a fost găsit</h2>
          <p className="text-gray-500 font-medium">Este posibil să fi fost șters sau să nu existe.</p>
          <Link href="/" className="mt-4 bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
            Înapoi acasă
          </Link>
        </div>
      </div>
    );
  }

  const title = `${auto.marca || ''} ${auto.model || ''}`.trim() || 'Vehicul';
  const price = Number(auto.price) || 0;
  const images = auto.images?.length > 0 ? auto.images : [
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
  ];
  const createdDate = auto.createdAt?.seconds
    ? new Date(auto.createdAt.seconds * 1000).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div 
      className="bg-[#f4f4f4] min-h-screen pt-[72px]"
      style={{ 
        backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 11 50 11c-10.639 0-16.035 2.333-25.753 5.928H0v3h21.184zM0 16.5c2.493-.726 5.12-1.688 8.214-2.922C16.88 10.457 21.6 8 30 8c8.397 0 13.12 2.457 21.786 5.578C54.88 14.812 57.507 15.773 60 16.5h40V0H0v16.5z' fill='%23000000' fill-opacity='0.025' fill-rule='evenodd'/%3E%3C/svg%3E')",
        backgroundSize: "80px 16px"
      }}
    >
      <div className="bg-white w-full border-b border-gray-200 pb-12 pt-4">
        <div className="container mx-auto px-6">
          
          {/* Breadcrumbs & Top Actions */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
              <Link href="/" className="hover:text-[var(--primary)] transition-colors">imoob</Link>
              <span className="text-gray-300">/</span>
              <Link href="/" className="hover:text-[var(--primary)] transition-colors">Auto</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400 truncate">{title}</span>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-600 hover:text-[var(--primary)] transition-colors">
                <Share2 size={18} /> Distribuie
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-600 hover:text-red-500 transition-colors">
                <Heart size={18} /> Salvează
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 mb-0">
            
            {/* LEFT COLUMN: Info Panel */}
            <div className="w-full lg:w-[540px] xl:w-[620px] shrink-0 order-2 lg:order-1 flex flex-col pt-6 lg:pt-8 px-6 lg:px-8 pb-6 lg:pb-8 rounded-3xl" style={{ backgroundColor: "#F8FAF7" }}>
              <h1 className="text-[28px] lg:text-[34px] font-black text-[#1a1a1a] leading-[1.15] tracking-tight mb-4 capitalize">
                {title}
              </h1>
              
              <div className="flex items-center gap-2 text-[#64748b] mb-6">
                <MapPin size={16} strokeWidth={2} className="text-[#94a3b8]" />
                <span className="text-[14px] font-medium">{auto.city || '—'}</span>
              </div>
              
              {/* Meta pills */}
              <div className="flex items-center flex-wrap gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide">
                  ID #{auto.id?.slice(0, 8).toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide">
                  <Calendar size={12} className="text-[#94a3b8]" />
                  {createdDate}
                </span>
                {auto.stare && (
                  <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide">
                    <Car size={12} /> {auto.stare}
                  </span>
                )}
              </div>

              <hr className="w-full border-t border-[#e2e8f0]/80 mb-8" />

              <div className="mb-8">
                <div className="flex items-center gap-3.5 flex-wrap">
                  <h2 className="text-[34px] font-black text-[#0f172a] tracking-tight leading-none">
                    {new Intl.NumberFormat('ro-RO').format(price)} €
                  </h2>
                  {auto.oldPrice && Number(auto.oldPrice) > price && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-bold text-gray-400 line-through">
                        {new Intl.NumberFormat('ro-RO').format(Number(auto.oldPrice))} €
                      </span>
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full tracking-widest uppercase flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 backdrop-blur-sm border border-white/20">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7l10 10M17 7v10H7"/></svg>
                        Preț Redus
                      </span>
                    </div>
                  )}
                </div>
                {auto.pretNegociabil && (
                  <p className="text-[13px] text-[var(--primary)] font-semibold mt-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Preț negociabil
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {auto.rulaj && (
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-[#e2e8f0]/60">
                    <Gauge size={18} strokeWidth={1.5} className="text-[#94a3b8]" />
                    <span className="text-[13px] font-bold text-[#334155]">{Number(auto.rulaj).toLocaleString('ro-RO')} km</span>
                  </div>
                )}
                {auto.combustibil && (
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-[#e2e8f0]/60">
                    <Fuel size={18} strokeWidth={1.5} className="text-[#94a3b8]" />
                    <span className="text-[13px] font-bold text-[#334155]">{auto.combustibil}</span>
                  </div>
                )}
                {auto.transmisie && (
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-[#e2e8f0]/60">
                    <Cog size={18} strokeWidth={1.5} className="text-[#94a3b8]" />
                    <span className="text-[13px] font-bold text-[#334155]">{auto.transmisie}</span>
                  </div>
                )}
                {auto.an && (
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-[#e2e8f0]/60">
                    <Calendar size={18} strokeWidth={1.5} className="text-[#94a3b8]" />
                    <span className="text-[13px] font-bold text-[#334155]">An: {auto.an}</span>
                  </div>
                )}
                {auto.putere && (
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-[#e2e8f0]/60">
                    <span className="text-[#94a3b8] text-base">⚡</span>
                    <span className="text-[13px] font-bold text-[#334155]">{auto.putere} CP</span>
                  </div>
                )}
                {auto.caroserie && (
                  <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-[#e2e8f0]/60">
                    <Car size={18} strokeWidth={1.5} className="text-[#94a3b8]" />
                    <span className="text-[13px] font-bold text-[#334155] capitalize">{auto.caroserie}</span>
                  </div>
                )}
              </div>

              {/* Live Stats & Report */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0]/60 p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  {/* Live viewers */}
                  <div className="flex items-center gap-2.5 bg-[#f0f9ff] px-3.5 py-2 rounded-xl">
                    <div className="relative">
                      <Eye size={15} className="text-[#0ea5e9]" />
                      <span className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] bg-emerald-400 rounded-full animate-pulse ring-2 ring-[#f0f9ff]" />
                    </div>
                    <span className="text-[12px] font-bold text-[#0c4a6e]">{liveViewers} <span className="text-[#64748b] font-medium">văd acum</span></span>
                  </div>
                  {/* Favorites */}
                  <div className="flex items-center gap-2.5 bg-[#fef2f2] px-3.5 py-2 rounded-xl">
                    <Heart size={14} className="text-rose-400" fill="#fb7185" />
                    <span className="text-[12px] font-bold text-[#9f1239]">{liveFavorites} <span className="text-[#64748b] font-medium">favorite</span></span>
                  </div>
                </div>
                {/* Report */}
                <button className="flex items-center gap-1.5 text-[11px] text-[#94a3b8] hover:text-rose-400 font-semibold transition-colors group uppercase tracking-wider">
                  <Flag size={12} className="group-hover:text-rose-400 transition-colors" />
                  Raportează
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Gallery */}
            <div className="w-full flex-1 order-1 lg:order-2">
              <PropertyGallery 
                images={images} 
                title={title} 
                agent={{
                  name: auto.name || 'Proprietar',
                  phone: auto.phone || '',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
                  role: 'Proprietar'
                }}
                propertyInfo={{
                  price: `${new Intl.NumberFormat('ro-RO').format(price)} €`,
                  size: auto.rulaj ? `${Number(auto.rulaj).toLocaleString('ro-RO')} km` : '—',
                  location: auto.city || '—'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-6">

            {/* Description */}
            {auto.description && (
              <div className="bg-white p-8 rounded-[20px] border border-gray-100/80">
                <h3 className="text-[20px] font-black text-[#1e293b] mb-4 tracking-tight">Descriere vehicul</h3>
                <p className="text-[#475569] leading-[1.8] font-medium whitespace-pre-line text-[15px]">
                  {auto.description}
                </p>
              </div>
            )}

            {/* Technical Specs — refined grid */}
            <div className="bg-white p-8 rounded-[20px] border border-gray-100/80">
              <h3 className="text-[20px] font-black text-[#1e293b] mb-8 tracking-tight">Specificații Tehnice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {[
                  auto.marca && ['Marcă', auto.marca],
                  auto.model && ['Model', auto.model],
                  auto.an && ['An fabricație', auto.an],
                  auto.motor && ['Capacitate motor', `${auto.motor} cm³`],
                  auto.putere && ['Putere', `${auto.putere} CP`],
                  auto.combustibil && ['Combustibil', auto.combustibil],
                  auto.transmisie && ['Cutie viteze', auto.transmisie],
                  auto.caroserie && ['Tip Caroserie', auto.caroserie],
                  auto.culoare && ['Culoare', auto.culoare],
                  auto.rulaj && ['Rulaj', `${Number(auto.rulaj).toLocaleString('ro-RO')} km`],
                  auto.stare && ['Stare', auto.stare],
                ].filter(Boolean).map((item, idx) => {
                  const [label, value] = item as [string, string];
                  return (
                    <div key={idx} className="flex justify-between items-center py-4 px-5 border-b border-gray-100/80 hover:bg-[#f8fafc] transition-colors group">
                      <span className="text-[14px] text-[#94a3b8] font-medium group-hover:text-[#64748b] transition-colors">{label}</span>
                      <span className="text-[14px] text-[#0f172a] font-bold capitalize">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evoluția ofertei — Price Stats */}
            <div className="bg-white p-8 rounded-[20px] border border-gray-100/80">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-[#1e293b] tracking-tight">Evoluția ofertei vânzătorului</h3>
                  <p className="text-[12px] text-[#94a3b8] font-medium">Cum s-a schimbat prețul de la prima listare până azi</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-gray-100/60">
                  <span className="text-[18px] font-black text-[#0f172a] block">{new Intl.NumberFormat('ro-RO').format(price)} €</span>
                  <span className="text-[12px] text-[#94a3b8] font-medium">Preț inițial</span>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-gray-100/60">
                  <span className="text-[18px] font-black text-[#0f172a] block">{new Intl.NumberFormat('ro-RO').format(price)} €</span>
                  <span className="text-[12px] text-[#94a3b8] font-medium">Preț curent</span>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-gray-100/60">
                  <span className="text-[18px] font-black text-[#0f172a] block">Fara reducere</span>
                  <span className="text-[12px] text-[#94a3b8] font-medium">Reducere</span>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-4 border border-gray-100/60">
                  <span className="text-[18px] font-black text-[#0f172a] block">
                    {auto.createdAt?.seconds ? Math.max(1, Math.ceil((Date.now() / 1000 - auto.createdAt.seconds) / 86400)) : '—'} zile
                  </span>
                  <span className="text-[12px] text-[#94a3b8] font-medium">Pe piață</span>
                </div>
              </div>
            </div>

            {/* Features */}
            {auto.features?.length > 0 && (
              <div className="bg-white p-8 rounded-[20px] border border-gray-100/80">
                <h3 className="text-[20px] font-black text-[#1e293b] mb-6 tracking-tight">Dotări</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {auto.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#f8fafc] border border-gray-100/60 hover:border-[var(--primary)]/20 hover:bg-emerald-50/30 transition-colors">
                      <CheckCircle2 size={15} className="text-[var(--primary)] shrink-0" />
                      <span className="text-[#334155] font-medium text-[13px]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-5">
             <AutoContactCard seller={{
               name: auto.name || 'Proprietar',
               phone: auto.phone || '',
               email: auto.email || '',
               type: auto.tipVanzator || 'particular',
               memberSince: auto.createdAt?.seconds ? new Date(auto.createdAt.seconds * 1000).getFullYear().toString() : '2026'
             }} />
             {/* Safety Tips */}
             <div className="bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] p-6 rounded-[20px] border border-emerald-100/60">
                <h4 className="font-bold text-[#1e293b] mb-3 flex items-center gap-2.5 text-[15px]">
                  <div className="w-7 h-7 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={15} className="text-[var(--primary)]" />
                  </div>
                  Sfaturi de siguranță
                </h4>
                <p className="text-[13px] text-[#64748b] font-medium leading-relaxed">
                  Nu trimite niciodată bani în avans. Verifică întotdeauna autovehiculul în persoană și seria de șasiu (VIN) înainte de a face o plată.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
