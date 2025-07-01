import React, { useState, useEffect } from 'react';
import { Loader2, FileText, X } from 'lucide-react';
import { getDiagnosticResult } from '../services/diagnosticService';

interface DiagnosticButtonProps {
  slug: string;
}

export default function DiagnosticButton({ slug }: DiagnosticButtonProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Décompte de 15 secondes
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsEnabled(true);
    }
  }, [countdown]);

  const handleClick = async () => {
    if (!isEnabled || !slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getDiagnosticResult(slug);
      
      if (result) {
        setContent(result.diagnostic);
        setShowModal(true);
      } else {
        setError('Diagnostic non disponible pour le moment');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du diagnostic:', error);
      setError('Erreur lors du chargement du diagnostic');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (!isEnabled) {
      return `Voir le résultat de mon diagnostic (${countdown}s)`;
    }
    if (isLoading) {
      return 'Chargement...';
    }
    return 'Voir le résultat de mon diagnostic';
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!isEnabled || isLoading}
        className={`inline-flex items-center gap-2 font-medium transition-all duration-300 text-sm sm:text-base px-3 py-1.5 rounded-lg ${
          isEnabled && !isLoading
            ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer'
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        {getButtonText()}
      </button>

      {/* Message d'erreur */}
      {error && (
        <div className="mt-2 text-xs text-red-600">
          {error}
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
    </>
  );
}