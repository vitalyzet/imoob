import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = query(collection(db, 'anuncios'), limit(10));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    if (doc.data().title?.includes('Brasov') || doc.data().city?.includes('brasov')) {
       console.log('---', doc.id, '---');
       console.log('rooms:', doc.data().rooms);
       console.log('baths:', doc.data().baths);
       console.log('bai:', doc.data().bai);
       console.log('baie:', doc.data().baie);
       console.log('amenities:', doc.data().amenities);
    }
  });
  console.log("Done");
  process.exit(0);
}

check();
