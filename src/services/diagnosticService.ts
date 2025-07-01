import { supabase } from '../lib/supabase';
import { DiagnosticResult } from '../types/diagnostic';

export class DiagnosticError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'DiagnosticError';
  }
}

export async function getDiagnosticResult(slug: string): Promise<DiagnosticResult | null> {
  try {
    if (!slug) {
      throw new DiagnosticError('Slug manquant pour récupérer le diagnostic');
    }

    console.log('Récupération du diagnostic pour le slug:', slug);

    // Vérifier d'abord si Supabase est configuré
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      throw new DiagnosticError('Configuration Supabase manquante');
    }

    const { data, error } = await supabase
      .from('diagnostics_results')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucune ligne trouvée
        console.log('Aucun diagnostic trouvé pour le slug:', slug);
        return null;
      }
      
      // Si la table n'existe pas
      if (error.message.includes('relation "public.diagnostics_results" does not exist')) {
        throw new DiagnosticError('La table des diagnostics n\'existe pas encore. Veuillez connecter Supabase.');
      }
      
      throw new DiagnosticError(`Erreur lors de la récupération du diagnostic: ${error.message}`, error);
    }

    console.log('Diagnostic récupéré avec succès:', data);
    return data as DiagnosticResult;
  } catch (error) {
    console.error('Erreur dans getDiagnosticResult:', error);
    
    if (error instanceof DiagnosticError) {
      throw error;
    }
    
    throw new DiagnosticError(
      'Une erreur inattendue s\'est produite lors de la récupération du diagnostic',
      error
    );
  }
}

export async function checkDiagnosticAvailability(slug: string): Promise<boolean> {
  try {
    const result = await getDiagnosticResult(slug);
    return result !== null;
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité du diagnostic:', error);
    return false;
  }
}

// Fonction pour tester si la table existe
export async function testDiagnosticTable(): Promise<{ exists: boolean; message: string }> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      return { exists: false, message: 'Configuration Supabase manquante' };
    }

    const { error } = await supabase
      .from('diagnostics_results')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "public.diagnostics_results" does not exist')) {
        return { exists: false, message: 'Table diagnostics_results non trouvée' };
      }
      return { exists: false, message: error.message };
    }

    return { exists: true, message: 'Table diagnostics_results accessible' };
  } catch (error) {
    return { 
      exists: false, 
      message: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}