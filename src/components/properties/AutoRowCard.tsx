'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Calendar, Fuel, Gauge, Tag, Camera, Sparkles } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import ContactModal from './ContactModal';

interface AutoRowCardProps {
  auto: any;
}

export default function AutoRowCard({ auto }: AutoRowCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [logo, setLogo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem('xmobe_user_logo');
    if (savedLogo) setLogo(savedLogo);

    const handleLogoChange = (e: CustomEvent) => {
      setLogo(e.detail);
    };

    window.addEventListener('user-logo-changed', handleLogoChange as EventListener);
    return () => window.removeEventListener('user-logo-changed', handleLogoChange as EventListener);
  }, []);

  const formattedNumber = new Intl.NumberFormat('ro-RO', {
    maximumFractionDigits: 0,
  }).format(auto.price || 0);

  const imagesLength = auto.images?.length || 1;
  const mainImage = auto.image || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600";

  let isNew = false;
  if (auto.createdAt) {
    let dateObj;
    if (typeof auto.createdAt === 'object' && 'seconds' in auto.createdAt) {
      dateObj = new Date((auto.createdAt as any).seconds * 1000);
    } else if (typeof auto.createdAt === 'number') {
      dateObj = new Date(auto.createdAt);
    } else {
      dateObj = new Date(auto.createdAt);
    }
    
    if (!isNaN(dateObj.getTime())) {
      isNew = (Date.now() - dateObj.getTime()) < 2 * 24 * 60 * 60 * 1000;
    }
  }

  return (
    <div 
      onClick={() => router.push(`/auto/${auto.slug || auto.id}`)}
      className="group block bg-white rounded-[24px] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.08)] transition-all hover:shadow-xl hover:-translate-y-1 relative border cursor-pointer border-transparent hover:border-gray-200"
    >
      {/* Promotion Ribbon */}
      {auto.promoType && (
        <div className="absolute top-6 -left-2 z-20">
          <div className="bg-[#0ea5e9] text-white px-3 py-1.5 rounded-r-lg shadow-md flex items-center gap-1.5 font-bold text-[13px]">
            <Tag size={14} /> Promovată
          </div>
          <div className="w-0 h-0 border-t-[6px] border-t-[#0284c7] border-l-[8px] border-l-transparent absolute top-full left-0"></div>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-[24px] [transform:translateZ(0)]">
        
        {/* Image Container */}
        <div className="relative aspect-[16/10] md:aspect-auto w-full md:w-[280px] lg:w-[340px] h-64 md:h-auto shrink-0 group/img bg-slate-900">
          <Image
            src={mainImage}
            alt={auto.title || 'Vehicul'}
            fill
            className="object-cover group-hover/img:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          
          {/* Top Badges */}
          <div className={`absolute left-4 flex flex-col gap-1.5 z-10 ${auto.promoType ? 'top-16' : 'top-4'}`}>
            <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit">
              {auto.year || 2022}
            </span>
            {isNew && (
              <span className="bg-[#139E69]/30 backdrop-blur-md border border-[#139E69]/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm w-fit">
                Nou
              </span>
            )}
            {auto.oldPrice && auto.oldPrice > auto.price && (
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 w-fit backdrop-blur-sm border border-white/20">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7l10 10M17 7v10H7"/></svg>
                Preț Redus
              </span>
            )}
            {auto.inPromotie && (
              <span className="bg-gradient-to-r from-rose-500 to-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/30 flex items-center gap-1.5 w-fit backdrop-blur-sm border border-white/20">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Promoție
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={(e) => toggleFavorite(auto.id, e)}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 shadow-sm hover:bg-white hover:text-rose-500 transition-colors group/fav"
            >
              <Heart size={18} fill={isFavorite(auto.id) ? "currentColor" : "transparent"} className={`transition-transform group-hover/fav:scale-110 ${isFavorite(auto.id) ? "text-rose-500" : ""}`} />
            </button>
          </div>

          <div className="absolute bottom-3 right-3 z-10">
            <div className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full flex items-center gap-1 text-[9px] font-bold border border-white/20 shadow-sm">
              <Camera size={9} />
              <span>{imagesLength}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative bg-white">
          
          {/* Agent Header */}
          <div className="h-10 bg-slate-100/80 px-5 flex items-center justify-between border-b border-slate-200/50">
            <Link href={`?agentProfile=${auto.agent?.id || 'anonimo'}`} scroll={false} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5 group/agent hover:opacity-80 transition-opacity">
              <div className="w-[22px] h-[22px] rounded-full overflow-hidden bg-white shrink-0 relative border border-slate-200 shadow-sm">
                {auto.agent?.image ? (
                  <Image src={auto.agent.image} fill className="object-cover" alt={auto.agent.name || 'Agent'} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-200">
                    {(auto.agent?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-tight">
                Publicat de <span className="font-bold text-slate-700 group-hover/agent:text-sky-600 transition-colors">{auto.agent?.name || 'Proprietar'}</span>
              </span>
            </Link>
            
            <div className="absolute top-2 right-5 z-20">
              <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center w-[85px] h-[55px] overflow-hidden transition-transform group-hover:scale-105 duration-500">
                <Image 
                  src={logo || "https://www.panter.ro/img/logo-dark.png"}
                  alt="Agency Logo"
                  width={65}
                  height={40}
                  unoptimized
                  className="object-contain"
                  onError={(e: any) => { e.target.src = "https://placehold.co/100x60/0284c7/ffffff?text=LOGO"; }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="space-y-1 mb-3">
               <div className="flex items-center gap-2 flex-wrap">
                 <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-baseline">
                   {formattedNumber} <span className="text-lg font-bold text-slate-500 ml-0.5">€</span>
                 </p>
                 {auto.oldPrice && auto.oldPrice > auto.price && (
                   <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md line-through">
                     {new Intl.NumberFormat('ro-RO').format(auto.oldPrice)} €
                   </span>
                 )}
               </div>
               <h3 className="text-sm md:text-base font-medium text-slate-500 leading-snug line-clamp-1">
                 {auto.title}
               </h3>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 font-bold text-[13px] mb-4">
              {auto.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{auto.location}</span>
                </div>
              )}
              {auto.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-slate-400" />
                  <span>{auto.year}</span>
                </div>
              )}
              {auto.mileage && auto.mileage !== '—' && (
                <div className="flex items-center gap-1.5">
                  <Gauge size={16} className="text-slate-400" />
                  <span>{auto.mileage} <span className="font-medium text-slate-400 text-xs lowercase">km</span></span>
                </div>
              )}
              {auto.fuel && (
                <div className="flex items-center gap-1.5">
                  <Fuel size={16} className="text-slate-400" />
                  <span>{auto.fuel}</span>
                </div>
              )}
            </div>

            <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-6">
              {auto.description || 'Descoperă mai multe detalii despre acest vehicul accesând pagina anunțului.'}
            </p>
            
            {/* Action Buttons - Horizontal Row Right Aligned */}
            <div className="flex items-center justify-end gap-3 mt-auto w-full">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="flex-1 max-w-[180px] bg-sky-500 text-white py-2.5 px-4 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.98]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Trimite mesaj
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${auto.agent?.phone || ''}`;
                }}
                className="flex-1 max-w-[140px] bg-emerald-50 text-emerald-700 py-2.5 px-4 rounded-xl font-bold text-[11px] uppercase tracking-wider border border-emerald-100 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-emerald-100 hover:border-emerald-200 hover:shadow-sm active:scale-[0.98]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Sună
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        propertyName={auto.title} 
      />
    </div>
  );
}
