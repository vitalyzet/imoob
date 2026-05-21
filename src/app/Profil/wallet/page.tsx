'use client';

import { 
  Wallet, 
  Plus, 
  History, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  TrendingUp, 
  Calendar, 
  Star, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, onSnapshot, setDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

const creditPackages = [
  { id: 'eur_10', name: 'Starter', amount: 10, credits: 100, price: '10€', popular: false },
  { id: 'eur_50', name: 'Professional', amount: 50, credits: 550, price: '50€', popular: true, bonus: '+10% Bonus' },
  { id: 'eur_100', name: 'Corporate', amount: 100, credits: 1200, price: '100€', popular: false, bonus: '+20% Bonus' }
];

// Replaced static transactions with Firebase dynamic history

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0.00);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedPack, setSelectedPack] = useState('eur_50');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [view, setView] = useState<'dashboard' | 'history'>('dashboard');
  const [category, setCategory] = useState<'all' | 'refill' | 'promo'>('all');
  
  const [showGateway, setShowGateway] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'revolut'>('card');

  useEffect(() => {
    if (!user) return;
    
    // Set up real-time listener for the user document
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setBalance(data.walletBalance || 0);
        setTransactions((data.walletHistory || []).reverse());
        console.log("[Wallet] Real-time update received");
      }
    }, (error) => {
      console.error("Error listening to wallet updates:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredTransactions = transactions.filter(t => 
    category === 'all' || t.category === category
  );

  const processPayment = async () => {
    if (!user) return;
    setIsProcessing(true);
    
    // Simulate Gateway latency
    setTimeout(async () => {
      const p = creditPackages.find(x => x.id === selectedPack);
      if (p) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const newTx = {
            id: 'tx_' + Date.now(),
            label: `Alimentare (${paymentMethod === 'card' ? 'Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Revolut'})`,
            am: `+${p.amount.toFixed(2)}€`,
            date: new Date().toLocaleString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            type: 'in',
            category: 'refill',
            timestamp: Date.now()
          };
          
          await setDoc(userRef, {
            walletBalance: increment(p.amount),
            walletHistory: arrayUnion(newTx)
          }, { merge: true });

          setBalance(b => b + p.amount);
          setTransactions(prev => [newTx, ...prev]);
        } catch (e) {
          console.error("Payment failed to save", e);
        }
      }
      setIsProcessing(false);
      setShowGateway(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 flex flex-col gap-6">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
      
      {/* Breadcrumb - Compact */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        <span>Contul meu</span>
        <ChevronRight size={10} />
        <span className="text-[#f25c1a]">Alimentează cont</span>
      </div>

      {/* Situatie Cont - Header Section Dual View */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-[1.5] bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between group">
          <div className="flex flex-col gap-1">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Credit existent</h2>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">{balance.toFixed(2)}</span>
                <span className="text-xl font-black text-[#f25c1a]">€</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Zap size={12} className="text-gray-400 group-hover:text-orange-400 transition-colors" fill="currentColor" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">{(balance * 10).toLocaleString()} Credite disponibile</span>
              </div>
            </div>
          </div>
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#f25c1a] shadow-sm shadow-orange-500/5 group-hover:scale-110 transition-transform">
            <Wallet size={28} />
          </div>
        </div>

        <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dată expirare credit</h2>
            <span className="text-lg font-black text-gray-700">12 Oct 2026</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Packages & Refill */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-[#f25c1a]" fill="currentColor" />
              Pachete de credite
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {creditPackages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPack(p.id)}
                  className={`relative flex flex-col p-5 rounded-2xl border-2 transition-all text-left ${
                    selectedPack === p.id 
                      ? 'border-[#f25c1a] bg-orange-50/10' 
                      : 'border-gray-50 bg-gray-50/30 hover:border-gray-200'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2 left-4 bg-[#f25c1a] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Popular
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">{p.name}</span>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-lg font-black text-gray-900 leading-none">{p.credits} <span className="text-[10px] opacity-40 uppercase tracking-tighter">Credite</span></span>
                    <span className="text-sm font-black text-[#f25c1a]">{p.price}</span>
                  </div>
                  {p.bonus && <span className="text-[9px] font-black text-green-600 uppercase tracking-wider">{p.bonus}</span>}
                </button>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400">
                  <CreditCard size={20} />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-black text-gray-800 tracking-tight">Metodă de plată: Card Bancar</span>
                  <span className="text-[10px] text-gray-400 font-bold">VISA •••• 4242</span>
                </div>
                <button className="text-[10px] font-black text-[#f25c1a] uppercase tracking-widest hover:underline">Edit</button>
              </div>

              <button
                onClick={() => setShowGateway(true)}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[2px] transition-all relative overflow-hidden active:scale-95 flex items-center justify-center gap-3 bg-[#f25c1a] text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
              >
                Cumpără acum pachetul
                <ArrowRight size={14} />
              </button>
              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                <ShieldCheck size={12} className="text-green-500" />
                Tranzacție securizată 256-bit
              </div>
            </div>
          </div>
        </div>

        {/* Right: History - Compact List */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-6">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
            <History size={16} className="text-[#f25c1a]" />
            Istoric
          </h3>
          <div className="flex flex-col gap-3">
            {transactions.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-gray-800">{t.label}</span>
                  <span className="text-[9px] text-gray-400 font-bold">{t.date}</span>
                </div>
                <span className={`text-[12px] font-black ${t.type === 'in' ? 'text-green-600' : 'text-gray-900'}`}>
                  {t.am}
                </span>
              </div>
            ))}
          </div>
                <button 
                  onClick={() => setView('history')}
                  className="mt-auto py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#f25c1a] border-t border-gray-50 pt-4"
                >
                  Vezi tot istoricul
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8 bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.06)]"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setView('dashboard')}
                  className="w-fit flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#f25c1a] transition-colors mb-2"
                >
                  <ChevronRight size={14} className="rotate-180" />
                  Înapoi la Portofel
                </button>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Istoric Tranzacții</h1>
              </div>

              {/* Filters */}
              <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                {[
                  { id: 'all', label: 'Toate' },
                  { id: 'refill', label: 'Alimentări' },
                  { id: 'promo', label: 'Promovări' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id as any)}
                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                      category === cat.id 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-100' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List Table */}
            <div className="flex flex-col gap-3 min-h-[400px]">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-6 rounded-[28px] hover:bg-gray-50/50 border border-transparent hover:border-gray-50 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        t.type === 'in' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#f25c1a]'
                      }`}>
                        {t.type === 'in' ? <Plus size={22} /> : <TrendingUp size={22} />}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[15px] font-black text-gray-800 leading-tight mb-1">{t.label}</span>
                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{t.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[18px] font-black leading-none mb-1 ${
                        t.type === 'in' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {t.am}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-300">Confirmat</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-300">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <History size={32} />
                  </div>
                  <span className="text-sm font-bold">Nicio tranzacție găsită în această categorie.</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Tip Section - Softened Elegant Orange with Subtler Margin */}
      <div className="mt-2 bg-[#FFF9F5] rounded-[32px] p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group border border-orange-100/50 shadow-sm shadow-orange-500/5 transition-all hover:bg-[#FFF4ED]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-5 relative">
          <div className="w-14 h-14 bg-white rounded-[22px] flex items-center justify-center text-[#f25c1a] shadow-sm border border-orange-50 group-hover:scale-105 transition-transform duration-500">
            <TrendingUp size={28} />
          </div>
          <div className="flex flex-col text-left">
            <h4 className="text-lg font-black text-gray-800 leading-tight">Vrei mai multă vizibilitate?</h4>
            <p className="text-[12px] text-gray-500 font-bold tracking-tight">Anunțurile promovate primesc de 5x mai multe vizualizări.</p>
          </div>
        </div>
        <button className="bg-[#f25c1a] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[2px] transition-all relative overflow-hidden shadow-lg shadow-orange-500/20 hover:bg-[#ff6b00] hover:shadow-orange-500/30 active:scale-95">
          Promovează acum
        </button>
      </div>

      {/* Success Success Success Success Success Success Success Success Success Success Success Success Success Success Success Success Success Success Success Success */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }} className="bg-white rounded-[32px] p-8 max-w-[320px] w-full text-center shadow-2xl flex flex-col gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 size={32} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-gray-900">Succes!</h3>
                <p className="text-xs text-gray-400 font-medium">Banii și creditele au fost adăugate în cont.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Gateway Modal */}
      <AnimatePresence>
        {showGateway && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
              
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#f25c1a]">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Finalizare Plată</h3>
                    <p className="text-[10px] font-bold text-gray-400">Pachet {creditPackages.find(p => p.id === selectedPack)?.name} - {creditPackages.find(p => p.id === selectedPack)?.price}</p>
                  </div>
                </div>
                <button onClick={() => !isProcessing && setShowGateway(false)} disabled={isProcessing} className="w-7 h-7 rounded-full bg-white text-gray-400 hover:text-gray-900 flex items-center justify-center shadow-sm disabled:opacity-50">
                  <ChevronRight size={14} className={isProcessing ? "" : "rotate-90"} />
                </button>
              </div>

              <div className="p-4 sm:p-5 flex flex-col gap-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selectați metoda de plată</span>
                
                <div className="flex flex-col gap-2.5">
                  {[
                    { id: 'card', name: 'Card Bancar', icon: <CreditCard size={16} /> },
                    { id: 'paypal', name: 'PayPal', icon: <span className="font-serif font-black italic text-sm">P</span> },
                    { id: 'revolut', name: 'Revolut Pay', icon: <span className="font-black italic text-[14px]">R</span> }
                  ].map(method => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      disabled={isProcessing}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
                        paymentMethod === method.id 
                          ? 'border-[#f25c1a] bg-orange-50/20' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                         <div className={`w-7 h-7 rounded-full flex items-center justify-center ${paymentMethod === method.id ? 'bg-[#f25c1a] text-white' : 'bg-gray-100 text-gray-500'}`}>
                           {method.icon}
                         </div>
                         <span className={`text-[12px] font-bold ${paymentMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>{method.name}</span>
                       </div>
                       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#f25c1a]' : 'border-gray-200'}`}>
                         {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-[#f25c1a]"></div>}
                       </div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#FFF9F5] p-3 rounded-xl border border-orange-100 flex flex-col gap-1.5 mt-1">
                   <div className="flex justify-between items-center text-[11px] text-gray-500 font-bold">
                     <span>Subtotal</span>
                     <span>{creditPackages.find(p => p.id === selectedPack)?.price}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] text-gray-500 font-bold">
                     <span>Taxe (TVA)</span>
                     <span>Inclus</span>
                   </div>
                   <div className="h-px w-full bg-orange-100/50 my-1"></div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-black text-gray-900 uppercase">Total Plată</span>
                     <span className="text-lg font-black text-[#f25c1a]">{creditPackages.find(p => p.id === selectedPack)?.price}</span>
                   </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="w-full mt-1 bg-slate-900 hover:bg-black text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-80"
                >
                  {isProcessing ? (
                    <><svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Procesare securizată...</>
                  ) : (
                    <>Plătește {creditPackages.find(p => p.id === selectedPack)?.price}</>
                  )}
                </button>
                <p className="text-[9px] text-center text-gray-400 font-medium leading-tight opacity-70">Plățile sunt securizate end-to-end de sistemul nosso bancar.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
