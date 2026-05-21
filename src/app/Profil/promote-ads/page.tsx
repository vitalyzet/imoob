'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, ArrowRight, Loader2, MapPin, Eye, LayoutGrid, CalendarDays, RefreshCcw, ChevronRight, Star, Wallet } from 'lucide-react';
import Link from 'next/link';
import { collection, getDocs, doc, getDoc, updateDoc, query, increment, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PromoteAdsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [adsState, setAdsState] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [promotingAdInfo, setPromotingAdInfo] = useState<{id: string, title: string} | null>(null);
  const [showFundsAlert, setShowFundsAlert] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [promoDuration, setPromoDuration] = useState<'15' | '30'>('15');

  useEffect(() => {
    const fetchAds = async () => {
        if (!user) return;
      try {
        
        const qImob = query(collection(db, 'anuncios'));
        const qAuto = query(collection(db, 'anuncios_auto'));
        
        const [snapImob, snapAuto] = await Promise.all([getDocs(qImob), getDocs(qAuto)]);
        
        let fetchedAds = [
          ...snapImob.docs.map(doc => ({ id: doc.id, ...doc.data(), domainType: 'imob' })),
          ...snapAuto.docs.map(doc => ({ id: doc.id, ...doc.data(), domainType: 'auto' }))
        ];
        
        // Strictly filter to ONLY show the logged in user's ads
        fetchedAds = fetchedAds.filter((ad: any) => ad.userId === user.uid);
        
        // Sort by newest
        fetchedAds.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setAdsState(fetchedAds);
      } catch (error) {
        console.error("Error recuperando anuncios", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [user]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (user) {
        const u = await getDoc(doc(db, 'users', user.uid));
        if (u.exists()) {
          setWalletBalance(u.data().walletBalance || 0);
        }
      }
    };
    fetchTokens();
  }, [user]);

  const openPromoModal = (id: string, adTitle: string) => {
    setPromotingAdInfo({ id, title: adTitle });
    setPromoDuration('15');
  };

  const handlePromoteSelection = async (type: 'standard' | 'gold') => {
    if (!user || !promotingAdInfo) return;
    
    const baseCost = type === 'standard' ? 3 : 6;
    const durationMultiplier = promoDuration === '30' ? 2 : 1;
    const finalCost = baseCost * durationMultiplier;

    if (walletBalance < finalCost) {
      setShowFundsAlert(true);
      setPromotingAdInfo(null);
      return;
    }

    setPromotingId(promotingAdInfo.id);
    const adId = promotingAdInfo.id;
    const title = promotingAdInfo.title;
    setPromotingAdInfo(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      const newTx = {
        id: 'tx_' + Date.now(),
        label: `Promovare ${type === 'gold' ? 'GOLD VIP' : 'STANDARD'} (${promoDuration}z): ${title}`,
        am: `-${finalCost.toFixed(2)}€`,
        date: new Date().toLocaleString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        type: 'out',
        category: 'promo',
        timestamp: Date.now()
      };

      await updateDoc(userRef, {
        walletBalance: increment(-finalCost),
        walletHistory: arrayUnion(newTx)
      });
      
      setWalletBalance(w => w - finalCost);

      // Find which collection to update
      const adToUpdate = adsState.find(ad => ad.id === adId);
      const collectionName = adToUpdate?.domainType === 'auto' ? 'anuncios_auto' : 'anuncios';

      const adRef = doc(db, collectionName, adId);
      await updateDoc(adRef, { 
        isPromoted: true,
        promoType: type,
        reach: type === 'gold' ? 180 : 92,
        views: type === 'gold' ? 300 : 150
      });

      setAdsState(prev => prev.map(ad => 
        ad.id === adId ? { ...ad, isPromoted: true, promoType: type, reach: type === 'gold' ? 180 : 92, views: (ad.views || 0) + (type === 'gold' ? 300 : 150) } : ad
      ));
    } catch (error) {
      console.error('Failed to apply token:', error);
      alert('Eroare la aplicarea pachetului.');
    } finally {
      if (promotingId === adId) setPromotingId(null);
    }
  };

  const eligibleAds = adsState.filter(ad => !ad.isPromoted && (ad.status === 'active' || ad.status === 'pending'));

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-fade-in">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 mb-8">
        <div className="flex-1">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-[#f25c1a] mb-4">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Multiplică-ți șansele de vânzare</h2>
          <p className="text-gray-500 font-medium mb-6">
            Anunțurile promovate primesc cu până la 10x mai multe contacte. Alege cel mai bun loc pentru proprietatea ta.
          </p>
          <Link href="/publicar-anuncio" className="inline-flex items-center gap-2 bg-[#f25c1a] hover:bg-[#e04d0e] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20">
            Promovează un anunț acum <ArrowRight size={18} />
          </Link>
        </div>
        <div className="w-full md:w-1/3 space-y-4">
          {['Prima poziție în rezultate', 'Vizibilitate maximă', 'Statistici avansate'].map((benefit, i) => (
             <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-orange-50 shadow-sm">
                <CheckCircle size={18} className="text-[#f25c1a] shrink-0" />
                <span className="text-sm font-bold text-gray-700">{benefit}</span>
             </div>
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        Alege un anunț pentru a-l promova
        <span className="bg-gray-100 text-gray-500 text-[12px] px-2 py-0.5 rounded-md font-bold">{eligibleAds.length} eligibile</span>
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[#f25c1a]" size={32} />
        </div>
      ) : eligibleAds.length === 0 ? (
        <div className="text-center py-10 mt-8 border-t border-gray-100">
           <h3 className="text-xl font-bold text-gray-500 mb-2">Nu ai anunțuri eligibile în acest moment.</h3>
           <p className="text-gray-400">Momentan wszystkie anuncio están promovidos, inactivos o no has publicado ninguno.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eligibleAds.map(ad => (
            <div key={ad.id} className="bg-white rounded-[20px] border border-gray-100/80 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] overflow-hidden transition-all flex flex-col group relative">
              {/* Image Header */}
              <div className="h-[140px] w-full relative">
                <img src={ad.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&h=400&q=80'} alt="Ad" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex flex-col">
                  <span className="text-white font-black text-lg leading-tight">{ad.price ? `${Number(ad.price).toLocaleString('es-ES')} €` : 'Consulta'}</span>
                  <div className="text-white/80 text-[11px] font-bold flex items-center gap-1"><MapPin size={10} /> {ad.city || 'Desconocido'}</div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="text-[14px] font-black text-gray-800 leading-tight mb-1"><span className="capitalize">{ad.type || 'Inmueble'}</span> en <span className="lowercase">{ad.operation || 'transacción'}</span></h4>
                  
                  <div className="flex flex-wrap gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1"><LayoutGrid size={10} /> {ad.area || '-'} m²</span>
                    <span className="flex items-center gap-1"><CalendarDays size={10} /> {ad.createdAt?.seconds ? new Date(ad.createdAt.seconds * 1000).toLocaleDateString('es-ES') : 'Reciente'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => openPromoModal(ad.id, `${ad.type} en ${ad.city}`)}
                  disabled={promotingId === ad.id}
                  className="w-full py-2.5 rounded-xl bg-orange-50 hover:bg-[#f25c1a] text-[#f25c1a] hover:text-white text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-orange-100 disabled:opacity-50"
                >
                  {promotingId === ad.id ? <RefreshCcw size={14} className="animate-spin" /> : <TrendingUp size={14} />}
                  {promotingId === ad.id ? 'Se activează...' : `Aplică Pachet`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Promo Selection Modal */}
      {promotingAdInfo && !showFundsAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col p-8 relative">
            <button onClick={() => setPromotingAdInfo(null)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
               <span className="font-bold">✕</span>
            </button>
            <h3 className="text-2xl font-black text-gray-900 mb-1">Boost Anunț</h3>
            <p className="text-sm font-bold text-gray-400 mb-6 tracking-tight">Selectează planul de promovare dorit pentru '{promotingAdInfo.title}'</p>
            
            {/* Duration Toggle (iOS Style Segmented Control) */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-[14px] mb-8 w-full max-w-[260px] mx-auto shadow-inner border border-slate-200/60">
              <button
                onClick={() => setPromoDuration('15')}
                className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${promoDuration === '15' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                15 Zile
              </button>
              <button
                onClick={() => setPromoDuration('30')}
                className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${promoDuration === '30' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                30 Zile
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Standard Tier */}
              <button 
                onClick={() => handlePromoteSelection('standard')}
                className="flex items-center justify-between p-4 sm:p-5 rounded-[24px] border-2 border-gray-100/80 bg-white hover:border-[#f25c1a]/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-[16px] flex items-center justify-center text-gray-400 group-hover:bg-[#f25c1a] group-hover:text-white transition-colors duration-300">
                    <TrendingUp size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-[15px] group-hover:text-[#f25c1a] transition-colors">Standard (5x Vizibilitate)</span>
                    <span className="text-[11px] font-bold text-gray-400 mt-0.5">Preț: <span className="text-gray-900 font-extrabold ml-0.5">{promoDuration === '30' ? '6.00€' : '3.00€'}</span></span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-orange-50 group-hover:text-[#f25c1a] transition-colors duration-300">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </button>

              {/* Gold Tier */}
              <div className="relative mt-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md z-20 border-2 border-white">Recomandat</div>
                <button 
                  onClick={() => handlePromoteSelection('gold')}
                  className="w-full flex items-center justify-between p-4 sm:p-5 rounded-[24px] border-2 border-amber-200 hover:border-amber-400 bg-gradient-to-br from-[#FFFAF0] to-[#FFF5EB] hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4 relative z-10 w-full justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[16px] flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Star size={20} fill="currentColor" strokeWidth={0} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-amber-600 text-[15px] drop-shadow-sm">Gold VIP (10x Vizibilitate)</span>
                        <span className="text-[11px] font-bold text-amber-700/60 mt-0.5">Preț: <span className="text-amber-600 font-extrabold ml-0.5">{promoDuration === '30' ? '12.00€' : '6.00€'}</span></span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-amber-400 group-hover:bg-amber-100 group-hover:text-amber-600 shadow-sm transition-colors duration-300 z-10">
                      <ChevronRight size={16} strokeWidth={3} />
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Insufficient Funds Modal */}
      {showFundsAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl overflow-hidden flex flex-col p-8 items-center text-center animate-fade-in relative">
            <button onClick={() => setShowFundsAlert(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
               <span className="font-bold">✕</span>
            </button>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border-4 border-red-100">
               <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Fonduri Insuficiente</h3>
            <p className="text-sm font-bold text-gray-500 mb-6">Nu ai suficienți bani în portofel pentru a aplica acest plan de promovare. Ai {walletBalance.toFixed(2)}€ disponibili.</p>
            <div className="w-full flex flex-col gap-3">
              <button onClick={() => router.push('/Profil/wallet')} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-black text-xs uppercase tracking-[2px] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                 <Wallet size={16} /> Alimentează Portofelul
              </button>
              <button onClick={() => setShowFundsAlert(false)} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                 Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
