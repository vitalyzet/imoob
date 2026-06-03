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
              <p className="text-gray-500 text-sm max-w-[80%]">Actualizează-ți datele de contact, parola și preferințele contului tău Xmobe.</p>
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
