import { Property, Testimonial, Agent } from './types';

export const agents: Agent[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    role: 'Director Comercial',
    image: '/images/team/carlos.jpg',
    phone: '+34 612 345 678',
    email: 'carlos@imoob.com',
  },
  {
    id: '2',
    name: 'María García',
    role: 'Agente Senior',
    image: '/images/team/maria.jpg',
    phone: '+34 623 456 789',
    email: 'maria@imoob.com',
  },
  {
    id: '3',
    name: 'Alejandro Ruiz',
    role: 'Asesor Inmobiliario',
    image: '/images/team/alejandro.jpg',
    phone: '+34 634 567 890',
    email: 'alejandro@imoob.com',
  },
  {
    id: '4',
    name: 'Laura Fernández',
    role: 'Directora de Marketing',
    image: '/images/team/laura.jpg',
    phone: '+34 645 678 901',
    email: 'laura@imoob.com',
  },
];

export const properties: Property[] = [];

export const cities = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brașov', 'Brăila', 'București',
  'Buzău', 'Caraș-Severin', 'Călărași', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț',
  'Olt', 'Prahova', 'Satu Mare', 'Sălaj', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui',
  'Vâlcea', 'Vrancea'
];
export const propertyTypes = [
  { value: 'Apartamente', label: 'Apartamente' },
  { value: 'Garsoniere', label: 'Garsoniere' },
  { value: 'Case / Vile', label: 'Case / Vile' },
  { value: 'Terenuri', label: 'Terenuri' },
  { value: 'Birouri', label: 'Birouri' },
  { value: 'Spații comerciale', label: 'Spații comerciale' },
  { value: 'Spații industriale', label: 'Spații industriale' },
  { value: 'Ansambluri', label: 'Ansambluri' },
  { value: 'Hoteluri / Pensiuni', label: 'Hoteluri / Pensiuni' },
  { value: 'Cameră de închiriat', label: 'Cameră de închiriat' }
];
