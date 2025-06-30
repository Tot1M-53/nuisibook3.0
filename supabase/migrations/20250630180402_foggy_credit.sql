/*
  # Create booking appointments table

  1. New Tables
    - `rdv_bookings`
      - `id` (uuid, primary key)
      - `prenom` (text, required) - First name
      - `nom` (text, required) - Last name  
      - `societe` (text, optional) - Company name
      - `email` (text, required) - Email address
      - `telephone` (text, required) - Phone number
      - `adresse` (text, required) - Street address
      - `ville` (text, required) - City
      - `code_postal` (text, required) - Postal code
      - `date_rdv` (date, required) - Appointment date
      - `heure_rdv` (text, required) - Appointment time
      - `slug` (text, required) - Treatment type slug
      - `created_at` (timestamp) - Creation timestamp

  2. Security
    - Enable RLS on `rdv_bookings` table
    - Add policy for public insert access (no auth required for bookings)
    - Add policy for authenticated users to read all bookings (admin access)
*/

CREATE TABLE IF NOT EXISTS rdv_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom text NOT NULL,
  nom text NOT NULL,
  societe text,
  email text NOT NULL,
  telephone text NOT NULL,
  adresse text NOT NULL,
  ville text NOT NULL,
  code_postal text NOT NULL,
  date_rdv date NOT NULL,
  heure_rdv text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rdv_bookings ENABLE ROW LEVEL SECURITY;

-- Allow public to insert bookings (no authentication required)
CREATE POLICY "Anyone can create bookings"
  ON rdv_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all bookings (admin access)
CREATE POLICY "Authenticated users can read bookings"
  ON rdv_bookings
  FOR SELECT
  TO authenticated
  USING (true);