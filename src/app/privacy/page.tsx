import React from 'react';

export const metadata = {
  title: 'Politică de Confidențialitate | Vindu24',
  description: 'Află cum protejăm și procesăm datele tale personale conform GDPR.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 pt-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Politică de Confidențialitate</h1>
          <p className="text-gray-500 font-medium mb-10">Ultima actualizare: Iunie 2026</p>

          <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Angajamentul Nostru (GDPR)</h2>
              <p>
                Vindu24 respectă confidențialitatea datelor tale personale și se angajează să le protejeze în conformitate 
                cu Regulamentul General privind Protecția Datelor (UE) 2016/679 (GDPR) și legile naționale aplicabile.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Ce date colectăm</h2>
              <p>Colectăm datele pe care ni le furnizezi direct atunci când:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Îți creezi un cont (nume, adresă de email, număr de telefon).</li>
                <li>Publici un anunț (locație, descriere, fotografii).</li>
                <li>Comunici prin intermediul platformei (mesaje între utilizatori).</li>
              </ul>
              <p>De asemenea, colectăm date automat prin intermediul cookie-urilor, cum ar fi adresa IP și comportamentul de navigare pe site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">3. Cum folosim datele</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pentru a-ți oferi și menține serviciile platformei.</li>
                <li>Pentru a facilita comunicarea între vânzători și cumpărători.</li>
                <li>Pentru prevenirea fraudelor și asigurarea securității conturilor.</li>
                <li>Pentru a procesa plățile aferente serviciilor de promovare.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">4. Drepturile Tale</h2>
              <p>Conform GDPR, ai următoarele drepturi asupra datelor tale:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Dreptul de acces:</strong> poți solicita o copie a datelor pe care le deținem.</li>
                <li><strong>Dreptul la rectificare:</strong> poți corecta datele inexacte din contul tău.</li>
                <li><strong>Dreptul la ștergere ("dreptul de a fi uitat"):</strong> poți solicita ștergerea contului și a datelor tale.</li>
                <li><strong>Dreptul la portabilitate:</strong> poți cere transferul datelor către alt operator.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Securitatea Datelor</h2>
              <p>
                Implementăm măsuri tehnice și organizatorice de ultimă generație pentru a proteja datele tale împotriva 
                accesului neautorizat, modificării sau distrugerii. Datele sunt stocate pe servere securizate (inclusiv Firebase/Google Cloud) 
                care respectă cele mai înalte standarde de securitate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Contact</h2>
              <p>
                Pentru orice întrebări referitoare la confidențialitatea datelor sau pentru a-ți exercita drepturile, 
                ne poți contacta la adresa de email: <strong>privacy@vindu24.ro</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
