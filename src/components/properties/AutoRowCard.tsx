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
    const savedLogo = localStorage.getItem('vindu24_user_logo');
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
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer overflow-hidden flex flex-col md:flex-row relative"
    >
      {/* Promotion Ribbon */}
      {auto.promoType && (
        <div className="absolute top-4 -left-2 z-20">
          <div className="bg-[#0ea5e9] text-white px-3 py-1 rounded-r-lg shadow-md flex items-center gap-1.5 font-bold text-[11px]">
            <Tag size={12} /> Promovată
          </div>
          <div className="w-0 h-0 border-t-[6px] border-t-[#0284c7] border-l-[8px] border-l-transparent absolute top-full left-0"></div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full md:w-[32%] lg:w-[28%] aspect-[16/10] md:aspect-auto md:min-h-[200px] shrink-0 bg-slate-900 group/img">
        <Image
          src={mainImage}
          alt={auto.title || 'Vehicul'}
          fill
          className="object-cover group-hover/img:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        
        {/* Top-left Badge (Year) */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg">
            {auto.year || 2022}
          </div>
        </div>

        {/* Top-right Badge (Favorite) */}
        <div className="absolute top-3 right-3 z-20">
          <button 
            onClick={(e) => toggleFavorite(auto.id, e)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-md hover:scale-110 transition-transform"
          >
            <Heart size={16} fill={isFavorite(auto.id) ? "currentColor" : "transparent"} />
          </button>
        </div>

        {/* Bottom-right Badge (Photos count) */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
            <Camera size={11} />
            <span>{imagesLength}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        
        {/* Header - Agent Info */}
        <div className="h-10 bg-slate-50/50 px-4 flex items-center justify-between border-b border-gray-100">
          <Link href={`?agentProfile=${auto.agent?.id || 'anonimo'}`} scroll={false} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 group/agent">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm relative shrink-0">
              {auto.agent?.image ? (
                <Image src={auto.agent.image} fill className="object-cover" alt={auto.agent.name || 'Agent'} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-500 bg-slate-200">
                  {(auto.agent?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Publicat de <span className="font-bold text-slate-700">{auto.agent?.name || 'Proprietar'}</span>
            </span>
          </Link>
          
          {/* Logo Right */}
          <div className="bg-white border border-gray-200 rounded-md p-1 shadow-sm h-7 min-w-[50px] flex items-center justify-center">
            {logo ? (
              <Image 
                src={logo}
                alt="Logo"
                width={45}
                height={20}
                unoptimized
                className="object-contain h-full w-auto"
              />
            ) : (
              <div className="bg-[#0ea5e9] text-white text-[9px] font-black px-2 py-0.5 rounded w-full h-full flex items-center justify-center">
                LOGO
              </div>
            )}
          </div>
        </div>

        {/* Main Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] md:text-[24px] font-black text-[#1a1a2e]">
                {formattedNumber}
              </span>
              <span className="text-lg font-bold text-[#1a1a2e]">€</span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-slate-500 mt-0.5">
              {auto.title}
            </h3>
          </div>

          {/* Icons Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-slate-500 font-bold text-[11px] mb-3">
            {auto.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" />
                <span className="capitalize">{auto.location.toLowerCase()}</span>
              </div>
            )}
            {auto.year && (
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span>{auto.year}</span>
              </div>
            )}
            {auto.mileage && auto.mileage !== '—' && (
              <div className="flex items-center gap-1.5">
                <Gauge size={13} className="text-slate-400" />
                <span>{auto.mileage} <span className="font-medium text-[10px]">km</span></span>
              </div>
            )}
            {auto.fuel && (
              <div className="flex items-center gap-1.5">
                <Fuel size={13} className="text-slate-400" />
                <span>{auto.fuel}</span>
              </div>
            )}
          </div>

          <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2">
            Descoperă mai multe detalii despre acest vehicul accesând pagina anunțului.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 w-full md:justify-end">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex-1 md:flex-none bg-[#0ea5e9] text-white py-2 px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-sky-600 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Trimite mesaj
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `tel:${auto.agent?.phone || ''}`;
              }}
              className="flex-1 md:flex-none bg-[#ecfdf5] text-[#059669] py-2 px-4 rounded-lg font-bold text-[10px] uppercase tracking-wider border border-[#a7f3d0] flex items-center justify-center gap-1.5 hover:bg-[#d1fae5] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Sună
            </button>
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
