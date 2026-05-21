'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  propertyInfo: {
    price: string;
    size: string;
    location: string;
  };
}

export default function PhotoLightbox({ isOpen, onClose, images, initialIndex, propertyInfo }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialIndex]);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-between animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Background Blur */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image 
          src={images[currentIndex]} 
          alt="background" 
          fill 
          className="object-cover blur-[80px]" 
        />
      </div>

      {/* Header */}
      <div className="relative z-10 w-full flex items-start justify-between p-6 md:p-8 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[20px] md:text-[24px] font-black">{propertyInfo.price}</span>
            <span className="text-gray-400">|</span>
            <span className="text-[16px] md:text-[18px] font-medium text-gray-200">{propertyInfo.size}</span>
          </div>
          <p className="text-[14px] md:text-[16px] text-gray-300 font-medium">{propertyInfo.location}</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-white/20 transition-all">
            <Heart size={18} className="text-[#f25c1a]" fill="#f25c1a" />
            Favorit
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-white/20 transition-all">
            <Share2 size={18} />
            Trimite
          </button>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all ml-2"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Image and Navigation */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center p-4">
        <button 
          onClick={goToPrevious}
          className="absolute left-4 md:left-8 p-4 rounded-full bg-black/20 text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft size={48} strokeWidth={1} />
        </button>

        <div 
          className="relative w-full max-w-5xl h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-h-[75vh]">
            <Image 
              src={images[currentIndex]} 
              alt={`Image ${currentIndex + 1}`} 
              fill 
              className="object-contain" 
              priority
            />
          </div>
        </div>

        <button 
          onClick={goToNext}
          className="absolute right-4 md:right-8 p-4 rounded-full bg-black/20 text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight size={48} strokeWidth={1} />
        </button>
      </div>

      {/* Footer / Counter */}
      <div className="relative z-10 p-8 text-white/80 font-bold tracking-widest text-[16px]">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
