import { 
  Wifi, Flame, Wind, ThermometerSnowflake, Zap, Coffee, Sofa, Microwave, 
  Accessibility, Home, DoorOpen, ShieldCheck, Cctv, Tv, 
  Waves, TreePalm, Trees, Sun, 
  Car, Box, ShowerHead, UtensilsCrossed, Dumbbell,
  Bus, ShoppingBag, GraduationCap, Stethoscope, Utensils, Landmark, ParkingSquare, 
  Building2
} from 'lucide-react';

export const AMENITIES_GROUPS = [
  {
    title: 'Confort & Servicii',
    items: [
      { id: 'Wi-Fi / Fibră', icon: Wifi },
      { id: 'Calefacción central', icon: Flame },
      { id: 'Aer condiționat', icon: Wind },
      { id: 'Încălzire pardoseală', icon: ThermometerSnowflake },
      { id: 'Centrală proprie', icon: Zap },
      { id: 'Gaz natural', icon: Flame },
      { id: 'Semineu', icon: Coffee },
      { id: 'Mobilat', icon: Sofa },
      { id: 'Electrocasnice', icon: Microwave },
    ]
  },
  {
    title: 'Accesibilitate & Protecție',
    items: [
      { id: 'Acces adaptat (PMR)', icon: Accessibility },
      { id: 'Locuință adaptată', icon: Home },
      { id: 'Ascensor', icon: DoorOpen },
      { id: 'Alarmă', icon: ShieldCheck },
      { id: 'Supraveghere video', icon: Cctv },
      { id: 'Ușă blindată', icon: ShieldCheck },
      { id: 'Pază 24/7', icon: ShieldCheck },
      { id: 'Interfon / Videointerfon', icon: Tv },
    ]
  },
  {
    title: 'Exterior & Relaxare',
    items: [
      { id: 'Piscină', icon: Waves },
      { id: 'Grădină privată', icon: TreePalm },
      { id: 'Grădină comună', icon: Trees },
      { id: 'Terasa', icon: Sun },
      { id: 'Balcon', icon: DoorOpen },
      { id: 'Curte', icon: Home },
      { id: 'Grătar / BBQ', icon: Flame },
      { id: 'Loc de joacă', icon: Home },
    ]
  },
  {
    title: 'Alte Facilități',
    items: [
      { id: 'Parcare privată', icon: Car },
      { id: 'Garaj', icon: Car },
      { id: 'Boxă / Depozitare', icon: Box },
      { id: 'Spălătorie', icon: ShowerHead },
      { id: 'Cămară', icon: UtensilsCrossed },
      { id: 'Vedere la mare', icon: Waves },
    ]
  },
  {
    title: 'Vecinătăți & Servicii',
    items: [
      { id: 'Transport în comun', icon: Bus },
      { id: 'Supermarket', icon: ShoppingBag },
      { id: 'Școală / Grădiniță', icon: GraduationCap },
      { id: 'Farmacie', icon: Stethoscope },
      { id: 'Spital / Clinică', icon: Stethoscope },
      { id: 'Parc / Zonă verde', icon: Trees },
      { id: 'Sală de fitness', icon: Dumbbell },
      { id: 'Restaurant / Cafenea', icon: Utensils },
      { id: 'Mall / Centru comercial', icon: Building2 },
      { id: 'Bancă / ATM', icon: Landmark },
      { id: 'Parcare publică', icon: ParkingSquare },
    ]
  }
];
