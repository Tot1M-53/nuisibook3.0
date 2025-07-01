import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, Clock } from 'lucide-react';
import { format, addDays, isSameDay, isToday, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getNextAvailability, formatAvailabilityDate, getCallbackTime, isDateAvailable } from '../utils/dateUtils';

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  isFlexible: boolean;
  onFlexibleChange: (flexible: boolean) => void;
}

export default function DateSelector({ selectedDate, onDateSelect, isFlexible, onFlexibleChange }: DateSelectorProps) {
  const [currentStartDate, setCurrentStartDate] = React.useState(new Date());
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const nextAvailability = getNextAvailability();
  const callbackTime = getCallbackTime();
  
  // Générer 7 jours à partir de la date de début actuelle
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(currentStartDate, i));
  }
  
  const isDisabled = (date: Date) => {
    return !isDateAvailable(date, nextAvailability) || (isPast(date) && !isToday(date));
  };
  
  const goToPreviousWeek = () => {
    setCurrentStartDate(addDays(currentStartDate, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentStartDate(addDays(currentStartDate, 7));
  };

  // Obtenir le mois/année à afficher (basé sur la majorité des jours visibles)
  const getDisplayMonth = () => {
    const middleDay = weekDays[3]; // 4ème jour de la semaine affichée
    return format(middleDay, 'MMMM yyyy', { locale: fr });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      {/* Titre en haut du bloc */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Calendar className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Date de l'intervention souhaitée</h2>
      </div>

      {/* Prochaine disponibilité */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Prochaine disponibilité :</span>
        </div>
        <p className="text-blue-800 font-medium">
          {formatAvailabilityDate(nextAvailability)}
        </p>
      </div>

      {/* Option "Je ne sais pas encore" - Design amélioré */}
      <div className="mb-6">
        <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${
          isFlexible 
            ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-md' 
            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
        }`}>
          <div className="flex items-start gap-4">
            {/* Case à cocher personnalisée */}
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="checkbox"
                id="flexible-date"
                checked={isFlexible}
                onChange={(e) => onFlexibleChange(e.target.checked)}
                className="sr-only"
              />
              <label
                htmlFor="flexible-date"
                className={`flex items-center justify-center w-6 h-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  isFlexible
                    ? 'bg-gradient-to-r from-orange-400 to-amber-400 border-orange-400 shadow-lg'
                    : 'bg-white border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {isFlexible && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            </div>
            
            <div className="flex-1">
              <label htmlFor="flexible-date" className="block font-semibold text-gray-900 cursor-pointer mb-2">
                Je ne sais pas encore, je souhaite en discuter avec le professionnel
              </label>
              
              {/* Info-bulle améliorée */}
              <div className="relative inline-block">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    isFlexible
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span className="font-medium">Comment ça marche ?</span>
                </button>
                
                {showTooltip && (
                  <div className="absolute bottom-full left-0 mb-3 w-96 p-4 bg-gray-900 text-white text-sm rounded-xl shadow-2xl z-20">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-orange-300 mb-1">
                            Rappel prévu avant le {callbackTime}
                          </div>
                          <p className="text-gray-300 leading-relaxed">
                            Le professionnel vous contactera pendant les heures ouvrées (10h-18h) 
                            pour fixer ensemble la date et l'heure qui vous conviennent le mieux.
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-3">
                        <p className="text-gray-300 text-xs leading-relaxed">
                          Il pourra également établir un devis personnalisé selon votre situation 
                          et répondre à toutes vos questions avant l'intervention.
                        </p>
                      </div>
                    </div>
                    
                    {/* Flèche de l'info-bulle */}
                    <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
              
              {/* Message quand l'option est sélectionnée */}
              {isFlexible && (
                <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      Parfait ! Le professionnel vous contactera pour organiser le rendez-vous.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de date */}
      <div className={`transition-all duration-300 ${isFlexible ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={goToPreviousWeek}
            disabled={isFlexible}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
            {getDisplayMonth()}
          </h3>
          
          <button
            onClick={goToNextWeek}
            disabled={isFlexible}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[280px]">
              {weekDays.map((day, index) => {
                const dayName = format(day, 'EEE', { locale: fr });
                return (
                  <div key={`${day.toISOString()}-header`} className="text-center text-xs sm:text-sm font-medium text-gray-500 mb-2 px-1">
                    {dayName}
                  </div>
                );
              })}
              
              {weekDays.map((day) => {
                const disabled = isDisabled(day);
                const selected = selectedDate && isSameDay(day, selectedDate);
                const isAvailable = isDateAvailable(day, nextAvailability);
                
                return (
                  <div key={day.toISOString()} className="text-center px-1">
                    <button
                      onClick={() => !disabled && !isFlexible && onDateSelect(day)}
                      disabled={disabled || isFlexible}
                      className={`w-full py-3 sm:py-4 px-1 text-lg sm:text-xl font-semibold rounded-xl transition-all duration-300 min-h-[48px] sm:min-h-[56px] flex items-center justify-center ${
                        disabled || isFlexible
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selected
                          ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg transform scale-105'
                          : isAvailable
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-100 hover:shadow-sm'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}