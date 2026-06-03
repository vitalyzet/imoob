'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Heart, Calendar, Gauge, Fuel, Cog, Tag, Sparkles } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface AutoCardProps {
  auto: any;
}

export default function AutoCard({ auto }: AutoCardProps) {
  const [style, setStyle] = React.useState<'classic' | 'professional'>('classic');
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(auto.id);

  React.useEffect(() => {
    const savedStyle = localStorage.getItem('propertyCardStyle') as 'classic' | 'professional';
    if (savedStyle) setStyle(savedStyle);

    const handleStyleChange = (e: CustomEvent) => {
      setStyle(e.detail);
    };

    window.addEventListener('card-style-changed', handleStyleChange as EventListener);
    
    return () => {
      window.removeEventListener('card-style-changed', handleStyleChange as EventListener);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE').format(price);
  };

  let formattedDate = '';
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
      formattedDate = dateObj.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
      isNew = (Date.now() - dateObj.getTime()) < 2 * 24 * 60 * 60 * 1000;
    }
  }

  if (style === 'classic') {
    return (
      <Link href={`/auto/${auto.slug || auto.id}`} className="block h-full">
        <div className="group bg-white border border-gray-200 rounded-[16px] overflow-hidden hover:shadow-lg transition-all duration-300 relative flex flex-col h-full">
          <div className="relative h-56 w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={auto.image || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600"}
              alt={auto.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute top-3 right-3 z-20">
              <button 
                onClick={(e) => toggleFavorite(auto.id, e)}
                className={`w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform ${isFav ? 'text-red-500' : 'text-gray-900 hover:text-red-500'}`}
              >
                <Heart size={18} strokeWidth={2} className={isFav ? "fill-current text-red-500" : ""} />
              </button>
            </div>

            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {isNew && (
                <span className="bg-[#139E69]/30 backdrop-blur-md border border-[#139E69]/50 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm w-fit">
                  Nou
                </span>
              )}
              {auto.oldPrice && Number(auto.oldPrice) > Number(auto.price) && (
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm flex items-center gap-1 w-fit">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7l10 10M17 7v10H7"/></svg>
                  Preț Redus
                </span>
              )}
              {auto.inPromotie && (
                <span className="bg-gradient-to-r from-rose-500 to-red-500 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm flex items-center gap-1 w-fit">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Promoție
                </span>
              )}
            </div>
            
            {auto.promoType && (
              <div className="absolute bottom-3 left-3 z-10">
                <span className="bg-[#0ea5e9]/95 text-white px-3 py-1 text-[11px] font-bold rounded-lg shadow-sm border border-white/20 uppercase tracking-widest">
                  Promovată
                </span>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-gray-900 text-[16px] line-clamp-2 mb-1 uppercase tracking-tight leading-tight group-hover:text-[var(--primary)] transition-colors">
              {auto.title || "BMW Seria 3 320d"}
            </h3>
            
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-3 line-clamp-1 mt-1">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{auto.location || auto.city || "Nespecificat"}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500 text-[13px] mb-4 truncate">
              <span>{auto.year || "2022"}</span>
              <span className="text-gray-300">•</span>
              <span>{auto.mileage || "125.000"} km</span>
              <span className="text-gray-300">•</span>
              <span>{auto.fuel || "Diesel"}</span>
              <span className="text-gray-300">•</span>
              <span className="truncate">{auto.transmisie || auto.transmission || "Nespecificat"}</span>
            </div>
            
            <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
              <div className="text-[20px] font-black text-gray-900 flex items-baseline gap-2">
                <div>{formatPrice(auto.price || 24500)} <span className="text-[16px]">€</span></div>
                {auto.oldPrice && Number(auto.oldPrice) > Number(auto.price) && (
                  <span className="text-[12px] text-gray-400 line-through ml-2 font-medium">
                    {formatPrice(auto.oldPrice)} €
                  </span>
                )}
              </div>
              {formattedDate && (
                <div className="text-[12px] text-gray-400 font-medium">
                  {formattedDate}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/auto/${auto.slug || auto.id}`} className="block h-full">
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[24px] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col relative"
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

      {/* Inner wrapper to contain overflow without cutting the outer ribbon */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-[24px] [transform:translateZ(0)]">
        {/* Imagen Header */}
        <div className="relative h-56 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={auto.image || "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600"} 
          alt={auto.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
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
          {auto.oldPrice && Number(auto.oldPrice) > Number(auto.price) && (
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

        <button 
          onClick={(e) => toggleFavorite(auto.id, e)}
          className={`absolute top-4 right-4 z-10 w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm ${isFav ? 'bg-white text-red-500' : 'bg-white/40 text-white hover:text-red-500'}`}
        >
          <Heart size={18} strokeWidth={2.5} className={isFav ? "fill-current text-red-500" : ""} />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-[18px] text-gray-900 leading-tight mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {auto.title || "BMW Seria 3 320d M Sport"}
        </h3>
        
        <p className="text-gray-500 text-[13px] font-medium flex items-center gap-1.5 mb-4 truncate">
          <MapPin size={14} className="text-gray-400" />
          {auto.location || auto.city || "Nespecificat"}
        </p>

        {/* Tech Specs */}
        <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Gauge size={16} className="text-gray-400" />
            <span className="text-[12px] font-bold">{auto.mileage || "125.000"} km</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Fuel size={16} className="text-gray-400" />
            <span className="text-[12px] font-bold">{auto.fuel || "Diesel"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Cog size={16} className="text-gray-400" />
            <span className="text-[12px] font-bold">{auto.transmisie || auto.transmission || "Nespecificat"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-[12px] font-bold">{auto.year || "2022"}</span>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 mb-4"></div>

        {/* Footer: Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Preț</span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-gray-900 tracking-tight">{formatPrice(auto.price || 24500)}</span>
                <span className="text-lg font-bold text-gray-500">€</span>
              </div>
              {auto.oldPrice && Number(auto.oldPrice) > Number(auto.price) && (
                <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md line-through">
                  {formatPrice(auto.oldPrice)} €
                </span>
              )}
            </div>
            {auto.pretNegociabil && (
              <span className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider mt-0.5 block">Negociabil</span>
            )}
          </div>
          {formattedDate && (
            <div className="text-[12px] text-gray-400 font-medium text-right self-end pb-1">
              {formattedDate}
            </div>
          )}
        </div>
      </div>
      </div>
    </motion.div>
    </Link>
  );
}
