import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative py-28 bg-[#2b3543] overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute w-full h-full text-white">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
          ¿Listo para <span className="text-[#139E69]">vender</span> o comprar?
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-12 text-xl font-medium leading-relaxed">
          Nuestros expertos inmobiliarios están preparados para asesorarte y acompañarte en cada paso del proceso.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            href="/contacto"
            className="bg-[#139E69] text-white px-10 py-5 font-bold rounded-md hover:bg-[#0f8256] transition-all shadow-xl text-lg flex items-center justify-center gap-3"
          >
            Contactar ahora
          </Link>
          <Link 
            href="/propiedades"
            className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 px-10 py-5 font-bold rounded-md transition-all text-lg flex items-center justify-center"
          >
            Ver todas las casas
          </Link>
        </div>
      </div>
    </section>
  );
}
