'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Heart, Share2, Map as MapIcon, Camera, Phone, MessageCircle, Info, Gauge, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';
import { useDomain } from '@/context/DomainContext';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageClick: (index: number) => void;
  images: string[];
  title: string;
  agent: {
    name: string;
    phone: string;
    image: string;
    role: string;
  };
  propertyInfo?: {
    price: string;
    size: string; // Used for mileage in autos
    location: string;
  };
}

export default function GalleryModal({ isOpen, onClose, onImageClick, images, title, agent, propertyInfo }: GalleryModalProps) {
  const [activeTab, setActiveTab] = useState<'fotos' | 'mapa' | 'street'>('fotos');
  const { domain } = useDomain();

  const formatAgentName = (name: string) => {
    if (!name) return 'Proprietar';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      const lastName = parts.pop();
      if (lastName) {
        return `${parts.join(' ')} ${lastName[0].toUpperCase()}.`;
      }
    }
    return name;
  };

  if (!isOpen) return null;

  if (domain === 'auto') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6 overflow-hidden">
        <div className="bg-slate-50 w-full max-w-7xl h-full max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200">
          
          {/* Header (Auto Light Theme) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
            <h2 className="text-slate-800 font-bold text-lg truncate pr-4">{title}</h2>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-xl text-sky-700 text-sm font-bold hover:bg-sky-100 transition-all border border-sky-100">
                <Heart size={16} className="text-sky-500" />
                <span className="hidden sm:inline">Salvează</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-200 transition-all border border-slate-200">
                <Share2 size={16} />
                <span className="hidden sm:inline">Distribuie</span>
              </button>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-xl text-slate-500 transition-colors ml-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content (Auto Light Theme) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Main Content Area - Just Gallery */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide bg-slate-100/50">
              <div className="grid grid-cols-6 gap-2">
                {images.map((img, idx) => {
                  let colSpan = "col-span-6 md:col-span-2";
                  let rowSpan = "h-[250px] md:h-[300px]";

                  if (idx === 0) {
                    colSpan = "col-span-6";
                    rowSpan = "h-[350px] md:h-[500px]";
                  } else if (idx === 1 || idx === 2) {
                    colSpan = "col-span-6 md:col-span-3";
                    rowSpan = "h-[250px] md:h-[350px]";
                  }

                  return (
                    <div 
                      key={idx} 
                      onClick={() => onImageClick(idx)}
                      className={`relative overflow-hidden rounded-xl group cursor-pointer border border-slate-200 shadow-sm ${colSpan} ${rowSpan}`}
                    >
                      <Image 
                        src={img} 
                        alt={`${title} ${idx + 1}`} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar (Auto Light Theme) */}
            <div className="w-full md:w-[400px] border-l border-slate-200 bg-white p-6 overflow-y-auto shrink-0 flex flex-col">
              
              {propertyInfo && (
                <div className="mb-6 bg-sky-50 rounded-2xl p-5 border border-sky-100">
                  <div className="text-[28px] font-black text-slate-800 mb-4">{propertyInfo.price}</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-white border border-sky-100 flex items-center justify-center shadow-sm">
                        <Gauge size={16} className="text-sky-500" />
                      </div>
                      <span className="font-medium text-sm">{propertyInfo.size}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-white border border-sky-100 flex items-center justify-center shadow-sm">
                        <MapPin size={16} className="text-sky-500" />
                      </div>
                      <span className="font-medium text-sm">{propertyInfo.location}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-sky-400 shadow-sm shrink-0">
                    <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-slate-800 text-[18px] tracking-tight">{formatAgentName(agent.name)}</h3>
                      <div className="bg-emerald-50 text-emerald-600 p-1 rounded-full" title="Vânzător Verificat">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {agent.role === 'Proprietar' ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                      )}
                      {agent.role}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[14px] font-black text-sky-600 flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {agent.phone}
                      </span>
                      <span className="text-[12px] font-medium text-slate-400 flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Pe Vindu24 din 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2">
                  <MessageCircle size={18} className="text-sky-500" /> Contactează Vânzătorul
                </h4>
                <div className="light-theme-form">
                  <ContactForm property={{ id: 'temp', title, agent: { id: 'temp', ...agent } }} />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-sky-500 hover:bg-sky-600 rounded-xl text-white font-bold text-sm transition-colors shadow-md shadow-sky-500/20">
                    <Phone size={18} /> Sună
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- REAL ESTATE DESIGN ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setActiveTab('fotos')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'fotos' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Fotos
            </button>
            <button 
              onClick={() => setActiveTab('mapa')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'mapa' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Mapa
            </button>
            <button 
              onClick={() => setActiveTab('street')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'street' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Street View
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-bold hover:bg-gray-50 transition-all">
              <Heart size={16} className="text-[#f25c1a]" fill="#f25c1a" />
              Favorit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-bold hover:bg-gray-50 transition-all">
              <Share2 size={16} />
              Trimite
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-all ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
            {activeTab === 'fotos' && (
              <div className="grid grid-cols-6 gap-1.5">
                {images.map((img, idx) => {
                  let colSpan = "col-span-6 md:col-span-2"; // Default
                  let rowSpan = "h-[300px]";

                  if (idx === 0 || idx === 1) {
                    colSpan = "col-span-6 md:col-span-3";
                    rowSpan = "h-[320px] md:h-[450px]";
                  } else if (idx >= 2 && idx <= 4) {
                    colSpan = "col-span-6 md:col-span-2";
                    rowSpan = "h-[300px] md:h-[350px]";
                  }

                  return (
                    <div 
                      key={idx} 
                      onClick={() => onImageClick(idx)}
                      className={`relative overflow-hidden rounded-lg group cursor-pointer ${colSpan} ${rowSpan}`}
                    >
                      <Image 
                        src={img} 
                        alt={`${title} ${idx + 1}`} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  );
                })}
              </div>
            )}
            
            {activeTab === 'mapa' && (
              <div className="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <MapIcon size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Harta se încarcă...</p>
                </div>
              </div>
            )}
            
            {activeTab === 'street' && (
              <div className="w-full h-full bg-gray-900 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <Camera size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">Street View nu este disponibil momentan.</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-[400px] border-l border-gray-100 bg-white p-8 overflow-y-auto shrink-0">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm">
                  <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[18px] tracking-tight">{formatAgentName(agent.name)}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[14px] font-bold text-emerald-600">{agent.phone}</span>
                    <span className="text-gray-300">·</span>
                    <button className="text-[13px] font-bold text-emerald-600 hover:underline">Vezi telefon</button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-[16px]">Solicită informații</h4>
                <ContactForm property={{ id: 'temp', title, agent: { id: 'temp', ...agent } }} />
                
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-emerald-500 rounded-2xl text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-emerald-500 rounded-2xl text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
