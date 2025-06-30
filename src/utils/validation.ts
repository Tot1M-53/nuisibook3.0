export interface FormErrors {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
}

export function validateForm(formData: any): FormErrors {
  const errors: FormErrors = {};

  // Required fields validation
  if (!formData.prenom?.trim()) {
    errors.prenom = 'Le prénom est requis';
  }

  if (!formData.nom?.trim()) {
    errors.nom = 'Le nom est requis';
  }

  if (!formData.email?.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Format d\'email invalide';
  }

  if (!formData.telephone?.trim()) {
    errors.telephone = 'Le téléphone est requis';
  } else if (!/^[0-9\s\-\+\(\)]{8,}$/.test(formData.telephone.replace(/\s/g, ''))) {
    errors.telephone = 'Format de téléphone invalide';
  }

  if (!formData.adresse?.trim()) {
    errors.adresse = 'L\'adresse est requise';
  }

  if (!formData.ville?.trim()) {
    errors.ville = 'La ville est requise';
  }

  if (!formData.code_postal?.trim()) {
    errors.code_postal = 'Le code postal est requis';
  } else if (!/^[0-9]{5}$/.test(formData.code_postal)) {
    errors.code_postal = 'Le code postal doit contenir 5 chiffres';
  }

  return errors;
}

export function isFormValid(formData: any, selectedDate: Date | null, selectedTime: string): boolean {
  const errors = validateForm(formData);
  const hasErrors = Object.keys(errors).length > 0;
  const hasDateTime = selectedDate && selectedTime;
  
  return !hasErrors && !!hasDateTime;
}