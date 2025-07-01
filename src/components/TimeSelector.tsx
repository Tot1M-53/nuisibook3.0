import React from 'react';
import { Clock } from 'lucide-react';
import { TIME_SLOTS, PackInfo } from '../types/booking';

interface TimeSelectorProps {
  selectedTime: string;
  selectedPack: PackInfo;
  onTimeSelect: (time: string) => void;
  isFlexible: boolean;
}

export default function TimeSelector({ selectedTime, selectedPack, onTimeSelect, isFlexible }: TimeSelectorProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all duration-300 ${
      isFlexible ? 'opacity-50 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {isFlexible ? 'Quelles sont vos disponibilités ? (optionnel)' : 'Quelles sont vos disponibilités ?'}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {TIME_SLOTS.map((time) => (
          <button
            key={time}
            onClick={() => !isFlexible && onTimeSelect(time)}
            disabled={isFlexible}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-300 border-2 text-sm sm:text-base ${
              selectedTime === time && !isFlexible
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white border-transparent'
                : isFlexible
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-700 mb-2">
          <strong>Durée de l'intervention :</strong> {selectedPack.duration}
        </p>
        <p className="text-xs sm:text-sm text-gray-700">
          {isFlexible 
            ? 'Le professionnel vous rappellera pour fixer ensemble la date et l\'heure qui vous conviennent le mieux.'
            : 'Le professionnel vous rappellera sous 24h pour confirmer les détails du rendez-vous.'
          }
        </p>
      </div>
    </div>
  );
}