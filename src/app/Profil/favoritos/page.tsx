'use client';

import { useState } from 'react';
import { Heart, MapPin, Star, PlusSquare } from 'lucide-react';
import Link from 'next/link';

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<any[]>([]); // Starts empty for new users
  
  return (
    <div className="flex flex-col gap-6">
      {favorites.length > 0 ? (
        <div className="flex flex-col gap-6">
          {/* Favorite cards would go here once connected to fetch */}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-10 relative">
            <Heart size={40} strokeWidth={1.5} className="text-[#f25c1a]" fill="none" />
          </div>
          <h3 className="text-[20px] font-bold text-gray-800 mb-3">Lista ta de favorite</h3>
          <p className="text-gray-500 font-medium max-w-sm text-[16px] leading-relaxed">
            Momentan nu ai niciun anunț salvat la favorite. Salvează anunțurile care îți plac pentru a le găsi mai ușor mai târziu.
          </p>
          <Link 
            href="/propiedades"
            className="mt-8 px-8 py-3.5 bg-gray-900 hover:bg-[#A13A17] text-white rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            Explorați proprietățile
          </Link>
        </div>
      )}
    </div>
  );
}
