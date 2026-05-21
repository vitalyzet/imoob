export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  type: PropertyType;
  status: PropertyStatus;
  location: Location;
  features: PropertyFeatures;
  images: string[];
  amenities: string[];
  featured: boolean;
  promoType?: string | null;
  oldPrice?: number | null;
  isNewConstruction?: boolean;
  createdAt: string;
  agent: Agent;
  roommateDetails?: {
    cautaColeg: boolean;
    nrPersoaneActual: string;
    preferinteColeg: string;
    cheltuieliIncluse: string;
    frigiderPersonal: string;
    cameraCuCheie: string;
    animaleAceptate: string;
    bucatarie: string;
    baie: string;
  };
}

export type PropertyType = 'villa' | 'apartment' | 'penthouse' | 'loft' | 'house' | 'studio' | 'camera';

export type PropertyStatus = 'for-sale' | 'for-rent' | 'sold' | 'rented';

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  lat: number;
  lng: number;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number; // in m²
  garage: number;
  yearBuilt: number;
  floors: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface FilterState {
  city: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
}
