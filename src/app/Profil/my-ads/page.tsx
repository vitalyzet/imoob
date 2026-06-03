'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, MapPin, Star, CalendarDays, MailX, ThumbsDown, Loader2, LayoutGrid, MessageSquare, Phone, Search, ThumbsUp, List, Wallet, Settings, LogOut, PlusSquare, Eye, Pencil, Trash2, RefreshCcw, BarChart3, TrendingUp, Check, ChevronDown, ChevronRight, Clock, CreditCard, ShieldCheck, BarChart, CheckCircle2, Car, Fuel, Gauge, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where, doc, getDoc, updateDoc, increment, arrayUnion, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyAdsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') || 'active';
    }
    return 'active';
  });
  const [adsState, setAdsState] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [promotingAdInfo, setPromotingAdInfo] = useState<{id: string, title: string} | null>(null);
  const [showFundsAlert, setShowFundsAlert] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [userProfilePhone, setUserProfilePhone] = useState('');
  const [userProfileCity, setUserProfileCity] = useState('');
  const [promoDuration, setPromoDuration] = useState<'15' | '30'>('15');
  const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>({});
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Custom Edit Panel States
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    price: '',
    description: '',
    phone: '',
    city: '',
    transmisie: '',
    rulaj: '',
    an: '',
    rooms: '',
    surface: ''
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false);

  const handleStartEdit = (ad: any) => {
    setEditingAd(ad);
    setEditFormData({
      price: ad.price ? String(ad.price) : '',
      description: ad.description || '',
      phone: ad.phone || userProfilePhone || '',
      city: ad.city || ad.location || userProfileCity || '',
      transmisie: ad.transmisie || ad.transmission || '',
      rulaj: ad.rulaj ? String(ad.rulaj) : '',
      an: ad.an ? String(ad.an) : '',
      rooms: ad.rooms ? String(ad.rooms) : (ad.features?.bedrooms ? String(ad.features.bedrooms) : ''),
      surface: ad.area ? String(ad.area) : (ad.surface ? String(ad.surface) : (ad.features?.area ? String(ad.features.area) : ''))
    });
  };

  const getRemainingTime = () => {
    if (!editingAd || !editingAd.lastEdited) return null;
    const lastEdited = editingAd.lastEdited;
    const lastEditedDate = lastEdited.toDate ? lastEdited.toDate() : new Date(lastEdited);
    const now = new Date();
    const diffMs = now.getTime() - lastEditedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      const remainingMs = (24 * 60 * 60 * 1000) - diffMs;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    }
    return null;
  };

  const handleSaveEdit = () => {
    if (!user || !editingAd) return;

    // Check time lock restriction (24 hours check)
    const remaining = getRemainingTime();
    if (remaining) {
      alert(`Nu poți modifica acest anunț încă. Revino în ${remaining.hours} ore și ${remaining.minutes} minute.`);
      return;
    }

    // Show custom confirmation step inside modal
    setShowConfirmSave(true);
  };

  const handleConfirmedSave = async () => {
    if (!user || !editingAd) return;
    setShowConfirmSave(false);
    setIsSavingEdit(true);
    try {
      const col = editingAd._collection || 'anuncios';
      const docRef = doc(db, col, editingAd.id);

      const newPrice = Number(String(editFormData.price).replace(/[.,\s]/g, ''));
      const currentPrice = Number(String(editingAd.price).replace(/[.,\s]/g, ''));

      const updateData: any = {
        price: newPrice,
        description: editFormData.description,
        phone: editFormData.phone,
        city: editFormData.city,
        lastEdited: new Date()
      };

      // Generate slug if it doesn't exist for older ads
      if (!editingAd.slug) {
        if (col === 'anuncios_auto') {
          const baseSlug = `${editingAd.marca || ''}-${editingAd.model || ''}-${editingAd.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          updateData.slug = baseSlug ? `${baseSlug}-${Math.random().toString(36).substring(2, 8)}` : `auto-${Date.now()}`;
        } else {
          const baseSlug = `${editingAd.type || ''}-${editingAd.rooms ? editingAd.rooms + '-camere-' : ''}${editingAd.localitate || editingAd.city || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          updateData.slug = baseSlug ? `${baseSlug}-${Math.random().toString(36).substring(2, 8)}` : `prop-${Date.now()}`;
        }
      }

      // Check if price decreased to register the discount
      if (currentPrice && newPrice < currentPrice) {
        updateData.oldPrice = currentPrice;
      } else if (currentPrice && newPrice > currentPrice) {
        // If price increased, clear the discount
        updateData.oldPrice = null;
      } else if (editingAd.oldPrice && newPrice >= Number(editingAd.oldPrice)) {
        // If price went up back to original or higher than oldPrice, clear it
        updateData.oldPrice = null;
      }

      if (col === 'anuncios_auto') {
        if (editFormData.rulaj) updateData.rulaj = Number(editFormData.rulaj);
        if (editFormData.an) updateData.an = Number(editFormData.an);
        if (editFormData.transmisie) updateData.transmisie = editFormData.transmisie;
      } else {
        if (editFormData.rooms) updateData.rooms = Number(editFormData.rooms);
        if (editFormData.surface) {
          updateData.surface = Number(editFormData.surface);
          updateData.area = Number(editFormData.surface);
        }
      }

      await updateDoc(docRef, updateData);

      // Instantly update local state
      setAdsState(prev => prev.map(a => a.id === editingAd.id ? { ...a, ...updateData } : a));
      setEditingAd(null);
    } catch (err) {
      console.error("Error updating ad:", err);
      alert("Eroare la salvarea modificărilor.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const toggleStats = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedStats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (!user) return;
    
    setIsLoading(true);
    let imobAds: any[] = [];
    let autoAds: any[] = [];
    let imobLoaded = false;
    let autoLoaded = false;

    const mergeAds = () => {
      if (imobLoaded && autoLoaded) {
        const all = [...imobAds, ...autoAds].sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        setAdsState(all);
        setIsLoading(false);
      }
    };

    // Listen to imobiliare ads
    const q1 = query(collection(db, 'anuncios'), where('userId', '==', user.uid));
    const unsub1 = onSnapshot(q1, (snapshot) => {
      imobAds = snapshot.docs.map(doc => ({ id: doc.id, _collection: 'anuncios', ...doc.data() }));
      imobLoaded = true;
      mergeAds();
    });

    // Listen to auto ads
    const q2 = query(collection(db, 'anuncios_auto'), where('userId', '==', user.uid));
    const unsub2 = onSnapshot(q2, (snapshot) => {
      autoAds = snapshot.docs.map(doc => ({ id: doc.id, _collection: 'anuncios_auto', ...doc.data() }));
      autoLoaded = true;
      mergeAds();
    });

    return () => { unsub1(); unsub2(); };
  }, [user]);

  // Real-time wallet balance for the modal check
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setWalletBalance(data.walletBalance || 0);
        setUserProfilePhone(data.phone || '');
        setUserProfileCity(data.location || data.city || '');
        console.log("[MyAds] Real-time balance and profile update");
      }
    });

    return () => unsubscribe();
  }, [user]);

  const openPromoModal = (id: string, adTitle: string) => {
    setPromotingAdInfo({ id, title: adTitle });
    setPromoDuration('15');
  };

  const handlePromoteSelection = async (type: 'standard' | 'gold') => {
    if (!user || !promotingAdInfo) return;
    
    // Calculate cost based on type and duration
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

      // Update Ad Document
      const ad = adsState.find(a => a.id === adId);
      const col = ad?._collection || 'anuncios';
      const adRef = doc(db, col, adId);
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

  const handleReactivateAd = async (ad: any) => {
    if (!confirm('Ești sigur că vrei să reactivezi acest anunț pentru încă 30 de zile?')) return;
    try {
      const col = ad._collection || 'anuncios';
      await updateDoc(doc(db, col, ad.id), {
        status: 'active',
        createdAt: new Date(),
        lastEdited: new Date()
      });
      // La lista se actualizará automáticamente gracias a onSnapshot
    } catch (error) {
      console.error('Error reactivating ad:', error);
      alert('Eroare la reactivarea anunțului.');
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest anunț? Această acțiune este ireversibilă.')) return;
    
    setIsDeleting(adId);
    try {
      const ad = adsState.find(a => a.id === adId);
      const col = ad?._collection || 'anuncios';
      await deleteDoc(doc(db, col, adId));
      // onSnapshot will automatically update the UI
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Eroare la ștergerea anunțului.');
    } finally {
      setIsDeleting(null);
    }
  };

  const isAdExpired = (ad: any) => {
    if (ad.status === 'expired' || ad.status === 'inactive') return true;
    if (ad.createdAt) {
      const created = ad.createdAt.toDate ? ad.createdAt.toDate() : new Date(ad.createdAt);
      const expiry = new Date(created);
      expiry.setDate(expiry.getDate() + 30);
      return new Date() > expiry;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Status Sub-Navigation */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100">
        {[
          { id: 'active', label: 'Active', count: adsState.filter(a => a.status === 'active' && !isAdExpired(a)).length, color: 'bg-green-500' },
          { id: 'promovate', label: 'Promovate', count: adsState.filter(a => a.isPromoted && a.status === 'active' && !isAdExpired(a)).length, color: 'bg-[#f25c1a]' },
          { id: 'pending', label: 'În așteptare', count: adsState.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
          { id: 'rejected', label: 'Respinse', count: adsState.filter(a => a.status === 'rejected').length, color: 'bg-red-500' },
          { id: 'expired', label: 'Expirate', count: adsState.filter(a => isAdExpired(a)).length, color: 'bg-gray-400' },
        ].map((subTab) => (
          <button
            key={subTab.id}
            onClick={() => setActiveSubTab(subTab.id)}
            className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2.5 ${
              activeSubTab === subTab.id
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${subTab.color}`}></div>
            {subTab.label}
            <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeSubTab === subTab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {subTab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Professional System Insight Pill */}
      {activeSubTab === 'active' && (
        <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white/80 backdrop-blur-xl border border-blue-100 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.1)] px-5 py-2.5 rounded-full flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
              <BarChart3 size={11} />
              System info
            </div>
            <span className="text-[12px] font-bold text-gray-500 tracking-tight">
              Anunțurile active beneficiază de <span className="text-gray-900">vizibilitate maximă</span> timp de 30 de zile.
            </span>
          </div>
        </div>
      )}
      {activeSubTab === 'promovate' && (
        <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white/80 backdrop-blur-xl border border-orange-100 shadow-[0_10px_30px_-10px_rgba(242,92,26,0.1)] px-5 py-2.5 rounded-full flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#f25c1a] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
              <Star size={11} fill="white" />
              Performance boost
            </div>
            <span className="text-[12px] font-bold text-gray-500 tracking-tight">
              Anunțurile promovate primesc cu până la <span className="text-gray-900">de 5 ori mai multă atenție</span>.
            </span>
          </div>
        </div>
      )}
      {activeSubTab === 'pending' && (
        <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white/80 backdrop-blur-xl border border-amber-100 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.1)] px-5 py-2.5 rounded-full flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#f25c1a] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
              <RefreshCcw size={11} className="animate-spin-slow" />
              În moderare
            </div>
            <span className="text-[12px] font-bold text-gray-500 tracking-tight">
              Anunțul tău este verificat de echipa <span className="text-gray-900">Vindu24</span> și va fi <span className="text-gray-900">activat în cel mult 24 de ore</span>.
            </span>
          </div>
        </div>
      )}

      {/* Ads List Filtered by Status */}
      <div className="flex flex-col gap-5">
        {adsState.filter(ad => 
          activeSubTab === 'promovate' ? (ad.isPromoted && ad.status === 'active' && !isAdExpired(ad)) : 
          activeSubTab === 'expired' ? isAdExpired(ad) : 
          activeSubTab === 'active' ? (ad.status === 'active' && !isAdExpired(ad)) :
          ad.status === activeSubTab
        ).map((ad) => {
          const isAuto = ad._collection === 'anuncios_auto';
          return (
          <div key={ad.id} className={`rounded-[24px] border overflow-hidden flex flex-col sm:flex-row group transition-all duration-300 relative ${
            ad.isPromoted 
              ? 'border-orange-100 shadow-[0_15px_40px_-15px_rgba(242,92,26,0.15)] bg-gradient-to-br from-white to-orange-50/10' 
              : isAuto
                ? 'shadow-[0_10px_30px_-12px_rgba(14,165,233,0.08)] border-sky-100 hover:shadow-[0_20px_50px_-15px_rgba(14,165,233,0.12)] bg-white'
                : 'shadow-[0_10px_30px_-12px_rgba(0,0,0,0.04)] border-gray-100 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] bg-white'
          }`}>
            {/* Minimal Background Blur for Status */}
            {ad.status === 'rejected' && <div className="absolute inset-0 bg-red-50/30 z-0 pointer-events-none"></div>}

            {/* Left Image Section */}
            <div className="relative w-full sm:w-[260px] h-48 sm:h-auto flex-shrink-0 z-10">
              <img src={ad.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&h=400&q=80'} alt="Ad Image" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${
                  isAdExpired(ad) ? 'bg-gray-500/90' :
                  ad.status === 'active' ? 'bg-green-500/90' : 
                  ad.status === 'pending' ? 'bg-amber-500/90' : 
                  ad.status === 'rejected' ? 'bg-red-500/90' : 'bg-gray-500/90'
                }`}>
                  {isAdExpired(ad) ? 'Expirat' : ad.status === 'active' ? 'Activ' : ad.status === 'pending' ? 'În așteptare' : ad.status === 'rejected' ? 'Respins' : 'Expirat'}
                </span>
                {ad.isPromoted && (
                  <span className={`${ad.promoType === 'gold' ? 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-amber-500/30' : 'bg-[#f25c1a]/90 shadow-orange-500/30'} backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg`}>
                    <Star size={10} fill="white" /> {ad.promoType === 'gold' ? 'GOLD VIP' : 'PROMOVAT'}
                  </span>
                )}
                {isAuto && !ad.isPromoted && (
                  <span className="bg-sky-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-sky-500/20">
                    <Car size={10} /> AUTO
                  </span>
                )}              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between z-10 bg-white sm:bg-transparent">
              {/* Top Title & Price Row */}
              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex flex-col">
                  <h3 className="text-[17px] font-black text-gray-900 leading-tight">
                    {isAuto ? (
                      <>
                        {ad.marca || 'Vehicul'} {ad.model || ''}
                        <span className="text-gray-400 font-medium"> • {ad.city || ''}</span>
                      </>
                    ) : (
                      <>
                        <span className="capitalize">{ad.type || 'Inmueble'}</span> en <span className="lowercase">{ad.operation || 'transacción'}</span> 
                        <span className="text-gray-400 font-medium"> • {ad.city || 'España'}</span>
                      </>
                    )}
                  </h3>
                  <div className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-1">
                    <MapPin size={12} className={isAuto ? 'text-sky-400' : 'text-gray-400'} />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{(() => {
                      if (isAuto) return ad.city || 'Locație nedefinită';
                      if (ad.location) {
                        if (ad.location.hideExactAddress) {
                          return [ad.location.localitate || ad.location.city, ad.location.judet ? `Jud. ${ad.location.judet}` : ''].filter(Boolean).join(', ') || 'Dirección específica no proporcionada';
                        }
                        const parts = [];
                        if (ad.location.strada) parts.push(ad.location.strada);
                        else if (ad.location.address) parts.push(ad.location.address);
                        if (ad.location.numar) parts.push(`nr. ${ad.location.numar}`);
                        if (ad.location.bloc) parts.push(`bl. ${ad.location.bloc}`);
                        
                        const addressStr = parts.join(', ');
                        return [addressStr, ad.location.localitate || ad.location.city].filter(Boolean).join(', ') || 'Dirección específica no proporcionada';
                      }
                      return ad.address || ad.zone || 'Dirección específica no proporcionada';
                    })()}</span>
                  </div>
                </div>
                <div className={`text-[18px] sm:text-[22px] font-black whitespace-nowrap px-3 py-1 rounded-xl shadow-sm border ${
                  isAuto 
                    ? 'text-sky-600 bg-sky-50 border-sky-100'
                    : 'text-[#f25c1a] bg-orange-50 border-orange-100'
                }`}>
                  {ad.price ? `${Number(ad.price).toLocaleString('ro-RO')} €` : 'Consulta'}
                </div>
              </div>

              {/* Middle Badges */}
              <div className="flex flex-wrap items-center gap-3 text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-4 mt-2">
                {isAuto ? (
                  <>
                    {ad.an && <span className="flex items-center gap-1"><CalendarDays size={13} className="text-sky-400" /> {ad.an}</span>}
                    {ad.combustibil && <span className="flex items-center gap-1"><Fuel size={13} className="text-sky-400" /> {ad.combustibil}</span>}
                    {ad.rulaj && <span className="flex items-center gap-1"><Gauge size={13} className="text-sky-400" /> {Number(ad.rulaj).toLocaleString('ro-RO')} km</span>}
                    {ad.putere && <span className="flex items-center gap-1">⚡ {ad.putere} CP</span>}
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1"><LayoutGrid size={13} className="text-gray-400" /> {ad.area || '-'} m²</span>
                    <span className="flex items-center gap-1"><CalendarDays size={13} className="text-gray-400" /> 
                      {ad.createdAt?.seconds ? new Date(ad.createdAt.seconds * 1000).toLocaleDateString('ro-RO') : 'Recente'}
                    </span>
                  </>
                )}
                {ad.status === 'active' && ad.promoType !== 'gold' && <span className="flex items-center gap-1 ml-2"><Eye size={13} className="text-blue-500" /> {ad.views || 0} views</span>}
                {ad.status === 'active' && ad.promoType !== 'gold' && <span className="flex items-center gap-1"><Phone size={13} className="text-green-500" /> {ad.calls || 0} leads</span>}
              </div>

              {/* Gold VIP Advanced Analytics Toggle & Bar */}
              {ad.status === 'active' && ad.promoType === 'gold' && (
                <div className="mb-4">
                  <button 
                    onClick={(e) => toggleStats(ad.id, e)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#f25c1a] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors mb-2"
                  >
                    <BarChart3 size={14} /> Ver Estadísticas Avanzadas
                    <ChevronDown size={14} className={`transition-transform duration-300 ml-1 ${expandedStats[ad.id] ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedStats[ad.id] && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-4 gap-2 bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-2.5 rounded-xl border border-amber-100/50 mt-1">
                          <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm">
                            <Eye size={14} className="text-amber-500 mb-1" />
                            <span className="text-[14px] font-black text-gray-800">{ad.views || 0}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Views</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm">
                            <Heart size={14} className="text-red-400 mb-1" fill="currentColor" />
                            <span className="text-[14px] font-black text-gray-800">{Math.floor((ad.views || 0) * 0.15) + (ad.saves ?? 3)}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Salvate</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm">
                            <Phone size={14} className="text-green-500 mb-1" />
                            <span className="text-[14px] font-black text-gray-800">{ad.calls || Math.floor((ad.views || 0) * 0.05)}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Telefon</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm relative">
                            <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-[#f25c1a] rounded-full animate-pulse"></div>
                            <MessageSquare size={14} className="text-blue-500 mb-1" />
                            <span className="text-[14px] font-black text-gray-800">{ad.messages || Math.floor((ad.views || 0) * 0.08) + 1}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Mesaje</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Bottom Actions Row */}
              <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {ad.status === 'rejected' ? (
                     <div className="text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 border border-red-100">
                       <MailX size={14} /> Motiv: {ad.reason || 'Încalcă termenii platformei noastre'}
                     </div>
                  ) : ad.status === 'pending' ? (
                     <div className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5">
                       <RefreshCcw size={12} className="animate-spin-slow" /> Se verifică pozele și descrierea...
                     </div>
                  ) : (
                     <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       ID Referință: #{ad.id.slice(0, 8)}
                     </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {ad.status === 'active' && !ad.isPromoted && (
                    <button 
                      onClick={() => openPromoModal(ad.id, `${ad.type} en ${ad.city}`)}
                      disabled={promotingId === ad.id}
                      className="text-[#f25c1a] hover:bg-[#f25c1a] hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border border-orange-200/50 shadow-sm disabled:opacity-50"
                    >
                      {promotingId === ad.id ? <RefreshCcw size={14} className="animate-spin" /> : <TrendingUp size={14} />}
                      {promotingId === ad.id ? 'Se activează' : 'Boost Anunț'}
                    </button>
                  )}
                  {isAdExpired(ad) && (
                    <button 
                      onClick={() => handleReactivateAd(ad)}
                      className="text-[#f25c1a] hover:bg-[#f25c1a] hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border border-orange-200/50 shadow-sm"
                    >
                      <RefreshCcw size={14} /> Reactivare
                    </button>
                  )}
                  
                  <div className="flex items-center gap-1 ml-1 bg-gray-50 rounded-[14px] p-1 border border-gray-100 shadow-inner">
                    <Link href={isAuto ? `/auto/${ad.slug || ad.id}` : `/propiedades/${ad.id}`} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white hover:shadow-sm rounded-[10px] transition-all"><Eye size={16} /></Link>
                    <button 
                      onClick={() => handleStartEdit(ad)}
                      className="p-2 text-gray-400 hover:text-amber-500 hover:bg-white hover:shadow-sm rounded-[10px] transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteAd(ad.id)}
                      disabled={isDeleting === ad.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-[10px] transition-all disabled:opacity-50"
                    >
                      {isDeleting === ad.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })}

        {adsState.filter(ad => 
          activeSubTab === 'promovate' ? (ad.isPromoted && ad.status === 'active' && !isAdExpired(ad)) : 
          activeSubTab === 'expired' ? isAdExpired(ad) : 
          activeSubTab === 'active' ? (ad.status === 'active' && !isAdExpired(ad)) :
          ad.status === activeSubTab
        ).length === 0 && (
          <div className="bg-white rounded-[40px] p-24 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8">
              <List size={32} strokeWidth={1} className="text-gray-300" />
            </div>
            <h3 className="text-[18px] font-bold text-gray-600 mb-2">Niciun anunț în această secțiune</h3>
            <p className="text-gray-400 font-medium text-[15px]">Momentan nu ai niciun anunț cu statusul "{activeSubTab === 'active' ? 'activ' : activeSubTab === 'pending' ? 'în așteptare' : activeSubTab === 'rejected' ? 'respins' : 'expirat'}".</p>
          </div>
        )}
      </div>

      {activeSubTab === 'promovate' && adsState.filter(ad => ad.isPromoted && ad.status === 'active').length === 0 && (
        <div className="flex flex-col items-center justify-center py-32">
          {/* Left empty as per user request */}
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

      {/* Custom Premium Edit Panel Modal */}
      <AnimatePresence>
        {editingAd && (() => {
          const col = editingAd._collection || 'anuncios';
          const isAuto = col === 'anuncios_auto';
          const remaining = getRemainingTime();
          const isLocked = remaining !== null;

          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setEditingAd(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.2)] rounded-[32px] w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAuto ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isAuto ? <Car size={20} /> : <Home size={20} />}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-[16px]">Modificare Anunț</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {isAuto ? (
                          `${editingAd.marca || ''} ${editingAd.model || ''}`
                        ) : (
                          `${
                            editingAd.type === 'apartment' ? 'Apartament' :
                            editingAd.type === 'house' ? 'Casă' :
                            editingAd.type === 'villa' ? 'Vilă' :
                            editingAd.type === 'penthouse' ? 'Penthouse' :
                            editingAd.type === 'loft' ? 'Loft' :
                            editingAd.type === 'studio' ? 'Garsonieră' :
                            editingAd.type === 'camera' ? 'Cameră' :
                            editingAd.type === 'comercial' ? 'Spațiu Comercial' :
                            editingAd.type === 'teren' ? 'Teren' :
                            (editingAd.type || 'Proprietate')
                          } în ${
                            editingAd.operation === 'inchiriere' ? 'Închiriere' : 'Vânzare'
                          }`
                        )}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setEditingAd(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
                    ✕
                  </button>
                </div>

                {/* Body Form */}
                <div className="flex-grow overflow-y-auto p-6 space-y-5">
                  {/* Warning/Time lock alert */}
                  {isLocked && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3 text-amber-800 animate-in fade-in slide-in-from-top-4 duration-500">
                      <Clock size={20} className="flex-shrink-0 mt-0.5 text-amber-600 animate-pulse" />
                      <div className="text-xs font-medium leading-relaxed">
                        <span className="font-extrabold block text-amber-900 mb-0.5">🔒 Modificare Blocată (O dată la 24 ore)</span>
                        Pentru a proteja calitatea platformei, anunțurile pot fi modificate o singură dată la 24 de ore. 
                        Următoarea editare va fi disponibilă în <strong className="text-amber-900 font-extrabold">{remaining.hours} ore și {remaining.minutes} minute</strong>.
                      </div>
                    </div>
                  )}

                  {/* Pricing and Phone Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Preț (€)</label>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        disabled={isLocked}
                        value={editFormData.price}
                        onChange={e => {
                          const clean = e.target.value.replace(/[^0-9]/g, '');
                          setEditFormData(prev => ({ ...prev, price: clean }));
                        }}
                        className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                        placeholder="Ex: 15000"
                      />
                      <span className="text-[10px] text-gray-400 font-semibold mt-1.5 block">Numai cifre (ex: 23950)</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Telefon de Contact</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          disabled={isLocked}
                          value={editFormData.phone}
                          onChange={e => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                          placeholder="07xxxxxxxx"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Oraș / Locație</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          list="romania-cities-datalist"
                          disabled={isLocked}
                          value={editFormData.city}
                          onChange={e => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                          placeholder="Ex: București"
                        />
                        <datalist id="romania-cities-datalist">
                          <option value="București" /><option value="Cluj-Napoca" /><option value="Timișoara" />
                          <option value="Iași" /><option value="Constanța" /><option value="Craiova" />
                          <option value="Brașov" /><option value="Galați" /><option value="Ploiești" />
                          <option value="Oradea" /><option value="Brăila" /><option value="Arad" />
                          <option value="Pitești" /><option value="Sibiu" /><option value="Bacău" />
                          <option value="Târgu Mureș" /><option value="Baia Mare" /><option value="Buzău" />
                          <option value="Botoșani" /><option value="Satu Mare" /><option value="Râmnicu Vâlcea" />
                          <option value="Suceava" /><option value="Drobeta-Turnu Severin" /><option value="Târgoviște" />
                          <option value="Târgu Jiu" /><option value="Tulcea" /><option value="Bistrița" />
                          <option value="Reșița" /><option value="Slatina" /><option value="Călărași" />
                          <option value="Alba Iulia" /><option value="Giurgiu" /><option value="Deva" />
                          <option value="Focșani" /><option value="Zalău" /><option value="Sfântu Gheorghe" />
                        </datalist>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Auto Fields */}
                  {isAuto && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Kilometraj (km)</label>
                        <div className="relative">
                          <Gauge size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            inputMode="numeric"
                            disabled={isLocked}
                            value={editFormData.rulaj}
                            onChange={e => {
                              const clean = e.target.value.replace(/[^0-9]/g, '');
                              setEditFormData(prev => ({ ...prev, rulaj: clean }));
                            }}
                            className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                            placeholder="Ex: 150000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">An Fabricație</label>
                        <div className="relative">
                          <CalendarDays size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            inputMode="numeric"
                            disabled={isLocked}
                            value={editFormData.an}
                            onChange={e => {
                              const clean = e.target.value.replace(/[^0-9]/g, '');
                              setEditFormData(prev => ({ ...prev, an: clean }));
                            }}
                            className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                            placeholder="Ex: 2018"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Transmisie</label>
                      <div className="flex gap-2">
                        {['Manuală', 'Automată'].map(t => (
                          <button
                            key={t}
                            disabled={isLocked}
                            onClick={() => setEditFormData(prev => ({ ...prev, transmisie: t }))}
                            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all border ${
                              editFormData.transmisie === t ? 'bg-sky-500 text-white border-sky-500' : 'bg-gray-50 text-gray-600 border-gray-200/60 disabled:bg-gray-100'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    </>
                  )}

                  {/* Conditional Real Estate Fields */}
                  {!isAuto && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Număr Camere</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          disabled={isLocked}
                          value={editFormData.rooms}
                          onChange={e => {
                            const clean = e.target.value.replace(/[^0-9]/g, '');
                            setEditFormData(prev => ({ ...prev, rooms: clean }));
                          }}
                          className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                          placeholder="Ex: 2"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Suprafață Utilă (m²)</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          disabled={isLocked}
                          value={editFormData.surface}
                          onChange={e => {
                            const clean = e.target.value.replace(/[^0-9]/g, '');
                            setEditFormData(prev => ({ ...prev, surface: clean }));
                          }}
                          className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                          placeholder="Ex: 55"
                        />
                      </div>
                    </div>
                  )}

                  {/* Description field */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Descriere Principală</label>
                    <textarea 
                      disabled={isLocked}
                      value={editFormData.description}
                      onChange={e => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-200/60 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors resize-none leading-relaxed"
                      placeholder="Descrie proprietatea sau vehiculul în detaliu..."
                    />
                  </div>
                </div>

                {/* 24h Lock Confirmation Overlay */}
                <AnimatePresence>
                  {showConfirmSave && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl rounded-[32px] flex flex-col items-center justify-center p-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="flex flex-col items-center max-w-xs"
                      >
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 border border-amber-100 shadow-sm">
                          <Clock size={28} className="text-amber-500" />
                        </div>
                        <h4 className="text-[18px] font-black text-gray-900 mb-2">Confirmare Modificare</h4>
                        <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-6">
                          După salvare, <span className="text-amber-600 font-bold">nu vei mai putea edita</span> acest anunț timp de <span className="text-gray-900 font-extrabold">24 de ore</span>.
                        </p>
                        <div className="flex gap-3 w-full">
                          <button 
                            onClick={() => setShowConfirmSave(false)}
                            className="flex-1 px-5 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            Anulează
                          </button>
                          <button 
                            onClick={handleConfirmedSave}
                            className="flex-[1.5] px-5 py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                          >
                            Da, Salvează
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Controls */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 flex-shrink-0">
                  <button 
                    onClick={() => { setEditingAd(null); setShowConfirmSave(false); }} 
                    className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Anulează
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    disabled={isLocked || isSavingEdit || !editFormData.price}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-[2px] px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                  >
                    {isSavingEdit ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Se salvează...
                      </>
                    ) : (
                      'Salvează modificări'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

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
