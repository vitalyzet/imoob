'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vindu24_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('vindu24_favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        } else {
          setFavorites([]);
        }
      } catch (e) {
        console.error('Error syncing favorites', e);
      }
    };
    
    window.addEventListener('favorites-updated', handleSync);
    return () => window.removeEventListener('favorites-updated', handleSync);
  }, []);

  const toggleFavorite = (propertyId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(propertyId)) {
        newFavorites = prev.filter(id => id !== propertyId);
      } else {
        newFavorites = [...prev, propertyId];
      }
      
      localStorage.setItem('vindu24_favorites', JSON.stringify(newFavorites));
      window.dispatchEvent(new Event('favorites-updated'));
      return newFavorites;
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
