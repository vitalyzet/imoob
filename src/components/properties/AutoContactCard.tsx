'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, User, Building2, Shield, Clock, MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface AutoContactCardProps {
  seller?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    type?: string;
    memberSince?: string;
  };
  auto?: any;
}

export default function AutoContactCard({ seller, auto }: AutoContactCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingChatId, setExistingChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !auto) return;
    const checkExistingChat = async () => {
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', user.uid));
        const snap = await getDocs(q);
        const sellerId = seller?.id || auto.userId || 'unknown';
        
        let foundChat = null;
        snap.forEach(docSnap => {
          const data = docSnap.data();
          if (data.propertyId === auto.id && data.participants.includes(sellerId)) {
            foundChat = docSnap.id;
          }
        });
        setExistingChatId(foundChat);
      } catch (error) {
        console.error("Error checking chat:", error);
      }
    };
    checkExistingChat();
  }, [user, auto, seller?.id]);

  const isParticular = seller?.type !== 'firma' && seller?.type !== 'Firmă';
  const sellerName = seller?.name || 'Proprietar';
  const sellerPhone = seller?.phone || '+40 7XX XXX XXX';

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !auto) return;
    
    setLoading(true);
    try {
      const sellerId = seller?.id || auto.userId || 'unknown';
      const buyerId = user.uid;

      // DESACTIVADO PARA PRUEBAS: Permitir enviarse mensajes a uno mismo
      // if (sellerId === buyerId) {
      //   alert("Nu poți trimite un mesaj la propriul anunț.");
      //   setLoading(false);
      //   return;
      // }

      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('participants', 'array-contains', buyerId));
      const querySnapshot = await getDocs(q);

      let existingChatId: string | null = null;
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.propertyId === auto.id && data.participants.includes(sellerId)) {
          existingChatId = docSnap.id;
        }
      });

      let chatId: string | null = existingChatId;

      if (!chatId) {
        const newChat = await addDoc(chatsRef, {
          propertyId: auto.id,
          propertyType: 'auto',
          propertyTitle: `${auto.marca} ${auto.model}`,
          propertyImage: auto.images?.[0] || '',
          propertyPrice: auto.price || 0,
          propertyAddress: auto.city || 'România',
          participants: [buyerId, sellerId],
          buyerId: buyerId,
          sellerId: sellerId,
          buyerName: user.displayName || 'Utilizator',
          sellerName: sellerName,
          buyerImage: user.photoURL || '',
          sellerImage: '',
          updatedAt: serverTimestamp(),
          lastMessage: message,
          lastSenderId: buyerId,
          unreadBy: [sellerId]
        });
        chatId = newChat.id;
      } else {
        await updateDoc(doc(db, 'chats', chatId), {
          updatedAt: serverTimestamp(),
          lastMessage: message,
          lastSenderId: buyerId,
          unreadBy: [sellerId]
        });
      }

      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: message,
        senderId: buyerId,
        createdAt: serverTimestamp(),
        read: false
      });

      setIsSent(true);
      setMessage('');
      setTimeout(() => {
        setIsSent(false);
        setShowMessageBox(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("A apărut o eroare. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#e2e8f0]/80 mb-5 flex flex-col gap-0">
      
      {/* Seller Type Badge */}
      <div className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider mb-5 ${
        isParticular 
          ? 'bg-[#f0f9ff] text-[#0369a1] border border-sky-100/60' 
          : 'bg-[#fdf4ff] text-[#86198f] border border-purple-100/60'
      }`}>
        {isParticular ? <User size={12} /> : <Building2 size={12} />}
        {isParticular ? 'Vânzător Particular' : 'Firmă / Dealer'}
      </div>

      {/* Seller Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
          isParticular 
            ? 'bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200/50' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50'
        }`}>
          {isParticular 
            ? <User size={22} className="text-sky-500" /> 
            : <Building2 size={22} className="text-purple-500" />
          }
        </div>
        <div>
          <h4 className="font-black text-[#0f172a] text-[16px] leading-tight">{sellerName}</h4>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[11px] text-[#64748b] font-medium">
              <Shield size={11} className="text-emerald-400" />
              Verificat
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#94a3b8] font-medium">
              <Clock size={11} />
              Pe Vindu24 din {seller?.memberSince || '2026'}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-[#e2e8f0]/60 mb-5" />

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => setShowPhone(!showPhone)}
          className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all text-[15px] shadow-sm shadow-sky-500/10 active:scale-[0.98]"
        >
          <Phone size={18} />
          {showPhone ? sellerPhone : 'Afișează telefonul'}
        </button>
        
        {existingChatId ? (
          <button 
            onClick={() => router.push(`/Profil/messages?chatId=${existingChatId}`)}
            className="w-full bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all text-[15px] active:scale-[0.98]"
          >
            <MessageCircle size={18} /> Mergi la conversație
          </button>
        ) : !showMessageBox ? (
          <button 
            onClick={() => setShowMessageBox(true)}
            className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all text-[15px] active:scale-[0.98]"
          >
            <MessageCircle size={18} /> Trimite mesaj
          </button>
        ) : (
          <div className="mt-1 flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            {user ? (
              isSent ? (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-[13px] font-bold text-center border border-emerald-200 flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  Mesaj trimis cu succes!
                </div>
              ) : (
                <>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bună ziua, sunt interesat de acest vehicul..." 
                    className="w-full border border-[#e2e8f0] rounded-xl p-4 text-[14px] min-h-[100px] focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent outline-none resize-none text-[#334155] placeholder:text-[#94a3b8] bg-[#f8fafc]"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowMessageBox(false)}
                      className="flex-1 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] font-bold py-3 rounded-xl transition-colors text-[13px]"
                    >
                      Anulează
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      className="flex-[2] bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-[13px]"
                    >
                      Trimite acum
                    </button>
                  </div>
                </>
              )
            ) : (
              <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-[13px] font-medium text-center border border-amber-100">
                Trebuie să fii autentificat pentru a trimite un mesaj.
                <button 
                  onClick={() => setShowMessageBox(false)}
                  className="mt-3 block w-full bg-white text-amber-600 font-bold py-2 rounded-lg border border-amber-200 hover:bg-amber-50 text-[13px]"
                >
                  Închide
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
