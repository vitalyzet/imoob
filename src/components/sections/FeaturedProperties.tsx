'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PropertyCard from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeaturedProperties() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'anuncios'), where('status', '==', 'active'));
        const snap = await getDocs(q);
        const mapped = snap.docs.map(doc => {
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
            featured: d.selectedPromotion === 'premium' || d.selectedPromotion === 'promovat' || d.selectedPromotion === 'promovado' || d.featured === true,
            createdAt: d.createdAt?.toDate() || new Date(),
          };
        });
        
        // Try to get featured ads first
        let featuredAds = mapped.filter(p => p.featured);
        
        // Fallback: If no featured ads, just take the most recent ones
        if (featuredAds.length === 0) {
          featuredAds = mapped.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 8);
        } else {
          featuredAds = featuredAds.slice(0, 8);
        }
        
        setFeatured(featuredAds);
      } catch (e) {
        console.error("Error fetching featured ads:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!loading && featured.length === 0) return null;

  return (
    <section className="py-24 bg-[#f8f8f8]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 underline-green-offset px-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-sans font-black text-[#333] uppercase tracking-tighter">
              Anunțuri <span className="text-[#139E69]">destacate</span>
            </h2>
            <div className="w-16 h-1 bg-[#139E69] mt-3 mb-6" />
            <p className="text-[#666] max-w-2xl text-base font-medium">
              Descoperă cele mai extraordinare rezidențe în cele mai bune locații.
            </p>
          </div>
          <Link 
            href="/propiedades"
            className="hidden md:flex items-center gap-2 text-[#666] hover:text-[#139E69] font-bold tracking-wide text-sm transition-colors border-2 border-gray-200 px-6 py-3 rounded-md bg-white shadow-sm"
          >
            Vezi catalogul complet <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-2">
          {loading ? (
             <div className="col-span-1 md:col-span-2 lg:col-span-4 py-20 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="animate-spin mb-4" size={40} />
               <p>Căutăm exclusivități...</p>
             </div>
          ) : (
            featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
