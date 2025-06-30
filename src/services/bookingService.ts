import { supabase } from '../lib/supabase';
import { BookingData } from '../types/booking';

export async function createBooking(bookingData: BookingData) {
  try {
    const { data, error } = await supabase
      .from('rdv_bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Erreur lors de la création du rendez-vous: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}