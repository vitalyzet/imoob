'use client';

import { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationCard() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (isSubscribed) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-200 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-[18px] font-bold text-gray-900 mb-1">Notificări activate!</h3>
        <p className="text-[13.5px] text-gray-500 leading-relaxed px-4">
          Vei fi primul care află despre noile oportunități imobiliare.
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-white p-8 pt-12 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-200 flex flex-col items-center text-center">
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
        <Bell size={24} className="text-slate-700" />
      </div>
      
      <h3 className="text-[20px] font-bold text-slate-900 mb-2">Activează notificările</h3>
      <p className="text-[14px] text-gray-500 leading-relaxed mb-8 px-2">
        Pentru a fi la curent cu cele mai noi anunțuri imobiliare.
      </p>
      
      <button 
        onClick={() => setIsSubscribed(true)}
        className="w-full py-4 bg-gray-50 border border-gray-200 rounded-2xl text-slate-800 font-bold text-[15px] hover:bg-gray-100 transition-all hover:shadow-sm active:scale-[0.98]"
      >
        Activează Notificările
      </button>
    </div>
  );
}
