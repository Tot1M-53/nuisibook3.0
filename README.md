# Nuisibook 3.0 - Interface de Réservation

## Configuration Netlify

Pour que l'application fonctionne correctement en production, vous devez configurer les variables d'environnement Supabase sur Netlify :

### Étapes de configuration :

1. **Accédez à votre tableau de bord Netlify**
   - Connectez-vous sur [netlify.com](https://netlify.com)
   - Sélectionnez votre site (nuisibook50)

2. **Configurez les variables d'environnement**
   - Allez dans "Site settings" > "Environment variables"
   - Cliquez sur "Add a variable"
   - Ajoutez ces deux variables :

   ```
   VITE_SUPABASE_URL = https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY = votre_cle_anonyme_supabase
   ```

3. **Redéployez le site**
   - Après avoir ajouté les variables, allez dans "Deploys"
   - Cliquez sur "Trigger deploy" > "Deploy site"

### Obtenir vos clés Supabase :

1. Connectez-vous sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans "Settings" > "API"
4. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### Vérification :

Une fois configuré, l'application :
- Ne devrait plus afficher "Permissions insuffisantes"
- Permettra de créer des réservations réelles
- Sauvegardera les données dans Supabase

## Développement local

Pour tester localement :

1. Créez un fichier `.env` à la racine :
   ```
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Structure du projet

- `src/components/` - Composants React
- `src/services/` - Services de données (Supabase)
- `src/types/` - Types TypeScript
- `src/utils/` - Utilitaires et validation
- `supabase/migrations/` - Migrations de base de données

## Base de données

La table `rdv_bookings` contient :
- Informations client (nom, prénom, email, téléphone)
- Adresse d'intervention
- Date et heure du rendez-vous
- Type de traitement (slug)
- Statut de la réservation

## Fonctionnalités

- ✅ Formulaire de réservation multi-étapes
- ✅ Validation en temps réel
- ✅ Sélection de date et heure
- ✅ Intégration Trustpilot
- ✅ Design responsive
- ✅ Gestion d'erreurs robuste
- ✅ Indicateur de statut de connexion