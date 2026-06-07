import React from 'react';

export const metadata = {
  title: 'Aviz Legal | Vindu24',
  description: 'Informații legale, date de identificare ale companiei și drepturi de autor.',
};

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 pt-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Aviz Legal</h1>
          <p className="text-gray-500 font-medium mb-10">Ultima actualizare: Iunie 2026</p>

          <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Date de identificare</h2>
              <p>Conform reglementărilor legale în vigoare din România, furnizăm următoarele informații privind entitatea care operează site-ul web Vindu24:</p>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mt-4">
                <ul className="space-y-2">
                  <li><strong>Nume Companie:</strong> Vindu24 Online SRL</li>
                  <li><strong>Cod Unic de Înregistrare (CUI):</strong> ROXXXXXXXX</li>
                  <li><strong>Număr Registrul Comerțului:</strong> JXX/XXXX/XXXX</li>
                  <li><strong>Adresă Sediu Social:</strong> București, România</li>
                  <li><strong>E-mail Contact:</strong> contact@vindu24.ro</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Proprietate Intelectuală</h2>
              <p>
                Tot conținutul prezent pe site-ul Vindu24 (texte, grafică, logo-uri, butoane, imagini, software) 
                reprezintă proprietatea Vindu24 Online SRL sau a partenerilor săi și este protejat de legislația 
                română și internațională privind drepturile de autor.
              </p>
              <p>
                Extragerea, reutilizarea, reproducerea sau utilizarea oricărei părți din conținutul platformei 
                fără acordul scris prealabil al Vindu24 este strict interzisă și atrage răspunderea legală.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Găzduire și Infrastructură</h2>
              <p>
                Platforma Vindu24 este găzduită și securizată prin intermediul partenerilor tehnologici (Vercel, Google Cloud Platform), 
                asigurând respectarea standardelor europene privind stocarea și procesarea datelor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Protecția Consumatorului (ANPC)</h2>
              <p>
                În conformitate cu legile din România, consumatorii nemulțumiți pot adresa plângeri Autorității Naționale pentru Protecția Consumatorilor (ANPC).
              </p>
              <p>
                Telefon INFO CONSUMATOR: 021.9551 <br />
                Site web: <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">anpc.ro</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
