import React from 'react';
import { MapPin } from 'lucide-react';

interface AddressFormProps {
  formData: {
    adresse: string;
    ville: string;
    code_postal: string;
  };
  onInputChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function AddressForm({ formData, onInputChange, errors }: AddressFormProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <MapPin className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Adresse d'intervention</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse *
          </label>
          <input
            type="text"
            id="adresse"
            value={formData.adresse}
            onChange={(e) => onInputChange('adresse', e.target.value)}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base ${
              errors.adresse ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="123 rue de la République"
          />
          {errors.adresse && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.adresse}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
              Ville *
            </label>
            <input
              type="text"
              id="ville"
              value={formData.ville}
              onChange={(e) => onInputChange('ville', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base ${
                errors.ville ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Paris"
            />
            {errors.ville && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.ville}</p>
            )}
          </div>

          <div>
            <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700 mb-2">
              Code postal *
            </label>
            <input
              type="text"
              id="code_postal"
              value={formData.code_postal}
              onChange={(e) => onInputChange('code_postal', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base ${
                errors.code_postal ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="75001"
              maxLength={5}
            />
            {errors.code_postal && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.code_postal}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}