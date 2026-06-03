'use client';

import Link from 'next/link';
import { MessageCircle, Hash, Camera, Briefcase, Video, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function PremiumFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Compañía',
      links: [
        { name: 'Sobre nosotros', href: '#' },
        { name: 'Nuestro equipo', href: '#' },
        { name: 'Carreras', href: '#' },
        { name: 'Blog inmobiliario', href: '#' },
      ]
    },
    {
      title: 'Servicios',
      links: [
        { name: 'Comprar propiedad', href: '#' },
        { name: 'Vender propiedad', href: '#' },
        { name: 'Alquiler vacacional', href: '#' },
        { name: 'Inversiones', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Términos de uso', href: '#' },
        { name: 'Privacidad', href: '#' },
        { name: 'Política de cookies', href: '#' },
        { name: 'Aviso legal', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-[#0a0f16] text-gray-400 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center mb-8">
              <Logo size="lg" dark={true} />
            </Link>
            <p className="text-lg leading-relaxed text-gray-500 mb-10 max-w-sm">
              Redefiniendo la experiencia inmobiliaria con tecnología y elegancia. Encuentra el lugar que siempre soñaste.
            </p>
            <div className="flex gap-4">
              {[MessageCircle, Camera, Hash, Briefcase].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="hover:text-emerald-500 transition-colors duration-300 flex items-center group">
                        <span className="w-0 group-hover:w-2 h-px bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-6">Recibe las mejores ofertas y noticias exclusivas.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Tu email..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-400 transition-colors group">
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="mt-10 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-sm">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-500">
                    <Mail size={16} />
                 </div>
                 contact@xmobe.ro
               </div>
               <div className="flex items-center gap-3 text-sm">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-500">
                    <Phone size={16} />
                 </div>
                 +40 700 000 000
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:row items-center justify-between gap-6 text-xs font-medium uppercase tracking-widest">
          <p>© {currentYear} Xmobe. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="#" className="hover:text-white transition-colors">Seguridad</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
