'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { List, MessageSquare, Heart, PlusSquare, TrendingUp, Wallet, ArrowRight, Loader2, User } from 'lucide-react';
import Image from 'next/image';

export default function OverviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ads: 0,
    messages: 0,
    favorites: 0,
    wallet: 0,
    userName: '',
    userImage: '',
    memberSince: ''
  });

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Fetch User details & Favorites & Wallet
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        let favCount = 0;
        let wallet = 0;
        let memberSince = '2026';
        if (userSnap.exists()) {
          const data = userSnap.data();
          favCount = (data.favorites?.length || 0) + (data.favoriteAutos?.length || 0);
          wallet = data.walletBalance || 0;
          if (data.createdAt?.toDate) {
            memberSince = data.createdAt.toDate().getFullYear().toString();
          }
        }

        // Fetch Imob Ads count
        const imobQ = query(collection(db, 'properties'), where('agent.id', '==', user.uid));
        const imobSnap = await getDocs(imobQ);
        
        // Fetch Auto Ads count
        const autoQ = query(collection(db, 'anuncios_auto'), where('userId', '==', user.uid));
        const autoSnap = await getDocs(autoQ);

        // Fetch Chats count
        const chatsQ = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
        const chatsSnap = await getDocs(chatsQ);

        setStats({
          ads: imobSnap.size + autoSnap.size,
          messages: chatsSnap.size,
          favorites: favCount,
          wallet: wallet,
          userName: user.displayName || userSnap.data()?.name || 'Utilizator',
          userImage: user.photoURL || '',
          memberSince
        });
      } catch (error) {
        console.error("Error fetching profile stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#f25c1a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f25c1a]/5 to-[#f25c1a]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden shrink-0 relative z-10">
          {stats.userImage ? (
            <Image src={stats.userImage} fill className="object-cover" alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f25c1a] to-[#ff7a3d] text-white font-bold text-3xl">
              {stats.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left flex-1 relative z-10">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Salutare, {stats.userName}! 👋</h2>
          <p className="text-gray-500 font-medium mb-4">Bine ai venit în panoul tău de control. Aici poți gestiona întreaga ta activitate.</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Cont Activ
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-200">
              Membru din {stats.memberSince}
            </span>
          </div>
        </div>
        
        <div className="shrink-0 relative z-10 w-full md:w-auto">
          <Link href="/publicar-anuncio" className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f25c1a] text-white rounded-xl font-bold shadow-[0_10px_30px_rgba(242,92,26,0.3)] hover:shadow-[0_10px_40px_rgba(242,92,26,0.4)] hover:-translate-y-1 transition-all">
            <PlusSquare size={20} />
            Adaugă Anunț
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link href="/Profil/my-ads" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] hover:border-[#f25c1a]/30 hover:shadow-[0_10px_30px_rgba(242,92,26,0.05)] transition-all group">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <List size={24} strokeWidth={2} />
          </div>
          <p className="text-gray-500 font-medium text-sm mb-1">Anunțurile mele</p>
          <h3 className="text-3xl font-black text-gray-900">{stats.ads}</h3>
        </Link>
        
        <Link href="/Profil/messages" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] hover:border-[#f25c1a]/30 hover:shadow-[0_10px_30px_rgba(242,92,26,0.05)] transition-all group">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} strokeWidth={2} />
          </div>
          <p className="text-gray-500 font-medium text-sm mb-1">Conversații</p>
          <h3 className="text-3xl font-black text-gray-900">{stats.messages}</h3>
        </Link>

        <Link href="/Profil/favoritos" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] hover:border-[#f25c1a]/30 hover:shadow-[0_10px_30px_rgba(242,92,26,0.05)] transition-all group">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Heart size={24} strokeWidth={2} />
          </div>
          <p className="text-gray-500 font-medium text-sm mb-1">Salvate</p>
          <h3 className="text-3xl font-black text-gray-900">{stats.favorites}</h3>
        </Link>

        <Link href="/Profil/wallet" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] hover:border-[#f25c1a]/30 hover:shadow-[0_10px_30px_rgba(242,92,26,0.05)] transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#f25c1a]/10 text-[#f25c1a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Wallet size={24} strokeWidth={2} />
          </div>
          <p className="text-gray-500 font-medium text-sm mb-1">Balanță Portofel</p>
          <h3 className="text-3xl font-black text-gray-900">{stats.wallet.toFixed(2)}€</h3>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div className="flex items-start gap-5 flex-1 w-full">
          <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-2xl flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-sky-900 mb-2">Avantajele contului tău Vindu24</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 text-sm text-sky-800 font-medium">
              <li className="flex flex-col gap-1.5 justify-center">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0"></span>
                    Anunțuri gratuite
                  </span>
                  <span className="text-[11px] font-black bg-sky-200/50 px-2 py-0.5 rounded-md text-sky-700">
                    {stats.ads}/5 utilizate
                  </span>
                </div>
                <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${stats.ads >= 5 ? 'bg-rose-500' : 'bg-sky-500'}`} 
                    style={{ width: `${Math.min((stats.ads / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0"></span>
                Maxim 15 fotografii pe anunț
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full shrink-0"></span>
                Reactivare gratuită după expirare
              </li>
            </ul>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-sky-200/50 pt-5 md:pt-0 md:pl-6">
          <p className="text-sky-900 font-bold text-sm mb-3 text-center md:text-left">Vrei anunțuri nelimitate?</p>
          <Link href="/Profil/subscription" className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-[13px] font-bold rounded-xl shadow-[0_8px_20px_rgba(14,165,233,0.25)] hover:shadow-[0_8px_25px_rgba(14,165,233,0.35)] transition-all hover:-translate-y-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Treci la PRO lunar
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/Profil/promote-ads" className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                <TrendingUp size={24} className="text-[#f25c1a]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Crește-ți vânzările</h3>
              <p className="text-gray-300 text-sm max-w-[80%] leading-relaxed">Promovează-ți anunțurile pentru a ajunge la mai mulți clienți și a vinde mai rapid.</p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[#f25c1a] font-bold text-sm group-hover:gap-3 transition-all">
              Promovează acum <ArrowRight size={16} />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-[#f25c1a]/20 rounded-full blur-3xl -mr-10 -mb-10 group-hover:bg-[#f25c1a]/30 transition-colors"></div>
        </Link>

        <Link href="/Profil/settings" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_5px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-gray-200 transition-colors">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <User size={24} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Setări Profil</h3>
              <p className="text-gray-500 text-sm max-w-[80%]">Actualizează-ți datele de contact, parola și preferințele contului tău Vindu24.</p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-gray-600 font-bold text-sm group-hover:gap-3 transition-all">
              Gestionează contul <ArrowRight size={16} />
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
