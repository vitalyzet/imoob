'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
  property?: any;
}

export default function ContactForm({ property }: ContactFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('Bună ziua, am văzut această proprietate pe IMOOB și mă interesează să primesc mai multe informații. Vă mulțumesc!');
  const [loading, setLoading] = useState(false);

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

      // Ensure we don't message ourselves
      if (sellerId === buyerId) {
        alert("Nu poți trimite un mesaj la propria proprietate.");
        setLoading(false);
        return;
      }

      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('participants', 'array-contains', buyerId));
      const querySnapshot = await getDocs(q);

      let existingChatId = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.propertyId === property.id && data.participants.includes(sellerId)) {
          existingChatId = doc.id;
        }
      });

      let chatId = existingChatId;

      if (!chatId) {
        // Create new chat
        const newChat = await addDoc(chatsRef, {
          propertyId: property.id,
          propertyTitle: property.title,
          propertyImage: property.images?.[0] || '',
          propertyPrice: property.price || 0,
          propertyAddress: `${property.location?.city || ''}, ${property.location?.judet || ''}`,
          participants: [buyerId, sellerId],
          buyerId: buyerId,
          sellerId: sellerId,
          buyerName: user.displayName || 'Utilizator',
          sellerName: property.agent?.name || 'Vânzător',
          updatedAt: serverTimestamp(),
          lastMessage: message
        });
        chatId = newChat.id;
      } else {
        // Update existing chat
        await updateDoc(doc(db, 'chats', chatId), {
          updatedAt: serverTimestamp(),
          lastMessage: message
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

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#f25c1d] hover:bg-[#eb5211] text-white py-4 font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(242,92,29,0.3)] hover:shadow-[0_6px_20px_rgba(242,92,29,0.4)] hover:-translate-y-0.5 text-[16px] tracking-wide mt-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Se trimite...' : 'Trimite mesaj'}
      </button>
    </form>
  );
}
