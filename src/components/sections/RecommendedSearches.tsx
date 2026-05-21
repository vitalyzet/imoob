'use client';

import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Închiriere',
    subtitle: 'apartamente în București',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    size: 'tall',
    link: '/propiedades?status=for-rent&type=apartament',
  },
  {
    id: 2,
    title: 'Vânzare',
    subtitle: 'case & vile',
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800',
    size: 'small',
    link: '/propiedades?status=for-sale&type=casa',
  },
  {
    id: 3,
    title: 'Închiriere',
    subtitle: 'în Cluj-Napoca',
    image: 'https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&q=80&w=800',
    size: 'small',
    link: '/propiedades?status=for-rent&city=Cluj-Napoca',
  },
  {
    id: 4,
    title: 'Închiriere',
    subtitle: 'în București',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=800',
    size: 'small',
    link: '/propiedades?status=for-rent&city=Bucuresti',
  },
  {
    id: 5,
    title: 'Locuințe',
    subtitle: 'în Iași',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    size: 'small',
    link: '/propiedades?city=Iasi',
  },
  {
    id: 6,
    title: 'Vânzare',
    subtitle: 'apartamente de lux',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    size: 'wide',
    link: '/propiedades?status=for-sale&type=apartament',
  },
];

export default function RecommendedSearches() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight mb-4">
            Căutări <span className="text-[#139E69]">Recomandate</span>
          </h2>
          <div className="w-20 h-1.5 bg-[#139E69] mx-auto rounded-full"></div>
        </div>

        {/* Masonry-like Grid Layout with one Wide element */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {RECOMMENDATIONS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 0.98 }}
              className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg ${
                item.size === 'tall' ? 'row-span-2' : 
                item.size === 'wide' ? 'md:col-span-2' : 
                'col-span-1'
              }`}
            >
              <Link href={item.link}>
                <img
                  src={item.image}
                  alt={item.subtitle}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[2px]"
                  loading="eager"
                />
                {/* Elegant Black Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500"></div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                {/* Content Top Left */}
                <div className="absolute top-6 left-6 text-white">
                  <div className="text-2xl font-black tracking-tight leading-tight group-hover:text-[#139E69] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-sm font-medium text-white/80 tracking-wide">
                    {item.subtitle}
                  </div>
                </div>

                {/* Content Bottom Left */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  Vezi mai mult <ChevronRight size={16} />
                </div>
                
                {/* Always visible hint */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest group-hover:hidden">
                  Vezi mai mult <ChevronRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Footer */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/propiedades"
            className="group flex items-center gap-3 text-gray-500 hover:text-[#139E69] font-black uppercase tracking-widest text-[10px] transition-all"
          >
            Explorează toate categoriile
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
