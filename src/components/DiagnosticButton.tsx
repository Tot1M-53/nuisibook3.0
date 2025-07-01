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

  // Nettoyer et structurer le contenu HTML
  const cleanAndStructureContent = (htmlContent: string) => {
    // Créer un élément temporaire pour parser le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Extraire le contenu structuré
    const sections: { type: string; content: string; icon?: React.ReactNode }[] = [];
    
    // Chercher les éléments spécifiques
    const h4Elements = tempDiv.querySelectorAll('h4');
    const ulElements = tempDiv.querySelectorAll('ul');
    const divElements = tempDiv.querySelectorAll('div[data-block="conseilx"], div[data-block="conseilfy"]');
    
    h4Elements.forEach((h4) => {
      const text = h4.textContent || '';
      if (text.includes('En attendant l\'intervention d\'un expert')) {
        sections.push({
          type: 'section-title',
          content: 'En attendant l\'intervention d\'un expert',
          icon: <User className="w-5 h-5 text-orange-600" />
        });
      }
    });
    
    // Traiter les listes
    ulElements.forEach((ul) => {
      const listItems = ul.querySelectorAll('li');
      listItems.forEach((li) => {
        const text = li.textContent || '';
        if (text.trim()) {
          sections.push({
            type: 'info',
            content: text.trim(),
            icon: <CheckCircle className="w-5 h-5 text-indigo-600" />
          });
        }
      });
    });
    
    // Traiter les conseils
    divElements.forEach((div) => {
      const text = div.textContent || '';
      if (text.includes('Conseil d\'expert')) {
        const content = text.replace('Conseil d\'expert', '').trim();
        sections.push({
          type: 'advice',
          content: content,
          icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
        });
      }
    });
    
    // Si aucune structure spécifique n'est trouvée, afficher le contenu brut nettoyé
    if (sections.length === 0) {
      const cleanText = tempDiv.textContent || htmlContent;
      const lines = cleanText.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.length > 0) {
          if (trimmed.includes('Conseil') || trimmed.includes('conseil')) {
            sections.push({
              type: 'advice',
              content: trimmed,
              icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
            });
          } else if (trimmed.includes('En attendant')) {
            sections.push({
              type: 'info',
              content: trimmed,
              icon: <CheckCircle className="w-5 h-5 text-indigo-600" />
            });
          } else {
            sections.push({
              type: 'text',
              content: trimmed
            });
          }
        }
      });
    }
    
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
                {/* Affichage du contenu HTML rendu */}
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#374151'
                  }}
                />
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