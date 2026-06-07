import React from 'react';

export const metadata = {
  title: 'Politică de Cookies | Vindu24',
  description: 'Informații despre cum folosim modulele cookie pentru a îmbunătăți experiența ta.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 pt-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Politică de Cookies</h1>
          <p className="text-gray-500 font-medium mb-10">Ultima actualizare: Iunie 2026</p>

          <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Ce sunt cookie-urile?</h2>
              <p>
                Un cookie este un fișier text de mici dimensiuni, format din litere și cifre, care va fi stocat 
                pe computerul, terminalul mobil sau alte echipamente ale unui utilizator de pe care se accesează internetul. 
                Cookie-ul este instalat prin solicitarea emisă de către un web-server unui browser (ex: Chrome, Safari).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Cum folosim cookie-urile?</h2>
              <p>Folosim cookie-uri pentru a asigura funcționarea corectă a site-ului și pentru a-ți oferi o experiență mai bună:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Cookie-uri Strict Necesare:</strong> Esențiale pentru navigarea pe site, autentificarea în cont (Firebase Auth) și salvarea preferințelor de securitate.</li>
                <li><strong>Cookie-uri de Funcționalitate:</strong> Ne ajută să reținem alegerile tale (ex. limba preferată, căutările salvate).</li>
                <li><strong>Cookie-uri Analitice:</strong> Ne permit să analizăm modul în care utilizatorii interacționează cu site-ul (Google Analytics) pentru a-l îmbunătăți.</li>
                <li><strong>Cookie-uri de Marketing:</strong> Folosite pentru a-ți oferi reclame relevante, dacă este cazul.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Durata de viață a cookie-urilor</h2>
              <p>
                Unele cookie-uri sunt păstrate doar pe durata sesiunii (se șterg când închizi browser-ul), în timp ce 
                altele sunt "persistente" și rămân pe dispozitivul tău pentru o perioadă determinată sau până le ștergi manual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Cum poți controla cookie-urile?</h2>
              <p>
                Ai opțiunea de a accepta sau respinge cookie-urile (cu excepția celor strict necesare). Poți de asemenea 
                să îți setezi browserul pentru a bloca sau a te avertiza cu privire la aceste cookie-uri, dar anumite părți 
                ale site-ului ar putea să nu funcționeze corect fără ele.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
