'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Search, Loader2, ShieldCheck, ShieldAlert, Mail, Phone, MapPin, Wallet, TrendingUp, Car, Home, X, Eye, ChevronDown, Ban, Unlock, Calendar, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  walletBalance: number;
  walletHistory: any[];
  emailVerified: boolean;
  createdAt: any;
  blocked?: boolean;
  // Computed
  totalAdsImob: number;
  totalAdsAuto: number;
  promotedAds: number;
  ads: any[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'ads' | 'wallet'>('info');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');

  const handleOpenModal = (u: UserData) => {
    setSelectedUser(u);
    setModalTab('info');
  };

  const [rawUsers, setRawUsers] = useState<any[]>([]);
  const [rawImobAds, setRawImobAds] = useState<any[]>([]);
  const [rawAutoAds, setRawAutoAds] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setRawUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      setLoading(false);
    });
    const unsubImob = onSnapshot(collection(db, 'anuncios'), (snap) => {
      setRawImobAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubAuto = onSnapshot(collection(db, 'anuncios_auto'), (snap) => {
      setRawAutoAds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUsers();
      unsubImob();
      unsubAuto();
    };
  }, []);

  useEffect(() => {
    try {
      const enriched = rawUsers.map(u => {
        const userImob = rawImobAds.filter((a: any) => a.userId === u.uid || (u.email && a.email === u.email)).map(a => ({...a, domainType: 'imob'}));
        const userAuto = rawAutoAds.filter((a: any) => a.userId === u.uid || (u.email && a.email === u.email)).map(a => ({...a, domainType: 'auto'}));
        const allUserAds = [...userImob, ...userAuto];
        const promoted = allUserAds.filter((a: any) =>
          a.selectedPromotion && a.selectedPromotion !== 'free' && a.status === 'active'
        );
        const recoveredName = u.name || (allUserAds.length > 0 ? allUserAds[0].name : '');
        const recoveredEmail = u.email || (allUserAds.length > 0 ? allUserAds[0].email : '');

        return {
          ...u,
          name: recoveredName,
          email: recoveredEmail,
          totalAdsImob: userImob.length,
          totalAdsAuto: userAuto.length,
          promotedAds: promoted.length,
          ads: allUserAds,
          walletBalance: u.walletBalance || 0,
          walletHistory: u.walletHistory || [],
          emailVerified: u.emailVerified || false,
        } as UserData;
      });

      // Update selected user if modal is open to reflect live changes (like wallet balance)
      if (selectedUser) {
        const updatedSelected = enriched.find(e => e.uid === selectedUser.uid);
        if (updatedSelected) {
          setSelectedUser(updatedSelected);
        }
      }

      // Sort by createdAt (newest first)
      enriched.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (new Date(a.createdAt).getTime() || 0));
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (new Date(b.createdAt).getTime() || 0));
        return timeB - timeA;
      });

      setUsers(enriched);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [rawUsers, rawImobAds, rawAutoAds]);

  const handleBlockToggle = async (userToToggle: UserData) => {
    const isBlocking = !userToToggle.blocked;
    if (!confirm(`¿Estás seguro de que quieres ${isBlocking ? 'bloquear' : 'desbloquear'} a este usuario? ${isBlocking ? 'Todos sus anuncios serán retirados.' : 'Sus anuncios volverán a su estado anterior.'}`)) return;

    try {
      // 1. Update user document
      await updateDoc(doc(db, 'users', userToToggle.uid), { blocked: isBlocking });

      // 2. Fetch all ads of this user
      const imobQuery = query(collection(db, 'anuncios'), where('userId', '==', userToToggle.uid));
      const autoQuery = query(collection(db, 'anuncios_auto'), where('userId', '==', userToToggle.uid));
      
      const [imobSnap, autoSnap] = await Promise.all([getDocs(imobQuery), getDocs(autoQuery)]);
      
      const updatePromises: any[] = [];

      const processAd = (adDoc: any, colName: string) => {
        const adData = adDoc.data();
        if (isBlocking) {
           // Blocking
           if (adData.status !== 'blocked') {
             updatePromises.push(updateDoc(doc(db, colName, adDoc.id), { 
               status: 'blocked',
               previousStatus: adData.status
             }));
           }
        } else {
           // Unblocking
           if (adData.status === 'blocked') {
             updatePromises.push(updateDoc(doc(db, colName, adDoc.id), { 
               status: adData.previousStatus || 'pending'
             }));
           }
        }
      };

      imobSnap.forEach(d => processAd(d, 'anuncios'));
      autoSnap.forEach(d => processAd(d, 'anuncios_auto'));

      // If there are ads associated by email instead of userId (legacy), query them too
      if (userToToggle.email) {
        const imobEmailQuery = query(collection(db, 'anuncios'), where('email', '==', userToToggle.email));
        const autoEmailQuery = query(collection(db, 'anuncios_auto'), where('email', '==', userToToggle.email));
        const [imobEmailSnap, autoEmailSnap] = await Promise.all([getDocs(imobEmailQuery), getDocs(autoEmailQuery)]);
        imobEmailSnap.forEach(d => { if (d.data().userId !== userToToggle.uid) processAd(d, 'anuncios'); });
        autoEmailSnap.forEach(d => { if (d.data().userId !== userToToggle.uid) processAd(d, 'anuncios_auto'); });
      }

      await Promise.all(updatePromises);

      // 3. Update local state
      setUsers(users.map(u => u.uid === userToToggle.uid ? { ...u, blocked: isBlocking } : u));
      if (selectedUser?.uid === userToToggle.uid) {
        setSelectedUser({ ...selectedUser, blocked: isBlocking });
      }

      alert(`Usuario ${isBlocking ? 'bloqueado' : 'desbloqueado'} con éxito.`);
    } catch (err) {
      console.error('Error toggling block status:', err);
      alert('Hubo un error al actualizar el estado del usuario.');
    }
  };

  const exportUserPDF = (user: UserData) => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('es-ES');
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text('VINDU24', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Reporte de Actividad del Usuario - ${dateStr}`, 14, 28);
    
    // User Details
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Datos del Usuario', 14, 40);
    
    doc.setFontSize(10);
    doc.text(`Nombre: ${user.name || 'Sin nombre'}`, 14, 48);
    doc.text(`Email: ${user.email}`, 14, 54);
    doc.text(`Teléfono: ${user.phone || 'No provisto'}`, 14, 60);
    doc.text(`Ubicación: ${user.location || 'No especificada'}`, 14, 66);
    doc.text(`Estado: ${user.blocked ? 'Bloqueado' : user.emailVerified ? 'Verificado' : 'Pendiente'}`, 14, 72);
    doc.text(`Fecha Registro: ${formatDate(user.createdAt)}`, 14, 78);
    
    // Stats
    doc.setFontSize(14);
    doc.text('Resumen de Actividad', 110, 40);
    
    doc.setFontSize(10);
    doc.text(`Anuncios Inmobiliarios: ${user.totalAdsImob}`, 110, 48);
    doc.text(`Anuncios Auto: ${user.totalAdsAuto}`, 110, 54);
    doc.text(`Anuncios Promovados: ${user.promotedAds}`, 110, 60);
    doc.text(`Saldo Actual: ${user.walletBalance.toFixed(2)} EUR`, 110, 66);
    
    let currentY = 90;

    // Ads Table
    if (user.ads && user.ads.length > 0) {
      doc.setFontSize(14);
      doc.text('Anuncios Publicados', 14, currentY);
      
      const adsData = user.ads.map(ad => [
        ad.domainType === 'auto' ? 'Auto' : 'Inmob',
        (ad.title || `${ad.marca || ''} ${ad.model || ''}`).substring(0, 40),
        ad.price ? `${ad.price} EUR` : '-',
        ad.status === 'active' ? 'Activo' : ad.status === 'blocked' ? 'Bloqueado' : 'Pendiente',
        ad.selectedPromotion && ad.selectedPromotion !== 'free' ? 'Sí' : 'No'
      ]);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Categoría', 'Título / Modelo', 'Precio', 'Estado', 'Promovado']],
        body: adsData,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Transactions Table
    if (user.walletHistory && user.walletHistory.length > 0) {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Historial de Transacciones', 14, currentY);
      
      const txData = user.walletHistory.map(tx => [
        tx.date || '-',
        tx.type === 'in' ? 'Recarga de Saldo' : 'Promoción de Anuncio',
        tx.type === 'in' ? `+${tx.am} EUR` : `-${tx.am} EUR`
      ]);

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Fecha', 'Operación', 'Importe']],
        body: txData,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9 }
      });
    }

    doc.save(`Reporte_VINDU24_${user.name ? user.name.replace(/\s+/g, '_') : 'Usuario'}.pdf`);
  };

  const filtered = users.filter(u => {
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.phone.includes(q)) return false;
    }
    // Status filter
    if (filterStatus === 'verified' && !u.emailVerified) return false;
    if (filterStatus === 'unverified' && u.emailVerified) return false;
    return true;
  });

  const totalVerified = users.filter(u => u.emailVerified).length;
  const totalWithAds = users.filter(u => u.totalAdsImob + u.totalAdsAuto > 0).length;
  const totalWithCredit = users.filter(u => u.walletBalance > 0).length;
  const totalPromoted = users.filter(u => u.promotedAds > 0).length;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Desconocida';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return 'Desconocida';
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return 'Desconocida';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Directorio de Usuarios</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">Gestión centralizada de cuentas y permisos.</p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <Users size={16} />
          {users.length} Usuarios
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verificados</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tight">{totalVerified}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Cuentas validadas</div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Home size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activos</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tight">{totalWithAds}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Con anuncios publicados</div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promovados</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tight">{totalPromoted}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Anuncios premium</div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center text-violet-600">
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fondos</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tight">{totalWithCredit}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Usuarios con saldo</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 h-[52px] border border-slate-200 focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-800/5 transition-all shadow-sm">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-800 font-medium text-[14px] placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 gap-1">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'verified', label: 'Verificados' },
            { id: 'unverified', label: 'Sin verificar' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all ${
                filterStatus === f.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p>Cargando usuarios...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Ningún usuario encontrado</h3>
          <p className="text-slate-500">No se encontraron resultados con los filtros actuales.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4 text-center">Registro</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Anuncios</th>
                <th className="px-6 py-4 text-center">Promovados</th>
                <th className="px-6 py-4 text-center">Crédito</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const totalAds = u.totalAdsImob + u.totalAdsAuto;
                return (
                  <tr key={u.uid} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[13px] uppercase shrink-0 border border-slate-200">
                          {u.name ? u.name.charAt(0) : (u.email ? u.email.charAt(0) : 'U')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-[14px] flex items-center gap-2">
                            {u.name || 'Sin nombre'}
                            {(() => {
                              const timeCreatedAt = u.createdAt?.toMillis ? u.createdAt.toMillis() : (u.createdAt?.seconds ? u.createdAt.seconds * 1000 : (new Date(u.createdAt).getTime() || 0));
                              const isNew = timeCreatedAt > 0 && (Date.now() - timeCreatedAt) < 7 * 24 * 60 * 60 * 1000;
                              return isNew ? <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[#139E69]/10 text-[#139E69]">Nou</span> : null;
                            })()}
                          </h4>
                          <p className="text-[12px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                            <Mail size={10} /> {u.email || '—'}
                          </p>
                          {u.phone && (
                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <Phone size={10} /> {u.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[12px] font-medium text-slate-600">{formatDate(u.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.blocked ? (
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-100">
                          <Ban size={10} /> Bloqueado
                        </span>
                      ) : u.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                          <ShieldCheck size={10} /> Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                          <ShieldAlert size={10} /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[16px] font-bold text-slate-800">{totalAds}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                          {u.totalAdsImob > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Home size={10} className="text-emerald-400" /> {u.totalAdsImob}
                            </span>
                          )}
                          {u.totalAdsAuto > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Car size={10} className="text-sky-400" /> {u.totalAdsAuto}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.promotedAds > 0 ? (
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 bg-orange-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-100 px-2">
                          {u.promotedAds}
                        </span>
                      ) : (
                        <span className="text-[12px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.walletBalance > 0 ? (
                        <span className="text-[14px] font-bold text-slate-800">{u.walletBalance.toFixed(2)}€</span>
                      ) : (
                        <span className="text-[13px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(u)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleBlockToggle(u)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                            u.blocked 
                              ? 'text-emerald-500 hover:bg-emerald-50' 
                              : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={u.blocked ? "Desbloquear usuario" : "Bloquear usuario"}
                        >
                          {u.blocked ? <Unlock size={16} /> : <Ban size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden"
            >
              {/* Modal Header Premium */}
              <div className="p-8 border-b border-slate-100 bg-white relative">
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 font-bold text-2xl uppercase border border-slate-200">
                      {selectedUser.name ? selectedUser.name.charAt(0) : (selectedUser.email ? selectedUser.email.charAt(0) : 'U')}
                    </div>
                    <div>
                      <h2 className="font-black text-xl text-slate-900">{selectedUser.name || 'Sin nombre'}</h2>
                      <p className="text-slate-500 text-[14px] font-medium">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => exportUserPDF(selectedUser)} 
                      className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
                    >
                      <Download size={14} /> Exportar PDF
                    </button>
                    <button onClick={() => setSelectedUser(null)} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-slate-50 px-8 border-b border-slate-100 flex gap-6">
                <button 
                  onClick={() => setModalTab('info')} 
                  className={`py-4 text-[13px] font-bold border-b-2 transition-colors ${modalTab === 'info' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                  Información
                </button>
                <button 
                  onClick={() => setModalTab('ads')} 
                  className={`py-4 text-[13px] font-bold border-b-2 transition-colors ${modalTab === 'ads' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                  Anuncios ({selectedUser.ads.length})
                </button>
                <button 
                  onClick={() => setModalTab('wallet')} 
                  className={`py-4 text-[13px] font-bold border-b-2 transition-colors ${modalTab === 'wallet' ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                  Transacciones
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                
                {modalTab === 'info' && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedUser.blocked ? (
                          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-red-100">
                            <Ban size={12} /> Usuario Bloqueado
                          </span>
                        ) : selectedUser.emailVerified ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-emerald-100">
                            <ShieldCheck size={12} /> Email Verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                            <ShieldAlert size={12} /> Email No Verificado
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleBlockToggle(selectedUser)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                          selectedUser.blocked 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                        }`}
                      >
                        {selectedUser.blocked ? (
                          <><Unlock size={14} /> Desbloquear</>
                        ) : (
                          <><Ban size={14} /> Bloquear</>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Miembro desde</div>
                        <div className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(selectedUser.createdAt)}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Teléfono</div>
                        <div className="text-[13px] font-bold text-slate-800 flex items-center gap-2 break-all">
                          <Phone size={14} className="text-slate-400 shrink-0" />
                          {selectedUser.phone || 'No provisto'}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ubicación</div>
                        <div className="text-[13px] font-bold text-slate-800 flex items-center gap-2 truncate">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate">{selectedUser.location || 'No especificada'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                        <div className="text-2xl font-black text-slate-800">{selectedUser.totalAdsImob}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                          <Home size={10} /> Imobiliare
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                        <div className="text-2xl font-black text-slate-800">{selectedUser.totalAdsAuto}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                          <Car size={10} /> Auto
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 text-center">
                        <div className="text-2xl font-black text-orange-600">{selectedUser.promotedAds}</div>
                        <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                          <TrendingUp size={10} /> Promovados
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'ads' && (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    {selectedUser.ads.length === 0 ? (
                      <div className="text-center py-10 text-slate-400">
                        <Home size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="font-bold">Este usuario no ha publicado anuncios.</p>
                      </div>
                    ) : (
                      selectedUser.ads.map(ad => (
                        <div key={ad.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors bg-white shadow-sm">
                          <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden relative">
                            {ad.images?.[0] ? (
                              <img src={ad.images[0]} alt="Ad" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                {ad.domainType === 'auto' ? <Car size={24} /> : <Home size={24} />}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{ad.title || `${ad.brand} ${ad.model}` || 'Sin título'}</h4>
                              <span className="text-sm font-black text-slate-900">{ad.price ? `${ad.price}€` : '—'}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {ad.status === 'active' ? (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wider border border-emerald-100">Activo</span>
                              ) : ad.status === 'blocked' ? (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[9px] font-bold uppercase tracking-wider border border-red-100">Bloqueado</span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-wider border border-amber-100">{ad.status || 'Pendiente'}</span>
                              )}
                              
                              {ad.selectedPromotion && ad.selectedPromotion !== 'free' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[9px] font-bold uppercase tracking-wider border border-orange-100">
                                  <TrendingUp size={8} /> Promovado
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1">
                              <MapPin size={10} /> {ad.location?.localitate || ad.location?.city || ad.city || 'Ubicación no especificada'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {modalTab === 'wallet' && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden">
                      <div className="absolute right-0 top-0 p-6 opacity-10">
                        <Wallet size={80} />
                      </div>
                      <div className="relative z-10">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fondos Disponibles</div>
                        <div className="text-4xl font-black text-white">{selectedUser.walletBalance.toFixed(2)}€</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-3">Historial de Transacciones</h3>
                      {selectedUser.walletHistory.length === 0 ? (
                        <p className="text-sm text-slate-400">No hay transacciones recientes.</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedUser.walletHistory.map((tx: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                  {tx.type === 'in' ? <TrendingUp size={14} /> : <Wallet size={14} />}
                                </div>
                                <div>
                                  <p className="text-[12px] font-bold text-slate-800">{tx.type === 'in' ? 'Recarga de saldo' : 'Pago de promoción'}</p>
                                  <p className="text-[10px] font-medium text-slate-400">{tx.date || 'Fecha desconocida'}</p>
                                </div>
                              </div>
                              <div className={`font-black text-[14px] ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                {tx.type === 'in' ? '+' : '-'}{tx.am}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
