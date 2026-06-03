'use client';

import React from 'react';
import { useDomain } from '@/context/DomainContext';
import FeaturedProperties from './FeaturedProperties';
import RecommendedSearches from './RecommendedSearches';
import FeaturedAutos from './FeaturedAutos';
import RecommendedAutoSearches from './RecommendedAutoSearches';

export default function DomainView() {
  const { domain } = useDomain();

  return (
    <>
      {/* Imobiliare Domain */}
      <div className={domain === 'imobiliare' ? 'block' : 'hidden'}>
        <FeaturedProperties />
        <RecommendedSearches />
      </div>

      {/* Auto Domain */}
      <div className={domain === 'auto' ? 'block' : 'hidden'}>
        <FeaturedAutos />
        <RecommendedAutoSearches />
      </div>
    </>
  );
}
