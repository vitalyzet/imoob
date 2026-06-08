'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { ChevronLeft, Send, MessageSquare, MoreVertical, Star, Car, Home } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayRemove, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';

const formatName = (fullName?: string) => {
  if (!fullName) return 'Usuario';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 1) {
    return `${parts[0]} ${parts[1][0]}.`;
  }
  return parts[0];
};

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(searchParams?.get('chatId') || null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChatOptions, setShowChatOptions] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-select chat from URL if it changes
  useEffect(() => {
    const chatId = searchParams?.get('chatId');
    if (chatId) {
      setSelectedChatId(chatId);
    }
  }, [searchParams]);

  // Fetch all chats for this user
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'chats'), 
      where('participants', 'array-contains', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort locally to avoid Firebase Index requirement
      chatsData.sort((a: any, b: any) => {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
        return timeB - timeA;
      });
      setChats(chatsData);
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch messages for selected chat and mark as read
  useEffect(() => {
    if (!selectedChatId || !user) return;
    
    // Mark as read
    const chat = chats.find(c => c.id === selectedChatId);
    if (chat && chat.unreadBy?.includes(user.uid)) {
      updateDoc(doc(db, 'chats', selectedChatId), {
        unreadBy: arrayRemove(user.uid)
      }).catch(console.error);
    }

    const q = query(collection(db, `chats/${selectedChatId}/messages`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    });
    return () => unsubscribe();
  }, [selectedChatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId || !user) return;

    const msg = newMessage.trim();
    setNewMessage('');

    await addDoc(collection(db, `chats/${selectedChatId}/messages`), {
      text: msg,
      senderId: user.uid,
      createdAt: serverTimestamp()
    });
    
    // Update the chat document with lastMessage and unread status
    const chat = chats.find(c => c.id === selectedChatId);
    if (chat) {
      const otherUserId = chat.buyerId === user.uid ? chat.sellerId : chat.buyerId;
      await updateDoc(doc(db, 'chats', selectedChatId), {
        updatedAt: serverTimestamp(),
        lastMessage: msg,
        lastSenderId: user.uid,
        unreadBy: [otherUserId]
      });
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChatId) return;
    if (confirm('Ești sigur că vrei să ștergi această conversație? Acțiunea este ireversibilă.')) {
      try {
        await deleteDoc(doc(db, 'chats', selectedChatId));
        setSelectedChatId(null);
        setShowChatOptions(false);
      } catch (err) {
        console.error('Error deleting chat:', err);
        alert('A apărut o eroare la ștergerea conversației.');
      }
    }
  };

  const handleReport = async (type: 'ad' | 'user') => {
    if (!selectedChatId || !user) return;
    const chat = chats.find(c => c.id === selectedChatId);
    if (!chat) return;
    
    if (confirm(`Ești sigur că vrei să raportezi acest ${type === 'ad' ? 'anunț' : 'utilizator'}?`)) {
      try {
        await addDoc(collection(db, 'reports'), {
          type,
          reportedBy: user.uid,
          reportedId: type === 'ad' ? chat.propertyId : (chat.buyerId === user.uid ? chat.sellerId : chat.buyerId),
          chatId: selectedChatId,
          createdAt: serverTimestamp(),
          status: 'pending'
        });
        alert('Raportul a fost trimis cu succes. Echipa noastră va investiga.');
        setShowChatOptions(false);
      } catch (err) {
        console.error('Error reporting:', err);
      }
    }
  };

  const handleBlockUser = async () => {
    if (!selectedChatId || !user) return;
    const chat = chats.find(c => c.id === selectedChatId);
    if (!chat) return;
    
    if (confirm('Ești sigur că vrei să blochezi acest utilizator? Nu vei mai primi mesaje de la el și conversația actuală va fi ștearsă.')) {
      try {
        const otherUserId = chat.buyerId === user.uid ? chat.sellerId : chat.buyerId;
        await addDoc(collection(db, 'blocked_users'), {
          blockerId: user.uid,
          blockedId: otherUserId,
          createdAt: serverTimestamp()
        });
        
        await deleteDoc(doc(db, 'chats', selectedChatId));
        setSelectedChatId(null);
        setShowChatOptions(false);
        alert('Utilizatorul a fost blocat cu succes.');
      } catch (err) {
        console.error('Error blocking user:', err);
      }
    }
  };

  if (!user) return (
    <div className="bg-white rounded-[40px] p-24 border border-gray-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8">
        <MessageSquare size={32} strokeWidth={1} className="text-gray-300" />
      </div>
      <h3 className="text-[18px] font-bold text-gray-600 mb-2">Trebuie să te autentifici</h3>
      <p className="text-gray-400 font-medium text-[15px]">Conectează-te pentru a accesa mesajele.</p>
    </div>
  );

  const selectedChat = chats.find(c => c.id === selectedChatId);

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm flex flex-col md:flex-row h-[calc(100vh-300px)] md:h-[calc(100vh-200px)] min-h-[400px] w-full relative">
      
      {/* Left Sidebar (Contacts or Selected Property Info) */}
      <div className={`w-full md:w-[320px] shrink-0 md:border-r border-gray-200 bg-white flex flex-col h-full min-h-0 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* View 1: Property Context (When a chat is selected) */}
            <div className="p-4">
              <button 
                onClick={() => setSelectedChatId(null)}
                className="flex items-center gap-2 text-gray-800 font-semibold text-[13px] hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors w-full bg-gray-50 border border-gray-100/50"
              >
                <ChevronLeft size={16} /> Volver a Mis contactos
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="border border-gray-200 rounded-[12px] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 border-b border-gray-100 bg-white flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="text-[10px] text-gray-500 uppercase font-medium tracking-wide">
                      Publicado por <span className="font-bold text-[#2a3646] text-[11px]">{selectedChat.sellerName || 'Usuario'}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      <Star size={10} fill="currentColor" strokeWidth={1} />
                      <Star size={10} fill="currentColor" strokeWidth={1} />
                      <Star size={10} fill="currentColor" strokeWidth={1} />
                      <Star size={10} fill="currentColor" strokeWidth={1} />
                      <Star size={10} fill="currentColor" strokeWidth={1} />
                      <span className="text-[10px] text-gray-400 font-bold ml-1 tracking-tighter">5.0</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative bg-slate-200 shadow-sm border border-gray-100">
                    {selectedChat.sellerImage ? (
                      <Image src={selectedChat.sellerImage} fill className="object-cover" alt="Seller" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-[12px]">
                        {(selectedChat.sellerName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative h-36 w-full">
                  <Image 
                    src={selectedChat.propertyImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600"} 
                    alt="Property" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 backdrop-blur-sm p-1 rounded-full cursor-pointer hover:bg-black/50 transition-colors text-white">
                    <ChevronLeft className="rotate-180" size={16} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-[11px] text-gray-500 font-medium mb-0.5">Desde</div>
                  <div className="text-[18px] font-black text-gray-900 mb-3 tracking-tight">
                    {selectedChat.propertyPrice ? `€ ${selectedChat.propertyPrice.toLocaleString('de-DE')}` : 'Preț la cerere'}
                  </div>
                  
                  <div className="text-[12px] font-bold text-gray-900 mb-1 leading-snug line-clamp-2">
                    {selectedChat.propertyTitle || 'Proprietate'}
                  </div>
                  <div className="text-[11px] text-gray-500 mb-2 font-medium truncate">
                    {selectedChat.propertyAddress || 'România'}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* View 2: Contact List (When NO chat is selected) */}
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Mis Contactos</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">No tienes conversaciones aún.</div>
              ) : (
                chats.map(chat => {
                  const otherUserRole = chat.buyerId === user.uid ? 'sellerName' : 'buyerName';
                  const otherUserImageRole = chat.buyerId === user.uid ? 'sellerImage' : 'buyerImage';
                  const chatName = formatName(chat[otherUserRole]);
                  const chatImage = chat[otherUserImageRole];
                  const isUnread = chat.unreadBy?.includes(user.uid);
                  
                  const chatDate = chat.updatedAt?.toDate ? chat.updatedAt.toDate() : null;
                  const chatDateStr = chatDate ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(chatDate) : '';
                  
                  return (
                    <div 
                      key={chat.id} 
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${isUnread ? 'bg-[#f0f7ff] hover:bg-[#e6f2ff]' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex gap-3 relative">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                          {chat.propertyImage ? (
                            <Image src={chat.propertyImage} fill className="object-cover" alt="Property" />
                          ) : (
                            <div className="w-full h-full bg-slate-100"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-center mb-0.5 gap-2">
                            <h4 className={`text-[14px] truncate ${isUnread ? 'font-black text-blue-900' : 'font-bold text-gray-900'}`}>{chatName}</h4>
                            <div className="flex items-center gap-2 shrink-0">
                              {chatDateStr && <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{chatDateStr}</span>}
                              {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {(chat.lastSenderId ? chat.lastSenderId === user.uid : chat.buyerId === user.uid) ? (
                              <span className="bg-sky-50 text-sky-600 border border-sky-100 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0">
                                Trimis
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0">
                                Primit
                              </span>
                            )}
                            {chat.propertyType === 'auto' ? (
                              <Car size={12} className="text-gray-400 shrink-0" />
                            ) : chat.propertyType === 'imobiliare' ? (
                              <Home size={12} className="text-gray-400 shrink-0" />
                            ) : null}
                            <p className="text-[11px] text-gray-400 font-medium truncate">{chat.propertyTitle || 'Anunț'}</p>
                          </div>
                          <p className={`text-[13px] truncate ${isUnread ? 'text-blue-700 font-bold' : 'text-gray-500'}`}>{chat.lastMessage || 'Sin mensajes'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Chat Area */}
      {selectedChat ? (
        <div className={`flex-1 flex flex-col bg-[#f5f7fa] h-full min-h-0 ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
          {/* Chat Header */}
          <div className="bg-white px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => setSelectedChatId(null)}
                className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 overflow-hidden relative shrink-0">
                {selectedChat[selectedChat.buyerId === user.uid ? 'sellerImage' : 'buyerImage'] ? (
                  <Image src={selectedChat[selectedChat.buyerId === user.uid ? 'sellerImage' : 'buyerImage']} fill className="object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-[16px]">
                    {formatName(selectedChat.buyerId === user.uid ? selectedChat.sellerName : selectedChat.buyerName).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="font-medium text-[16px] text-slate-700 truncate">
                {formatName(selectedChat.buyerId === user.uid ? selectedChat.sellerName : selectedChat.buyerName)}
              </h2>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowChatOptions(!showChatOptions)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors" 
                title="Opțiuni"
              >
                <MoreVertical size={20} />
              </button>

              {showChatOptions && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowChatOptions(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 overflow-hidden">
                    <button onClick={handleDeleteChat} className="w-full text-left px-5 py-3 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors">
                      Șterge conversația
                    </button>
                    <button onClick={() => handleReport('ad')} className="w-full text-left px-5 py-3 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors">
                      Raportează acest anunț
                    </button>
                    <button onClick={() => handleReport('user')} className="w-full text-left px-5 py-3 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors">
                      Raportează acest utilizator
                    </button>
                    <button onClick={handleBlockUser} className="w-full text-left px-5 py-3 text-[14px] text-red-500 hover:bg-red-50 transition-colors">
                      Blochează acest utilizator
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-10">Envía un mensaje para comenzar la conversación.</div>
            ) : null}

            {messages.map((msg, i) => {
              const isMe = msg.senderId === user.uid;
              
              // Helper to format date
              const dateStr = msg.createdAt?.toDate ? new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(msg.createdAt.toDate()) : '';

              return (
                <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%]">
                    <div className={`p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                      isMe 
                        ? 'bg-[#4a6b82] text-white rounded-tr-sm' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    {dateStr && (
                      <div className={`text-[10px] text-gray-500 mt-1.5 font-bold ${isMe ? 'text-right' : 'text-left'}`}>
                        {dateStr}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div className="bg-white p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 flex items-center bg-white focus-within:border-[#4a6b82] transition-colors">
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje" 
                  className="flex-1 outline-none text-[14px] text-gray-700 bg-transparent placeholder:text-gray-400"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-[14px] transition-all ${
                  newMessage.trim() 
                    ? 'bg-[#4a6b82] text-white hover:bg-[#3b5568] shadow-sm' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Enviar <Send size={16} strokeWidth={2} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-[#f5f7fa] flex flex-col items-center justify-center text-gray-400">
          <MessageSquare size={48} className="text-gray-300 mb-4" />
          <p>Selecciona un contacto para ver los mensajes.</p>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <p className="font-bold uppercase tracking-widest text-xs">Cargando...</p>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
