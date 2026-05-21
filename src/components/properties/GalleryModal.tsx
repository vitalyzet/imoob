'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Heart, Share2, Map as MapIcon, Camera, LayoutGrid, Phone, MessageCircle, Send } from 'lucide-react';
import ContactForm from './ContactForm';
import { useDomain } from '@/context/DomainContext';
import AutoContactCard from './AutoContactCard';

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
}

export default function GalleryModal({ isOpen, onClose, onImageClick, images, title, agent }: GalleryModalProps) {
  const [activeTab, setActiveTab] = useState<'fotos' | 'mapa' | 'street'>('fotos');
  const { domain } = useDomain();

  if (!isOpen) return null;

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
                  <h3 className="font-bold text-gray-900 text-[18px] tracking-tight">{agent.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[14px] font-bold text-emerald-600">{agent.phone}</span>
                    <span className="text-gray-300">·</span>
                    <button className="text-[13px] font-bold text-emerald-600 hover:underline">Vezi telefon</button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-[16px]">Solicită informații</h4>
                <ContactForm />
                
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
