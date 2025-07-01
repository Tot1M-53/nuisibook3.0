/*
  # Create diagnostics_results table

  1. New Tables
    - `diagnostics_results`
      - `slug` (text, primary key) - Identifiant unique du diagnostic
      - `diagnostic` (text, not null) - Contenu HTML du diagnostic
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de dernière modification

  2. Security
    - Enable RLS on `diagnostics_results` table
    - Add policy for read access to all users (anon and authenticated)

  3. Triggers
    - Add trigger to automatically update `updated_at` column
*/

-- Create the diagnostics_results table
CREATE TABLE IF NOT EXISTS diagnostics_results (
  slug text PRIMARY KEY,
  diagnostic text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE diagnostics_results ENABLE ROW LEVEL SECURITY;

-- Create policy for read access (drop if exists first)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'diagnostics_results' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    DROP POLICY "Enable read access for all users" ON diagnostics_results;
  END IF;
END $$;

CREATE POLICY "Enable read access for all users"
  ON diagnostics_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create or replace the update function if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Add trigger (drop if exists first)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_diagnostics_results_updated_at'
    AND event_object_table = 'diagnostics_results'
  ) THEN
    DROP TRIGGER update_diagnostics_results_updated_at ON diagnostics_results;
  END IF;
END $$;

CREATE TRIGGER update_diagnostics_results_updated_at
  BEFORE UPDATE ON diagnostics_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();