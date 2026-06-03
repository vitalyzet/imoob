'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AutoCard from '../properties/AutoCard';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedAutos() {
  const [autos, setAutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAutos = async () => {
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

        const data = snapshot.docs.filter(doc => !isAdExpired(doc.data())).map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            slug: d.slug || '',
            title: `${d.marca || ''} ${d.model || ''}`.trim() || 'Vehicul',
            price: Number(d.price) || 0,
            oldPrice: d.oldPrice ? Number(d.oldPrice) : null,
            pretNegociabil: d.pretNegociabil || false,
            year: d.an || '',
            mileage: d.rulaj ? Number(d.rulaj).toLocaleString('ro-RO') : '—',
            fuel: d.combustibil || '',
            transmission: d.transmisie || d.cutie || '',
            location: d.city || d.location || '',
            image: d.images?.[0] || '',
            promoType: d.promoType || (d.isPromoted ? 'standard' : null),
            createdAt: d.createdAt || null,
          };
        });
        setAutos(data);
      } catch (err) {
        console.error('Error fetching active autos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAutos();
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
