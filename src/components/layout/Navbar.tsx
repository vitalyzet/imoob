'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, Building2, Mail, MessageSquare, FolderSearch, Heart, User, Menu, X, ChevronLeft, Search, Trash2, ChevronDown, Clock, XCircle, LayoutGrid, Phone, ThumbsUp, PlusSquare, List, Wallet, Settings, LogOut, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useAuth } from '@/context/AuthContext';
import { useDomain } from '@/context/DomainContext';
import Logo from '@/components/layout/Logo';
import { doc, onSnapshot, query, collection, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { domain, setDomain } = useDomain();
  const [isOpen, setIsOpen] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const { savedSearches, deleteSearch } = useSavedSearches();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleDomainChange = (targetDomain: 'imobiliare' | 'auto') => {
    setDomain(targetDomain);
    
    // If we are not on the home page, redirect to home page so the new domain vertical is displayed
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const isDashboard = pathname.startsWith('/Profil');
  const isHome = pathname === '/';
  const [dashboardTitle, setDashboardTitle] = useState('Profil');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [adsCount, setAdsCount] = useState<number>(0);
  const [expiredAdsCount, setExpiredAdsCount] = useState<number>(0);
  const [showExpiredBanner, setShowExpiredBanner] = useState<boolean>(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      setWalletBalance(0);
      setAdsCount(0);
      setExpiredAdsCount(0);
      setShowExpiredBanner(false);
      setUnreadMessages(0);
      return;
    }

    // 1. Real-time balance
    const userRef = doc(db, 'users', user.uid);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setWalletBalance(snapshot.data().walletBalance || 0);
      }
    });

    // 2. Real-time ads count & expired check
    const q1 = query(collection(db, 'anuncios'), where('userId', '==', user.uid));
    const q2 = query(collection(db, 'anuncios_auto'), where('userId', '==', user.uid));
    
    let imobAds: any[] = [];
    let autoAds: any[] = [];
    
    const calculateCounts = () => {
      const all = [...imobAds, ...autoAds];
      setAdsCount(all.length);
      
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
      
      const expiredCount = all.filter(d => isAdExpired(d)).length;
      setExpiredAdsCount(expiredCount);
      
      if (expiredCount > 0) {
        const lastDismissed = localStorage.getItem('expired_alert_dismissed');
        if (!lastDismissed || (Date.now() - Number(lastDismissed) > 24 * 60 * 60 * 1000)) {
          setShowExpiredBanner(true);
        }
      } else {
        setShowExpiredBanner(false);
      }
    };

    const unsubAds1 = onSnapshot(q1, (snapshot) => {
      imobAds = snapshot.docs.map(doc => doc.data());
      calculateCounts();
    });
    
    const unsubAds2 = onSnapshot(q2, (snapshot) => {
      autoAds = snapshot.docs.map(doc => doc.data());
      calculateCounts();
    });

    // 3. Real-time unread messages
    const qChats = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
    const unsubChats = onSnapshot(qChats, (snapshot) => {
      let unread = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.unreadBy && data.unreadBy.includes(user.uid)) {
          unread++;
        }
      });
      setUnreadMessages(unread);
    });

    return () => {
      unsubUser();
      unsubAds1();
      unsubAds2();
      unsubChats();
    };
  }, [user]);

  useEffect(() => {
    const handleTabChange = (e: any) => {
      setDashboardTitle(e.detail);
    };
    window.addEventListener('profil-tab-change', handleTabChange);
    return () => window.removeEventListener('profil-tab-change', handleTabChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dismissBanner = () => {
    localStorage.setItem('expired_alert_dismissed', Date.now().toString());
    setShowExpiredBanner(false);
  };

  if (pathname === '/publicar-anuncio' || pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null;

  const isLightHeader = (isHome && scrolled) || !isHome;
  
  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    isHome && !scrolled 
      ? 'bg-transparent py-3 border-b border-white/10' 
      : 'bg-white py-2.5 shadow-sm border-b border-gray-100'
  }`;

  const textColor = isLightHeader ? 'text-[#333]' : 'text-white';
  const iconColor = isLightHeader ? 'text-[#555]' : 'text-white';
  const hoverColor = isLightHeader ? 'hover:text-[var(--primary)]' : 'hover:text-white/80';
  const logoDotColor = 'var(--primary)';
  const userIconBg = isLightHeader ? 'bg-gray-100' : 'bg-white/10';
  const userIconText = isLightHeader ? 'text-gray-400' : 'text-white/80';

  const renderUserPanel = () => {
    const leftItems = [
      { icon: LayoutGrid, label: 'Profil', href: '/Profil' },
      { icon: MessageSquare, label: 'Mesajele mele', href: '/Profil/messages', badge: unreadMessages > 0 ? unreadMessages : undefined },
      { icon: Phone, label: 'Anunțuri contactate', href: '/Profil/contacted' },
      { icon: Search, label: 'Căutările mele', href: '/Profil/searches' },
      { icon: ThumbsUp, label: 'Anunțuri recomandate', href: '/Profil/recommended' },
      { icon: Heart, label: 'Anunțuri salvate', href: '/Profil/favoritos' },
    ];

    const rightItems = [
      { icon: PlusSquare, label: 'Adaugă anunț', href: '/publicar-anuncio' },
      { icon: List, label: 'Anunțurile mele', href: '/Profil/my-ads', badge: adsCount },
      { icon: Wallet, label: 'Alimentează cont', href: '/Profil/wallet', isWallet: true },
      { icon: Settings, label: 'Setări cont', href: '/Profil/settings' },
      { icon: LogOut, label: 'Deconectare', isLogout: true },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-full right-0 mt-4 w-[580px] bg-black/80 backdrop-blur-xl shadow-2xl flex flex-row z-[100] rounded-[30px] overflow-hidden p-3 border border-white/10"
      >
        {/* Left Column: Activity */}
        <div className="flex-[1.2] flex flex-col border-r border-white/5 pr-2">
          <div className="px-5 py-3 mb-1">
            <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-[2px]">Activitate</h4>
          </div>
          {leftItems.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 px-5 py-3 hover:bg-white/10 transition-all group rounded-[20px] text-white"
            >
              <item.icon size={22} strokeWidth={1.5} className="text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right Column: Account */}
        <div className="flex-1 flex flex-col pl-2">
          <div className="px-5 py-3 mb-1">
            <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-[2px]">Contul meu</h4>
          </div>
          {rightItems.map((item, idx) => {
            const content = (
              <div
                className="flex items-center gap-4 px-5 py-3 hover:bg-white/10 transition-all group rounded-[20px] text-white cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  if (item.isLogout) logout();
                }}
              >
                <item.icon size={22} strokeWidth={1.5} className="text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                
                {item.badge !== undefined && (
                  <span className="bg-[#f25c1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 shadow-sm">
                    {item.badge}
                  </span>
                )}
                
                {item.isWallet && (
                  <div className="bg-[#f25c1a]/20 text-[#f25c1a] text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {walletBalance.toFixed(2)}€
                  </div>
                )}
              </div>
            );
            return item.href ? <Link key={idx} href={item.href}>{content}</Link> : <div key={idx}>{content}</div>;
          })}
        </div>
      </motion.div>
    );
  };

  if (isDashboard) {
    return (
      <>
      <AnimatePresence>
        {showExpiredBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-red-500 text-white text-[11px] md:text-[13px] py-1.5 md:py-2 z-[60] text-center font-bold tracking-wide shadow-md flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4"
          >
            <div className="flex items-center gap-1.5"><Clock size={14} /> <span>Ai {expiredAdsCount} anunț{expiredAdsCount === 1 ? '' : 'uri'} expirat{expiredAdsCount === 1 ? '' : 'e'}. Vizibilitate oprită în căutări.</span></div>
            <Link href="/Profil/my-ads?tab=expired" className="bg-white text-red-500 px-3 py-1 rounded-full text-[10px] md:text-xs hover:bg-red-50 transition-colors uppercase tracking-widest shadow-sm">
              Reactivează acum
            </Link>
            <button onClick={dismissBanner} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <header className={`fixed w-full z-50 bg-[#f25c1a] py-3 shadow-md transition-all ${showExpiredBanner ? 'top-[36px] md:top-[44px]' : 'top-0'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Left: Back and Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="text-white hover:text-white/80 transition-colors">
              <ChevronLeft size={28} strokeWidth={1.5} />
            </Link>
            
            <Link href="/" className="flex items-center">
              <Logo size="md" dark={true} />
            </Link>

            <div className="hidden sm:flex items-center">
              <div className="h-6 w-px bg-white/20 mx-4"></div>
              <span className="text-white/70 text-[10px] font-black tracking-[2px] uppercase">Profil</span>
              <span className="mx-2 text-white/40 font-light">/</span>
              <span className="text-white text-sm font-bold tracking-tight">{dashboardTitle}</span>
            </div>
          </div>

          {/* Right: Icons, User, Menu */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden md:flex items-center gap-5 mr-2">
              <Link href="/Profil/messages" className="text-white hover:text-white/80 transition-colors relative group">
                <MessageSquare size={24} strokeWidth={1.5} />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-[#f25c1a] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-pulse">
                    {unreadMessages}
                  </span>
                )}
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setShowSavedSearches(!showSavedSearches)}
                  className="text-white hover:text-white/80 transition-colors relative"
                >
                  <Bell size={24} strokeWidth={1.5} />
                  {savedSearches.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#f25c1a] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#f25c1a]">
                      {savedSearches.length}
                    </span>
                  )}
                </button>

                {/* Dashboard Saved Searches Dropdown */}
                <AnimatePresence>
                  {showSavedSearches && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-[60]"
                    >
                      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                          <FolderSearch size={16} className="text-[#4567c1]" />
                          Mis búsquedas guardadas
                        </h3>
                        <button 
                          onClick={() => setShowSavedSearches(false)}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="max-h-[300px] overflow-y-auto">
                        {savedSearches.length === 0 ? (
                          <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Search size={24} className="text-gray-300" />
                            </div>
                            <p className="text-gray-400 text-xs font-medium">No tienes búsquedas guardadas todavía</p>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            {savedSearches.map((search) => (
                              <div key={search.id} className="group relative border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <Link 
                                  href={`/propiedades?city=${search.filters.city}&type=${search.filters.type}&status=${search.filters.status}&minPrice=${search.filters.minPrice}`}
                                  onClick={() => setShowSavedSearches(false)}
                                  className="block p-4 pr-12"
                                >
                                  <div className="font-bold text-gray-800 text-sm mb-1 leading-tight">{search.name}</div>
                                  <div className="flex items-center gap-2 text-gray-400 text-[11px] font-medium uppercase tracking-wider">
                                    <Clock size={10} />
                                    {new Date(search.timestamp).toLocaleDateString('es-ES')}
                                  </div>
                                </Link>
                                <button 
                                  onClick={() => deleteSearch(search.id)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {savedSearches.length > 0 && (
                        <div className="p-3 bg-gray-50/30 border-t border-gray-50">
                          <Link 
                            href="/Profil/searches" 
                            className="block text-center text-[11px] font-bold text-[#4567c1] hover:underline uppercase tracking-widest"
                          >
                            Gestionar todas las búsquedas
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/Profil/favoritos" className="text-white hover:text-white/80 transition-colors">
                <Heart size={24} strokeWidth={1.5} />
              </Link>
            </nav>
            
            {user ? (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ml-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden text-[#f25c1a]">
                  <User size={18} strokeWidth={2} />
                </div>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-white text-sm sm:text-base font-medium hidden sm:block truncate max-w-[100px]">{user.displayName || user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} className={`text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Dashboard Unified User Panel */}
        <AnimatePresence>
          {isOpen && renderUserPanel()}
        </AnimatePresence>
      </header>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showExpiredBanner && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-red-500 text-white text-[11px] md:text-[13px] py-1.5 md:py-2 z-[60] text-center font-bold tracking-wide shadow-md flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4"
          >
            <div className="flex items-center gap-1.5"><Clock size={14} /> <span>Ai {expiredAdsCount} anunț{expiredAdsCount === 1 ? '' : 'uri'} expirat{expiredAdsCount === 1 ? '' : 'e'}. Vizibilitate oprită în căutări.</span></div>
            <Link href="/Profil/my-ads?tab=expired" className="bg-white text-red-500 px-3 py-1 rounded-full text-[10px] md:text-xs hover:bg-red-50 transition-colors uppercase tracking-widest shadow-sm">
              Reactivează acum
            </Link>
            <button onClick={dismissBanner} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    <header className={`${navClass} ${showExpiredBanner ? 'top-[36px] md:top-[44px]' : 'top-0'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Logo size="md" dark={textColor === 'text-white'} />
          </Link>
          
          {/* Domain Switcher */}
          <div className="hidden md:flex bg-gray-100 p-1 rounded-full relative items-center cursor-pointer shadow-inner border border-gray-200/60">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                domain === 'imobiliare' ? 'left-1' : 'left-[calc(50%+3px)]'
              }`}
            />
            <button
              onClick={() => handleDomainChange('imobiliare')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-black transition-colors ${
                domain === 'imobiliare' ? 'text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Building2 size={14} /> IMOBILIARE
            </button>
            <button
              onClick={() => handleDomainChange('auto')}
              className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-black transition-colors ${
                domain === 'auto' ? 'text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Car size={14} /> AUTO
            </button>
          </div>
        </div>
        {/* Right: Icon Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/Profil/messages" className={`${iconColor} ${hoverColor} transition-colors relative group`}>
            <MessageSquare size={24} strokeWidth={1.5} />
            {unreadMessages > 0 && (
              <>
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm">
                  {unreadMessages}
                </span>
                <span className="absolute -top-2 -right-2 bg-blue-400 w-[18px] h-[18px] rounded-full animate-ping opacity-75"></span>
              </>
            )}
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className={`${iconColor} ${hoverColor} transition-colors relative`}
            >
              <Bell size={24} strokeWidth={1.5} />
              {savedSearches.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4567c1] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {savedSearches.length}
                </span>
              )}
            </button>

            {/* Saved Searches Dropdown */}
            <AnimatePresence>
              {showSavedSearches && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden z-[60]"
                >
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <FolderSearch size={16} className="text-[#4567c1]" />
                      Mis búsquedas guardadas
                    </h3>
                    <button 
                      onClick={() => setShowSavedSearches(false)}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {savedSearches.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-xs font-medium">No tienes búsquedas guardadas todavía</p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {savedSearches.map((search) => (
                          <div key={search.id} className="group relative border-b border-gray-50 last:border-0">
                            <Link 
                              href={`/propiedades?city=${search.filters.city}&type=${search.filters.type}&status=${search.filters.status}&minPrice=${search.filters.minPrice}`}
                              onClick={() => setShowSavedSearches(false)}
                              className="block p-4 hover:bg-gray-50 transition-colors pr-12"
                            >
                              <div className="font-bold text-gray-800 text-sm mb-1 leading-tight">{search.name}</div>
                              <div className="flex items-center gap-2 text-gray-400 text-[11px] font-medium uppercase tracking-wider">
                                <Clock size={10} />
                                {new Date(search.timestamp).toLocaleDateString('es-ES')}
                              </div>
                            </Link>
                            <button 
                              onClick={() => deleteSearch(search.id)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {savedSearches.length > 0 && (
                    <div className="p-3 bg-gray-50/30 border-t border-gray-50">
                      <Link 
                        href="/Profil/searches" 
                        className="block text-center text-[11px] font-bold text-[#4567c1] hover:underline uppercase tracking-widest"
                      >
                        Gestionar todas las búsquedas
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link href="/Profil/favoritos" className={`${iconColor} ${hoverColor} transition-colors`}>
            <Heart size={24} strokeWidth={1.5} />
          </Link>
 
          {user ? (
            <div 
              className="flex items-center gap-3 ml-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border border-white/20 bg-emerald-500`}>
                <User size={20} className={`text-white`} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1">
                <span className={`${textColor} text-sm font-medium`}>{user.displayName || user.email?.split('@')[0]}</span>
                <ChevronDown size={14} className={`${textColor} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          ) : (
            <Link href="/auth" className={`ml-2 text-sm font-bold ${textColor} ${hoverColor} transition-colors tracking-wide px-4 py-2 border border-white/20 rounded-full hover:bg-white/10`}>
              Iniciar sesión
            </Link>
          )}
          
          {/* Language Switcher */}
          <div className="relative group ml-3 flex items-center">
            <button className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-black/5 transition-all ${textColor}`}>
              <img src="https://flagcdn.com/w20/ro.png" alt="RO" className="w-[18px] h-[13px] object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
              <span className="text-[13px] font-bold tracking-wide">RO</span>
              <ChevronDown size={14} className="opacity-70 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-1 group-hover:translate-y-0 z-50">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-[18px] h-[13px] object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                <span className="font-medium">Español</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-sky-600 bg-sky-50 transition-colors">
                <img src="https://flagcdn.com/w20/ro.png" alt="RO" className="w-[18px] h-[13px] object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                <span className="font-bold">Română</span>
              </button>
            </div>
          </div>
 
          <Link 
            href="/publicar-anuncio"
            className="ml-4 bg-[#574188] hover:bg-[#483570] text-white px-5 py-2 rounded-sm transition-all flex flex-col items-center shadow-sm"
          >
            <span className="text-sm font-bold leading-tight">Publica tu anuncio</span>
            <span className="text-[11px] font-light leading-tight">¡es gratis!</span>
          </Link>
        </nav>
 
        {/* Mobile Toggle & Domain */}
        <div className="flex lg:hidden items-center gap-4">
          <div className="flex bg-gray-100/50 p-1 rounded-full relative items-center cursor-pointer shadow-inner">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${
                domain === 'imobiliare' ? 'left-1' : 'left-[calc(50%+3px)]'
              }`}
            />
            <button
              onClick={() => handleDomainChange('imobiliare')}
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                domain === 'imobiliare' ? 'text-[var(--primary)]' : 'text-gray-400'
              }`}
            >
              <Building2 size={16} />
            </button>
            <button
              onClick={() => handleDomainChange('auto')}
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                domain === 'auto' ? 'text-[var(--primary)]' : 'text-gray-400'
              }`}
            >
              <Car size={16} />
            </button>
          </div>
          
          <Link href="/Profil/messages" className={`${textColor} relative group`}>
            <MessageSquare size={20} />
            {unreadMessages > 0 && (
              <>
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm">
                  {unreadMessages}
                </span>
                <span className="absolute -top-2 -right-2 bg-blue-400 w-[16px] h-[16px] rounded-full animate-ping opacity-75"></span>
              </>
            )}
          </Link>
          {user ? (
            <div 
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${textColor}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <User size={24} />
            </div>
          ) : (
            <Link href="/auth" className={`${textColor} font-bold text-sm tracking-wide`}>
              Entrar
            </Link>
          )}
        </div>
      </div>
 
      <div className="relative container mx-auto px-6 flex justify-end">
        <AnimatePresence>
          {isOpen && renderUserPanel()}
        </AnimatePresence>
      </div>
    </header>
    </>
  );
}
