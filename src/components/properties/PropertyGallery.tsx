'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Map, Share2, FileText, EyeOff, Heart, Camera } from 'lucide-react';
import GalleryModal from './GalleryModal';
import PhotoLightbox from './PhotoLightbox';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  agent: {
    name: string;
    phone: string;
    image: string;
    role: string;
  };
  propertyInfo: {
    price: string;
    size: string;
    location: string;
  };
}

export default function PropertyGallery({ images, title, agent, propertyInfo }: PropertyGalleryProps) {
  const validImages = images.length ? images : ['/images/properties/apartment.png'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };


  return (
    <>
      <div className="relative mb-4 group/gallery">


        <div className="overflow-hidden rounded-xl bg-stone-100">
          {/* Mobile View: Carousel */}
          <div 
            className="relative h-[260px] overflow-hidden rounded-lg bg-stone-100 md:hidden cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={validImages[currentIndex]}
              alt={`${title} - Imagen ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-3 left-3 rounded bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white z-10 flex items-center gap-1.5">
              <span>{validImages.length}</span>
              <Camera size={12} />
            </div>
          </div>

          {/* Desktop View: Top/Bottom Split Layout */}
          <div className="hidden md:flex flex-col gap-2">
            {/* Top: Main Large Image */}
            <div 
              className="relative h-[320px] lg:h-[380px] w-full cursor-zoom-in group overflow-hidden rounded-xl"
              onClick={() => { setIsLightboxOpen(true); }}
            >
              <Image
                src={validImages[currentIndex]}
                alt={`${title} - Principal`}
                fill
                className="object-cover transition-all duration-700"
                priority
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              
              {/* Navigation Arrows */}
              {validImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full text-stone-700 shadow-md hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full text-stone-700 shadow-md hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Share Button (Top Left) */}
              <button className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full text-stone-700 shadow-md hover:bg-white hover:scale-105 transition-all">
                <Share2 size={18} strokeWidth={2.5} />
              </button>

              {/* View all photos (Top Right) */}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-[14px] font-bold rounded-lg shadow-md hover:bg-[var(--primary-hover)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <ImageIcon size={18} />
                <span>Ver más fotos</span>
              </button>

            </div>

            {/* Bottom: 3 Small Images Grid */}
            <div className="grid grid-cols-3 gap-2 h-[120px] lg:h-[150px]">
              {(() => {
                // We need exactly 3 small images
                const smallImages = [];
                for (let i = 1; i < 4; i++) {
                  const sourceIndex = i < validImages.length ? i : (i % validImages.length);
                  smallImages.push({ src: validImages[sourceIndex], originalIndex: sourceIndex });
                }

                return smallImages.map((img, index) => {
                  const isLast = index === 2;
                  const remaining = validImages.length - 4;
                  const showOverlay = isLast && remaining > 0;

                  return (
                    <div 
                      key={`small-img-${index}`}
                      className="relative cursor-pointer group overflow-hidden rounded-xl"
                      onClick={(e) => { 
                        e.stopPropagation();
                        if (showOverlay) {
                          setIsModalOpen(true);
                        } else {
                          setCurrentIndex(img.originalIndex); 
                        }
                      }}
                    >
                      <Image
                        src={img.src}
                        alt={`${title} - Imagen ${index + 2}`}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 transition-colors ${showOverlay ? 'bg-black/40 group-hover:bg-black/50' : 'bg-black/0 group-hover:bg-black/10'}`} />
                      
                      {showOverlay && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pointer-events-none">
                          <span className="text-2xl lg:text-3xl font-bold tracking-tight">+{remaining}</span>
                          <span className="text-[11px] lg:text-[13px] font-medium tracking-wide mt-0.5">Vezi toate</span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

      </div>



      <GalleryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageClick={(index) => {
          setCurrentIndex(index);
          setIsLightboxOpen(true);
        }}
        images={validImages}
        title={title}
        agent={agent}
        propertyInfo={propertyInfo}
      />

      <PhotoLightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={validImages}
        initialIndex={currentIndex}
        propertyInfo={propertyInfo}
      />
    </>
  );
}
