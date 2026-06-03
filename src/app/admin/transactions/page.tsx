'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Download, Search, Loader2, ArrowUpRight, ArrowDownRight, Wallet, User, Calendar, FileText } from 'lucide-react';

interface Transaction {
  id: string; // generated
  userId: string;
  userName: string;
  userEmail: string;
  type: 'in' | 'out';
  amount: number;
  dateStr: string;
  timestamp: number; // for sorting
  method: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');

  const parseCustomDate = (dateStr: string) => {
    // Example: "12 Oct, 15:30" or "12 Oct 2023, 15:30"
    // Just create a fallback sorting using JS Date parsing if possible
    try {
      const parsed = new Date(dateStr).getTime();
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  };

  const [rawUsers, setRawUsers] = useState<any[]>([]);
  const [rawImobAds, setRawImobAds] = useState<any[]>([]);
  const [rawAutoAds, setRawAutoAds] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => setRawUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() }))));
    const unsubImob = onSnapshot(collection(db, 'anuncios'), (snap) => setRawImobAds(snap.docs.map(d => d.data())));
    const unsubAuto = onSnapshot(collection(db, 'anuncios_auto'), (snap) => setRawAutoAds(snap.docs.map(d => d.data())));

    return () => {
      unsubUsers();
      unsubImob();
      unsubAuto();
    };
  }, []);

  useEffect(() => {
    const allTx: Transaction[] = [];
    const allAds = [...rawImobAds, ...rawAutoAds];

    rawUsers.forEach(u => {
      const fallbackName = allAds.find((a: any) => a.userId === u.uid || (u.email && a.email === u.email))?.name || '';
      const fallbackEmail = allAds.find((a: any) => a.userId === u.uid || (u.email && a.email === u.email))?.email || '';

      const userName = u.name || fallbackName || 'Sin Nombre';
      const userEmail = u.email || fallbackEmail || 'Sin Email';

      if (u.walletHistory && Array.isArray(u.walletHistory)) {
        u.walletHistory.forEach((tx: any, idx: number) => {
          const amountStr = String(tx.am || '0').replace(/[^0-9.]/g, '');
          const amount = parseFloat(amountStr) || 0;
          allTx.push({
            id: `${u.uid}-${idx}`,
            userId: u.uid,
            userName,
            userEmail,
            type: tx.type === 'in' ? 'in' : 'out',
            amount,
            dateStr: tx.date || 'Fecha desconocida',
            timestamp: tx.timestamp || parseCustomDate(tx.date || ''),
            method: tx.label || (tx.type === 'in' ? 'Recarga' : 'Promoción')
          });
        });
      }
    });

    allTx.sort((a, b) => b.timestamp - a.timestamp);
    setTransactions(allTx);
    setLoading(false);
  }, [rawUsers, rawImobAds, rawAutoAds]);

  const filtered = transactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!tx.userName.toLowerCase().includes(q) && !tx.userEmail.toLowerCase().includes(q) && !tx.dateStr.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalIn = transactions.filter(t => t.type === 'in').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);

  const downloadCSV = () => {
    // CSV Header
    let csvContent = "Fecha,Usuario,Email,Tipo,Operacion,Importe (EUR)\n";
    
    // CSV Rows
    filtered.forEach(tx => {
      const operation = tx.type === 'in' ? 'Recarga de Saldo' : 'Promoción de Anuncio';
      // Escape strings containing commas
      const name = `"${tx.userName.replace(/"/g, '""')}"`;
      const email = `"${tx.userEmail}"`;
      const date = `"${tx.dateStr}"`;
      
      csvContent += `${date},${name},${email},${tx.type},${operation},${tx.amount.toFixed(2)}\n`;
    });

    // Create Blob and Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Transacciones_VINDU24_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Registro Financiero</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Historial completo de pagos y recargas de todos los usuarios.</p>
        </div>
        <button 
          onClick={downloadCSV}
          disabled={filtered.length === 0}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Volumen Total</div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{transactions.length} <span className="text-sm text-slate-400 font-medium tracking-normal">movimientos</span></div>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Total Ingresado (Recargas)</div>
            <div className="text-2xl font-black text-emerald-600 tracking-tight">{totalIn.toFixed(2)}€</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <ArrowUpRight size={20} />
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Total Consumido (Promociones)</div>
            <div className="text-2xl font-black text-indigo-600 tracking-tight">{totalOut.toFixed(2)}€</div>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <ArrowDownRight size={20} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 h-[52px] border border-slate-200 focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-800/5 transition-all shadow-sm">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por usuario, email o fecha..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-800 font-medium text-[14px] placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1 gap-1 shadow-sm h-[52px]">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'in', label: 'Recargas' },
            { id: 'out', label: 'Promociones' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all h-full flex items-center ${
                filterType === f.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p className="font-bold uppercase tracking-widest text-xs">Cargando registros...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[32px] p-16 text-center border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Sin transacciones</h3>
          <p className="text-slate-500 font-medium text-sm">No se encontraron registros que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4 text-center">Tipo de Operación</th>
                <th className="px-6 py-4 text-right">Importe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {tx.dateStr}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 border border-slate-200">
                        {tx.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{tx.userName}</div>
                        <div className="text-xs text-slate-500">{tx.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {tx.type === 'in' ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                          <ArrowUpRight size={12} /> Recarga de saldo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                          <ArrowDownRight size={12} /> Promoción de Anuncio
                        </span>
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 truncate max-w-[150px]" title={tx.method}>
                        {tx.method}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`font-black text-lg ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'in' ? '+' : '-'}{tx.amount.toFixed(2)}€
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
