'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Heart, Calendar, Gauge, Fuel, Cog, Tag } from 'lucide-react';

interface AutoCardProps {
  auto: any;
}

export default function AutoCard({ auto }: AutoCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE').format(price);
  };

  return (
    <Link href={`/auto/${auto.id}`} className="block h-full">
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
            <Tag size={14} /> Promoción
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
          {auto.oldPrice && auto.oldPrice > auto.price && (
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 w-fit backdrop-blur-sm border border-white/20">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7l10 10M17 7v10H7"/></svg>
              Preț Redus
            </span>
          )}
        </div>

        <button className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white text-white hover:text-red-500 transition-colors shadow-sm">
          <Heart size={18} strokeWidth={2.5} />
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
          {auto.location || "București, Sector 1"}
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
            <span className="text-[12px] font-bold">{auto.transmission || "Automată"}</span>
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
              {auto.oldPrice && auto.oldPrice > auto.price && (
                <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md line-through">
                  {formatPrice(auto.oldPrice)} €
                </span>
              )}
            </div>
            {auto.pretNegociabil && (
              <span className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider mt-0.5 block">Negociabil</span>
            )}
          </div>
        </div>
      </div>
      </div>
    </motion.div>
    </Link>
  );
}
