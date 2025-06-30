import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'checking' | 'connected' | 'error';
}

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  if (status === 'connected') {
    return null; // Don't show anything when connected
  }

  return (
    <div className={`mb-4 rounded-2xl p-4 border ${
      status === 'checking' 
        ? 'bg-blue-50 border-blue-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-3">
        {status === 'checking' ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-600 flex-shrink-0" />
        )}
        <p className={`text-sm sm:text-base ${
          status === 'checking' ? 'text-blue-800' : 'text-red-800'
        }`}>
          {status === 'checking' 
            ? 'Vérification de la connexion...' 
            : 'Problème de connexion à la base de données. Veuillez vérifier votre configuration Supabase.'
          }
        </p>
      </div>
    </div>
  );
}