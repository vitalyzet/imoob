'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import PropertyRowCard from '@/components/properties/PropertyRowCard';
import PropertyCard from '@/components/properties/PropertyCard';
import AutoCard from '@/components/properties/AutoCard';
import AutoRowCard from '@/components/properties/AutoRowCard';

export default function FavoritosPage() {
  const { favorites: favoriteIds, isLoaded } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    if (!isLoaded) return;
    
    if (favoriteIds.length === 0) {
      setFavoriteProperties([]);
      setIsLoading(false);
      return;
    }
    
    const fetchProps = async () => {
      setIsLoading(true);
      try {
        const promises = favoriteIds.map(id => getDoc(doc(db, 'anuncios', id)));
        const snapshots = await Promise.all(promises);
        
        const items = [];
        const missingIds = [];

        snapshots.forEach((s, idx) => {
          if (s.exists()) {
            items.push({ snap: s, type: 'imobiliare' });
          } else {
            missingIds.push(favoriteIds[idx]);
          }
        });

        if (missingIds.length > 0) {
          const autoPromises = missingIds.map(id => getDoc(doc(db, 'anuncios_auto', id)));
          const autoSnapshots = await Promise.all(autoPromises);
          autoSnapshots.forEach(s => {
            if (s.exists()) {
              items.push({ snap: s, type: 'auto' });
            }
          });
        }
        
        const mapped = items.map(item => {
          const d = item.snap.data();
          if (item.type === 'auto') {
            return {
              id: item.snap.id,
              _isAuto: true,
              title: `${d.marca || ''} ${d.model || ''}`.trim() || 'Vehicul',
              price: Number(d.price) || 0,
              oldPrice: d.oldPrice ? Number(d.oldPrice) : null,
              pretNegociabil: d.pretNegociabil || false,
              year: d.an || '',
              mileage: d.rulaj ? Number(d.rulaj).toLocaleString('ro-RO') : '—',
              fuel: d.combustibil || '',
              transmission: d.transmisie || d.cutie || '',
              location: d.city || d.localitate || '',
              image: d.images?.[0] || '',
              images: d.images || [],
              promoType: d.promoType || (d.isPromoted ? 'standard' : null),
              createdAt: d.createdAt || d.timestamp || null,
              description: d.description || '',
              agent: {
                id: d.userId || d.uid || d.email || 'anonimo',
                name: d.name || 'Proprietar Anonim',
                email: d.email || '',
                phone: d.phone || '+40 000 000 000',
                role: 'Proprietar Particular',
                image: d.agentImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
              },
            };
          } else {
            let status = (d.operation === 'vender' || d.operation === 'vanzare') ? 'for-sale' : 'for-rent';
            if (d.type === 'camera') status = 'for-rent';
            
            let typeName = d.type || 'Inmueble';
            const displayCity = d.localitate || d.city || d.judet || 'România';
            if (typeName === 'camera') typeName = 'Cameră';
            
            return {
              id: item.snap.id,
              title: d.title || `${typeName} de ${status === 'for-sale' ? 'Vânzare' : 'Închiriat'} în ${displayCity}`,
              slug: item.snap.id,
              description: d.description ? d.description.substring(0, 160) + '...' : 'Sin descripción.',
              longDescription: d.description || '',
              price: Number(d.price) || 0,
              oldPrice: d.oldPrice ? Number(d.oldPrice) : null,
              currency: 'EUR',
              type: d.type || 'apartment',
              status: status,
              location: {
                address: d.address || '',
                city: d.localitate || d.city || d.judet || '',
                state: d.judet || '',
                country: 'România',
                zipCode: d.zipCode || '',
                lat: 0,
                lng: 0,
              },
              features: {
                bedrooms: parseInt(d.rooms) || parseInt(d.bedrooms) || 0,
                bathrooms: parseInt(d.baths) || parseInt(d.bai) || parseInt(d.bathrooms) || 0,
                area: parseFloat(d.area) || parseFloat(d.suprafataUtila) || 0,
                garage: 0,
                yearBuilt: 2024,
                floors: Number(d.floor) || 1,
              },
              images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'],
              amenities: d.amenities || [],
              roommateDetails: d.type === 'camera' ? {
                cautaColeg: d.cautaColeg || false,
                nrPersoaneActual: d.nrPersoaneActual || '',
                preferinteColeg: d.preferinteColeg || '',
                cheltuieliIncluse: d.cheltuieliIncluse || 'nu',
                frigiderPersonal: d.frigiderPersonal || 'la comun',
                cameraCuCheie: d.cameraCuCheie || 'nu',
                animaleAceptate: d.animaleAceptate || 'nu'
              } : undefined,
              featured: d.promoType === 'gold',
              agent: {
                id: d.userId || d.uid || d.email || 'anonimo',
                name: d.name || 'Proprietar Anonim',
                email: d.email || '',
                phone: d.phone || '+40 000 000 000',
                role: 'Proprietar Particular',
                image: d.agentImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
              },
            };
          }
        });
        
        setFavoriteProperties(mapped);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProps();
  }, [favoriteIds, isLoaded]);
  
  return (
    <div className="flex flex-col gap-6">
      {!isLoaded || isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#139E69]" size={32} />
        </div>
      ) : favoriteProperties.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">Anunțuri salvate ({favoriteProperties.length})</h2>
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#f25c1d]' : 'text-gray-400 hover:text-gray-600'}`}
                title="Afișare listă"
              >
                <List size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#f25c1d]' : 'text-gray-400 hover:text-gray-600'}`}
                title="Afișare carduri"
              >
                <LayoutGrid size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="flex flex-col gap-5">
              {favoriteProperties.map(property => (
                property._isAuto ? (
                  <div key={property.id}><AutoRowCard auto={property} /></div>
                ) : (
                  <PropertyRowCard key={property.id} property={property} />
                )
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {favoriteProperties.map(property => (
                property._isAuto ? (
                  <div key={property.id} className="h-96"><AutoCard auto={property} /></div>
                ) : (
                  <PropertyCard key={property.id} property={property} />
                )
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-10 relative">
            <Heart size={40} strokeWidth={1.5} className="text-[#f25c1a]" fill="none" />
          </div>
          <h3 className="text-[20px] font-bold text-gray-800 mb-3">Lista ta de favorite</h3>
          <p className="text-gray-500 font-medium max-w-sm text-[16px] leading-relaxed">
            Momentan nu ai niciun anunț salvat la favorite. Salvează anunțurile care îți plac pentru a le găsi mai ușor mai târziu.
          </p>
          <Link 
            href="/propiedades"
            className="mt-8 px-8 py-3.5 bg-gray-900 hover:bg-[#A13A17] text-white rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            Explorați proprietățile
          </Link>
        </div>
      )}
    </div>
  );
}
