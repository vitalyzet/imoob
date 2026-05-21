import Image from 'next/image';
import { agents } from '@/lib/data';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nosotros - IMOOB 2026',
  description: 'Descubre IMOOB, la plataforma inmobiliaria más innovadora del 2026 con tecnología IA avanzada para revolucionar el sector.',
};

const stats = [
  { value: '2026', label: 'Año de Fundación' },
  { value: '100%', label: 'Digital Nativa' },
  { value: '24/7', label: 'Servicio IA' },
  { value: '∞', label: 'Potencial de Crecimiento' },
];

const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15l-3-3m0 0l3-3m-3 3h12.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Exclusividad',
    description: 'Acceso a propiedades off-market y oportunidades exclusivas no disponibles públicamente.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Discreción',
    description: 'Absoluta confidencialidad garantizada en cada transacción, protegiendo su privacidad.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Conocimiento',
    description: 'Expertos locales con visión global del mercado, asesoramiento especializado y personalizado.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Servicio Integral',
    description: 'Desde la búsqueda inicial hasta el servicio concierge post-venta, acompañamiento completo.',
  },
];

const timeline = [
  { year: '2026', title: 'Fundación', description: 'IMOOB nace como la plataforma inmobiliaria más innovadora del 2026, revolucionando el sector con tecnología de vanguardia.' },
  { year: '2026', title: 'Lanzamiento Digital', description: 'Plataforma completamente digital con IA avanzada para matching perfecto entre compradores y propiedades.' },
  { year: '2026', title: 'Expansión Nacional', description: 'Cobertura completa en España con presencia en todas las comunidades autónomas.' },
  { year: '2026', title: 'Innovación Continua', description: 'Primer trimestre del año marca el inicio de una nueva era en el sector inmobiliario español.' },
];

const achievements = [
  '🚀 Primera plataforma IA del 2026',
  '💡 Tecnología revolucionaria',
  '⚡ Experiencia 100% digital',
  '🎯 Matching perfecto con IA'
];

export default function SobreNosotros() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section - OPCIÓN 2: Color Sólido Verde Elegante */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#139E69]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#139E69] via-[#0f8256] to-[#0b6341]"></div>

        {/* OPCIÓN 2: Color Sólido Verde Elegante */}
        {/* <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#139E69]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#139E69] via-[#0f8256] to-[#0b6341]"></div> */}

        {/* OPCIÓN 3: Gradiente Moderno */}
        {/* <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"></div> */}

        {/* OPCIÓN 4: Patrón de Puntos Sutil */}
        {/* <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, #139E69 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/80 to-slate-50/90"></div> */}

        {/* OPCIÓN 5: Diseño Minimalista con Líneas */}
        {/* <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#139E69]/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#139E69]/20 to-transparent"></div>
            <div className="absolute top-1/2 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#139E69]/20 to-transparent"></div>
            <div className="absolute top-1/2 right-0 w-1 h-full bg-gradient-to-t from-transparent via-[#139E69]/20 to-transparent"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95"></div> */}

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full mb-8 shadow-2xl">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium tracking-wider uppercase">Inmobiliaria de Lujo</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-8 tracking-tight leading-tight">
            Acerca de <span className="text-white relative">
              IMOOB
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-white opacity-80"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto font-light leading-relaxed mb-12">
            La plataforma inmobiliaria más innovadora del 2026, revolucionando el sector con tecnología de vanguardia
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 px-8 py-4 rounded-full shadow-lg">
              <span className="text-white/90 text-sm font-medium">Fundada en</span>
              <span className="text-white font-bold text-2xl ml-2">2026</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/25 px-8 py-4 rounded-full shadow-lg">
              <span className="text-white/90 text-sm font-medium">Tecnología</span>
              <span className="text-white font-bold text-2xl ml-2">IA</span>
              <span className="text-white/90 text-sm font-medium ml-1">Avanzada</span>
            </div>
          </div>
        </div>

        {/* Elegant wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block w-full h-[100px] md:h-[150px]">
            <path d="M0,80 L400,80 C800,80 1000,40 1440,20 L1440,120 L0,120 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>



      {/* About & Timeline Section */}
      <section className="py-32 bg-white relative overflow-hidden -mt-16">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6 leading-tight">
                  Nuestra <span className="text-[#139E69]">Historia</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#139E69] to-[#0f8256] mb-8"></div>
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Fundada en 2026, IMOOB llega como la plataforma inmobiliaria más innovadora del año, revolucionando el sector con tecnología de vanguardia y una experiencia completamente digital. Nuestra visión es transformar completamente cómo se compran y venden propiedades en España.
              </p>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Nuestra filosofía combina la excelencia tradicional del sector inmobiliario con la innovación tecnológica más avanzada del 2026. Utilizamos IA de vanguardia para garantizar que cada conexión entre comprador y propiedad sea perfecta, manteniendo siempre los más altos estándares de calidad y confianza.
              </p>

              {/* Achievements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-2xl">{achievement.split(' ')[0]}</div>
                    <span className="text-slate-700 font-medium text-sm">{achievement.slice(achievement.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#139E69] via-[#139E69]/50 to-[#139E69]/20"></div>

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex gap-8">
                    {/* Timeline dot */}
                    <div className="relative z-10 w-16 h-16 bg-white border-4 border-[#139E69] rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 bg-[#139E69] rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                        <div className="text-3xl font-bold text-[#139E69] mb-2">{item.year}</div>
                        <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>






    </div>
  );
}
