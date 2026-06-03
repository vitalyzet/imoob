'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Calendar, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function ContactedPage() {
  const { user } = useAuth();
  const [contactedAds, setContactedAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Un anuncio contactado es un chat donde el usuario actual es el "buyerId"
    const q = query(
      collection(db, 'chats'),
      where('buyerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let adsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenar por fecha de última actualización
      adsData.sort((a: any, b: any) => {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
        return timeB - timeA;
      });

      setContactedAds(adsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-[20px] p-20 flex flex-col items-center justify-center border border-gray-100 shadow-sm min-h-[400px]">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Se încarcă anunțurile...</p>
      </div>
    );
  }

  if (!user || contactedAds.length === 0) {
    return (
      <div className="bg-white rounded-[40px] p-20 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-10 relative">
          <Mail size={40} strokeWidth={1.5} className="text-sky-500" />
        </div>
        <h3 className="text-[20px] font-bold text-gray-800 mb-3">Anunțuri contactate</h3>
        <p className="text-gray-500 font-medium max-w-sm text-[16px] leading-relaxed">
          Momentan nu ai contactat niciun anunț. Istoricul tău va apărea aici după ce trimiți mesaje vânzătorilor.
        </p>
        <Link href="/" className="mt-8 px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Caută anunțuri
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Anunțuri contactate</h2>
          <p className="text-gray-500 font-medium">Ai {contactedAds.length} anunțuri în istoricul tău de conversații.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactedAds.map((ad) => {
          const formattedDate = ad.updatedAt?.toDate 
            ? new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' }).format(ad.updatedAt.toDate()) 
            : 'Recent';

          // Determine property link based on if it's auto or imobiliare
          // We can guess by checking if it has auto-specific fields in the future, 
          // for now we link to the chat or the general property ID
          const linkHref = `/Profil/messages`;

          return (
            <div key={ad.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                {ad.propertyImage ? (
                  <Image 
                    src={ad.propertyImage} 
                    alt={ad.propertyTitle || 'Anunț'} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">Fără imagine</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                  <span className="text-[14px] font-black text-gray-900">
                    {ad.propertyPrice ? `€ ${ad.propertyPrice.toLocaleString('de-DE')}` : 'Preț la cerere'}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
                  {ad.propertyTitle || 'Anunț fără titlu'}
                </h3>
                
                <div className="flex flex-col gap-2 mb-4 mt-auto">
                  <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{ad.propertyAddress || 'România'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Contactat: {formattedDate}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden relative shrink-0">
                      {ad.sellerImage ? (
                        <Image src={ad.sellerImage} fill className="object-cover" alt="Vânzător" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-[12px]">
                          {(ad.sellerName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-[12px] font-bold text-gray-700 truncate max-w-[100px]">
                      {ad.sellerName || 'Vânzător'}
                    </span>
                  </div>
                  
                  <Link 
                    href={linkHref}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors"
                  >
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
