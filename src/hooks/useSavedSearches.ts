'use client';

import { useState, useEffect } from 'react';

export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    city: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    status: string;
    isNewConstruction: boolean;
  };
  timestamp: number;
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('xmobe_saved_searches');
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved searches', e);
      }
    }
  }, []);

  const saveSearch = (filters: SavedSearch['filters']) => {
    const cityName = filters.city || 'România';
    const typeLabel = filters.type ? ` (${filters.type})` : '';
    const priceText = filters.minPrice > 0 ? `, > ${filters.minPrice.toLocaleString('ro-RO')}€` : '';
    const name = `Proprietăți în ${cityName}${typeLabel}${priceText}`;

    const newSearch: SavedSearch = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      filters: { ...filters },
      timestamp: Date.now(),
    };

    const updated = [newSearch, ...savedSearches].slice(0, 20); // Limit to 20
    setSavedSearches(updated);
    localStorage.setItem('xmobe_saved_searches', JSON.stringify(updated));
    return newSearch;
  };

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('xmobe_saved_searches', JSON.stringify(updated));
  };

  return { savedSearches, saveSearch, deleteSearch };
}
