export interface BookingData {
  prenom: string;
  nom: string;
  societe?: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  date_rdv: string;
  heure_rdv: string;
  slug: string;
  nuisible: string;
}

export interface RdvBooking extends BookingData {
  id: string;
  statut: 'en_attente' | 'confirme' | 'termine' | 'annule';
  created_at: string;
  updated_at: string;
}

export interface PackInfo {
  slug: string;
  name: string;
  duration: string;
  specificTreatment: string;
}

export const PACK_TYPES: Record<string, PackInfo> = {
  'rongeurs': {
    slug: 'rongeurs',
    name: 'Pack traitement rongeurs',
    duration: '3h',
    specificTreatment: 'pose d\'appât ou piège mécanique et/ou obstruction de points d\'entrée'
  },
  'blattes-cafards': {
    slug: 'blattes-cafards',
    name: 'Pack traitement blattes-cafards',
    duration: '3h',
    specificTreatment: 'appât, gel ou pulvérisation insecticide ou piège de contrôle'
  },
  'punaises-de-lit': {
    slug: 'punaises-de-lit',
    name: 'Pack traitement punaises de lit',
    duration: '4h',
    specificTreatment: 'traitement chimique par pulvérisation ou traitement thermique ou traitement mécanique'
  },
  'guepes-frelons': {
    slug: 'guepes-frelons',
    name: 'Pack traitement nid de guêpes',
    duration: '2h',
    specificTreatment: 'poudrage insecticide ou pulvérisation du nid'
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