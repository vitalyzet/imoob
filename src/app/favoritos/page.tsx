'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { properties } from '@/lib/data';
import { Property } from '@/lib/types';
import PropertyCard from '@/components/properties/PropertyCard';
import { Heart, Home, ArrowLeft } from 'lucide-react';

export default function FavoritosPage() {
  // Simulating saved properties (just taking a subset of properties)
  const [favorites, setFavorites] = useState<Property[]>(properties.slice(0, 2));

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-24 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <nav className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Link href="/" className="hover:text-[#139E69] transition-colors">Acasă</Link>
              <span>/</span>
              <span className="text-gray-600 font-medium">Favorite</span>
            </nav>
            <h1 className="text-4xl font-black text-[#333] tracking-tight flex items-center gap-4">
              Anunțuri <span className="text-[#139E69]">Favorite</span>
              <div className="bg-[#EAF5EE] text-[#139E69] text-sm px-4 py-1.5 rounded-full border border-[#139E69]/10">
                {favorites.length} salvate
              </div>
            </h1>
          </div>
          
          <Link 
            href="/propiedades"
            className="flex items-center gap-2 bg-white text-[#333] hover:text-[#139E69] px-6 py-3 rounded-xl border border-gray-200 shadow-sm transition-all font-bold"
          >
            <ArrowLeft size={18} /> Continuă căutarea
          </Link>
        </div>
 
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)] py-32 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
               <Heart size={48} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black text-[#333] mb-4">Nu ai salvat niciun anunț încă</h2>
            <p className="text-[#666] max-w-sm mb-10 text-lg">
              Salvează proprietățile care îți plac pentru a le vedea mai târziu sau pentru a primi notificări dacă scade prețul.
            </p>
            <Link 
              href="/propiedades"
              className="bg-[#139E69] hover:bg-[#0f8256] text-white px-10 py-4 rounded-xl font-black transition-all shadow-xl text-lg flex items-center gap-3"
            >
              <Home size={20} /> Explorează proprietăți
            </Link>
          </div>
        )}
 
        {/* Info Block */}
        {favorites.length > 0 && (
          <div className="mt-20 p-10 bg-[#2b3543] rounded-3xl overflow-hidden relative group">
             <div className="relative z-10">
               <h3 className="text-white text-2xl font-bold mb-4">Vrei să primești alerte?</h3>
               <p className="text-gray-300 max-w-xl text-lg mb-8 leading-relaxed">
                 Te vom anunța prin email imediat ce scade prețul favoritelor tale sau apar proprietăți similare în zonă.
               </p>
               <button className="bg-[#139E69] hover:bg-[#0f8256] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
                 Activează notificările
               </button>
             </div>
             {/* Decorative Heart */}
             <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Heart size={200} fill="white" stroke="none" />
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
