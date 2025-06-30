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
  
  // Get pack type from URL slug
  const slug = getParam('slug') || 'rongeur';
  const showCompany = getParam('company') === 'true';
  const selectedPack = PACK_TYPES[slug] || PACK_TYPES['rongeur'];

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    phone: ''
  });

  const [addressData, setAddressData] = useState({
    address: '',
    city: '',
    postal_code: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const allFormData = { ...formData, ...addressData };

  // Test Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
      if (!result.success) {
        console.error('Supabase connection failed:', result.message);
      }
    };
    
    checkConnection();
  }, []);

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
    if (['address', 'city', 'postal_code'].includes(field)) {
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

    // Clear submit status when user starts editing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  const handleSubmit = async () => {
    // Mark all fields as interacted to show validation errors
    const allFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'postal_code'];
    const newHasInteracted: Record<string, boolean> = {};
    allFields.forEach(field => {
      newHasInteracted[field] = true;
    });
    setHasInteracted(newHasInteracted);

    if (!isFormValid(allFormData, selectedDate, selectedTime)) {
      setSubmitStatus('error');
      setSubmitMessage('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    if (connectionStatus !== 'connected') {
      setSubmitStatus('error');
      setSubmitMessage('Problème de connexion à la base de données. Veuillez réessayer.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const bookingData: BookingData = {
        first_name: allFormData.first_name,
        last_name: allFormData.last_name,
        company: allFormData.company || undefined,
        email: allFormData.email,
        phone: allFormData.phone,
        address: allFormData.address,
        city: allFormData.city,
        postal_code: allFormData.postal_code,
        appointment_date: format(selectedDate!, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        treatment_type: selectedPack.slug
      };

      console.log('Submitting booking data:', bookingData);

      // Submit to Supabase
      const result = await createBooking(bookingData);
      console.log('Booking created successfully:', result);

      setSubmitStatus('success');
      setSubmitMessage(`Votre rendez-vous a été confirmé avec succès ! Référence: ${result.id.slice(0, 8)}`);

      // Redirect to validation page after a short delay
      setTimeout(() => {
        window.location.href = 'https://www.nuisibook.com/validation-du-rdv';
      }, 3000);

    } catch (error) {
      console.error('Error submitting booking:', error);
      
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

  const isValid = isFormValid(allFormData, selectedDate, selectedTime);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Connection Status */}
        <ConnectionStatus status={connectionStatus} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Submit Status Message */}
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
                address={addressData.address}
                city={addressData.city}
                isCollapsed={summaryCollapsed}
                onToggleCollapse={() => setSummaryCollapsed(!summaryCollapsed)}
              />
            </div>

            {/* Confirmation Button - Mobile */}
            <div className="lg:hidden pb-4">
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
                address={addressData.address}
                city={addressData.city}
              />

              {/* Confirmation Button - Desktop */}
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