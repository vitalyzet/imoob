'use client';

import { useState } from 'react';
import { Heart, Share2, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PropertyActionButtons() {
  const [favorite, setFavorite] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <motion.button 
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setFavorite(!favorite)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-[12px] font-bold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
      >
        <Heart size={14} className={favorite ? "text-[#f25c1a]" : "text-gray-400"} fill={favorite ? "#f25c1a" : "none"} />
        Favorit
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-[12px] font-bold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md relative"
      >
        <Share2 size={14} className={copied ? "text-[#139E69]" : "text-gray-500"} />
        {copied ? "Copiat!" : "Trimite"}
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReport}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-[12px] font-bold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
      >
        <Flag size={14} className={reported ? "text-red-500" : "text-gray-500"} />
        {reported ? "Trimis" : "Raportează"}
      </motion.button>
    </div>
  );
}
