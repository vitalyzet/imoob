'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, MessageSquare, Phone, Search, ThumbsUp, Heart, TrendingUp, List, Wallet, Settings, LogOut, PlusSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const activityItems = [
  { id: 'Profil', label: 'Profil', icon: LayoutGrid, href: '/Profil' },
  { id: 'messages', label: 'Mesajele mele', icon: MessageSquare, href: '/Profil/messages' },
  { id: 'contacted', label: 'Anunțuri contactate', icon: Phone, href: '/Profil/contacted' },
  { id: 'searches', label: 'Căutările mele', icon: Search, href: '/Profil/searches' },
  { id: 'recommended', label: 'Anunțuri recomandate', icon: ThumbsUp, href: '/Profil/recommended' },
  { id: 'favoritos', label: 'Anunțuri salvate', icon: Heart, href: '/Profil/favoritos' },
  { id: 'my-ads', label: 'Anunțurile mele', icon: List, href: '/Profil/my-ads' },
  { id: 'promote-ads', label: 'Promovează anunțuri', icon: TrendingUp, href: '/Profil/promote-ads' },
];

const accountItems = [
  { id: 'add', label: 'Adaugă anunț', icon: PlusSquare, href: '/publicar-anuncio' },
  { id: 'wallet', label: 'Alimentează cont', icon: Wallet, isWallet: true, href: '/Profil/wallet' },
  { id: 'web-design', label: 'Design Web', icon: LayoutGrid, href: '/Profil/web-design' },
  { id: 'settings', label: 'Setări cont', icon: Settings, href: '/Profil/settings' },
  { id: 'logout', label: 'Deconectare', icon: LogOut, href: '/' },
];

const getHeaderInfo = (pathname: string) => {
  if (pathname === '/Profil') return { title: 'Profil', subtitle: 'Privire de ansamblu asupra activității tale' };
  if (pathname.includes('/messages')) return { title: 'Mesajele mele', subtitle: 'Comunică cu proprietarii și agenții' };
  if (pathname.includes('/contacted')) return { title: 'Anunțuri contactate', subtitle: 'Anuncis en tu punto de mira' };
  if (pathname.includes('/searches')) return { title: 'Căutările mele', subtitle: 'Căutările tale salvate' };
  if (pathname.includes('/recommended')) return { title: 'Anunțuri recomandate', subtitle: 'Recomandări bazate pe preferințele tale' };
  if (pathname.includes('/favoritos')) return { title: 'Anunțuri salvate', subtitle: 'Gestiona tus inmuebles favoritos' };
  if (pathname.includes('/my-ads')) return { title: 'Anunțurile mele', subtitle: 'Gestionați anunțurile și performanța' };
  if (pathname.includes('/promote-ads')) return { title: 'Promovează anunțuri', subtitle: 'Dezbate și atrage mai mulți clienți' };
  if (pathname.includes('/web-design')) return { title: 'Design Web', subtitle: 'Pachete și servicii premium de design' };
  return { title: 'Profil', subtitle: 'Personalizează-ți experiența IMOOB' };
};

export default function ProfilLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  const { title, subtitle } = getHeaderInfo(pathname);

  useEffect(() => {
    const fetchBalance = async () => {
      if (user) {
        try {
          const userSnap = await getDoc(doc(db, 'users', user.uid));
          if (userSnap.exists()) {
            setWalletBalance(userSnap.data().walletBalance || 0);
          }
        } catch (error) {
          console.error("Error fetching balance for sidebar", error);
        }
      }
    };
    fetchBalance();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Sync title with Navbar dynamically
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('profil-tab-change', { detail: title }));
  }, [title]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Menu - Left (Optimized for Routing) */}
          <aside className="w-full md:w-72 flex-shrink-0 sticky top-28">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden p-3 border border-gray-200">
              
              {/* Category: ACTIVITATE */}
              <div className="flex flex-col gap-1 mb-4">
                <div className="px-5 py-3 mb-1">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[3px]">Activitate</h4>
                </div>
                {activityItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[22px] text-[14px] font-bold transition-all duration-100 group ${
                        isActive
                          ? 'bg-[#f25c1a] shadow-[0_10px_30px_rgba(242,92,26,0.2)] text-white' 
                          : 'text-gray-600 hover:bg-[#f25c1a] hover:text-white'
                      }`}
                    >
                      <item.icon size={20} className={`transition-colors duration-100 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Category: CONTUL MEU */}
              <div className="flex flex-col gap-1 border-t border-gray-100 pt-4 mt-2">
                <div className="px-5 py-3 mb-1">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[3px]">Contul meu</h4>
                </div>
                {accountItems.map((item) => {
                  const isActive = pathname === item.href;
                  const content = (
                    <>
                      <item.icon size={20} className={`transition-colors duration-100 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.isWallet && (
                        <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${isActive ? 'bg-white text-[#f25c1a]' : 'bg-[#f25c1a]/10 text-[#f25c1a]'}`}>
                          {walletBalance.toFixed(2)}€
                        </div>
                      )}
                    </>
                  );

                  const commonClasses = `w-full flex items-center gap-4 px-5 py-3.5 rounded-[22px] text-[14px] font-bold transition-all duration-100 group ${
                    isActive
                      ? 'bg-[#f25c1a] shadow-[0_10px_30px_rgba(242,92,26,0.2)] text-white' 
                      : 'text-gray-600 hover:bg-[#f25c1a] hover:text-white'
                  }`;

                  return item.id === 'logout' ? (
                    <button
                      key={item.id}
                      onClick={() => logout()}
                      className={commonClasses}
                    >
                      {content}
                    </button>
                  ) : (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={commonClasses}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

            </div>
          </aside>

          {/* Content Area - Right (Routed Content) */}
          <main className="flex-grow relative">
            {/* Header Section */}
            <div className="mb-8 text-left">
              <h1 className="text-2xl md:text-[32px] font-black text-[#f25c1a] mb-2 leading-tight tracking-tight">
                {title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-[3px] w-12 bg-[#f25c1a] rounded-full shadow-[0_2px_8px_rgba(242,92,26,0.3)]"></div>
                <p className="text-gray-500 font-semibold text-[15px] tracking-tight lowercase first-letter:uppercase">{subtitle}</p>
              </div>
            </div>

            {/* Sub-page Content */}
            <div className="min-h-[500px]">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
