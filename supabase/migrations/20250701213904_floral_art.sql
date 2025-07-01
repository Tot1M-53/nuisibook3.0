/*
  # Create diagnostics_results table

  1. New Tables
    - `diagnostics_results`
      - `slug` (text, primary key) - Identifiant unique du diagnostic
      - `diagnostic` (text, not null) - Contenu HTML du résultat de diagnostic
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de dernière modification

  2. Security
    - Enable RLS on `diagnostics_results` table
    - Add policy for public read access (anon and authenticated users)

  3. Triggers
    - Use existing `update_updated_at_column()` function for automatic timestamp updates
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

-- Create policy for read access
CREATE POLICY "Enable read access for all users"
  ON diagnostics_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add trigger using the existing function
CREATE TRIGGER update_diagnostics_results_updated_at
  BEFORE UPDATE ON diagnostics_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();