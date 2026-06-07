import { Metadata } from 'next';
import { Suspense } from 'react';
import AutoResultsClient from '../../client';
import { Loader2 } from 'lucide-react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ marca: string }> }): Promise<Metadata> {
  const { marca } = await params;
  const decodedMarca = decodeURIComponent(marca);
  // Capitalize properly
  const formattedMarca = decodedMarca.charAt(0).toUpperCase() + decodedMarca.slice(1).toLowerCase();

  let siteName = 'Vindu24';
  
  try {
    const seoDoc = await getDoc(doc(db, 'settings', 'seo'));
    if (seoDoc.exists()) {
      const data = seoDoc.data();
      if (data.siteName) siteName = data.siteName;
    }
  } catch (e) {
    console.error('Error fetching SEO in auto/marca', e);
  }

  const title = `Mașini ${formattedMarca} second-hand de vânzare | ${siteName}`;
  const desc = `Zeci de oferte de vânzare cu autoturisme ${formattedMarca} rulate. Găsește prețuri excelente, compară anunțurile și contactează direct vânzătorul pe ${siteName}.`;

  return {
    title,
    description: desc,
    keywords: `${formattedMarca}, auto ${formattedMarca}, masini ${formattedMarca}, auto rulate, masini second hand, vanzari auto, vindu24`,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `https://vindu24.ro/auto/marca/${encodeURIComponent(marca)}`,
    },
    alternates: {
      canonical: `https://vindu24.ro/auto/marca/${encodeURIComponent(marca)}`,
    }
  };
}

export default async function AutoMarcaPage({ params }: { params: Promise<{ marca: string }> }) {
  const { marca } = await params;
  const decodedMarca = decodeURIComponent(marca);
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f8fa] pt-32 flex justify-center"><Loader2 className="animate-spin text-slate-400" size={48} /></div>}>
      <AutoResultsClient initialFilters={{ keyword: decodedMarca }} />
    </Suspense>
  );
}
