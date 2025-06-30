import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification plus robuste des variables d'environnement
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL manquante');
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY manquante');
}

// Créer le client même si les variables sont manquantes pour éviter les erreurs de build
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false
    }
  }
);

// Fonction de test de connexion
export async function testConnection() {
  try {
    // Vérifier d'abord si les variables d'environnement sont présentes
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      return { 
        success: false, 
        message: 'Variables d\'environnement Supabase manquantes ou incorrectes' 
      };
    }

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