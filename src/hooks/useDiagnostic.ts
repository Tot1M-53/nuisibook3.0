import { useState, useEffect, useCallback } from 'react';
import { DiagnosticState } from '../types/diagnostic';
import { getDiagnosticResult, checkDiagnosticAvailability } from '../services/diagnosticService';

export function useDiagnostic(slug: string) {
  const [state, setState] = useState<DiagnosticState>({
    isLoading: false,
    isAvailable: false,
    content: null,
    error: null
  });

  const [isPolling, setIsPolling] = useState(false);
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null);

  // Fonction pour vérifier la disponibilité
  const checkAvailability = useCallback(async () => {
    if (!slug) return false;

    try {
      const isAvailable = await checkDiagnosticAvailability(slug);
      setState(prev => ({ ...prev, isAvailable }));
      return isAvailable;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur de vérification'
      }));
      return false;
    }
  }, [slug]);

  // Démarrer le polling pour vérifier la disponibilité
  const startPolling = useCallback(() => {
    if (!slug || isPolling) return;

    setIsPolling(true);
    setPollingStartTime(Date.now());
    setState(prev => ({ ...prev, error: null }));

    const pollInterval = setInterval(async () => {
      const isAvailable = await checkAvailability();
      
      if (isAvailable) {
        setIsPolling(false);
        clearInterval(pollInterval);
      }
    }, 3000); // Vérifier toutes les 3 secondes

    // Arrêter le polling après 5 minutes maximum
    const maxPollingTime = setTimeout(() => {
      setIsPolling(false);
      clearInterval(pollInterval);
      setState(prev => ({ 
        ...prev, 
        error: 'Délai d\'attente dépassé. Le diagnostic n\'est pas encore disponible.' 
      }));
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(pollInterval);
      clearTimeout(maxPollingTime);
    };
  }, [slug, isPolling, checkAvailability]);

  // Vérification initiale au montage
  useEffect(() => {
    if (slug) {
      checkAvailability();
    }
  }, [slug, checkAvailability]);

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
          error: 'Diagnostic non disponible'
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

  // Calculer le temps écoulé depuis le début du polling
  const getPollingDuration = () => {
    if (!pollingStartTime) return 0;
    return Math.floor((Date.now() - pollingStartTime) / 1000);
  };

  return {
    ...state,
    isPolling,
    pollingDuration: getPollingDuration(),
    startPolling,
    loadDiagnostic
  };
}