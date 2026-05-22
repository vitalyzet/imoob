'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function MessagesPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  // Fetch all chats for this user
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'chats'), 
      where('participants', 'array-contains', user.uid), 
      orderBy('updatedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsData);
      // Auto-select first chat if none selected only on initial load
      if (!initialLoadRef.current && !selectedChatId && chatsData.length > 0) {
        setSelectedChatId(chatsData[0].id);
        initialLoadRef.current = true;
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) return;
    const q = query(collection(db, `chats/${selectedChatId}/messages`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
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
    
    // In a real app, we should also update the 'updatedAt' field of the chat document here
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
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm flex h-[700px] w-full">
      
      {/* Left Sidebar */}
      <div className="w-[320px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
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
                <div className="text-[10px] text-gray-500 p-2.5 border-b border-gray-100 bg-white uppercase font-medium truncate">
                  Publicado por <span className="font-bold text-gray-700">{selectedChat.sellerName || 'Usuario'}</span>
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
                  const chatName = chat[otherUserRole] || 'Usuario';
                  return (
                    <div 
                      key={chat.id} 
                      onClick={() => setSelectedChatId(chat.id)}
                      className="p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 relative">
                          {chat.propertyImage && <Image src={chat.propertyImage} fill className="object-cover" alt="prop" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[13px] text-gray-900 truncate">{chatName}</h4>
                          <p className="text-[12px] text-gray-500 truncate">{chat.propertyTitle}</p>
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
        <div className="flex-1 flex flex-col bg-[#f5f7fa]">
          {/* Chat Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-[14px] text-gray-900 uppercase tracking-wide truncate">
              {selectedChat.buyerId === user.uid ? selectedChat.sellerName : selectedChat.buyerName || 'Usuario'}
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
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
            <div ref={messagesEndRef} />
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
