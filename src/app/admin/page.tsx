'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X, Eye, Loader2, Image as ImageIcon, MapPin, Tag, Car, Fuel, Gauge, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<any>(null); // For detail view modal
  
  const fetchPendingAds = async () => {
    setLoading(true);
    try {
      // Fetch from both collections
      const [imobSnap, autoSnap] = await Promise.all([
        getDocs(query(collection(db, 'anuncios'), where('status', '==', 'pending'))),
        getDocs(query(collection(db, 'anuncios_auto'), where('status', '==', 'pending')))
      ]);
      const imobData = imobSnap.docs.map(d => ({ id: d.id, _collection: 'anuncios', ...d.data() }));
      const autoData = autoSnap.docs.map(d => ({ id: d.id, _collection: 'anuncios_auto', ...d.data() }));
      const all = [...imobData, ...autoData].sort((a, b) => {
        if (!(a as any).createdAt || !(b as any).createdAt) return 0;
        return (b as any).createdAt.toMillis() - (a as any).createdAt.toMillis();
      });
      setAds(all);
    } catch (err) {
      console.error("Error fetching pending ads:", err);
      try {
        const [fb1, fb2] = await Promise.all([
          getDocs(collection(db, 'anuncios')),
          getDocs(collection(db, 'anuncios_auto'))
        ]);
        const allData = [
          ...fb1.docs.map(d => ({ id: d.id, _collection: 'anuncios', ...d.data() })),
          ...fb2.docs.map(d => ({ id: d.id, _collection: 'anuncios_auto', ...d.data() }))
        ];
        const pending = allData.filter(d => (d as any).status === 'pending');
        setAds(pending);
      } catch (inner) {
        console.error(inner);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAds();
  }, []);

  const handleAction = async (id: string, action: 'active' | 'rejected') => {
    try {
      const ad = ads.find(a => a.id === id);
      const col = ad?._collection || 'anuncios';
      await updateDoc(doc(db, col, id), {
        status: action
      });
      // Remover de la lista activa
      setAds(prev => prev.filter(a => a.id !== id));
      if (selectedAd?.id === id) setSelectedAd(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error al actualizar el estado");
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Anuncios en Modulación</h2>
          <p className="text-slate-500 mt-1">Revisa y acepta los anuncios publicados por los usuarios antes de mandarlos online.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-emerald-100">
           <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
           {ads.length} Pendientes
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p>Cargando anuncios...</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Check size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Todo al día</h3>
          <p className="text-slate-500">No hay ningún anuncio pendiente de revisión.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-500 font-bold">
                <th className="p-5 font-bold">Anunț</th>
                <th className="p-5 font-bold">Usuario</th>
                <th className="p-5 font-bold">Precio</th>
                <th className="p-5 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => {
                const isAuto = ad._collection === 'anuncios_auto';
                return (
                <tr key={ad.id} className={`border-b border-slate-50 hover:bg-slate-50/30 transition-colors group ${isAuto ? 'bg-sky-50/20' : ''}`}>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl overflow-hidden relative shadow-sm border ${isAuto ? 'border-sky-200' : 'border-slate-200'} bg-slate-100`}>
                         {ad.images && ad.images.length > 0 ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={ad.images[0]} alt="portada" className="w-full h-full object-cover" />
                         ) : (
                           <ImageIcon className="absolute inset-0 m-auto text-slate-300" size={24} />
                         )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                           {isAuto ? (
                             <>{ad.marca || 'Vehicul'} {ad.model || ''}</>
                           ) : (
                             <>{ad.propertyType} en {ad.operation}</>
                           )}
                           {isAuto && (
                             <span className="text-[9px] bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded uppercase font-black tracking-widest flex items-center gap-1">
                               <Car size={9} /> Auto
                             </span>
                           )}
                           {ad.selectedPromotion && ad.selectedPromotion !== 'free' && (
                             <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded uppercase font-black tracking-widest flex items-center gap-1">
                               <Tag size={9} /> Promovado
                             </span>
                           )}
                        </h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin size={12} className={isAuto ? 'text-sky-400' : ''} /> {ad.location?.localitate || ad.location?.city || ad.city || 'Sin ciudad'}
                        </p>
                        {isAuto && (
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-bold">
                            {ad.an && <span className="flex items-center gap-0.5"><CalendarDays size={10} className="text-sky-400" /> {ad.an}</span>}
                            {ad.combustibil && <span className="flex items-center gap-0.5"><Fuel size={10} className="text-sky-400" /> {ad.combustibil}</span>}
                            {ad.rulaj && <span className="flex items-center gap-0.5"><Gauge size={10} className="text-sky-400" /> {Number(ad.rulaj).toLocaleString()} km</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-medium text-slate-700">{ad.name}</div>
                    <div className="text-sm text-slate-400 mt-0.5">{ad.email}</div>
                  </td>
                  <td className="p-5">
                    <div className={`font-black ${isAuto ? 'text-sky-600' : 'text-slate-800'}`}>{Number(ad.price).toLocaleString()} €</div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedAd(ad)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        title="Ver detalles"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => handleAction(ad.id, 'active')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                        title="Aprobar anuncio"
                      >
                        <Check size={20} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleAction(ad.id, 'rejected')}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Rechazar anuncio"
                      >
                        <X size={20} strokeWidth={2.5} />
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedAd(null)}
          >
            <motion.div 
               initial={{ y: 20, scale: 0.95 }}
               animate={{ y: 0, scale: 1 }}
               exit={{ y: 20, scale: 0.95 }}
               onClick={e => e.stopPropagation()}
               className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                 <h2 className="font-bold text-xl text-slate-800">Revisión de anuncio</h2>
                 <button onClick={() => setSelectedAd(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              
              <div className="overflow-y-auto p-8 space-y-8">
                {/* Images Grid */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Imágenes Subidas ({selectedAd.images?.length || 0})</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedAd.images?.map((url: string, i: number) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt={`Preview ${i}`} className="w-full aspect-square object-cover rounded-xl border border-slate-200" />
                    ))}
                  </div>
                </div>

                {/* Promotion Alert */}
                {selectedAd.selectedPromotion && selectedAd.selectedPromotion !== 'free' && (
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-800 text-sm">Este anuncio solicita promoción pagada</h4>
                      <p className="text-xs text-orange-600 font-medium">Paquete seleccionado: <span className="uppercase font-bold tracking-wider">{selectedAd.selectedPromotion}</span></p>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-8">
                   <div>
                     <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Especificaciones</h3>
                     <div className="space-y-4">
                       <div>
                         <div className="text-sm text-slate-500">Operación</div>
                         <div className="font-bold text-slate-800 capitalize">{selectedAd.operation}</div>
                       </div>
                       <div>
                         <div className="text-sm text-slate-500">Tipo de Inmueble</div>
                         <div className="font-bold text-slate-800 capitalize">{selectedAd.propertyType}</div>
                       </div>
                       <div>
                         <div className="text-sm text-slate-500">Precio configurado</div>
                         <div className="font-black text-[#139E69] text-2xl">{Number(selectedAd.price).toLocaleString()} €</div>
                       </div>
                     </div>
                   </div>
                   
                   <div>
                     <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Usuario y Contacto</h3>
                     <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                       <p className="font-bold text-slate-800">{selectedAd.name}</p>
                       <p className="text-sm text-slate-600">{selectedAd.email}</p>
                       <p className="text-sm text-slate-600">{selectedAd.phone}</p>
                     </div>
                   </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Descripción Principal</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl text-slate-700 whitespace-pre-wrap text-sm leading-relaxed border border-slate-100">
                    {selectedAd.description || 'Sin descripción'}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                 <button onClick={() => setSelectedAd(null)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancelar</button>
                 <button onClick={() => handleAction(selectedAd.id, 'rejected')} className="px-6 py-3 font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">Rechazar</button>
                 <button onClick={() => handleAction(selectedAd.id, 'active')} className="px-8 py-3 font-bold text-white bg-[#139E69] hover:bg-[#0f8256] shadow-lg shadow-emerald-500/20 rounded-xl transition-all">Aprobar y Publicar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
