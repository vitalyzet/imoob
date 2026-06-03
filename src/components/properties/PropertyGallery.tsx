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
              onClick={() => { setCurrentIndex(0); setIsLightboxOpen(true); }}
            >
              <Image
                src={validImages[0]}
                alt={`${title} - Principal`}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              
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

                return smallImages.map((img, index) => (
                  <div 
                    key={`small-img-${index}`}
                    className="relative cursor-zoom-in group overflow-hidden rounded-xl"
                    onClick={() => { setCurrentIndex(img.originalIndex); setIsLightboxOpen(true); }}
                  >
                    <Image
                      src={img.src}
                      alt={`${title} - Imagen ${index + 2}`}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                  </div>
                ));
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
