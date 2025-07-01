import React, { useState, useEffect } from 'react';
import { Loader2, Clock, FileText, X, AlertTriangle, Search } from 'lucide-react';
import { useDiagnostic } from '../hooks/useDiagnostic';
import { testDiagnosticTable } from '../services/diagnosticService';

interface DiagnosticButtonProps {
  slug: string;
}

export default function DiagnosticButton({ slug }: DiagnosticButtonProps) {
  const { 
    isLoading, 
    isAvailable, 
    content, 
    error, 
    isPolling,
    pollingDuration,
    startPolling,
    loadDiagnostic 
  } = useDiagnostic(slug);

  const [showModal, setShowModal] = useState(false);
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  // Vérifier si la table existe au montage
  useEffect(() => {
    const checkTable = async () => {
      const result = await testDiagnosticTable();
      setTableExists(result.exists);
      if (!result.exists) {
        console.warn('Table diagnostics_results:', result.message);
      }
    };
    
    checkTable();
  }, []);

  const handleClick = () => {
    if (content) {
      setShowModal(true);
    } else if (isAvailable) {
      loadDiagnostic();
    } else if (!isPolling) {
      startPolling();
    }
  };

  const getButtonText = () => {
    if (tableExists === false) {
      return 'Table diagnostic non disponible';
    }
    if (isPolling) {
      return `Traitement des données en cours... (${pollingDuration}s)`;
    }
    if (isLoading) {
      return 'Chargement du diagnostic...';
    }
    if (content) {
      return 'Voir le résultat de mon diagnostic';
    }
    if (isAvailable) {
      return 'Diagnostic disponible - Cliquer pour voir';
    }
    if (error) {
      return 'Réessayer';
    }
    return 'Vérifier la disponibilité du diagnostic';
  };

  const getButtonIcon = () => {
    if (tableExists === false) {
      return <AlertTriangle className="w-4 h-4" />;
    }
    if (isPolling) {
      return <Search className="w-4 h-4 animate-pulse" />;
    }
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    if (isAvailable || content) {
      return <FileText className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  const getButtonStyle = () => {
    if (tableExists === false) {
      return 'text-red-500 cursor-not-allowed';
    }
    if (isPolling) {
      return 'text-orange-600 cursor-default animate-pulse';
    }
    if (isLoading) {
      return 'text-blue-600 cursor-default';
    }
    if (content || isAvailable) {
      return 'text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer';
    }
    if (error) {
      return 'text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer';
    }
    return 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer';
  };

  const isButtonDisabled = () => {
    return tableExists === false || isLoading;
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isButtonDisabled()}
        className={`inline-flex items-center gap-2 font-medium transition-all duration-300 text-sm sm:text-base px-3 py-1.5 rounded-lg ${getButtonStyle()}`}
      >
        {getButtonIcon()}
        {getButtonText()}
      </button>

      {/* Message d'information détaillé */}
      {tableExists === false && (
        <div className="mt-2 text-xs text-red-600">
          Veuillez connecter Supabase pour activer les diagnostics
        </div>
      )}

      {isPolling && (
        <div className="mt-2 text-xs text-orange-600">
          Recherche du diagnostic en cours... Le système vérifie automatiquement toutes les 3 secondes.
        </div>
      )}

      {isAvailable && !content && !isPolling && (
        <div className="mt-2 text-xs text-green-600">
          ✅ Diagnostic disponible ! Cliquez pour le consulter.
        </div>
      )}

      {/* Modal pour afficher le diagnostic */}
      {showModal && content && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Résultat de votre diagnostic</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div 
                className="prose prose-sm sm:prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && !showModal && tableExists !== false && !isPolling && (
        <div className="mt-2 text-xs text-red-600">
          {error}
        </div>
      )}
    </>
  );
}