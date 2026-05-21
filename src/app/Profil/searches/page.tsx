'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, CalendarDays, PlusSquare } from 'lucide-react';

export default function SearchesPage() {
  const [savedSearches, setSavedSearches] = useState<any[]>([]); // Starts empty for new users
  
  return (
    <div className="flex flex-col gap-6">
      {savedSearches.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {savedSearches.map((search) => (
            <div key={search.id} className="bg-white rounded-[24px] p-6 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] transition-all duration-300 group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                  <Search size={24} className="text-[#f25c1a]" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-800 mb-1">{search.title}</h3>
                  <div className="flex items-center gap-3 text-[13px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} strokeWidth={2} />
                      {search.date}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[#f25c1a] font-bold">{search.results} rezultate noi</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {search.trend === 'up' && (
                  <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-green-100/50 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    Nou
                  </span>
                )}
                <Link 
                  href="/propiedades" 
                  className="px-6 py-2.5 bg-gray-900 hover:bg-[#f25c1a] text-white text-[13px] font-bold rounded-xl transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(242,92,26,0.25)]"
                >
                  Vezi rezultate
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-10 relative">
            <Search size={40} strokeWidth={1.5} className="text-[#f25c1a]" />
          </div>
          <h3 className="text-[20px] font-bold text-gray-800 mb-3">Salvează căutările tale</h3>
          <p className="text-gray-500 font-medium max-w-sm text-[16px] leading-relaxed">
            Momentan nu ai nicio căutare salvată. Salvează căutarea ta din lista de rezultate pentru a fi notificat de noile anunțuri.
          </p>
        </div>
      )}
      
      <button className="mt-4 w-full py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-bold text-[14px] hover:border-[#f25c1a] hover:text-[#f25c1a] hover:bg-orange-50/30 transition-all duration-300 flex items-center justify-center gap-2">
        <PlusSquare size={18} />
        Căutare nouă
      </button>
    </div>
  );
}
