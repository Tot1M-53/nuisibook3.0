/*
  # Création de la table diagnostics_results

  1. Nouvelle table
    - `diagnostics_results`
      - `slug` (text, clé primaire)
      - `diagnostic` (text, contenu HTML du diagnostic)

  2. Sécurité
    - Enable RLS sur `diagnostics_results` table
    - Add policy pour permettre la lecture publique
*/

CREATE TABLE IF NOT EXISTS diagnostics_results (
  slug text PRIMARY KEY,
  diagnostic text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE diagnostics_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON diagnostics_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_diagnostics_results_updated_at'
  ) THEN
    CREATE TRIGGER update_diagnostics_results_updated_at
      BEFORE UPDATE ON diagnostics_results
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;