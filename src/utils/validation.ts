export interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}

export function validateForm(formData: any): FormErrors {
  const errors: FormErrors = {};

  // Required fields validation
  if (!formData.first_name?.trim()) {
    errors.first_name = 'Le prénom est requis';
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = 'Le nom est requis';
  }

  if (!formData.email?.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Format d\'email invalide';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Le téléphone est requis';
  } else if (!/^[0-9\s\-\+\(\)]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Format de téléphone invalide';
  }

  if (!formData.address?.trim()) {
    errors.address = 'L\'adresse est requise';
  }

  if (!formData.city?.trim()) {
    errors.city = 'La ville est requise';
  }

  if (!formData.postal_code?.trim()) {
    errors.postal_code = 'Le code postal est requis';
  } else if (!/^[0-9]{5}$/.test(formData.postal_code)) {
    errors.postal_code = 'Le code postal doit contenir 5 chiffres';
  }

  return errors;
}

export function isFormValid(formData: any, selectedDate: Date | null, selectedTime: string): boolean {
  const errors = validateForm(formData);
  const hasErrors = Object.keys(errors).length > 0;
  const hasDateTime = selectedDate && selectedTime;
  
  return !hasErrors && !!hasDateTime;
}