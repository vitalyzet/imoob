'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or declined cookies
    const consent = localStorage.getItem('vindu24_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vindu24_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('vindu24_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10 pointer-events-auto transform transition-all duration-500 translate-y-0">
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🍪</span>
            <h3 className="text-gray-900 font-black text-lg">Respectăm confidențialitatea ta</h3>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Folosim cookie-uri și tehnologii similare pentru a-ți oferi o experiență mai bună, 
            pentru a analiza traficul și pentru a personaliza conținutul. Poți alege să accepți toate 
            cookie-urile sau să le gestionezi. Află mai multe în{' '}
            <Link href="/cookies" className="text-sky-500 hover:text-sky-600 font-bold underline transition-colors">
              Politica de Cookies
            </Link> 
            {' '}și{' '}
            <Link href="/privacy" className="text-sky-500 hover:text-sky-600 font-bold underline transition-colors">
              Politica de Confidențialitate
            </Link>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleDecline}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-[13px]"
          >
            Doar necesare
          </button>
          <button 
            onClick={handleAccept}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black shadow-lg shadow-gray-900/20 transition-all hover:scale-105 active:scale-95 text-[13px]"
          >
            Accept toate
          </button>
        </div>

      </div>
    </div>
  );
}
