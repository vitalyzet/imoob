'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Crown, Sparkles, Bed, Bath, Square, TrendingUp } from 'lucide-react';
import { Property } from '@/lib/types';

import { useState, useEffect } from 'react';

interface PropertyListCardProps {
  property: Property;
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  const [style, setStyle] = useState<'classic' | 'minimalist'>('classic');

  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    const savedStyle = localStorage.getItem('propertyCardStyle') as 'classic' | 'minimalist';
    if (savedStyle) setStyle(savedStyle);

    const savedLogo = localStorage.getItem('imoob_user_logo');
    if (savedLogo) setLogo(savedLogo);

    // Listen for changes across the app
    const handleStyleChange = (e: CustomEvent) => {
      setStyle(e.detail);
    };

    const handleLogoChange = (e: CustomEvent) => {
      setLogo(e.detail);
    };

    window.addEventListener('card-style-changed', handleStyleChange as EventListener);
    window.addEventListener('user-logo-changed', handleLogoChange as EventListener);
    
    return () => {
      window.removeEventListener('card-style-changed', handleStyleChange as EventListener);
      window.removeEventListener('user-logo-changed', handleLogoChange as EventListener);
    };
  }, []);

  const formattedPrice = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(property.price);

  if (style === 'minimalist') {
    return (
      <Link 
        href={`/propiedades/${property.slug}`}
        className={`group block bg-transparent overflow-hidden transition-all duration-500 relative ${
          property.promoType === 'gold' ? 'border-2 border-amber-400/50 rounded-2xl p-2' : ''
        }`}
      >
        <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-4">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Agency Logo (Minimalist) */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-md border border-white/50 flex items-center justify-center w-14 h-7 overflow-hidden">
              <Image 
                src={logo || "https://www.panter.ro/img/logo-dark.png"}
                alt="Agency Logo"
                width={50}
                height={25}
                unoptimized
                className="object-contain opacity-80"
                onError={(e: any) => { e.target.src = "https://placehold.co/100x50/139e69/ffffff?text=LOGO"; }}
              />
            </div>
          </div>
          {property.promoType && (
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-md rounded-md">
              Promovat
            </div>
          )}
        </div>
        <div className="px-2">
          <div className="flex justify-between items-baseline mb-1">
            <div className="text-[24px] font-black text-gray-900 tracking-tight">{formattedPrice}</div>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md">{property.status === 'for-sale' ? 'Vânzare' : 'Închiriere'}</span>
          </div>
          <h3 className="font-medium text-gray-800 text-[15px] truncate mb-2 hover:text-[#f25c1a] transition-colors">{property.title}</h3>
          <div className="flex items-center gap-3 text-gray-400 text-[13px] font-medium mt-2">
            <span>{property.location.city}</span>
            <span>•</span>
            <span>{property.features.bedrooms} pat.</span>
            <span>•</span>
            <span>{property.features.bathrooms} băi</span>
          </div>
        </div>
      </Link>
    );
  }



  // Classic Style (Default)
  return (
    <Link 
      href={`/propiedades/${property.slug}`}
      className={`group block bg-white rounded-[24px] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.08)] overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 relative border ${
        property.promoType === 'gold' 
          ? 'border-amber-400/50 shadow-[0_10px_35px_-12px_rgba(251,191,36,0.2)]'
          : property.promoType === 'standard'
          ? 'border-[#139E69]/20 shadow-sm'
          : 'border-transparent hover:border-gray-200'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-[#139E69] px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm w-fit border border-white/50">
            {property.status === 'for-sale' ? 'De Vânzare' : 'Închiriere'}
          </span>
        </div>

        {/* Promotion Badges */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
          {property.promoType === 'gold' && (
            <span className="bg-[#f25c1a]/15 backdrop-blur-md text-[#f25c1a] px-3 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm flex items-center gap-1.5 w-fit border border-[#f25c1a]/30">
              <Crown size={12} fill="currentColor" className="text-[#f25c1a]" /> PROMOVAT
            </span>
          )}
          {property.promoType === 'standard' && (
            <span className="bg-[#139E69]/15 backdrop-blur-md text-[#139E69] px-3 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm flex items-center gap-1.5 w-fit border border-[#139E69]/30">
              <Sparkles size={12} fill="currentColor" className="text-[#139E69]" /> PROMOVAT
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 relative">
        {/* Agency Logo (Classic List) */}
        <div className="absolute top-5 right-5 z-20">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center w-14 h-7 overflow-hidden">
            <Image 
              src={logo || "https://www.panter.ro/img/logo-dark.png"}
              alt="Agency Logo"
              width={50}
              height={25}
              unoptimized
              className="object-contain opacity-80"
              onError={(e: any) => { e.target.src = "https://placehold.co/100x50/139e69/ffffff?text=LOGO"; }}
            />
          </div>
        </div>
        <div className="flex justify-between items-start">
          <h3 className="text-[22px] font-black text-[#139E69] tracking-tight">
            {formattedPrice}
          </h3>
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">{property.type}</span>
        </div>

        <h4 className="font-bold text-gray-800 text-[15px] truncate mb-1">{property.title || 'Proprietate'}</h4>

        <div className="flex items-center gap-1.5 text-gray-500 font-medium text-[12px] mb-4">
          <MapPin size={14} className="text-gray-400" />
          <span className="truncate">{property.location.city}, {property.location.state}</span>
        </div>

        {/* Features Row */}
        <div className="flex items-center gap-5 text-gray-500 font-bold text-[11px] border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5">
            <Bed size={16} className="text-gray-400" />
            <span>{property.features.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={16} className="text-gray-400" />
            <span>{property.features.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square size={14} className="text-gray-400" />
            <span>{property.features.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
