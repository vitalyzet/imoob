const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "imoob-e52ad",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const q = collection(db, 'anuncios');
  const snap = await getDocs(q);
  console.log('Total properties:', snap.size);
  snap.forEach(doc => {
    const d = doc.data();
    if (d.type === 'camera' || (typeof d.type === 'string' && d.type.includes('camera'))) {
      console.log('ROOM:', { id: doc.id, type: d.type, localitate: d.localitate, city: d.city, judet: d.judet });
    }
  });
}
run();
