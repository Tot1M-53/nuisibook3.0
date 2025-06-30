# Configuration Supabase - Liste de vérification

## 1. Vérifier les politiques RLS (Row Level Security)

Dans votre tableau de bord Supabase :

1. **Allez dans "Table Editor"** → Sélectionnez la table `rdv_bookings`
2. **Cliquez sur "RLS disabled"** (si affiché) pour activer RLS
3. **Vérifiez les politiques** dans l'onglet "Policies"

### Politiques requises :

- ✅ **INSERT** : "Enable insert for all users" (pour `anon` et `authenticated`)
- ✅ **SELECT** : "Enable select for authenticated users" (pour `authenticated`)
- ✅ **UPDATE** : "Enable update for authenticated users" (pour `authenticated`)

## 2. Vérifier la structure de la table

La table `rdv_bookings` doit avoir ces colonnes :

```sql
- id (uuid, primary key, default: gen_random_uuid())
- prenom (text, not null)
- nom (text, not null)
- societe (text, nullable)
- email (text, not null)
- telephone (text, not null)
- adresse (text, not null)
- ville (text, not null)
- code_postal (text, not null)
- date_rdv (date, not null)
- heure_rdv (text, not null)
- slug (text, not null)
- statut (text, default: 'en_attente')
- created_at (timestamptz, default: now())
- updated_at (timestamptz, default: now())
```

## 3. Tester la connexion

1. **Dans Supabase** → "SQL Editor"
2. **Exécutez cette requête de test** :

```sql
SELECT COUNT(*) FROM rdv_bookings;
```

Si cela fonctionne, votre configuration est correcte.

## 4. Vérifier les variables d'environnement

Dans votre projet Supabase :

1. **Settings** → **API**
2. **Copiez exactement** :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

⚠️ **Important** : N'utilisez JAMAIS la clé `service_role` dans le frontend !

## 5. Redéployer sur Netlify

Après avoir vérifié Supabase :

1. **Netlify** → Votre site → **Deploys**
2. **"Trigger deploy"** → **"Deploy site"**

## 6. Test final

Une fois redéployé, testez la création d'une réservation sur votre site en production.

## Dépannage

### Si vous voyez encore "Permissions insuffisantes" :

1. **Vérifiez que RLS est activé** sur la table
2. **Vérifiez les politiques** (surtout la politique INSERT pour `anon`)
3. **Vérifiez les variables d'environnement** sur Netlify
4. **Redéployez** le site

### Si les variables ne sont pas reconnues :

1. **Netlify** → **Site settings** → **Environment variables**
2. **Vérifiez l'orthographe exacte** :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Redéployez** après modification

### Pour tester localement :

Créez un fichier `.env` à la racine avec :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

## Commandes SQL utiles

### Vérifier les politiques existantes :
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'rdv_bookings';
```

### Vérifier si RLS est activé :
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'rdv_bookings';
```

### Voir toutes les réservations (en tant qu'admin) :
```sql
SELECT * FROM rdv_bookings ORDER BY created_at DESC;
```