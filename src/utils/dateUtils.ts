import { addDays, isWeekend, format, addHours, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
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

// Fonction pour calculer l'heure de rappel (maintenant + 6 heures ouvrées entre 10h-18h)
export function getCallbackTime(): string {
  const now = new Date();
  let workingHoursToAdd = 6;
  let callbackTime = new Date(now);
  
  // Fonction pour vérifier si c'est un jour ouvré
  const isWorkingDay = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const allHolidays = [...FRENCH_HOLIDAYS_2024, ...FRENCH_HOLIDAYS_2025];
    return !isWeekend(date) && !allHolidays.includes(dateStr);
  };
  
  // Si on n'est pas dans les heures ouvrées (10h-18h), aller au prochain créneau ouvré
  if (callbackTime.getHours() < 10) {
    callbackTime = setHours(setMinutes(setSeconds(setMilliseconds(callbackTime, 0), 0), 0), 10);
  } else if (callbackTime.getHours() >= 18) {
    // Aller au lendemain 10h
    callbackTime = addDays(callbackTime, 1);
    callbackTime = setHours(setMinutes(setSeconds(setMilliseconds(callbackTime, 0), 0), 0), 10);
  }
  
  // S'assurer qu'on est sur un jour ouvré
  while (!isWorkingDay(callbackTime)) {
    callbackTime = addDays(callbackTime, 1);
    callbackTime = setHours(setMinutes(setSeconds(setMilliseconds(callbackTime, 0), 0), 0), 10);
  }
  
  // Ajouter les 6 heures ouvrées
  while (workingHoursToAdd > 0) {
    // Si on peut ajouter des heures dans la journée actuelle (jusqu'à 18h)
    const hoursUntilEndOfDay = 18 - callbackTime.getHours();
    const hoursToAddToday = Math.min(workingHoursToAdd, hoursUntilEndOfDay);
    
    callbackTime = addHours(callbackTime, hoursToAddToday);
    workingHoursToAdd -= hoursToAddToday;
    
    // Si il reste des heures à ajouter, passer au jour ouvré suivant
    if (workingHoursToAdd > 0) {
      callbackTime = addDays(callbackTime, 1);
      callbackTime = setHours(setMinutes(setSeconds(setMilliseconds(callbackTime, 0), 0), 0), 10);
      
      // S'assurer qu'on est sur un jour ouvré
      while (!isWorkingDay(callbackTime)) {
        callbackTime = addDays(callbackTime, 1);
        callbackTime = setHours(setMinutes(setSeconds(setMilliseconds(callbackTime, 0), 0), 0), 10);
      }
    }
  }
  
  return format(callbackTime, 'EEEE d MMMM yyyy à HH:mm', { locale: fr });
}

// Fonction pour vérifier si une date est disponible (doit être >= à la prochaine disponibilité)
export function isDateAvailable(date: Date, minAvailability: Date): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  const minDateStr = format(minAvailability, 'yyyy-MM-dd');
  const allHolidays = [...FRENCH_HOLIDAYS_2024, ...FRENCH_HOLIDAYS_2025];
  
  return (
    dateStr >= minDateStr && // La date doit être >= à la date de disponibilité minimale
    !isWeekend(date) &&
    !allHolidays.includes(dateStr)
  );
}