import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isPast, isWeekend, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FRENCH_HOLIDAYS_2024, FRENCH_HOLIDAYS_2025 } from '../types/booking';

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  
  const startWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endWeek = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const weekDays = [];
  for (let day = startWeek; day <= endWeek; day = addDays(day, 1)) {
    weekDays.push(day);
  }
  
  const allHolidays = [...FRENCH_HOLIDAYS_2024, ...FRENCH_HOLIDAYS_2025];
  
  const isHoliday = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return allHolidays.includes(dateStr);
  };
  
  const isDisabled = (date: Date) => {
    return isPast(date) && !isToday(date) || isWeekend(date) || isHoliday(date);
  };
  
  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Calendar className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Date de votre session</h2>
      </div>

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
        
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
          {format(currentWeek, 'MMMM yyyy', { locale: fr })}
        </h3>
        
        <button
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
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
              const disabled = isDisabled(day);
              const selected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <div key={day.toISOString()} className="text-center px-1">
                  <button
                    onClick={() => !disabled && onDateSelect(day)}
                    disabled={disabled}
                    className={`w-full py-3 sm:py-4 px-1 text-lg sm:text-xl font-semibold rounded-xl transition-all duration-300 min-h-[48px] sm:min-h-[56px] flex items-center justify-center ${
                      disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selected
                        ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md'
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

      <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
        Les week-ends et jours fériés sont exclus
      </p>
    </div>
  );
}