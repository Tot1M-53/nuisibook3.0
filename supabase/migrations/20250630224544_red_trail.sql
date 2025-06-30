/*
  # Correction des politiques RLS pour les réservations

  1. Corrections
    - Supprimer les anciennes politiques
    - Créer de nouvelles politiques plus permissives pour les insertions publiques
    - Maintenir la sécurité pour la lecture et modification

  2. Politiques
    - Permettre à tous (anon et authenticated) d'insérer des réservations
    - Permettre aux utilisateurs authentifiés de lire toutes les réservations
    - Permettre aux utilisateurs authentifiés de modifier les réservations
*/

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Tout le monde peut créer des réservations" ON rdv_bookings;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent lire toutes les réservations" ON rdv_bookings;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent modifier les réservations" ON rdv_bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON rdv_bookings;
DROP POLICY IF EXISTS "Authenticated users can read bookings" ON rdv_bookings;

-- Créer de nouvelles politiques plus permissives
CREATE POLICY "Enable insert for all users"
  ON rdv_bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users"
  ON rdv_bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users"
  ON rdv_bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Vérifier que RLS est activé
ALTER TABLE rdv_bookings ENABLE ROW LEVEL SECURITY;