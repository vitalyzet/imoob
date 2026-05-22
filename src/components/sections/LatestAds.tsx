'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PropertyCard from '@/components/properties/PropertyCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Loader2, LayoutGrid, List as ListIcon } from 'lucide-react';
import PropertyListCard from '@/components/properties/PropertyListCard';
import PropertyRowCard from '@/components/properties/PropertyRowCard';

const TABS = [
  { id: 'Compra', label: 'Compra' },
  { id: 'Alquiler', label: 'Alquiler' },
  { id: 'Obra nueva', label: 'Obra nueva' },
];

export default function LatestAds() {
  const [activeTab, setActiveTab] = useState('Compra');
  const [firebaseProperties, setFirebaseProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'anuncios'), where('status', '==', 'active'));

    // Real-time listener for homepage ads
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mapped = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          title: `${d.type ? d.type.charAt(0).toUpperCase() + d.type.slice(1) : 'Imobil'} de ${d.operation === 'vanzare' || d.operation === 'vender' ? 'vânzare' : 'închiriat'} în ${d.localitate || d.city || 'Ubicación Desconocida'}`,
          slug: doc.id,
          price: Number(d.price) || 0,
          oldPrice: d.oldPrice ? Number(d.oldPrice) : null,
          status: d.operation === 'vender' ? 'for-sale' : 'for-rent',
          propertyType: d.type || 'Piso',
          location: {
            city: d.localitate || d.city || '',
            state: d.judet || d.zipCode || '', 
          },
          features: {
            bedrooms: parseInt(d.rooms) || parseInt(d.bedrooms) || 0,
            bathrooms: parseInt(d.baths) || parseInt(d.bai) || parseInt(d.bathrooms) || 0,
            area: parseFloat(d.area) || parseFloat(d.suprafataUtila) || 0,
          },
          images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'],
          isNewConstruction: d.condition === 'new',
          featured: d.isPromoted === true,
          promoType: d.promoType || (d.isPromoted ? 'standard' : null),
          timestamp: d.createdAt?.toMillis ? d.createdAt.toMillis() : Date.now(),
        };
      });
      
      mapped.sort((a, b) => {
        // Priority 1: Gold
        if (a.promoType === 'gold' && b.promoType !== 'gold') return -1;
        if (a.promoType !== 'gold' && b.promoType === 'gold') return 1;
        
        // Priority 2: Standard
        if (a.promoType === 'standard' && b.promoType !== 'standard') return -1;
        if (a.promoType !== 'standard' && b.promoType === 'standard') return 1;
        
        // Priority 3: Native timestamp
        return b.timestamp - a.timestamp;
      });
      
      setFirebaseProperties(mapped);
      setLoading(false);
      console.log("[LatestAds] Real-time props update");
    }, (error) => {
      console.error("Error fetching real-time ads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const { featured, regular } = useMemo(() => {
    const filtered = firebaseProperties.filter(p => {
      if (activeTab === 'Compra') return p.status === 'for-sale' && !p.isNewConstruction;
      if (activeTab === 'Alquiler') return p.status === 'for-rent';
      if (activeTab === 'Obra nueva') return p.isNewConstruction === true;
      return true;
    });

    // Top section: only Gold VIP
    const featuredAds = filtered.filter(p => p.promoType === 'gold');

    // Bottom section: everything else, but sorted (Standard first)
    const regularAds = filtered.filter(p => p.promoType !== 'gold');
    
    // Sort regular ads so 'standard' comes first
    regularAds.sort((a, b) => {
      const priorityA = a.promoType === 'standard' ? 2 : a.promoType === 'normal' ? 1 : 0;
      const priorityB = b.promoType === 'standard' ? 2 : b.promoType === 'normal' ? 1 : 0;
      return priorityB - priorityA;
    });

    return {
      featured: featuredAds,
      regular: regularAds
    };
  }, [activeTab, firebaseProperties]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#f25c1a] shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-100 rounded-xl shadow-sm ml-4">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#f25c1a] shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
               title="Ver en Cuadrícula"
             >
               <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#f25c1a] shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
               title="Ver en Lista"
             >
               <ListIcon size={20} />
             </button>
          </div>
        </div>

        <div className="flex flex-col gap-20">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p>Cargando propiedades...</p>
            </div>
          ) : (
            <>
              {/* Featured Section */}
              {featured.length > 0 && (
                <div className="w-full">
                  <div className="flex flex-col mb-10">
                    <div className="flex items-center gap-4 mb-2">
                       <span className="h-1.5 w-12 bg-amber-400 rounded-full"></span>
                       <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                          Propiedades <span className="text-amber-500">Destacadas</span>
                       </h3>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Selección premium de los mejores anuncios</p>
                  </div>
                  
                   <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-8 max-w-5xl mx-auto"}>
                    <AnimatePresence mode="popLayout">
                    {featured.map((property: any) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {viewMode === 'grid' ? (
                          <PropertyCard property={property} />
                        ) : (
                          <PropertyRowCard property={property} />
                        )}
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Latest Section */}
              <div className="w-full">
                <div className="flex flex-col mb-10">
                  <div className="flex items-center gap-4 mb-2">
                     <span className="h-1.5 w-12 bg-[#f25c1a] rounded-full"></span>
                     <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                        Últimos <span className="text-[#f25c1a]">Anuncios</span>
                     </h3>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Descubre las novedades más recientes en el mercado</p>
                </div>
                
                {regular.length > 0 ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-8 max-w-5xl mx-auto"}>
                    <AnimatePresence mode="popLayout">
                    {regular.map((property: any) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {viewMode === 'grid' ? (
                          <PropertyCard property={property} />
                        ) : (
                          <PropertyRowCard property={property} />
                        )}
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="py-24 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium italic">No hay anuncios normales disponibles en esta categoría.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link 
            href="/propiedades"
            className="group flex items-center gap-3 bg-[#2b3543] hover:bg-[#139E69] text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl"
          >
            Explorar todas las propiedades
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
