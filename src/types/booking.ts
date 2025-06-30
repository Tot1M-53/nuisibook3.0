export interface BookingData {
  first_name: string;
  last_name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  appointment_date: string;
  appointment_time: string;
  treatment_type: string;
}

export interface Booking extends BookingData {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface PackInfo {
  slug: string;
  name: string;
  duration: string;
}

export const PACK_TYPES: Record<string, PackInfo> = {
  'rongeur': {
    slug: 'rongeur',
    name: 'Pack traitement rongeur',
    duration: '3h'
  },
  'blattes-cafards': {
    slug: 'blattes-cafards',
    name: 'Pack traitement cafards',
    duration: '3h'
  },
  'punaises-de-lit': {
    slug: 'punaises-de-lit',
    name: 'Pack traitement punaises de lit',
    duration: '4h'
  },
  'guepes-frelons': {
    slug: 'guepes-frelons',
    name: 'Pack traitement nid de guêpes',
    duration: '2h'
  }
};

export const TIME_SLOTS = ['08h00', '10h00', '13h00', '15h00', '17h00'];

export const FRENCH_HOLIDAYS_2024 = [
  '2024-01-01', // Nouvel An
  '2024-03-29', // Vendredi Saint
  '2024-04-01', // Lundi de Pâques
  '2024-05-01', // Fête du Travail
  '2024-05-08', // Victoire 1945
  '2024-05-09', // Ascension
  '2024-05-20', // Lundi de Pentecôte
  '2024-07-14', // Fête nationale
  '2024-08-15', // Assomption
  '2024-11-01', // Toussaint
  '2024-11-11', // Armistice
  '2024-12-25', // Noël
];

export const FRENCH_HOLIDAYS_2025 = [
  '2025-01-01', // Nouvel An
  '2025-04-18', // Vendredi Saint
  '2025-04-21', // Lundi de Pâques
  '2025-05-01', // Fête du Travail
  '2025-05-08', // Victoire 1945
  '2025-05-29', // Ascension
  '2025-06-09', // Lundi de Pentecôte
  '2025-07-14', // Fête nationale
  '2025-08-15', // Assomption
  '2025-11-01', // Toussaint
  '2025-11-11', // Armistice
  '2025-12-25', // Noël
];