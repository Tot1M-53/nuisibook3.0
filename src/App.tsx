import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useUrlParams } from './hooks/useUrlParams';
import { PACK_TYPES, BookingData } from './types/booking';
import { validateForm, isFormValid } from './utils/validation';
import ValidatedSteps from './components/ValidatedSteps';
import UserInfoForm from './components/UserInfoForm';
import AddressForm from './components/AddressForm';
import DateSelector from './components/DateSelector';
import TimeSelector from './components/TimeSelector';
import BookingSummary from './components/BookingSummary';
import CompanyInfo from './components/CompanyInfo';
import TrustpilotWidget from './components/TrustpilotWidget';

export default function App() {
  const { getParam } = useUrlParams();
  
  // Get pack type from URL slug
  const slug = getParam('slug') || 'rongeur';
  const showCompany = getParam('company') === 'true';
  const selectedPack = PACK_TYPES[slug] || PACK_TYPES['rongeur'];

  // Form state
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});

  const allFormData = { ...formData, ...addressData };

  // Validate form on changes, but only show errors for fields that have been interacted with
  useEffect(() => {
    const newErrors = validateForm(allFormData);
    const filteredErrors: Record<string, string> = {};
    
    Object.keys(newErrors).forEach(key => {
      if (hasInteracted[key]) {
        filteredErrors[key] = newErrors[key];
      }
    });
    
    setErrors(filteredErrors);
  }, [allFormData, hasInteracted]);

  const handleInputChange = (field: string, value: string) => {
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
    
    // Mark field as interacted
    setHasInteracted(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleSubmit = async () => {
    // Mark all fields as interacted to show validation errors
    const allFields = ['prenom', 'nom', 'email', 'telephone', 'adresse', 'ville', 'code_postal'];
    const newHasInteracted: Record<string, boolean> = {};
    allFields.forEach(field => {
      newHasInteracted[field] = true;
    });
    setHasInteracted(newHasInteracted);

    if (!isFormValid(allFormData, selectedDate, selectedTime)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData: BookingData = {
        ...allFormData,
        date_rdv: format(selectedDate!, 'yyyy-MM-dd'),
        heure_rdv: selectedTime,
        slug: selectedPack.slug
      };

      // Log the booking data for now (can be replaced with actual API call)
      console.log('Booking data:', bookingData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to validation page
      window.location.href = 'https://www.nuisibook.com/validation-du-rdv';
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = isFormValid(allFormData, selectedDate, selectedTime);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Validated Steps */}
            <ValidatedSteps selectedPack={selectedPack} />

            {/* User Information Form */}
            <UserInfoForm
              formData={formData}
              showCompany={showCompany}
              onInputChange={handleInputChange}
              errors={errors}
            />

            {/* Address Form */}
            <AddressForm
              formData={addressData}
              onInputChange={handleInputChange}
              errors={errors}
            />

            {/* Date Selection */}
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            {/* Time Selection */}
            {selectedDate && (
              <TimeSelector
                selectedTime={selectedTime}
                selectedPack={selectedPack}
                onTimeSelect={setSelectedTime}
              />
            )}

            {/* Trustpilot Widget */}
            <TrustpilotWidget />

            {/* Company Info */}
            <CompanyInfo />

            {/* Mobile Summary (collapsible) */}
            <div className="lg:hidden">
              <BookingSummary
                selectedPack={selectedPack}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                address={addressData.adresse}
                city={addressData.ville}
                isCollapsed={summaryCollapsed}
                onToggleCollapse={() => setSummaryCollapsed(!summaryCollapsed)}
              />
            </div>

            {/* Confirmation Button - Mobile */}
            <div className="lg:hidden pb-4">
              <button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                  isValid && !isSubmitting
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirmation en cours...
                  </div>
                ) : (
                  'Confirmer mon rendez-vous'
                )}
              </button>
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block space-y-6">
            <div className="sticky top-8 space-y-6">
              <BookingSummary
                selectedPack={selectedPack}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                address={addressData.adresse}
                city={addressData.ville}
              />

              {/* Confirmation Button - Desktop */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                  isValid && !isSubmitting
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirmation en cours...
                  </div>
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