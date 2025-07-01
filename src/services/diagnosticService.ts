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