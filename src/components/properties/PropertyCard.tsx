import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Square, MapPin, Heart, Crown, Sparkles, Star, TrendingUp, Users, Camera, Maximize, GitCommit, Tag } from 'lucide-react';
import { Property } from '@/lib/types';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: { property: Property }) {
  const [style, setStyle] = useState<'classic' | 'professional'>('classic');
  const { isFavorite, toggleFavorite } = useFavorites();
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
  
  const formattedNumber = new Intl.NumberFormat('ro-RO', {
    maximumFractionDigits: 0,
  }).format(property.price);

  let formattedDate = '';
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
      formattedDate = dateObj.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
      isNew = (Date.now() - dateObj.getTime()) < 2 * 24 * 60 * 60 * 1000;
    }
  }

  if (style === 'classic') {
    return (
      <div className="group bg-white border border-gray-200 rounded-[16px] overflow-hidden hover:shadow-lg transition-all duration-300 relative flex flex-col">

        <div className="relative h-56 w-full shrink-0">
          <Link href={`/propiedades/${property.slug}`} className="block h-full w-full">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
          
          {/* Heart Icon (Top Right) */}
          <div className="absolute top-3 right-3 z-20">
            <div 
              onClick={(e) => toggleFavorite(property.id, e)}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform group/fav"
            >
              <Heart size={18} strokeWidth={2} className={`${isFavorite(property.id) ? "text-[#f25c1a] fill-[#f25c1a]" : "text-gray-900 group-hover/fav:text-[#f25c1a] group-hover/fav:fill-[#f25c1a]"} transition-colors`} />
            </div>
          </div>
          
          {/* Status Badge (Bottom Left) */}
          <div className="absolute bottom-3 left-3 z-10 flex gap-1.5 flex-wrap">
            <span className="bg-white/95 text-gray-700 px-3 py-1 text-[11px] font-bold rounded-lg shadow-sm border border-white/50">
              {property.status === 'for-sale' ? 'Vânzare' : 'Închiriere'}
            </span>
            {isNew && (
              <span className="bg-[#139E69]/30 backdrop-blur-md border border-[#139E69]/50 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm w-fit">
                Nou
              </span>
            )}
          </div>
          
          {/* Image Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <Link href={`/propiedades/${property.slug}`}>
            <h3 className="font-bold text-gray-900 text-[16px] truncate mb-1 uppercase tracking-tight">{property.title}</h3>
          </Link>
          
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-3 line-clamp-1">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{property.location.city}{property.location.state ? `, ${property.location.state}` : ''}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 text-[13px] mb-4">
            <span>{property.type === 'camera' ? (property.roommateDetails?.nrPersoaneActual || 1) + ' col' : property.features.bedrooms + ' cam'}</span>
            <span className="text-gray-300">•</span>
            <span>{property.features.bathrooms} băi</span>
            <span className="text-gray-300">•</span>
            <span>{property.features.area} m²</span>
          </div>
          
          <div className="mt-auto flex items-end justify-between">
            <div className="text-[20px] font-black text-gray-900 flex items-baseline gap-2">
              <div>{formattedNumber} <span className="text-[16px]">€</span>{property.status === 'for-rent' && <span className="text-[13px] text-gray-500 font-bold ml-1">/ lună</span>}</div>
              {property.oldPrice && property.oldPrice > property.price && (
                <span className="text-[12px] text-gray-400 line-through ml-2 font-medium">
                  {new Intl.NumberFormat('ro-RO').format(property.oldPrice)} €
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
    );
  }

  return (
    <div className="group bg-white rounded-[28px] p-1.5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl transition-all hover:-translate-y-1 relative border flex flex-col border-gray-200">

      {/* Image Container */}
      <div className="relative h-[250px] w-full overflow-hidden rounded-[24px] shrink-0 [transform:translateZ(0)]">
        <Link href={`/propiedades/${property.slug}`}>
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        <div className="absolute left-4 z-10 flex flex-col gap-1.5 top-4">
          <span className={`px-3 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg border outline outline-4 outline-black/5 ${property.status === 'for-rent' || property.type === 'camera' ? 'bg-[#139E69] text-white border-emerald-400/20' : 'bg-slate-900 text-white border-slate-700/20'}`}>
            {property.type === 'camera' ? 'Cameră de închiriat' : property.status === 'for-rent' ? 'De închiriat' : 'De vânzare'}
          </span>
          {isNew && (
            <span className="bg-[#139E69]/30 backdrop-blur-md border border-[#139E69]/50 text-white px-3 py-1.5 text-[10px] font-bold rounded-full w-fit">
              Nou
            </span>
          )}
          {property.oldPrice && property.oldPrice > property.price && (
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 rounded-full w-fit flex items-center gap-1.5 backdrop-blur-sm border border-white/20">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7l10 10M17 7v10H7"/></svg>
              Preț Redus
            </span>
          )}
        </div>

        {/* Agency Logo removed as per user request (only for list view) */}

        {/* Photo Count Badge (Moved slightly up) */}
        <div className="absolute bottom-14 right-3 z-10">
          <div className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full flex items-center gap-1 text-[9px] font-bold border border-white/20 shadow-sm">
            <Camera size={9} />
            <span>{property.images.length}</span>
          </div>
        </div>

        
        {/* Floating Heart Button */}
        <div 
          onClick={(e) => toggleFavorite(property.id, e)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-md z-10 cursor-pointer hover:scale-110 transition-transform border border-gray-100"
        >
          <Heart color={isFavorite(property.id) ? "#f25c1a" : "#666"} fill={isFavorite(property.id) ? "#f25c1a" : "transparent"} size={18} strokeWidth={2.5} className="hover:fill-[#f25c1a] hover:text-[#f25c1a] transition-colors" />
        </div>
      </div>
      
      <div className="px-3 pt-4 pb-2 flex-grow flex flex-col">
        {/* Location & Price Row */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 text-[#6b7280]">
            <MapPin size={16} className="text-gray-400" fill="currentColor" strokeWidth={0.5} />
            <span className="text-[15px]">{[property.location.city, property.location.state].filter(Boolean).join(', ')}</span>
          </div>
          <div className="flex flex-col items-end">
            {property.oldPrice && property.oldPrice > property.price && (
              <span className="text-[11px] font-bold text-gray-400 line-through">
                {new Intl.NumberFormat('ro-RO').format(property.oldPrice)} €
              </span>
            )}
            <div className="text-[20px] md:text-[22px] font-bold text-[#111827] tracking-tight">
              {formattedNumber}<span className="text-[18px]">€</span>{property.status === 'for-rent' && <span className="text-[14px] text-gray-500 font-bold ml-1">/ lună</span>}
            </div>
          </div>
        </div>

        {/* Title */}
        <Link href={`/propiedades/${property.slug}`}>
          <h3 className="text-[17px] md:text-[18px] font-semibold text-[#111827] leading-snug mb-5 line-clamp-2 hover:text-[#139E69] transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Features Row */}
        <div className="flex items-center justify-between mt-auto">
          {property.type === 'camera' ? (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center text-gray-700 shrink-0">
                  <Users size={16} />
                </div>
                <span className="text-[14px] text-gray-800 font-medium whitespace-nowrap">{property.roommateDetails?.nrPersoaneActual || 1} col</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center text-gray-700 shrink-0">
                  <Bath size={16} />
                </div>
                <span className="text-[14px] text-gray-800 font-medium whitespace-nowrap">{property.features.bathrooms} băi</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center text-gray-700 shrink-0">
                  <Bed size={16} />
                </div>
                <span className="text-[14px] text-gray-800 font-medium whitespace-nowrap">{property.features.bedrooms} cam</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center text-gray-700 shrink-0">
                  <Bath size={16} />
                </div>
                <span className="text-[14px] text-gray-800 font-medium whitespace-nowrap">{property.features.bathrooms} băi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] flex items-center justify-center text-gray-700 shrink-0">
                  <Maximize size={16} />
                </div>
                <span className="text-[14px] text-gray-800 font-medium whitespace-nowrap">{property.features.area} mp</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

