'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDomain } from '@/context/DomainContext';

export default function Footer() {
  const pathname = usePathname();
  const { domain } = useDomain();
  if (pathname === '/publicar-anuncio' || pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">

          {/* Columna 1 - Marca */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold mb-4 inline-block">
              IMOOB<span className="text-[var(--primary)]">.</span><span className="text-xs text-gray-500">ro</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Platformă de anunțuri imobiliare din România. Locul perfect pentru a găsi casa ta de vis. Simplu, sigur și rapid.
            </p>

            {/* Social Links */}
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 002.856-3.515 10 10 0 01-2.856-1.36 5 5 0 00-2.165 1.1 10 10 0 00-3.688-.55 10 10 0 00-6.67 3.85c-1.61 1.61-2.558 3.78-2.558 6.07 0 .477.05.94.15 1.39-3.65-.27-6.97-1.92-9.34-4.42-.3-.4-.57-.82-.77-1.27a10 10 0 001.44 5.09 10 10 0 00-1.6-3.31c0 1.94.58 3.8 1.68 5.42-1.48.27-2.86.87-4 1.75 0 2.47 1.35 4.6 3.37 5.75-1.04.31-2.14.47-3.27.47-.71 0-1.4-.08-2.07-.24 3.1 9.68 11.5 16.76 21 16.76 9.47 0 17.9-7.08 21-16.76-1.7.42-3.43.64-5.2.64"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="currentColor" opacity="0"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor" stroke="white" strokeWidth="8"/>
                  <circle cx="18.5" cy="5.5" r="1.5" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 - Categorii */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">CATEGORII</h4>
            <ul className="space-y-3">
              {domain === 'imobiliare' ? (
                <>
                  <li><Link href="/propiedades?category=vanzari" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Vânzări</Link></li>
                  <li><Link href="/propiedades?category=inchirieri" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Închirieri</Link></li>
                  <li><Link href="/propiedades?category=apartamente" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Apartamente</Link></li>
                  <li><Link href="/propiedades?category=case" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Case</Link></li>
                  <li><Link href="/propiedades?category=terenuri" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Terenuri</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/auto?category=autoturisme" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Autoturisme</Link></li>
                  <li><Link href="/auto?category=motociclete" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Motociclete</Link></li>
                  <li><Link href="/auto?category=autoutilitare" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Autoutilitare</Link></li>
                  <li><Link href="/auto?category=camioane" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Camioane</Link></li>
                  <li><Link href="/auto?category=piese" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Piese Auto</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Columna 3 - Ajutor */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">AJUTOR</h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Centru de ajutor</Link></li>
              <li><Link href="/how-to-sell" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Cum să vânzii</Link></li>
              <li><Link href="/how-to-buy" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Cum să cumperi</Link></li>
              <li><Link href="/security" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Siguranță</Link></li>
              <li><Link href="/contacto" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Columna 4 - Legal */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">LEGAL</h4>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Termeni de utilizare</Link></li>
              <li><Link href="/privacy" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Politică de confidențialitate</Link></li>
              <li><Link href="/cookies" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Politică de cookies</Link></li>
              <li><Link href="/legal-notice" className="text-gray-600 text-sm hover:text-[var(--primary)] transition-colors duration-300">Aviz legal</Link></li>
            </ul>
          </div>

          {/* Columna 5 - App Mobile */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">APLICATIE MOBILĂ</h4>
            <p className="text-gray-600 text-sm mb-3">Ia-ți anunțurile cu tine</p>
            <div className="flex flex-col gap-3">
              <a href="#" className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300 text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.12-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.905-.04 1.77-.78 2.82-.76 1.5.03 2.63.87 3.33 2.14-3.1 1.88-2.6 5.43.48 6.34-.52 1.45-1.62 2.74-3.45 3.13l-.34-.01z"/>
                </svg>
                iOS
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300 text-xs font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.61 11h8.55V3H5.44c-.97 0-1.84.78-1.84 1.73v6.27zm16.56-7v8.55h8.55v-8.55h-8.55zm0 10.28v8.55h8.55v-8.55h-8.55zM3.61 12.73v8.55h8.55v-8.55H3.61z"/>
                </svg>
                Android
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-stone-200 pt-8 text-center">
          <p className="text-gray-500 text-xs">
            © {currentYear} IMOOB. Tutti i diritti riservati | În curând disponibil!
          </p>
        </div>
      </div>
    </footer>
  );
}
