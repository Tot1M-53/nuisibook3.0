import { addDays, isWeekend, format, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FRENCH_HOLIDAYS_2024, FRENCH_HOLIDAYS_2025 } from '../types/booking';

// Fonction pour calculer la prochaine disponibilité (2 jours ouvrés)
export function getNextAvailability(): Date {
  const today = new Date();
  let currentDate = addDays(today, 1); // Commencer à demain
  let workingDaysAdded = 0;
  
  const allHolidays = [...FRENCH_HOLIDAYS_2024, ...FRENCH_HOLIDAYS_2025];
  
  while (workingDaysAdded < 2) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Si ce n'est pas un weekend et pas un jour férié
    if (!isWeekend(currentDate) && !allHolidays.includes(dateStr)) {
      workingDaysAdded++;
    }
    
    // Si on n'a pas encore atteint 2 jours ouvrés, passer au jour suivant
    if (workingDaysAdded < 2) {
      currentDate = addDays(currentDate, 1);
    }
  }
  
  return currentDate;
}

// Fonction pour formater la date de disponibilité
export function formatAvailabilityDate(date: Date): string {
  return format(date, 'EEEE d MMMM yyyy', { locale: fr });
}

// Fonction pour calculer l'heure de rappel (maintenant + 6 heures ouvrées)
export function getCallbackTime(): string {
  const now = new Date();
  let callbackTime = addHours(now, 6);
  
  // Si on dépasse 18h, reporter au lendemain à 8h
  if (callbackTime.getHours() >= 18) {
    callbackTime = new Date(callbackTime);
    callbackTime.setDate(callbackTime.getDate() + 1);
    callbackTime.setHours(8, 0, 0, 0);
  }
  
  // Si c'est un weekend, reporter au lundi
  while (isWeekend(callbackTime)) {
    callbackTime = addDays(callbackTime, 1);
    callbackTime.setHours(8, 0, 0, 0);
  }
  
  return format(callbackTime, 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
}

// Fonction pour vérifier si une date est disponible
export function isDateAvailable(date: Date, minAvailability: Date): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  const allHolidays = [...FRENCH_HOLIDAYS_2024, ...FRENCH_HOLIDAYS_2025];
  
  return (
    date >= minAvailability &&
    !isWeekend(date) &&
    !allHolidays.includes(dateStr)
  );
}