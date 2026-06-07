import { Metadata } from 'next';
import { Suspense } from 'react';
import AutoResultsClient from './client';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateMetadata(): Promise<Metadata> {
  let siteName = 'Vindu24';
  let desc = 'Descoperă zeci de mii de oferte cu mașini second-hand, autoturisme noi și camioane pe Vindu24. Cele mai bune prețuri la auto.';
  
  try {
    const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
    if (seoDoc.exists()) {
      const data = seoDoc.data();
      if (data.siteName) siteName = data.siteName;
    }
  } catch (e) {
    console.error('Error fetching SEO in auto/page.tsx', e);
  }

  const title = `Auto - Anunțuri mașini second-hand și noi | ${siteName}`;

  return {
    title,
    description: desc,
    keywords: 'auto, masini, auto rulate, masini second hand, camioane, motociclete, vindu24',
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: 'https://vindu24.ro/auto',
    },
    alternates: {
      canonical: 'https://vindu24.ro/auto',
    }
  };
}

export default function AutoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f8fa] pt-32 flex justify-center"><Loader2 className="animate-spin text-slate-400" size={48} /></div>}>
      <AutoResultsClient />
    </Suspense>
  );
}
