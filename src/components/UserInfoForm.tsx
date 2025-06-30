import React from 'react';
import { User, Building2, Phone, Mail } from 'lucide-react';

interface UserInfoFormProps {
  formData: {
    prenom: string;
    nom: string;
    societe: string;
    email: string;
    telephone: string;
  };
  showCompany: boolean;
  onInputChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function UserInfoForm({
  formData,
  showCompany,
  onInputChange,
  errors
}: UserInfoFormProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Vos informations</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              id="prenom"
              value={formData.prenom}
              onChange={(e) => onInputChange('prenom', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base ${
                errors.prenom ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Votre prénom"
            />
            {errors.prenom && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.prenom}</p>
            )}
          </div>

          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              id="nom"
              value={formData.nom}
              onChange={(e) => onInputChange('nom', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base ${
                errors.nom ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Votre nom"
            />
            {errors.nom && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nom}</p>
            )}
          </div>
        </div>

        {showCompany && (
          <div>
            <label htmlFor="societe" className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Société
            </label>
            <input
              type="text"
              id="societe"
              value={formData.societe}
              onChange={(e) => onInputChange('societe', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base"
              placeholder="Nom de votre société (optionnel)"
            />
          </div>
        )}

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Téléphone *
          </label>
          <div className="flex">
            <div className="flex items-center px-3 py-2.5 sm:py-3 border border-gray-200 rounded-l-xl bg-gray-50 border-r-0 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent focus-within:bg-white">
              <span className="text-lg mr-1">🇫🇷</span>
              <span className="text-sm sm:text-base text-gray-600">+33</span>
            </div>
            <input
              type="tel"
              id="telephone"
              value={formData.telephone}
              onChange={(e) => onInputChange('telephone', e.target.value)}
              className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border rounded-r-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base ${
                errors.telephone ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="6 12 34 56 78"
              maxLength={10}
            />
          </div>
          {errors.telephone && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.telephone}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm sm:text-base ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="votre@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}