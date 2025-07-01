import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getNextAvailability, formatAvailabilityDate, getCallbackTime, isDateAvailable } from '../utils/dateUtils';

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  isFlexible: boolean;
  onFlexibleChange: (flexible: boolean) => void;
}

export default function DateSelector({ selectedDate, onDateSelect, isFlexible, onFlexibleChange }: DateSelectorProps) {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const nextAvailability = getNextAvailability();
  const callbackTime = getCallbackTime();
  
  const startWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endWeek = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const weekDays = [];
  for (let day = startWeek; day <= endWeek; day = addDays(day, 1)) {
    weekDays.push(day);
  }
  
  const isDisabled = (date: Date) => {
    return !isDateAvailable(date, nextAvailability) || (isPast(date) && !isToday(date));
  };
  
  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
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

      {/* Option "Je ne sais pas encore" */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="flexible-date"
            checked={isFlexible}
            onChange={(e) => onFlexibleChange(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <div className="flex-1">
            <label htmlFor="flexible-date" className="font-medium text-gray-900 cursor-pointer">
              Je ne sais pas encore, je souhaite en discuter avec le professionnel
            </label>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Info className="w-4 h-4" />
                  <span>Plus d'infos</span>
                </button>
                
                {showTooltip && (
                  <div className="absolute bottom-full left-0 mb-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    <div className="mb-2">
                      <strong>Le professionnel vous recontactera avant le {callbackTime}</strong>
                    </div>
                    <p>
                      Il vous appellera pour fixer les derniers détails, confirmer l'intervention 
                      et potentiellement établir un devis personnalisé selon votre situation.
                    </p>
                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de date (masqué si flexible) */}
      <div className={`transition-all duration-300 ${isFlexible ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {isFlexible ? 'Date de votre session (optionnel)' : 'Date de votre session'}
          </h2>
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={goToPreviousWeek}
            disabled={isFlexible}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
            {format(currentWeek, 'MMMM yyyy', { locale: fr })}
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
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 mb-2 px-1">
                  {day}
                </div>
              ))}
              
              {weekDays.map((day) => {
                const disabled = isDisabled(day) || isFlexible;
                const selected = selectedDate && isSameDay(day, selectedDate);
                const isAvailable = isDateAvailable(day, nextAvailability);
                
                return (
                  <div key={day.toISOString()} className="text-center px-1">
                    <button
                      onClick={() => !disabled && onDateSelect(day)}
                      disabled={disabled}
                      className={`w-full py-3 sm:py-4 px-1 text-lg sm:text-xl font-semibold rounded-xl transition-all duration-300 min-h-[48px] sm:min-h-[56px] flex items-center justify-center relative ${
                        disabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selected
                          ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg'
                          : isAvailable
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-md border border-green-200'
                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
                      }`}
                    >
                      {format(day, 'd')}
                      {isAvailable && !disabled && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Créneaux disponibles (à partir du {format(nextAvailability, 'd MMMM', { locale: fr })})</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Les week-ends et jours fériés sont exclus
          </p>
        </div>
      </div>
    </div>
  );
}