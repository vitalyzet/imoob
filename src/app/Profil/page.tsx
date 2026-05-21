'use client';

import { LayoutGrid } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="bg-white rounded-[40px] p-20 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-10 relative">
        <LayoutGrid size={40} strokeWidth={1.5} className="text-[#f25c1a]" />
      </div>
      <h3 className="text-[20px] font-bold text-gray-800 mb-3">Zona de activitate Profil</h3>
      <p className="text-gray-500 font-medium max-w-sm text-[16px] leading-relaxed">
        Aici vei găsi un rezumat complet al activității tale pe platforma IMOB.
      </p>
    </div>
  );
}
