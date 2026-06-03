'use client';

import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AUTO_RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Autoturisme',
    subtitle: 'mașini de oraș & sport',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    size: 'tall',
    link: '/auto?category=Autoturisme',
  },
  {
    id: 3,
    title: 'Motociclete',
    subtitle: 'sport, touring & chopper',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    size: 'small',
    link: '/auto?category=Motociclete',
  },
  {
    id: 4,
    title: 'Vânzare',
    subtitle: 'SUV & 4x4',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    size: 'wide',
    link: '/auto?category=Autoturisme&caroserie=suv',
  },
  {
    id: 6,
    title: 'Camioane',
    subtitle: 'transport greu & logistică',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    size: 'wide',
    link: '/auto?category=Camioane',
  },
];

export default function RecommendedAutoSearches() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight mb-4">
            Căutări <span className="text-[#5ae4c0]">Recomandate</span>
          </h2>
          <div className="w-20 h-1.5 bg-[#5ae4c0] mx-auto rounded-full"></div>
        </div>

        {/* Masonry-like Grid Layout with one Wide element */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {AUTO_RECOMMENDATIONS.map((item) => (
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
                  <div className="text-2xl font-black tracking-tight leading-tight group-hover:text-[#5ae4c0] transition-colors">
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
            href="/auto"
            className="group flex items-center gap-3 text-gray-500 hover:text-[#5ae4c0] font-black uppercase tracking-widest text-[10px] transition-all"
          >
            Explorează toate categoriile
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
