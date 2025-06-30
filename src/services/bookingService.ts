import { supabase } from '../lib/supabase';
import { BookingData, RdvBooking } from '../types/booking';

export class BookingError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'BookingError';
  }
}

export async function createBooking(bookingData: BookingData): Promise<RdvBooking> {
  try {
    console.log('Création de la réservation avec les données:', bookingData);

    const { data, error } = await supabase
      .from('rdv_bookings')
      .insert([{
        prenom: bookingData.prenom,
        nom: bookingData.nom,
        societe: bookingData.societe || null,
        email: bookingData.email,
        telephone: bookingData.telephone,
        adresse: bookingData.adresse,
        ville: bookingData.ville,
        code_postal: bookingData.code_postal,
        date_rdv: bookingData.date_rdv,
        heure_rdv: bookingData.heure_rdv,
        slug: bookingData.slug,
        statut: 'en_attente'
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      throw new BookingError(`Erreur lors de la création du rendez-vous: ${error.message}`, error);
    }

    if (!data) {
      throw new BookingError('Aucune donnée retournée après la création du rendez-vous');
    }

    console.log('Réservation créée avec succès:', data);
    return data as RdvBooking;
  } catch (error) {
    console.error('Erreur dans createBooking:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la création du rendez-vous',
      error
    );
  }
}

export async function getBooking(id: string): Promise<RdvBooking | null> {
  try {
    const { data, error } = await supabase
      .from('rdv_bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Aucune ligne trouvée
      }
      throw new BookingError(`Erreur lors de la récupération du rendez-vous: ${error.message}`, error);
    }

    return data as RdvBooking;
  } catch (error) {
    console.error('Erreur dans getBooking:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la récupération du rendez-vous',
      error
    );
  }
}

export async function getAllBookings(): Promise<RdvBooking[]> {
  try {
    const { data, error } = await supabase
      .from('rdv_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BookingError(`Erreur lors de la récupération des rendez-vous: ${error.message}`, error);
    }

    return (data || []) as RdvBooking[];
  } catch (error) {
    console.error('Erreur dans getAllBookings:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la récupération des rendez-vous',
      error
    );
  }
}

export async function updateBookingStatus(id: string, statut: RdvBooking['statut']): Promise<RdvBooking> {
  try {
    const { data, error } = await supabase
      .from('rdv_bookings')
      .update({ statut })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BookingError(`Erreur lors de la mise à jour du statut: ${error.message}`, error);
    }

    if (!data) {
      throw new BookingError('Aucune donnée retournée après la mise à jour du statut');
    }

    return data as RdvBooking;
  } catch (error) {
    console.error('Erreur dans updateBookingStatus:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la mise à jour du statut',
      error
    );
  }
}