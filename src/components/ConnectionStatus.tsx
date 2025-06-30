import React from 'react';
import { WifiOff, Loader2, AlertTriangle } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'checking' | 'connected' | 'error';
}

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  if (status === 'connected') {
    return null; // Ne rien afficher quand connecté
  }

  return (
    <div className={`mb-4 rounded-2xl p-4 border ${
      status === 'checking' 
        ? 'bg-blue-50 border-blue-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-center gap-3">
        {status === 'checking' ? (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className={`text-sm sm:text-base font-medium ${
            status === 'checking' ? 'text-blue-800' : 'text-yellow-800'
          }`}>
            {status === 'checking' 
              ? 'Vérification de la connexion...' 
              : 'Configuration Supabase requise'
            }
          </p>
          {status === 'error' && (
            <p className="text-xs sm:text-sm text-yellow-700 mt-1">
              L'application fonctionne en mode démonstration. Pour activer la sauvegarde des données, configurez vos variables d'environnement Supabase.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}