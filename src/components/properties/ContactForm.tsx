'use client';

import { useAuth } from '@/context/AuthContext';

export default function ContactForm() {
  const { user } = useAuth();

  return (
    <form className="space-y-4">
      {!user && (
        <>
          <input type="text" placeholder="Numele tău" className="w-full px-5 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl text-gray-700 text-[14px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400" />
          <input type="email" placeholder="Email-ul tău" className="w-full px-5 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl text-gray-700 text-[14px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400" />
          <input type="tel" placeholder="Numărul de telefon" className="w-full px-5 py-3.5 border border-gray-200 bg-gray-50/50 rounded-xl text-gray-700 text-[14px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400" />
        </>
      )}
      <textarea 
        placeholder="Mesajul tău..." 
        defaultValue="Bună ziua, am văzut această proprietate pe IMOOB și mă interesează să primesc mai multe informații. Vă mulțumesc!"
        rows={4} 
        className="w-full px-5 py-4 border border-gray-200 bg-gray-50/50 rounded-2xl text-gray-700 text-[15px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all placeholder:text-gray-400 resize-none leading-relaxed"
      ></textarea>
      
      <div className="flex items-start gap-3 py-1">
        <div className="mt-0.5">
          <input type="checkbox" id="privacy" className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer" />
        </div>
        <label htmlFor="privacy" className="text-[13px] text-gray-500 font-medium leading-tight cursor-pointer select-none">Sunt de acord cu politica de confidențialitate și termenii de utilizare</label>
      </div>

      <button type="button" className="w-full bg-[#f25c1d] hover:bg-[#eb5211] text-white py-4 font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(242,92,29,0.3)] hover:shadow-[0_6px_20px_rgba(242,92,29,0.4)] hover:-translate-y-0.5 text-[16px] tracking-wide mt-3">
        Trimite mesaj
      </button>
    </form>
  );
}
