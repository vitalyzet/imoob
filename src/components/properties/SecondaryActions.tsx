'use client';

import { useState, useEffect } from 'react';
import { Bell, Phone, Calendar, CheckCircle2 } from 'lucide-react';

export default function SecondaryActions() {
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [alreadySent, setAlreadySent] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (lastSent) {
      const timer = setTimeout(() => {
        setLastSent(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastSent]);

  const handleAction = (type: string) => {
    if (alreadySent.has(type)) return;
    
    setLastSent(type);
    setAlreadySent(prev => new Set(prev).add(type));
  };

  if (lastSent) {
    return (
      <div className="mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
        <h4 className="text-[16px] font-bold text-emerald-900">Solicitare trimisă cu succes!</h4>
        <p className="text-[13px] text-emerald-700 mt-1">Te vom contacta în cel mai scurt timp.</p>
        <button 
          onClick={() => setLastSent(null)}
          className="mt-4 text-[12px] font-bold text-emerald-600 hover:underline"
        >
          Trimite altă solicitare
        </button>
      </div>
    );
  }

  const buttons = [
    { id: 'price', icon: Bell, label: 'Anunță-mă când scade prețul' },
    { id: 'call', icon: Phone, label: 'Vreau să fiu sunat' },
    { id: 'visit', icon: Calendar, label: 'Programează vizionare' }
  ];

  return (
    <div className="mt-6 space-y-2.5">
      {buttons.map((btn) => {
        const isSent = alreadySent.has(btn.id);
        const Icon = btn.icon;
        
        return (
          <button 
            key={btn.id}
            disabled={isSent}
            onClick={() => handleAction(btn.id)}
            className={`w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${
              isSent 
                ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:shadow-sm group'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ${
              isSent 
                ? 'bg-white border-gray-50' 
                : 'bg-slate-50 border-slate-100 group-hover:bg-white'
            }`}>
              {isSent ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <Icon size={14} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              )}
            </div>
            <span className="flex-1 text-center pr-7">
              {isSent ? 'Solicitare deja trimisă' : btn.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
