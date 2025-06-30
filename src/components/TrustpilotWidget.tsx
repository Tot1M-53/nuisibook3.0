import React, { useEffect } from 'react';

export default function TrustpilotWidget() {
  useEffect(() => {
    // Initialize Trustpilot widget after component mounts
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(document.getElementById('trustpilot-widget'));
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Avis clients vérifiés
        </h3>
        
        {/* TrustBox widget - Micro Star */}
        <div 
          id="trustpilot-widget"
          className="trustpilot-widget" 
          data-locale="fr-FR" 
          data-template-id="5419b732fbfb950b10de65e5" 
          data-businessunit-id="682a431dda567151e6b37290" 
          data-style-height="24px" 
          data-style-width="100%"
        >
          <a 
            href="https://fr.trustpilot.com/review/nuisibook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors text-sm underline"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface to include Trustpilot
declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: HTMLElement | null) => void;
    };
  }
}