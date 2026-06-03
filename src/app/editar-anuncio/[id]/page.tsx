'use client';

import React, { useEffect, useState } from 'react';
import PropertyPublishForm from '@/components/properties/PropertyPublishForm';
import AutoPublishForm from '@/components/properties/AutoPublishForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export default function EditarAnuncio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [type, setType] = useState<'property' | 'auto' | null>(null);

  useEffect(() => {
    const checkType = async () => {
      try {
        const autoDoc = await getDoc(doc(db, 'anuncios_auto', id));
        if (autoDoc.exists()) {
          setType('auto');
          return;
        }
        setType('property');
      } catch (err) {
        console.error("Error loading ad type", err);
        setType('property');
      }
    };
    checkType();
  }, [id]);

  if (!type) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-sky-500 w-12 h-12" />
      </div>
    );
  }

  return type === 'auto' ? <AutoPublishForm editId={id} /> : <PropertyPublishForm editId={id} />;
}
