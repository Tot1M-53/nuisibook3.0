import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes. Veuillez vérifier votre fichier .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Pas besoin de sessions d'authentification pour cette app de réservation
  }
});

// Fonction de test de connexion
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('rdv_bookings').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Connexion réussie' };
  } catch (error) {
    console.error('Test de connexion Supabase échoué:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}