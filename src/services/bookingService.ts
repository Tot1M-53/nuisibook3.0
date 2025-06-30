import { supabase } from '../lib/supabase';
import { BookingData, Booking } from '../types/booking';

export class BookingError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'BookingError';
  }
}

export async function createBooking(bookingData: BookingData): Promise<Booking> {
  try {
    console.log('Creating booking with data:', bookingData);

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        first_name: bookingData.first_name,
        last_name: bookingData.last_name,
        company: bookingData.company || null,
        email: bookingData.email,
        phone: bookingData.phone,
        address: bookingData.address,
        city: bookingData.city,
        postal_code: bookingData.postal_code,
        appointment_date: bookingData.appointment_date,
        appointment_time: bookingData.appointment_time,
        treatment_type: bookingData.treatment_type,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new BookingError(`Erreur lors de la création du rendez-vous: ${error.message}`, error);
    }

    if (!data) {
      throw new BookingError('Aucune donnée retournée après la création du rendez-vous');
    }

    console.log('Booking created successfully:', data);
    return data as Booking;
  } catch (error) {
    console.error('Error in createBooking:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la création du rendez-vous',
      error
    );
  }
}

export async function getBooking(id: string): Promise<Booking | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw new BookingError(`Erreur lors de la récupération du rendez-vous: ${error.message}`, error);
    }

    return data as Booking;
  } catch (error) {
    console.error('Error in getBooking:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la récupération du rendez-vous',
      error
    );
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new BookingError(`Erreur lors de la récupération des rendez-vous: ${error.message}`, error);
    }

    return (data || []) as Booking[];
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la récupération des rendez-vous',
      error
    );
  }
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BookingError(`Erreur lors de la mise à jour du statut: ${error.message}`, error);
    }

    if (!data) {
      throw new BookingError('Aucune donnée retournée après la mise à jour du statut');
    }

    return data as Booking;
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    
    if (error instanceof BookingError) {
      throw error;
    }
    
    throw new BookingError(
      'Une erreur inattendue s\'est produite lors de la mise à jour du statut',
      error
    );
  }
}