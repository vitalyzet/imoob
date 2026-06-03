'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, Users, Heart, Camera, Tag, Sparkles } from 'lucide-react';
import { Property } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import ContactModal from './ContactModal';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface PropertyRowCardProps {
  property: Property;
}

export default function PropertyRowCard({ property }: PropertyRowCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [logo, setLogo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div 
      onClick={() => router.push(`/propiedades/${property.slug}`)}
      className="group block bg-white rounded-[24px] shadow-[0_4px_25px_-5px_rgba(0,0,0,0.08)] transition-all hover:shadow-xl hover:-translate-y-1 relative border cursor-pointer border-transparent hover:border-gray-200"
    >
      {/* Inner wrapper to handle overflow without cutting outer ribbon */}
      <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-[24px] [transform:translateZ(0)]">
        {/* Image Container */}
        <div className="relative aspect-[16/10] md:aspect-auto w-full md:w-[280px] lg:w-[340px] h-64 md:h-auto shrink-0 group/img bg-slate-900">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
              opacity: { duration: 0.25 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 hover:bg-white shadow-lg border border-slate-200"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 hover:bg-white shadow-lg border border-slate-200"
        >
          <ChevronRight size={18} strokeWidth={3} />
        </button>
        
        <div className="absolute left-4 z-10 flex flex-col gap-1.5 top-4">
          <span className={`px-3 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg border outline outline-4 outline-black/5 ${property.status === 'for-rent' || property.type === 'camera' ? 'bg-[#139E69] text-white border-emerald-400/20' : 'bg-slate-900 text-white border-slate-700/20'}`}>
            {property.type === 'camera' ? 'Cameră de închiriat' : property.status === 'for-rent' ? 'De închiriat' : 'De vânzare'}
          </span>
          {isNew && (
            <span className="bg-[#139E69]/30 backdrop-blur-md border border-[#139E69]/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm w-fit">
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

        {/* Favorite Button */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={(e) => toggleFavorite(property.id, e)}
            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 shadow-sm hover:bg-white hover:text-rose-500 transition-colors group/fav"
          >
            <Heart size={18} fill={isFavorite(property.id) ? "currentColor" : "transparent"} className={`transition-transform group-hover/fav:scale-110 ${isFavorite(property.id) ? "text-rose-500" : ""}`} />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <div className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full flex items-center gap-1 text-[9px] font-bold border border-white/20 shadow-sm">
            <Camera size={9} />
            <span>{property.images.length}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        <div className="h-10 bg-slate-100/80 px-5 flex items-center justify-between border-b border-slate-200/50">
          <Link href={`?agentProfile=${property.agent?.id || 'anonimo'}`} scroll={false} className="flex items-center gap-2.5 group/agent hover:opacity-80 transition-opacity">
            <div className="w-[22px] h-[22px] rounded-full overflow-hidden bg-white shrink-0 relative border border-slate-200 shadow-sm">
              {property.agent?.image ? (
                <Image src={property.agent.image} fill className="object-cover" alt={property.agent.name || 'Agent'} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-200">
                  {(property.agent?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-medium tracking-tight">
              Publicat de <span className="font-bold text-slate-700 group-hover/agent:text-[#139E69] transition-colors">{property.agent?.name || 'Proprietar'}</span> <span className="text-slate-400 font-normal px-1">•</span> astăzi
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
                onError={(e: any) => { e.target.src = "https://placehold.co/100x60/139e69/ffffff?text=LOGO"; }}
              />
            </div>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="space-y-1 mb-3">
             <div className="flex items-center gap-2 flex-wrap">
               <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-baseline">
                 {formattedNumber} <span className="text-lg font-bold text-slate-500 ml-0.5">€</span>
                 {property.status === 'for-rent' && <span className="text-sm font-bold text-slate-400 ml-1.5">/ lună</span>}
               </p>
               {property.oldPrice && property.oldPrice > property.price && (
                 <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md line-through">
                   {new Intl.NumberFormat('ro-RO').format(property.oldPrice)} €
                 </span>
               )}
             </div>
             <h3 className="text-sm md:text-base font-medium text-slate-500 leading-snug">
               {property.title}
             </h3>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-bold text-[13px] mb-4">
            {property.type === 'camera' ? (
              <>
                <div className="flex items-center gap-1.5" title="Persoane care locuiesc deja">
                  <Users size={16} className="text-slate-400" />
                  <span>{property.roommateDetails?.nrPersoaneActual || '0'} <span className="font-medium text-slate-400">Colegi</span></span>
                </div>
                <button 
                  onClick={(e) => toggleFavorite(property.id, e)}
                  className={`flex items-center justify-center w-11 h-11 rounded-xl border ${isFavorite(property.id) ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'} hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0`}
                >
                  <Heart size={16} fill={isFavorite(property.id) ? "currentColor" : "transparent"} className={isFavorite(property.id) ? "text-rose-500" : "text-slate-400"} />
                </button>
                <div className="flex items-center gap-1.5" title="Profilul dorit pentru viitorul coleg">
                  <Heart size={16} className="text-slate-400" />
                  <span className="capitalize">{property.roommateDetails?.preferinteColeg?.slice(0, 15) || 'Oricine'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <Bed size={16} className="text-slate-400" />
                  <span>{property.features.bedrooms} <span className="font-medium text-slate-400">Dorms.</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath size={16} className="text-slate-400" />
                  <span>{property.features.bathrooms} <span className="font-medium text-slate-400">Băi</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Square size={14} className="text-slate-400" />
                  <span>{property.features.area} <span className="font-medium text-slate-400 text-xs lowercase">m²</span></span>
                </div>
              </>
            )}
          </div>

          <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-6">
            {property.description}
          </p>
          
          {/* Action Buttons - Horizontal Row Right Aligned */}
          <div className="flex items-center justify-end gap-3 mt-auto w-full">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex-1 max-w-[180px] bg-[#f25c1a] text-white py-2.5 px-4 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#d94e16] hover:shadow-lg hover:shadow-[#f25c1a]/25 active:scale-[0.98]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Trimite mesaj
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `tel:${property.agent.phone}`;
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
        propertyName={property.title} 
      />
    </div>
  );
}
