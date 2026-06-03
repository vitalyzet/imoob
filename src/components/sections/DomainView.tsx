'use client';

import React from 'react';
import { useDomain } from '@/context/DomainContext';
import FeaturedProperties from './FeaturedProperties';
import RecommendedSearches from './RecommendedSearches';
import FeaturedAutos from './FeaturedAutos';
import RecommendedAutoSearches from './RecommendedAutoSearches';

export default function DomainView() {
  const { domain } = useDomain();

  if (domain === 'auto') {
    return (
      <>
        <FeaturedAutos />
        <RecommendedAutoSearches />
      </>
    );
  }

  return (
    <>
      <FeaturedProperties />
      <RecommendedSearches />
    </>
  );
}
