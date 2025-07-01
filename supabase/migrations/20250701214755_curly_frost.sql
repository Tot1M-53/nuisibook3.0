/*
  # Création de la table diagnostics_results

  1. Nouvelle table
    - `diagnostics_results`
      - `slug` (text, clé primaire)
      - `diagnostic` (text, contenu HTML du diagnostic)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Activer RLS sur la table `diagnostics_results`
    - Ajouter une politique de lecture pour tous les utilisateurs

  3. Trigger
    - Ajouter un trigger pour mettre à jour `updated_at`
*/

-- Créer la table diagnostics_results
CREATE TABLE IF NOT EXISTS diagnostics_results (
  slug text PRIMARY KEY,
  diagnostic text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE diagnostics_results ENABLE ROW LEVEL SECURITY;

-- Créer la politique de lecture pour tous les utilisateurs
CREATE POLICY "Enable read access for all users"
  ON diagnostics_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ajouter le trigger pour updated_at (utilise la fonction existante)
CREATE TRIGGER update_diagnostics_results_updated_at
  BEFORE UPDATE ON diagnostics_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ajouter également la colonne nuisible à la table rdv_bookings si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rdv_bookings' AND column_name = 'nuisible'
  ) THEN
    ALTER TABLE rdv_bookings ADD COLUMN nuisible text;
  END IF;
END $$;