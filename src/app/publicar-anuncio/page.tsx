'use client';

import React, { useState } from 'react';
import { Building2, Car, ArrowRight, X, Sparkles, Shield, Eye } from 'lucide-react';
import Link from 'next/link';
import PropertyPublishForm from '@/components/properties/PropertyPublishForm';
import AutoPublishForm from '@/components/properties/AutoPublishForm';
import Logo from '@/components/layout/Logo';

export default function PublicarAnuncio() {
  const [selectedDomain, setSelectedDomain] = useState<'imobiliare' | 'auto' | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  if (selectedDomain === 'imobiliare') {
    return <PropertyPublishForm />;
  }

  if (selectedDomain === 'auto') {
    return <AutoPublishForm />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col relative overflow-hidden">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[13px] text-gray-400 font-medium">
              <Sparkles size={14} /> Publicare nouă
            </div>
            <Link href="/">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500">
                <X size={18} strokeWidth={2.5} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-[13px] font-bold text-gray-500 mb-8">
            <Sparkles size={14} className="text-amber-400" /> Formular inteligent adaptat nevoilor tale
          </div>
          <h1 className="text-4xl md:text-[44px] font-black text-[#1a1a2e] tracking-tight mb-5 leading-[1.15]">
            Ce dorești să publici?
          </h1>
          <p className="text-[17px] text-gray-500 font-medium leading-relaxed">
            Alege categoria potrivită și te vom ghida pas cu pas prin publicarea anunțului tău.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl mx-auto">
          
          {/* Card Imobiliare */}
          <button 
            onClick={() => setSelectedDomain('imobiliare')}
            onMouseEnter={() => setHoveredCard('imob')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative bg-white rounded-2xl p-8 md:p-10 text-left border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            {/* Accent gradient top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#139E69] to-[#10b981] rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            
            {/* Icon */}
            <div className="w-14 h-14 bg-[#139E69]/8 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#139E69]/15 transition-colors duration-300">
              <Building2 size={28} strokeWidth={1.5} className="text-[#139E69]" />
            </div>
            
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-2 tracking-tight group-hover:text-[#139E69] transition-colors duration-300">
              Imobiliare
            </h2>
            <p className="text-[14px] text-gray-500 font-medium leading-relaxed mb-8">
              Apartamente, case, terenuri sau spații comerciale. Vânzare și închiriere.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-400">
                <Eye size={13} /> 12.4k vizualizări/zi
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-400">
                <Shield size={13} /> Verificat
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[#139E69] font-bold text-[15px]">
              Începe publicarea <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </button>

          {/* Card Auto */}
          <button 
            onClick={() => setSelectedDomain('auto')}
            onMouseEnter={() => setHoveredCard('auto')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative bg-white rounded-2xl p-8 md:p-10 text-left border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            {/* Accent gradient top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            
            {/* Icon */}
            <div className="w-14 h-14 bg-[#0ea5e9]/8 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0ea5e9]/15 transition-colors duration-300">
              <Car size={28} strokeWidth={1.5} className="text-[#0ea5e9]" />
            </div>
            
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-2 tracking-tight group-hover:text-[#0ea5e9] transition-colors duration-300">
              Auto
            </h2>
            <p className="text-[14px] text-gray-500 font-medium leading-relaxed mb-8">
              Autoturisme, SUV-uri, mașini de lux, motociclete sau autoutilitare premium.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-400">
                <Eye size={13} /> 8.7k vizualizări/zi
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-400">
                <Shield size={13} /> Verificat
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[#0ea5e9] font-bold text-[15px]">
              Începe publicarea <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </button>

        </div>

        {/* Footer hint */}
        <p className="text-[13px] text-gray-400 font-medium mt-12 text-center">
          Publicarea este <span className="font-bold text-gray-600">gratuită</span>. Poți promova anunțul ulterior din panoul de control.
        </p>
      </div>
    </div>
  );
}
