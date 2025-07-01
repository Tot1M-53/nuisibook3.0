import React, { useState, useEffect } from 'react';
import { Loader2, FileText, X, AlertTriangle, CheckCircle, Lightbulb, User } from 'lucide-react';
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

  // Parser le contenu du diagnostic pour l'affichage structuré
  const parseContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const sections: { type: string; content: string; icon?: React.ReactNode }[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('Traitement mécanique :')) {
        sections.push({
          type: 'treatment',
          content: trimmed.replace('Traitement mécanique :', '').trim(),
          icon: <CheckCircle className="w-5 h-5 text-green-600" />
        });
      } else if (trimmed.startsWith('Traitement chimique :')) {
        sections.push({
          type: 'treatment',
          content: trimmed.replace('Traitement chimique :', '').trim(),
          icon: <CheckCircle className="w-5 h-5 text-blue-600" />
        });
      } else if (trimmed.startsWith('Traitement préventif :')) {
        sections.push({
          type: 'treatment',
          content: trimmed.replace('Traitement préventif :', '').trim(),
          icon: <CheckCircle className="w-5 h-5 text-purple-600" />
        });
      } else if (trimmed.includes('Comment se passe une intervention ?')) {
        sections.push({
          type: 'section-title',
          content: 'Comment se passe une intervention ?',
          icon: <User className="w-5 h-5 text-orange-600" />
        });
      } else if (trimmed.startsWith('💡') || trimmed.includes('Conseil :')) {
        sections.push({
          type: 'advice',
          content: trimmed.replace('💡', '').replace('Conseil :', '').trim(),
          icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
        });
      } else if (trimmed.startsWith('⚠️') || trimmed.includes('diagnostic proposé par Nuisibook')) {
        sections.push({
          type: 'warning',
          content: trimmed.replace('⚠️', '').trim(),
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
        });
      } else if (trimmed.startsWith('🔍') || trimmed.includes('En attendant l\'intervention')) {
        sections.push({
          type: 'info',
          content: trimmed.replace('🔍', '').trim(),
          icon: <CheckCircle className="w-5 h-5 text-indigo-600" />
        });
      } else if (trimmed.length > 0 && !trimmed.startsWith('—')) {
        sections.push({
          type: 'text',
          content: trimmed
        });
      }
    });
    
    return sections;
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
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Résultat de votre diagnostic</h2>
                  <p className="text-sm text-gray-600">Analyse personnalisée de votre situation</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {parseContent(content).map((section, index) => {
                  if (section.type === 'treatment') {
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                        {section.icon}
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-800 mb-1">Traitement recommandé</h4>
                          <p className="text-green-700 text-sm leading-relaxed">{section.content}</p>
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'section-title') {
                    return (
                      <div key={index} className="flex items-center gap-3 mt-8 mb-4">
                        {section.icon}
                        <h3 className="text-lg font-semibold text-gray-900">{section.content}</h3>
                      </div>
                    );
                  }

                  if (section.type === 'advice') {
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        {section.icon}
                        <div className="flex-1">
                          <h4 className="font-semibold text-yellow-800 mb-1">Conseil d'expert</h4>
                          <p className="text-yellow-700 text-sm leading-relaxed">{section.content}</p>
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'warning') {
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        {section.icon}
                        <div className="flex-1">
                          <h4 className="font-semibold text-amber-800 mb-1">Information importante</h4>
                          <p className="text-amber-700 text-sm leading-relaxed">{section.content}</p>
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'info') {
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                        {section.icon}
                        <div className="flex-1">
                          <h4 className="font-semibold text-indigo-800 mb-1">En attendant l'intervention</h4>
                          <p className="text-indigo-700 text-sm leading-relaxed">{section.content}</p>
                        </div>
                      </div>
                    );
                  }

                  if (section.type === 'text') {
                    return (
                      <div key={index} className="text-gray-700 text-sm leading-relaxed">
                        {section.content}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500">
                Diagnostic généré automatiquement • Nuisibook
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
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