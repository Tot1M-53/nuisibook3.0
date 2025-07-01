import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useUrlParams } from './hooks/useUrlParams';
import { PACK_TYPES, BookingData } from './types/booking';
import { validateForm, isFormValid } from './utils/validation';
import { createBooking, BookingError } from './services/bookingService';
import { testConnection } from './lib/supabase';
import ValidatedSteps from './components/ValidatedSteps';
import UserInfoForm from './components/UserInfoForm';
import AddressForm from './components/AddressForm';
import DateSelector from './components/DateSelector';
import TimeSelector from './components/TimeSelector';
import BookingSummary from './components/BookingSummary';
import CompanyInfo from './components/CompanyInfo';
import TrustpilotWidget from './components/TrustpilotWidget';
import ConnectionStatus from './components/ConnectionStatus';

export default function App() {
  const { getParam } = useUrlParams();
  
  // Récupérer les paramètres depuis l'URL
  const nuisible = getParam('nuisible') || 'rongeurs';
  const urlSlug = getParam('slug') || '';
  const showCompany = getParam('company') === 'true';
  
  // Utiliser le paramètre nuisible pour déterminer le pack
  const selectedPack = PACK_TYPES[nuisible] || PACK_TYPES['rongeurs'];

  // État du formulaire
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    societe: '',
    email: '',
    telephone: ''
  });

  const [addressData, setAddressData] = useState({
    adresse: '',
    ville: '',
    code_postal: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isFlexible, setIsFlexible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(2);

  const allFormData = { ...formData, ...addressData };

  // Tester la connexion Supabase au montage
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testConnection();
        setConnectionStatus(result.success ? 'connected' : 'error');
        if (!result.success) {
          console.error('Échec de la connexion Supabase:', result.message);
        }
      } catch (error) {
        console.error('Erreur lors du test de connexion:', error);
        setConnectionStatus('error');
      }
    };
    
    checkConnection();
  }, []);

  // Gérer le décompte de redirection
  useEffect(() => {
    if (isRedirecting && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isRedirecting && redirectCountdown === 0) {
      // Ouvrir dans une nouvelle fenêtre
      window.open('https://www.nuisibook.com/validation-du-rdv', '_blank');
    }
  }, [isRedirecting, redirectCountdown]);

  // Valider le formulaire lors des changements
  useEffect(() => {
    try {
      const newErrors = validateForm(allFormData);
      const filteredErrors: Record<string, string> = {};
      
      Object.keys(newErrors).forEach(key => {
        if (hasInteracted[key]) {
          filteredErrors[key] = newErrors[key];
        }
      });
      
      setErrors(filteredErrors);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    }
  }, [allFormData, hasInteracted]);

  // Réinitialiser la date et l'heure si flexible
  useEffect(() => {
    if (isFlexible) {
      setSelectedDate(null);
      setSelectedTime('');
    }
  }, [isFlexible]);

  const handleInputChange = (field: string, value: string) => {
    try {
      if (['adresse', 'ville', 'code_postal'].includes(field)) {
        setAddressData(prev => ({
          ...prev,
          [field]: value
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      }
      
      // Marquer le champ comme ayant été modifié
      setHasInteracted(prev => ({
        ...prev,
        [field]: true
      }));

      // Effacer le statut de soumission quand l'utilisateur recommence à éditer
      if (submitStatus !== 'idle') {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }
    } catch (error) {
      console.error('Erreur lors du changement d\'input:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Marquer tous les champs comme ayant été modifiés
      const allFields = ['prenom', 'nom', 'email', 'telephone', 'adresse', 'ville', 'code_postal'];
      const newHasInteracted: Record<string, boolean> = {};
      allFields.forEach(field => {
        newHasInteracted[field] = true;
      });
      setHasInteracted(newHasInteracted);

      // Validation adaptée selon le mode flexible
      const isValidForm = isFormValid(allFormData, isFlexible ? new Date() : selectedDate, isFlexible ? 'flexible' : selectedTime);
      
      if (!isValidForm) {
        setSubmitStatus('error');
        setSubmitMessage('Veuillez corriger les erreurs dans le formulaire');
        return;
      }

      if (connectionStatus !== 'connected') {
        setSubmitStatus('error');
        setSubmitMessage('Problème de connexion à la base de données. Veuillez vérifier votre configuration Supabase.');
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus('idle');

      const bookingData: BookingData = {
        prenom: allFormData.prenom,
        nom: allFormData.nom,
        societe: allFormData.societe || undefined,
        email: allFormData.email,
        telephone: allFormData.telephone,
        adresse: allFormData.adresse,
        ville: allFormData.ville,
        code_postal: allFormData.code_postal,
        date_rdv: isFlexible ? 'flexible' : format(selectedDate!, 'yyyy-MM-dd'),
        heure_rdv: isFlexible ? 'flexible' : selectedTime,
        slug: urlSlug, // Utiliser le slug de l'URL
        nuisible: nuisible // Ajouter le type de nuisible
      };

      console.log('Soumission des données de réservation:', bookingData);

      // Soumettre à Supabase
      const result = await createBooking(bookingData);
      console.log('Réservation créée avec succès:', result);

      setSubmitStatus('success');
      setSubmitMessage(isFlexible 
        ? 'Demande enregistrée ! Le professionnel vous contactera pour fixer le rendez-vous.'
        : 'Rendez-vous confirmé avec succès !'
      );
      setIsRedirecting(true);
      setRedirectCountdown(2); // Réinitialiser le décompte

    } catch (error) {
      console.error('Erreur lors de la soumission de la réservation:', error);
      
      let errorMessage = 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
      
      if (error instanceof BookingError) {
        errorMessage = error.message;
      }
      
      setSubmitStatus('error');
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation adaptée selon le mode flexible
  const isValid = isFormValid(allFormData, isFlexible ? new Date() : selectedDate, isFlexible ? 'flexible' : selectedTime);

  // Affichage du loader de redirection
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isFlexible ? 'Demande enregistrée !' : 'Rendez-vous confirmé !'}
            </h2>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {isFlexible 
                ? 'Le professionnel vous contactera pour fixer le rendez-vous.'
                : 'Votre demande a été enregistrée avec succès.'
              }
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p>Ouverture de la page de validation dans {redirectCountdown} seconde{redirectCountdown > 1 ? 's' : ''}...</p>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Une nouvelle fenêtre va s'ouvrir automatiquement
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Statut de connexion */}
        <ConnectionStatus status={connectionStatus} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 pb-32 lg:pb-0">
            {/* Message de statut de soumission */}
            {submitStatus !== 'idle' && (
              <div className={`rounded-2xl p-4 sm:p-6 border ${
                submitStatus === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <p className={`text-sm sm:text-base ${
                    submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {submitMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Étapes validées */}
            <ValidatedSteps selectedPack={selectedPack} />

            {/* Formulaire d'informations utilisateur */}
            <UserInfoForm
              formData={formData}
              showCompany={showCompany}
              onInputChange={handleInputChange}
              errors={errors}
            />

            {/* Formulaire d'adresse */}
            <AddressForm
              formData={addressData}
              onInputChange={handleInputChange}
              errors={errors}
            />

            {/* Sélection de date */}
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              isFlexible={isFlexible}
              onFlexibleChange={setIsFlexible}
            />

            {/* Sélection d'heure */}
            {(selectedDate || isFlexible) && (
              <TimeSelector
                selectedTime={selectedTime}
                selectedPack={selectedPack}
                onTimeSelect={setSelectedTime}
                isFlexible={isFlexible}
              />
            )}

            {/* Widget Trustpilot */}
            <TrustpilotWidget />

            {/* Informations sur l'entreprise */}
            <CompanyInfo />
          </div>

          {/* Barre latérale - Desktop */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-8 space-y-6">
              <BookingSummary
                selectedPack={selectedPack}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                address={addressData.adresse}
                city={addressData.ville}
                isFlexible={isFlexible}
              />

              {/* Bouton de confirmation - Desktop */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting || connectionStatus !== 'connected'}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                  isValid && !isSubmitting && connectionStatus === 'connected'
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirmation en cours...
                  </div>
                ) : connectionStatus !== 'connected' ? (
                  'Connexion en cours...'
                ) : isFlexible ? (
                  'Enregistrer ma demande'
                ) : (
                  'Confirmer mon rendez-vous'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Interface mobile fixe en bas */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          {/* Résumé mobile (pliable) */}
          <div className={`transition-all duration-300 ${summaryCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-96 overflow-y-auto'}`}>
            <div className="p-4 border-b border-gray-100">
              <BookingSummary
                selectedPack={selectedPack}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                address={addressData.adresse}
                city={addressData.ville}
                isCollapsed={false}
                isFlexible={isFlexible}
              />
            </div>
          </div>

          {/* Barre de contrôle */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSummaryCollapsed(!summaryCollapsed)}
                className="flex-shrink-0 text-blue-600 font-medium text-sm"
              >
                {summaryCollapsed ? 'Voir le récap' : 'Masquer'}
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting || connectionStatus !== 'connected'}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                  isValid && !isSubmitting && connectionStatus === 'connected'
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirmation...
                  </div>
                ) : connectionStatus !== 'connected' ? (
                  'Connexion...'
                ) : isFlexible ? (
                  'Enregistrer ma demande'
                ) : (
                  'Confirmer mon rendez-vous'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}