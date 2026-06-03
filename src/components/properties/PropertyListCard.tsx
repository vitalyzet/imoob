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
  const [style, setStyle] = useState<'classic' | 'professional'>('classic');

  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    const savedStyle = localStorage.getItem('propertyCardStyle') as 'classic' | 'professional';
    if (savedStyle) setStyle(savedStyle);

    const savedLogo = localStorage.getItem('vindu24_user_logo');
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

  let isNew = false;
  if (property.createdAt) {
    let dateObj;
    if (typeof property.createdAt === 'object' && 'seconds' in property.createdAt) {
      dateObj = new Date((property.createdAt as any).seconds * 1000);
    } else if (typeof property.createdAt === 'number') {
      dateObj = new Date(property.createdAt);
    } else {
      dateObj = new Date(property.createdAt);
    }
    
    if (!isNaN(dateObj.getTime())) {
      isNew = (Date.now() - dateObj.getTime()) < 2 * 24 * 60 * 60 * 1000;
    }
  }

  if (style === 'classic') {
    return (
      <div className="group block bg-white border border-slate-100/50 p-2 rounded-[28px] overflow-hidden transition-all duration-500 relative hover:border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <Link href={`/propiedades/${property.slug}`} className="block relative h-64 w-full rounded-[24px] overflow-hidden mb-4">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Agency Logo (Minimalist) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
            {isNew && (
              <div className="bg-[#139E69]/30 backdrop-blur-md border border-[#139E69]/50 text-white text-[10px] font-bold py-1 px-3 rounded-lg shadow-sm w-fit">
                Nou
              </div>
            )}
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
        </Link>
        <div className="px-2">
          <div className="flex justify-between items-baseline mb-1">
            <div className="text-[24px] font-black text-gray-900 tracking-tight">{formattedPrice}{property.status === 'for-rent' && <span className="text-[14px] text-gray-500 font-bold ml-1">/ lună</span>}</div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{property.status === 'for-sale' ? 'Vânzare' : 'Închiriere'}</span>
          </div>
          <Link href={`/propiedades/${property.slug}`}>
            <h3 className="font-medium text-gray-800 text-[15px] truncate mb-2 hover:text-[#f25c1a] transition-colors">{property.title}</h3>
          </Link>
          <div className="flex items-center gap-3 text-gray-400 text-[13px] font-medium mt-2">
            <span>{property.location.city}</span>
            <span>•</span>
            <span>{property.features.bedrooms} pat.</span>
            <span>•</span>
            <span>{property.features.bathrooms} băi</span>
          </div>
        </div>
      </div>
    );
  }



  // Classic Style (Default)
  return (
    <Link 
      href={`/propiedades/${property.slug}`}
      className="group block bg-white rounded-[24px] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.08)] overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 relative border border-transparent hover:border-gray-200"
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
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="bg-white/90 backdrop-blur-sm text-[#139E69] px-3 py-1 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm w-fit border border-white/50">
            {property.status === 'for-sale' ? 'De Vânzare' : 'Închiriere'}
          </span>
          {isNew && (
            <span className="bg-[#139E69]/30 backdrop-blur-md border border-[#139E69]/50 text-white px-3 py-1 text-[10px] font-bold rounded-lg shadow-sm w-fit">
              Nou
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
          <h3 className="text-[22px] font-black text-[#139E69] tracking-tight flex items-baseline">
            {formattedPrice}
            {property.status === 'for-rent' && <span className="text-[13px] text-gray-500 font-bold ml-1.5">/ lună</span>}
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
