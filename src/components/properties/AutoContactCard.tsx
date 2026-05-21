'use client';

import React, { useState } from 'react';
import { Phone, Mail, User, Building2, Shield, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AutoContactCardProps {
  seller?: {
    name?: string;
    phone?: string;
    email?: string;
    type?: 'particular' | 'firma';
    memberSince?: string;
  };
}

export default function AutoContactCard({ seller }: AutoContactCardProps) {
  const { user } = useAuth();
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [message, setMessage] = useState('');

  const isParticular = seller?.type !== 'firma';
  const sellerName = seller?.name || 'Proprietar';
  const sellerPhone = seller?.phone || '+40 7XX XXX XXX';

  const handleSendMessage = () => {
    if (!message.trim()) return;
    alert(`Mesaj trimis către ${sellerName}: ${message}`);
    setMessage('');
    setShowMessageBox(false);
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0]/80 mb-5 flex flex-col gap-0">
      
      {/* Seller Type Badge */}
      <div className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider mb-5 ${
        isParticular 
          ? 'bg-[#f0f9ff] text-[#0369a1] border border-sky-100/60' 
          : 'bg-[#fdf4ff] text-[#86198f] border border-purple-100/60'
      }`}>
        {isParticular ? <User size={12} /> : <Building2 size={12} />}
        {isParticular ? 'Vânzător Particular' : 'Firmă / Dealer'}
      </div>

      {/* Seller Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
          isParticular 
            ? 'bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200/50' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50'
        }`}>
          {isParticular 
            ? <User size={22} className="text-sky-500" /> 
            : <Building2 size={22} className="text-purple-500" />
          }
        </div>
        <div>
          <h4 className="font-black text-[#0f172a] text-[16px] leading-tight">{sellerName}</h4>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[11px] text-[#64748b] font-medium">
              <Shield size={11} className="text-emerald-400" />
              Verificat
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#94a3b8] font-medium">
              <Clock size={11} />
              Pe IMOOB din {seller?.memberSince || '2026'}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-[#e2e8f0]/60 mb-5" />

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => setShowPhone(!showPhone)}
          className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all text-[15px] shadow-sm shadow-sky-500/10 active:scale-[0.98]"
        >
          <Phone size={18} />
          {showPhone ? sellerPhone : 'Afișează telefonul'}
        </button>
        
        {!showMessageBox ? (
          <button 
            onClick={() => setShowMessageBox(true)}
            className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all text-[15px] active:scale-[0.98]"
          >
            <MessageCircle size={18} /> Trimite mesaj
          </button>
        ) : (
          <div className="mt-1 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            {user ? (
              <>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bună ziua, sunt interesat de acest vehicul..." 
                  className="w-full border border-[#e2e8f0] rounded-xl p-4 text-[14px] min-h-[100px] focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent outline-none resize-none text-[#334155] placeholder:text-[#94a3b8] bg-[#f8fafc]"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowMessageBox(false)}
                    className="flex-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] font-bold py-3 rounded-xl transition-colors text-[13px]"
                  >
                    Anulează
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className="flex-[2] bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-[13px]"
                  >
                    Trimite acum
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-[13px] font-medium text-center border border-amber-100">
                Trebuie să fii autentificat pentru a trimite un mesaj.
                <button 
                  onClick={() => setShowMessageBox(false)}
                  className="mt-3 block w-full bg-white text-amber-600 font-bold py-2 rounded-lg border border-amber-200 hover:bg-amber-50 text-[13px]"
                >
                  Închide
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
