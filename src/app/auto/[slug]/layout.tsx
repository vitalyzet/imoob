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
      const title = `${autoData.marca || ''} ${autoData.model || ''}`.trim() + ' | xmobe';
      const description = autoData.description?.substring(0, 160) || 'Detalii despre acest vehicul pe xmobe.';
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: autoData.images && autoData.images.length > 0 ? [{ url: autoData.images[0] }] : [],
        }
      };
    }
  } catch (error) {
    console.error("Error generating metadata for auto:", error);
  }

  return {
    title: 'Vehicul | xmobe',
    description: 'Anunț auto pe xmobe.'
  };
}

export default function AutoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
