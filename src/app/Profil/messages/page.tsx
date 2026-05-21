'use client';

import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="bg-white rounded-[40px] p-24 border border-gray-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8">
        <MessageSquare size={32} strokeWidth={1} className="text-gray-300" />
      </div>
      <h3 className="text-[18px] font-bold text-gray-600 mb-2">Mesajele mele</h3>
      <p className="text-gray-400 font-medium text-[15px]">Nu ai mesaje noi în acest moment.</p>
    </div>
  );
}
