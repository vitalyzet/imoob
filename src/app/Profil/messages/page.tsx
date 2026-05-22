'use client';

import React, { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import Image from 'next/image';

export default function MessagesPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm flex h-[700px] w-full">
      {/* Left Sidebar */}
      <div className="w-[320px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
        {/* Back Button */}
        <div className="p-4">
          <button className="flex items-center gap-2 text-gray-800 font-semibold text-[13px] hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors w-full bg-gray-50 border border-gray-100/50">
            <ChevronLeft size={16} /> Volver a Mis contactos
          </button>
        </div>

        {/* Property Context Card */}
        <div className="px-4 pb-4">
          <div className="border border-gray-200 rounded-[12px] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="text-[10px] text-gray-500 p-2.5 border-b border-gray-100 bg-white uppercase font-medium">
              Publicado por <span className="font-bold text-gray-700">SAN JOSE PERU</span>
            </div>
            <div className="relative h-36 w-full">
              <Image 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600" 
                alt="Property" 
                fill 
                className="object-cover" 
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-1 rounded-full cursor-pointer hover:bg-black/50 transition-colors text-white">
                <ChevronLeft className="rotate-180" size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div className="p-3">
              <div className="text-[11px] text-gray-500 font-medium mb-0.5">Desde</div>
              <div className="text-[18px] font-black text-gray-900 mb-3 tracking-tight">S/ 314,000</div>
              
              <div className="text-[12px] font-bold text-gray-900 mb-1 leading-snug">
                Av. Venezuela 2695, Bellavista - Límite con San Miguel
              </div>
              <div className="text-[11px] text-gray-500 mb-2 font-medium">San Miguel, Lima</div>
              <div className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mt-3">
                ¡Eleva tu estilo de vida, descubre Altavista...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f5f7fa]">
        {/* Chat Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-[14px] text-gray-900 uppercase tracking-wide">SAN JOSE PERU</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="flex justify-center my-2">
            <span className="bg-[#6b7b8a] text-white text-[11px] px-3.5 py-1 rounded-full font-medium">
              Ayer
            </span>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[70%]">
              <div className="bg-[#4a6b82] text-white p-3.5 rounded-2xl rounded-tr-sm text-[14px] leading-relaxed shadow-sm">
                ¡Hola! Quiero que se comuniquen conmigo por este proyecto Venta que vi en Urbania.
              </div>
              <div className="text-[10px] text-gray-500 text-right mt-1.5 font-bold">
                22:53
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 flex items-center bg-white focus-within:border-[#4a6b82] transition-colors">
              <input 
                type="text" 
                placeholder="Escribe un mensaje" 
                className="flex-1 outline-none text-[14px] text-gray-700 bg-transparent placeholder:text-gray-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button 
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-[14px] transition-all ${
                message.trim() 
                  ? 'bg-[#4a6b82] text-white hover:bg-[#3b5568] shadow-sm' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Enviar <Send size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
