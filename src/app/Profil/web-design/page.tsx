'use client';

import { useState } from 'react';
import { LayoutGrid, CheckCircle2, Bed, Bath, Square, Heart, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import PremiumHeader from '@/components/layout/PremiumHeader';
import PremiumFooter from '@/components/layout/PremiumFooter';

export default function WebDesignPage() {
  const [selectedStyle, setSelectedStyle] = useState<'classic' | 'minimalist'>('classic');
  const [isSaved, setIsSaved] = useState(false);

  // Initialize from localStorage
  useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('propertyCardStyle') as 'classic' | 'minimalist';
      if (saved) setSelectedStyle(saved);
    }
  });

  const handleSave = () => {
    setIsSaved(true);
    localStorage.setItem('propertyCardStyle', selectedStyle);
    window.dispatchEvent(new CustomEvent('card-style-changed', { detail: selectedStyle }));
    setTimeout(() => setIsSaved(false), 2000);
  };

  const mockupProperty = {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    price: '145.000 €',
    title: 'Vilă modernă cu piscină',
    location: 'București, Ilfov',
    beds: 4,
    baths: 3,
    area: 185
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PremiumHeader />
      
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 container mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Banner de Presentación */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            Diseño Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">
            Elegancia en cada detalle
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Explora nuestra nueva línea de componentes diseñados para ofrecer la mejor experiencia visual en el sector inmobiliario.
          </p>
        </div>

        <div className="flex flex-col gap-10">
      
      {/* Header matching user image */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 mb-3">
          <LayoutGrid size={28} className="text-[#139E69]" />
          <h2 className="text-[28px] font-black text-[#111827] tracking-tight">Aspect Card Produs</h2>
        </div>
        <p className="text-[17px] text-gray-500 font-medium">
          Alege stilul de afișare pentru anunțurile din platformă.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Style 1: Classic & Clean */}
          <div 
            onClick={() => setSelectedStyle('classic')}
            className={`relative rounded-3xl p-4 cursor-pointer transition-all duration-300 border-2 ${
              selectedStyle === 'classic' 
                ? 'border-[#f25c1a] bg-orange-50/30 shadow-[0_10px_30px_-10px_rgba(242,92,26,0.2)]' 
                : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <div className="absolute top-6 right-6 z-10">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedStyle === 'classic' ? 'border-[#f25c1a] bg-[#f25c1a]' : 'border-gray-300 bg-white'
              }`}>
                {selectedStyle === 'classic' && <CheckCircle2 size={14} className="text-white" />}
              </div>
            </div>

            <h3 className="text-[15px] font-bold text-gray-900 mb-6 px-2">Stil Clasic & Luminos</h3>

            {/* Mockup Card 1 */}
            <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all pointer-events-none">
              <div className="relative h-[200px] w-full">
                <Image src={mockupProperty.image} alt="Mockup" fill className="object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-[#139E69] tracking-widest">
                  De Vânzare
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400">
                  <Heart size={16} />
                </div>
              </div>
              <div className="p-5">
                <div className="text-xl font-black text-[#139E69] mb-1">{mockupProperty.price}</div>
                <h4 className="font-bold text-gray-800 text-[15px] truncate mb-1">{mockupProperty.title}</h4>
                <div className="flex items-center gap-1.5 text-gray-500 text-[12px] mb-4">
                  <MapPin size={12} />
                  {mockupProperty.location}
                </div>
                <div className="flex items-center gap-4 text-gray-500 text-[11px] font-bold border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1"><Bed size={14} /> {mockupProperty.beds}</div>
                  <div className="flex items-center gap-1"><Bath size={14} /> {mockupProperty.baths}</div>
                  <div className="flex items-center gap-1"><Square size={14} /> {mockupProperty.area} m²</div>
                </div>
              </div>
            </div>
          </div>

          {/* Style 4: Ultra Minimalist (Border-less, Huge Image, Tiny text) */}
          <div 
            onClick={() => setSelectedStyle('minimalist')}
            className={`relative rounded-3xl p-4 cursor-pointer transition-all duration-300 border-2 ${
              selectedStyle === 'minimalist' 
                ? 'border-[#f25c1a] bg-orange-50/30 shadow-[0_10px_30px_-10px_rgba(242,92,26,0.2)]' 
                : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <div className="absolute top-6 right-6 z-10">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedStyle === 'minimalist' ? 'border-[#f25c1a] bg-[#f25c1a]' : 'border-gray-300 bg-white'
              }`}>
                {selectedStyle === 'minimalist' && <CheckCircle2 size={14} className="text-white" />}
              </div>
            </div>

            <h3 className="text-[15px] font-bold text-gray-900 mb-6 px-2">Stil Ultra-Minimalist</h3>

            {/* Mockup Card 4 */}
            <div className="bg-transparent overflow-hidden transition-all pointer-events-none group">
              <div className="relative h-[250px] w-full rounded-2xl overflow-hidden mb-4">
                <Image src={mockupProperty.image} alt="Mockup" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 text-white">
                  <Heart size={20} strokeWidth={1.5} />
                </div>
              </div>
              <div className="px-1">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-[22px] font-black text-gray-900 tracking-tight">{mockupProperty.price}</div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md">Vânzare</span>
                </div>
                <h4 className="font-medium text-gray-800 text-[14px] truncate mb-1">{mockupProperty.title}</h4>
                <div className="flex items-center gap-3 text-gray-400 text-[12px] font-medium mt-2">
                  <span>{mockupProperty.location.split(',')[0]}</span>
                  <span>•</span>
                  <span>{mockupProperty.beds} pat.</span>
                  <span>•</span>
                  <span>{mockupProperty.baths} băi</span>
                </div>
              </div>
            </div>
          </div>



        </div>

        <div className="mt-10 flex justify-end pt-8 border-t border-gray-100">
          <button 
            onClick={handleSave}
            className="w-full md:w-auto bg-[#f25c1a] hover:bg-[#ff6b00] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-3"
          >
            {isSaved ? <CheckCircle2 size={18} /> : null}
            {isSaved ? 'Modificări Salvate' : 'Salvează Aspectul'}
          </button>
        </div>
      </div>
      
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
}
