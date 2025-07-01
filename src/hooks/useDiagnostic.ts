import { useState, useEffect } from 'react';
import { DiagnosticState } from '../types/diagnostic';
import { getDiagnosticResult, checkDiagnosticAvailability } from '../services/diagnosticService';

export function useDiagnostic(slug: string) {
  const [state, setState] = useState<DiagnosticState>({
    isLoading: false,
    isAvailable: false,
    content: null,
    error: null
  });

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(15);

  // Timer pour activer le bouton après 15 secondes
  useEffect(() => {
    if (!slug) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setButtonEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Nettoyer le timer après 15 secondes
    const enableTimer = setTimeout(() => {
      setButtonEnabled(true);
      clearInterval(timer);
    }, 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(enableTimer);
    };
  }, [slug]);

  // Vérifier périodiquement la disponibilité du diagnostic
  useEffect(() => {
    if (!slug || !buttonEnabled) return;

    const checkAvailability = async () => {
      try {
        const isAvailable = await checkDiagnosticAvailability(slug);
        setState(prev => ({ ...prev, isAvailable }));
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
      }
    };

    // Vérifier immédiatement
    checkAvailability();

    // Puis vérifier toutes les 5 secondes
    const interval = setInterval(checkAvailability, 5000);

    return () => clearInterval(interval);
  }, [slug, buttonEnabled]);

  const loadDiagnostic = async () => {
    if (!slug) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getDiagnosticResult(slug);
      
      if (result) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAvailable: true,
          content: result.diagnostic,
          error: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAvailable: false,
          content: null,
          error: 'Diagnostic non disponible pour le moment'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
    }
  };

  return {
    ...state,
    buttonEnabled,
    countdown,
    loadDiagnostic
  };
}