import { X, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
}

export default function ContactModal({ isOpen, onClose, propertyName }: ContactModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div 
        className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-[17px] font-bold text-gray-800">Contactează anunțătorul</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Nume complet" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f25c1a] focus:ring-1 focus:ring-[#f25c1a] transition-all text-sm"
              defaultValue="Alexandru bugeag"
            />
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium">
                <span className="text-lg">🇷🇴</span>
                <span>+40</span>
              </div>
              <input 
                type="tel" 
                placeholder="Telefon*" 
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f25c1a] focus:ring-1 focus:ring-[#f25c1a] transition-all text-sm"
              />
            </div>

            <input 
              type="email" 
              placeholder="Email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f25c1a] focus:ring-1 focus:ring-[#f25c1a] transition-all text-sm"
              defaultValue="yoalexcuatro@gmail.com"
            />

            <textarea 
              rows={4}
              placeholder="Mesaj..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#f25c1a] focus:ring-1 focus:ring-[#f25c1a] transition-all text-sm resize-none"
              defaultValue={`Bună, am văzut acest anunț "${propertyName}" pe Vindu24 și mă interesează să primesc mai multe informații. Mulțumesc!`}
            />
          </div>

          <button className="w-full bg-[#f25c1a] hover:bg-[#d94e16] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#f25c1a]/20 flex items-center justify-center gap-2 mt-2">
            <Send size={18} />
            Contactează
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
