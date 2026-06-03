'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDomain } from '@/context/DomainContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
  property?: any;
}

export default function ContactForm({ property }: ContactFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { domain } = useDomain();
  const defaultMessage = domain === 'auto' 
    ? 'Bună ziua, am văzut acest autoturism pe Vindu24 și mă interesează să primesc mai multe informații. Vă mulțumesc!'
    : 'Bună ziua, am văzut această proprietate pe Vindu24 și mă interesează să primesc mai multe informații. Vă mulțumesc!';
  const [message, setMessage] = useState(defaultMessage);
  const [loading, setLoading] = useState(false);
  const [existingChatId, setExistingChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !property) return;
    const checkExistingChat = async () => {
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', user.uid));
        const snap = await getDocs(q);
        const sellerId = property.agent?.id || 'unknown';
        
        let foundChat = null;
        snap.forEach(docSnap => {
          const data = docSnap.data();
          if (data.propertyId === property.id && data.participants.includes(sellerId)) {
            foundChat = docSnap.id;
          }
        });
        setExistingChatId(foundChat);
      } catch (error) {
        console.error("Error checking chat:", error);
      }
    };
    checkExistingChat();
  }, [user, property]);

  const handleSendMessage = async () => {
    if (!user) {
      alert("Trebuie să fii autentificat pentru a trimite un mesaj.");
      return;
    }

    if (!property) return;
    
    setLoading(true);
    try {
      // Create a unique chat ID or find existing
      const sellerId = property.agent?.id || 'unknown';
      const buyerId = user.uid;

      // DESACTIVADO PARA PRUEBAS: Permitir enviarse mensajes a uno mismo
      // if (sellerId === buyerId) {
      //   alert("Nu poți trimite un mesaj la propria proprietate.");
      //   setLoading(false);
      //   return;
      // }

      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('participants', 'array-contains', buyerId));
      const querySnapshot = await getDocs(q);

      let existingChatId: string | null = null;

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.propertyId === property.id && data.participants.includes(sellerId)) {
          existingChatId = docSnap.id;
        }
      });

      let chatId: string | null = existingChatId;

      if (!chatId) {
        // Create new chat
        const newChat = await addDoc(chatsRef, {
          propertyId: property.id,
          propertyType: domain === 'auto' ? 'auto' : 'imobiliare',
          propertyTitle: property.title,
          propertyImage: property.images?.[0] || '',
          propertyPrice: property.price || 0,
          propertyAddress: `${property.location?.city || ''}, ${property.location?.judet || ''}`,
          participants: [buyerId, sellerId],
          buyerId: buyerId,
          sellerId: sellerId,
          buyerName: user.displayName || 'Utilizator',
          sellerName: property.agent?.name || 'Vânzător',
          buyerImage: user.photoURL || '',
          sellerImage: property.agent?.image || '',
          updatedAt: serverTimestamp(),
          lastMessage: message,
          lastSenderId: buyerId,
          unreadBy: [sellerId]
        });
        chatId = newChat.id;
      } else {
        // Update existing chat
        await updateDoc(doc(db, 'chats', chatId), {
          updatedAt: serverTimestamp(),
          lastMessage: message,
          lastSenderId: buyerId,
          unreadBy: [sellerId]
        });
      }

      // Add the message to subcollection
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: message,
        senderId: buyerId,
        createdAt: serverTimestamp()
      });

      // Navigate to messages
      router.push('/Profil/messages');
      
    } catch (error) {
      console.error("Error sending message:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
      {!user && (
        <>
          <input type="text" placeholder="Numele tău" className="w-full px-5 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl text-gray-700 text-[14px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400" />
          <input type="email" placeholder="Email-ul tău" className="w-full px-5 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl text-gray-700 text-[14px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400" />
          <input type="tel" placeholder="Numărul de telefon" className="w-full px-5 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl text-gray-700 text-[14px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400" />
        </>
      )}
      <textarea 
        placeholder="Mesajul tău..." 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4} 
        className="w-full px-5 py-4 border border-gray-200 bg-gray-50/50 rounded-2xl text-gray-700 text-[15px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400 resize-none leading-relaxed"
      ></textarea>
      
      <div className="flex items-start gap-3 py-1">
        <div className="mt-0.5">
          <input type="checkbox" id="privacy" className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer" required />
        </div>
        <label htmlFor="privacy" className="text-[13px] text-gray-500 font-medium leading-tight cursor-pointer select-none">Sunt de acord cu politica de confidențialitate și termenii de utilizare</label>
      </div>

      {existingChatId ? (
        <button 
          type="button"
          onClick={() => router.push(`/Profil/messages?chatId=${existingChatId}`)}
          className="w-full bg-[#f25c1d]/10 hover:bg-[#f25c1d]/20 text-[#f25c1d] border border-[#f25c1d]/30 py-4 font-bold rounded-xl transition-all text-[16px] tracking-wide mt-3"
        >
          Mergi la conversație
        </button>
      ) : (
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#f25c1d] hover:bg-[#eb5211] text-white py-4 font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(242,92,29,0.3)] hover:shadow-[0_6px_20px_rgba(242,92,29,0.4)] hover:-translate-y-0.5 text-[16px] tracking-wide mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Se trimite...' : 'Trimite mesaj'}
        </button>
      )}
    </form>
  );
}
