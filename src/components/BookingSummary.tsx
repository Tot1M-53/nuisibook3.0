import React from 'react';
import { Bug, Shield, Zap, Calendar, MapPin, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PackInfo } from '../types/booking';

interface BookingSummaryProps {
  selectedPack: PackInfo;
  selectedDate: Date | null;
  selectedTime: string;
  address: string;
  city: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const getPackIcon = (slug: string) => {
  switch (slug) {
    case 'blattes-cafards':
      return <Bug className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'punaises-de-lit':
      return <Shield className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'guepes-frelons':
      return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />;
    default:
      return <Bug className="w-4 h-4 sm:w-5 sm:h-5" />;
  }
};

export default function BookingSummary({
  selectedPack,
  selectedDate,
  selectedTime,
  address,
  city,
  isCollapsed = false,
  onToggleCollapse
}: BookingSummaryProps) {
  const content = (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          {getPackIcon(selectedPack.slug)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Type de pack</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{selectedPack.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Résultat du diagnostic</h3>
          <p className="text-xs sm:text-sm text-gray-600">Problème identifié</p>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Date et horaire</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}, {selectedTime}
            </p>
          </div>
        </div>
      )}

      {address && city && (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Adresse</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{address}, {city}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Récapitulatif</h2>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-blue-600 font-medium lg:hidden text-sm sm:text-base"
          >
            {isCollapsed ? 'Afficher' : 'Masquer'}
          </button>
        )}
      </div>

      {!isCollapsed && content}
    </div>
  );
}