import React from 'react';
import { Building, ExternalLink } from 'lucide-react';

export default function CompanyInfo() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Building className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-green-800 mb-2 text-base sm:text-lg">
            Quelle entreprise viendra chez moi ?
          </h3>
          <p className="text-green-700 mb-4 text-sm sm:text-base leading-relaxed">
            Découvrez notre réseau d'entreprises partenaires certifiées et leurs zones d'intervention.
          </p>
          <a
            href="https://www.nuisibook.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-green-700 transition-all duration-300 shadow-sm text-sm sm:text-base"
          >
            En savoir plus
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}