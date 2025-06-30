import React from 'react';
import { Star } from 'lucide-react';

export default function TrustpilotWidget() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-center gap-3">
        {/* Trustpilot Icon */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white fill-current" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-sm sm:text-base">Trustpilot</span>
            <div className="flex items-center gap-0.5 ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">4.8/5</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-3">
        <a 
          href="https://fr.trustpilot.com/review/nuisibook.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 transition-colors text-sm underline"
        >
          Voir tous les avis
        </a>
      </div>
    </div>
  );
}