import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Póngase en contacto con IMOOB. Nuestros asesores inmobiliarios están a su disposición para ayudarle a encontrar su propiedad de lujo.',
};

export default function Contacto() {
  return (
    <div className="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6">
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            Póngase en Contacto
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
            Estamos aquí para asistirle en su búsqueda de la propiedad perfecta o responder cualquier consulta sobre nuestros servicios exclusivos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div className="bg-white dark:bg-[#111111] p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8">Envíenos un Mensaje</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Nombre</label>
                  <input type="text" className="w-full p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black focus:outline-none focus:border-[#139E69] dark:focus:border-[#139E69]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Apellidos</label>
                  <input type="text" className="w-full p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black focus:outline-none focus:border-[#139E69] dark:focus:border-[#139E69]" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Email</label>
                  <input type="email" className="w-full p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black focus:outline-none focus:border-[#139E69] dark:focus:border-[#139E69]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Teléfono</label>
                  <input type="tel" className="w-full p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black focus:outline-none focus:border-[#139E69] dark:focus:border-[#139E69]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Asunto</label>
                <select className="w-full p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black focus:outline-none focus:border-[#139E69] dark:focus:border-[#139E69]">
                  <option>Comprar una propiedad</option>
                  <option>Vender mi propiedad</option>
                  <option>Alquiler de lujo</option>
                  <option>Relaciones Públicas / Prensa</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Mensaje</label>
                <textarea rows={5} className="w-full p-4 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black focus:outline-none focus:border-[#139E69] dark:focus:border-[#139E69] resize-none"></textarea>
              </div>

              <div className="flex items-start mb-6">
                <input type="checkbox" id="privacy" className="mt-1 mr-3 rounded border-gray-300 text-[#139E69] focus:ring-[#139E69]" />
                <label htmlFor="privacy" className="text-sm text-gray-500">
                  He leído y acepto la política de privacidad. Consiento el tratamiento de mis datos personales para gestionar mi consulta.
                </label>
              </div>

              <button type="button" className="bg-[#139E69] hover:bg-[#b89326] text-white px-8 py-4 font-medium uppercase tracking-wider transition-colors">
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-[#111111] text-white p-10 mb-8 border border-gray-900">
              <h2 className="text-2xl font-serif font-bold mb-8">Nuestras Oficinas</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-[#139E69] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wider mb-2">Oficina Central Madrid</h4>
                    <p className="text-gray-400">Paseo de la Castellana 45, Planta 8</p>
                    <p className="text-gray-400">28046 Madrid, España</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={24} className="text-[#139E69] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wider mb-2">Teléfonos</h4>
                    <p className="text-gray-400">Principal: +34 900 123 456</p>
                    <p className="text-gray-400">Ventas: +34 900 123 457</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail size={24} className="text-[#139E69] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wider mb-2">Email</h4>
                    <p className="text-gray-400">info@imoob.com</p>
                    <p className="text-gray-400">sales@imoob.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-[#139E69] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wider mb-2">Horario de Atención</h4>
                    <p className="text-gray-400">Lunes a Viernes: 09:00 - 19:00</p>
                    <p className="text-gray-400">Sábados: Con cita previa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-80 bg-gray-200 dark:bg-gray-800 relative w-full overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-500">
                <MapPin size={48} className="mb-2 opacity-50" />
                <span>Mapa Interactivo</span>
              </div>
              {/* Optional: Add actual Google Maps or similar iframe here */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
