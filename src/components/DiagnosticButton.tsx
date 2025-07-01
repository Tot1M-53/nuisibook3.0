import React, { useState } from 'react';
import { Loader2, Clock, FileText, X } from 'lucide-react';
import { useDiagnostic } from '../hooks/useDiagnostic';

interface DiagnosticButtonProps {
  slug: string;
}

export default function DiagnosticButton({ slug }: DiagnosticButtonProps) {
  const { 
    isLoading, 
    isAvailable, 
    content, 
    error, 
    buttonEnabled, 
    countdown, 
    loadDiagnostic 
  } = useDiagnostic(slug);

  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (content) {
      setShowModal(true);
    } else {
      loadDiagnostic();
    }
  };

  const getButtonText = () => {
    if (!buttonEnabled) {
      return `Disponible dans ${countdown}s`;
    }
    if (isLoading) {
      return 'Chargement...';
    }
    if (content) {
      return 'Voir le résultat de mon diagnostic';
    }
    if (error) {
      return 'Réessayer';
    }
    return 'Voir le résultat de mon diagnostic';
  };

  const getButtonIcon = () => {
    if (!buttonEnabled) {
      return <Clock className="w-4 h-4" />;
    }
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!buttonEnabled || (isLoading && !content)}
        className={`inline-flex items-center gap-2 font-medium transition-all duration-300 text-sm sm:text-base px-3 py-1.5 rounded-lg ${
          !buttonEnabled
            ? 'text-gray-400 cursor-not-allowed'
            : content
            ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            : isAvailable
            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
            : error
            ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
        }`}
      >
        {getButtonIcon()}
        {getButtonText()}
      </button>

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
      {error && !showModal && (
        <div className="mt-2 text-xs text-red-600">
          {error}
        </div>
      )}
    </>
  );
}