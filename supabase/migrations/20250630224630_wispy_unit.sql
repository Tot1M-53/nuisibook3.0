/*
  # Corriger les politiques RLS pour permettre les réservations

  1. Corrections
    - Supprimer les politiques existantes avec les noms exacts
    - Créer de nouvelles politiques plus permissives
    - Permettre les insertions pour tous les utilisateurs (anon et authenticated)
    - Maintenir l'accès en lecture/modification pour les utilisateurs authentifiés

  2. Sécurité
    - RLS reste activé
    - Politiques simplifiées et plus permissives pour les insertions
*/

-- Supprimer les politiques existantes avec les noms exacts du schéma
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent lire toutes les réserva" ON rdv_bookings;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent modifier les réservatio" ON rdv_bookings;
DROP POLICY IF EXISTS "Tout le monde peut créer des réservations" ON rdv_bookings;

-- Créer de nouvelles politiques plus permissives
CREATE POLICY "Enable insert for all users"
  ON rdv_bookings
  FOR INSERT
  TO anon, authenticated
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

-- S'assurer que RLS est activé
ALTER TABLE rdv_bookings ENABLE ROW LEVEL SECURITY;