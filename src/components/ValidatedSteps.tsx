import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { PackInfo } from '../types/booking';
import DiagnosticButton from './DiagnosticButton';
import { useUrlParams } from '../hooks/useUrlParams';

interface ValidatedStepsProps {
  selectedPack: PackInfo;
}

export default function ValidatedSteps({ selectedPack }: ValidatedStepsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { getParam } = useUrlParams();
  const urlSlug = getParam('slug') || '';
  
  // Vérifier si le diagnostic a été ignoré
  const isIgnoredDiagnostic = urlSlug.startsWith('igno');

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Pack Selection Step */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 leading-tight">{selectedPack.name}</h3>
            <p className="text-gray-600 mb-3 text-sm sm:text-base leading-relaxed">
              Vous avez sélectionné le pack traitement {selectedPack.slug.replace('-', ' ')} Nuisibook
            </p>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm sm:text-base"
            >
              détails
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {showDetails && (
              <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Ce qui est inclus :</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Validation du diagnostic et du devis</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Confirmation de la méthode de traitement utilisée</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{selectedPack.specificTreatment}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Rapport d'intervention et conseil pour éviter toute récidive</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Suivi par des équipes Nuisibook à la suite de l'intervention</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diagnostic Step - Conditionnel selon si ignoré ou non */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
            isIgnoredDiagnostic 
              ? 'bg-orange-500' 
              : 'bg-green-500'
          }`}>
            {isIgnoredDiagnostic ? (
              <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Check className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 leading-tight">
              {isIgnoredDiagnostic ? 'Analyse de votre situation' : 'Analyse de votre situation'}
            </h3>
            
            {isIgnoredDiagnostic ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-orange-600 font-medium text-sm sm:text-base">En cours</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Le professionnel vous appellera pour bien comprendre la situation et la demande
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-2 text-sm sm:text-base leading-relaxed">
                  Vous avez envoyé le détail de votre problème
                </p>
                <DiagnosticButton slug={urlSlug} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}