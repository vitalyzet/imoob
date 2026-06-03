const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function run() {
  const imobSnap = await db.collection("anuncios").get();
  const autoSnap = await db.collection("anuncios_auto").get();
  
  const imob = imobSnap.docs.map(d => d.data());
  const auto = autoSnap.docs.map(d => d.data());
  
  const matches = imob.filter(a => a.email === "vitalyzet28@gmail.com" || !a.userId || !a.email);
  const matchesAuto = auto.filter(a => a.email === "vitalyzet28@gmail.com" || !a.userId || !a.email);
  
  console.log("Matches Imob:", matches.length);
  console.log("Matches Auto:", matchesAuto.length);
}
run();
