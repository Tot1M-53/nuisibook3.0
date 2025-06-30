import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { PackInfo } from '../types/booking';

interface ValidatedStepsProps {
  selectedPack: PackInfo;
}

// Contenu personnalisable pour chaque pack
const PACK_DETAILS: Record<string, string[]> = {
  'rongeur': [
    'Inspection complète des lieux',
    'Identification des points d\'entrée',
    'Pose d\'appâts sécurisés',
    'Traitement par gel professionnel',
    'Conseils de prévention personnalisés',
    'Garantie de résultat 3 mois'
  ],
  'blattes-cafards': [
    'Diagnostic approfondi de l\'infestation',
    'Traitement par gel insecticide longue durée',
    'Pulvérisation dans les zones critiques',
    'Pose de pièges moniteurs',
    'Plan de prévention sur mesure',
    'Suivi et garantie 6 mois'
  ],
  'punaises-de-lit': [
    'Inspection minutieuse de la literie',
    'Traitement thermique haute température',
    'Pulvérisation insecticide résiduelle',
    'Traitement des textiles et mobilier',
    'Protocole de préparation détaillé',
    'Garantie totale 12 mois'
  ],
  'guepes-frelons': [
    'Localisation précise du nid',
    'Équipement de protection intégral',
    'Destruction complète du nid',
    'Enlèvement sécurisé des résidus',
    'Traitement préventif de la zone',
    'Intervention d\'urgence possible'
  ]
};

export default function ValidatedSteps({ selectedPack }: ValidatedStepsProps) {
  const [showDetails, setShowDetails] = useState(false);

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
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Ce qui est inclus dans votre intervention :</h4>
                <ul className="space-y-2">
                  {PACK_DETAILS[selectedPack.slug]?.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diagnostic Step */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 leading-tight">Analyse de votre situation</h3>
            <p className="text-gray-600 mb-2 text-sm sm:text-base leading-relaxed">
              Vous avez envoyé le détail de votre problème
            </p>
            <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm sm:text-base">
              voir le résultat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}