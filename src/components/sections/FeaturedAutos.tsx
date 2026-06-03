'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AutoCard from '../properties/AutoCard';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// Global in-memory cache to prevent reloading when navigating back
const cache = {
  data: null as any[] | null,
  timestamp: 0
};

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export default function FeaturedAutos() {
  const [autos, setAutos] = useState<any[]>(cache.data || []);
  const [loading, setLoading] = useState(!cache.data);

  useEffect(() => {
    const fetchFeatured = async () => {
      // If we have valid cache, skip fetching
      if (cache.data && (Date.now() - cache.timestamp) < CACHE_DURATION_MS) {
        return;
      }

      try {
        const q = query(
          collection(db, 'anuncios_auto'),
          where('status', '==', 'active'),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const isAdExpired = (d: any) => {
          if (d.status === 'expired' || d.status === 'inactive') return true;
          if (d.createdAt) {
            const created = d.createdAt.toDate ? d.createdAt.toDate() : new Date(d.createdAt);
            const expiry = new Date(created);
            expiry.setDate(expiry.getDate() + 30);
            return new Date() > expiry;
          }
          return false;
        };

        const mapped = snapshot.docs.filter(doc => !isAdExpired(doc.data())).map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug || doc.id,
            title: `${data.marca} ${data.model}`,
            price: Number(data.price) || 0,
            oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
            pretNegociabil: data.pretNegociabil || false,
            year: data.an || '',
            mileage: data.rulaj ? Number(data.rulaj).toLocaleString('ro-RO') : '—',
            fuel: data.combustibil || '',
            transmission: data.transmisie || data.cutie || '',
            location: data.city || '',
            image: data.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000',
            promoType: data.promoType || (data.isPromoted ? 'standard' : null),
            createdAt: data.createdAt?.toDate() || new Date(),
          };
        });

        // Get Gold/Premium first
        const promoted = mapped.filter(p => p.promoType === 'gold');
        const regular = mapped.filter(p => p.promoType !== 'gold').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        const finalCars = [...promoted, ...regular].slice(0, 8);

        // Save to cache
        cache.data = finalCars;
        cache.timestamp = Date.now();

        setAutos(finalCars);
      } catch (error) {
        console.error("Error fetching featured autos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Don't render section if no active auto ads
  if (!loading && autos.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
              Mașini <span className="text-[var(--primary)] relative">Recomandate
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[var(--primary)]/20 -z-10 rounded-full"></span>
              </span>
            </h2>
            <p className="text-gray-500 font-medium">Vezi cele mai atractive oferte auto din piață.</p>
          </div>
          <Link href="/auto" className="hidden md:flex items-center gap-2 text-[var(--primary)] font-bold hover:gap-3 transition-all bg-[var(--primary)]/10 px-6 py-3 rounded-xl">
            Vezi toate ofertele →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {autos.map((auto) => (
              <AutoCard key={auto.id} auto={auto} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
