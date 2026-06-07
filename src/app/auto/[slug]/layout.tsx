import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    let autoData = null;
    
    // First try by slug
    const q = query(collection(db, 'anuncios_auto'), where('slug', '==', slug), limit(1));
    const qSnap = await getDocs(q);
    
    if (!qSnap.empty) {
      autoData = qSnap.docs[0].data();
    } else {
      // Fallback to ID
      const docSnap = await getDoc(doc(db, 'anuncios_auto', slug));
      if (docSnap.exists()) {
        autoData = docSnap.data();
      }
    }

    if (autoData) {
      const title = `${autoData.marca || ''} ${autoData.model || ''}`.trim() + ' | Vindu24';
      const description = autoData.description ? (autoData.description.substring(0, 155) + '...') : `Descoperă acest vehicul ${autoData.marca || ''} ${autoData.model || ''} pe Vindu24 la prețul de ${autoData.price}€.`;
      const image = autoData.images?.[0] || 'https://vindu24.ro/og-image.jpg';
      const url = `https://vindu24.ro/auto/${slug}`;
      
      return {
        title,
        description,
        keywords: `${autoData.marca || ''}, ${autoData.model || ''}, auto, masini, vanzari auto, ${autoData.city || ''}, Vindu24, auto rulate`,
        openGraph: {
          title,
          description,
          url,
          type: 'website',
          images: [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            }
          ],
          siteName: 'Vindu24',
          locale: 'ro_RO',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [image],
        },
        alternates: {
          canonical: url,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for auto:", error);
  }

  return {
    title: 'Vehicul | Vindu24',
    description: 'Anunț auto pe Vindu24.'
  };
}

export default function AutoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
