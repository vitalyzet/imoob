'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, BarChart, Settings, Home, CheckCircle } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Logo from '@/components/layout/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingImob, setPendingImob] = useState(0);
  const [pendingAuto, setPendingAuto] = useState(0);

  useEffect(() => {
    // 1. Listen to pending imobiliare ads
    const qImob = query(collection(db, 'anuncios'), where('status', '==', 'pending'));
    const unsubImob = onSnapshot(qImob, (snapshot) => {
      setPendingImob(snapshot.size);
    }, (err) => {
      console.error("Error listening to pending property ads:", err);
    });

    // 2. Listen to pending auto ads
    const qAuto = query(collection(db, 'anuncios_auto'), where('status', '==', 'pending'));
    const unsubAuto = onSnapshot(qAuto, (snapshot) => {
      setPendingAuto(snapshot.size);
    }, (err) => {
      console.error("Error listening to pending auto ads:", err);
    });

    return () => {
      unsubImob();
      unsubAuto();
    };
  }, []);

  const totalPending = pendingImob + pendingAuto;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1527] border-r border-[#1e293b] flex flex-col fixed h-full z-10 transition-all">
        <div className="h-20 flex items-center px-6 border-b border-[#1e293b]">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo size="md" dark={true} />
            <span className="text-[10px] bg-[#139E69] text-white px-2 py-0.5 rounded-full uppercase tracking-widest ml-1">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          <Link 
            href="/admin" 
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              pathname === '/admin' 
                ? 'bg-[#139E69]/10 text-[#10b981]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} />
              <span>Moderación</span>
            </div>
            {totalPending > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-md shadow-red-500/20">
                {totalPending}
              </span>
            )}
          </Link>

          <Link 
            href="/admin/active" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              pathname === '/admin/active' 
                ? 'bg-[#139E69]/10 text-[#10b981]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle size={20} />
            <span>Anunțuri Active</span>
          </Link>

          <Link 
            href="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              pathname === '/admin/users' 
                ? 'bg-[#139E69]/10 text-[#10b981]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users size={20} />
            Usuarios
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors pointer-events-none opacity-50">
            <ShieldAlert size={20} />
            Reportes
          </Link>
          <Link 
            href="/admin/analytics" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              pathname === '/admin/analytics' 
                ? 'bg-[#139E69]/10 text-[#10b981]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart size={20} />
            Analíticas
          </Link>
          <Link 
            href="/admin/transactions" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              pathname === '/admin/transactions' 
                ? 'bg-[#139E69]/10 text-[#10b981]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            Transacciones
          </Link>
          
          <Link 
            href="/admin/seo" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              pathname === '/admin/seo' 
                ? 'bg-[#139E69]/10 text-[#10b981]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings size={20} />
            Setări SEO
          </Link>
        </nav>

        <div className="p-4 border-t border-[#1e293b]">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Home size={20} />
            Volver a inicio
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-black text-slate-800">Centro de Control</h1>
          <div className="flex items-center gap-4">
             <Link href="/" className="flex items-center gap-2 bg-slate-800 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95">
               <Home size={16} />
               Volver a Vindu24
             </Link>
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors">
               <Settings size={20} />
             </div>
             <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center font-bold text-white uppercase">
               AD
             </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
