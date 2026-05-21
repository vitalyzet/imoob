'use client';

import { Mail } from 'lucide-react';

export default function ContactedPage() {
  return (
    <div className="bg-white rounded-[40px] p-20 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-10 relative">
        <Mail size={40} strokeWidth={1.5} className="text-[#f25c1a]" />
      </div>
      <h3 className="text-[20px] font-bold text-gray-800 mb-3">Anunțuri contactate</h3>
      <p className="text-gray-500 font-medium max-w-sm text-[16px] leading-relaxed">
        Momentan nu ai contactat niciun anunț. Istoricul tău va apărea aici.
      </p>
    </div>
  );
}
