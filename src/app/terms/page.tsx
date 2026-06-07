import React from 'react';

export const metadata = {
  title: 'Termeni de utilizare | Vindu24',
  description: 'Termenii și condițiile de utilizare pentru platforma Vindu24.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 pt-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Termeni și Condiții de Utilizare</h1>
          <p className="text-gray-500 font-medium mb-10">Ultima actualizare: Iunie 2026</p>

          <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Introducere</h2>
              <p>
                Bun venit pe Vindu24! Acești Termeni și Condiții guvernează accesul și utilizarea platformei noastre web. 
                Prin accesarea sau utilizarea Vindu24, sunteți de acord să respectați acești Termeni. Dacă nu sunteți de acord cu orice parte 
                a acestora, vă rugăm să nu utilizați platforma noastră.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Definiții</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Platformă:</strong> site-ul web Vindu24 și toate serviciile asociate.</li>
                <li><strong>Utilizator:</strong> orice persoană fizică sau juridică care accesează platforma.</li>
                <li><strong>Anunț:</strong> oferta de vânzare sau închiriere publicată pe platformă.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Reguli de Publicare a Anunțurilor</h2>
              <p>
                Utilizatorii se obligă să publice anunțuri reale, precise și care nu încalcă legile în vigoare din România. Este strict interzisă:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Publicarea de anunțuri cu conținut fals sau înșelător.</li>
                <li>Utilizarea de imagini care nu aparțin utilizatorului sau care sunt protejate de drepturi de autor.</li>
                <li>Promovarea bunurilor ilegale sau obținute prin infracțiuni.</li>
              </ul>
              <p>Ne rezervăm dreptul de a șterge orice anunț care încalcă aceste reguli, fără o notificare prealabilă.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Răspundere</h2>
              <p>
                Vindu24 acționează ca un intermediar tehnic (platformă de tip marketplace). Nu suntem proprietarii bunurilor 
                listate și nu garantăm pentru calitatea, starea sau legalitatea acestora. Orice tranzacție se încheie strict 
                între cumpărător și vânzător, Vindu24 nefiind parte în contract.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Plăți și Promovare</h2>
              <p>
                Platforma poate oferi servicii de promovare plătite. Plățile sunt procesate în siguranță prin intermediul partenerilor 
                noștri. Sumele achitate pentru promovarea anunțurilor nu sunt rambursabile în cazul în care anunțul este șters pentru 
                încălcarea termenilor sau dacă bunul a fost vândut înainte de expirarea perioadei de promovare.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Legislație Aplicabilă</h2>
              <p>
                Acești termeni sunt guvernați de legislația din România. Orice litigiu va fi soluționat pe cale amiabilă sau, 
                în caz de eșec, de către instanțele judecătorești competente din România. 
                Pentru protecția consumatorului, puteți accesa site-ul ANPC (Autoritatea Națională pentru Protecția Consumatorilor).
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
