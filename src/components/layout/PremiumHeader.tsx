'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, User, Menu, X, ChevronDown, Bell, Globe, Car, Building2 } from 'lucide-react';
import { useDomain } from '@/context/DomainContext';

export default function PremiumHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { domain, setDomain } = useDomain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleDomainChange = (targetDomain: 'imobiliare' | 'auto') => {
    setDomain(targetDomain);
    
    // If we are not on the home page, redirect to home page so the new domain vertical is displayed
    if (pathname !== '/') {
      router.push('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Propiedades', href: '/propiedades' },
    { name: 'Vender', href: '/publicar-anuncio' },
    { name: 'Servicios', href: '#' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 py-4 ${
        scrolled ? 'translate-y-2' : 'translate-y-0'
      }`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`mx-auto max-w-7xl rounded-[24px] transition-all duration-500 border ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-white/40 py-2' 
            : 'bg-transparent border-transparent py-3'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
              <span className="text-white font-black text-xl">I</span>
            </div>
            <span className={`text-2xl font-black tracking-tighter ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              IMOB<span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          {/* Domain Switcher */}
          <div className="hidden md:flex bg-gray-100 p-1 rounded-full relative items-center cursor-pointer shadow-inner border border-gray-200/60 mx-4">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                domain === 'imobiliare' ? 'left-1' : 'left-[calc(50%+3px)]'
              }`}
            />
            <button
              onClick={() => handleDomainChange('imobiliare')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-black transition-colors ${
                domain === 'imobiliare' ? 'text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Building2 size={14} /> IMOBILIARE
            </button>
            <button
              onClick={() => handleDomainChange('auto')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-black transition-colors ${
                domain === 'auto' ? 'text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Car size={14} /> AUTO
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative text-[15px] font-bold text-gray-600 hover:text-gray-900 transition-colors group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden sm:flex p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
              <Search size={20} strokeWidth={2} />
            </button>
            <button className="hidden sm:flex p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-all relative">
              <Heart size={20} strokeWidth={2} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>

            <Link 
              href="/auth" 
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-200 active:scale-95"
            >
              <User size={16} />
              <span>Acceder</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-[calc(100%+8px)] left-4 right-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[90]"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-gray-800 hover:text-[var(--primary)] transition-colors p-2"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              
              {/* Mobile Domain Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-full relative items-center cursor-pointer shadow-inner border border-gray-200/60 mt-2">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                    domain === 'imobiliare' ? 'left-1' : 'left-[calc(50%+3px)]'
                  }`}
                />
                <button
                  onClick={() => { handleDomainChange('imobiliare'); setMobileMenuOpen(false); }}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-black transition-colors ${
                    domain === 'imobiliare' ? 'text-[var(--primary)]' : 'text-gray-400'
                  }`}
                >
                  <Building2 size={16} /> IMOBILIARE
                </button>
                <button
                  onClick={() => { handleDomainChange('auto'); setMobileMenuOpen(false); }}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-black transition-colors ${
                    domain === 'auto' ? 'text-[var(--primary)]' : 'text-gray-400'
                  }`}
                >
                  <Car size={16} /> AUTO
                </button>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Link 
                  href="/auth"
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold"
                >
                  <User size={18} />
                  Acceder
                </Link>
                <Link 
                  href="/publicar-anuncio"
                  className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white py-4 rounded-2xl font-bold"
                >
                  Publicar Gratis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
