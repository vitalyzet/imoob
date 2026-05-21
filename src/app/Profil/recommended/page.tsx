'use client';

import { ThumbsUp } from 'lucide-react';

export default function RecommendedPage() {
  return (
    <div className="bg-white rounded-[40px] p-24 border border-gray-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-8">
        <ThumbsUp size={32} strokeWidth={1} className="text-[#f25c1a]" />
      </div>
      <h3 className="text-[18px] font-bold text-gray-600 mb-2">Anunțuri recomandate</h3>
      <p className="text-gray-400 font-medium text-[15px]">Recomandări bazate pe preferințele tale sunt în curs de generare.</p>
    </div>
  );
}
