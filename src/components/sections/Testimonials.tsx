import Image from 'next/image';
const testimonials = [{ id: '1', name: 'Alex', role: 'User', content: 'Great platform!', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a', rating: 5 }];
import { Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-[#333] mb-6">
            Lo que dicen <span className="text-[#139E69]">nuestros clientes</span>
          </h2>
          <p className="text-[#666] max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Miles de personas ya han encontrado el hogar de sus sueños con imoob. Conoce sus historias de éxito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-[#fcfcfc] p-10 rounded-xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-8 border-4 border-white shadow-md relative">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex text-[#ffb400] mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-[#555] mb-8 font-medium text-lg leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="mt-auto">
                <h4 className="font-bold text-[#333] text-lg mb-1">{testimonial.name}</h4>
                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-semibold">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
