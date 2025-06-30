/*
  # Création de la table des réservations de rendez-vous

  1. Nouvelle table
    - `rdv_bookings`
      - `id` (uuid, clé primaire)
      - `prenom` (text, requis) - Prénom du client
      - `nom` (text, requis) - Nom du client
      - `societe` (text, optionnel) - Nom de l'entreprise
      - `email` (text, requis) - Adresse email
      - `telephone` (text, requis) - Numéro de téléphone
      - `adresse` (text, requis) - Adresse d'intervention
      - `ville` (text, requis) - Ville
      - `code_postal` (text, requis) - Code postal
      - `date_rdv` (date, requis) - Date du rendez-vous
      - `heure_rdv` (text, requis) - Heure du rendez-vous
      - `slug` (text, requis) - Type de traitement
      - `statut` (text, défaut 'en_attente') - Statut de la réservation
      - `created_at` (timestamp) - Date de création
      - `updated_at` (timestamp) - Date de mise à jour

  2. Sécurité
    - Activation RLS sur la table `rdv_bookings`
    - Politique permettant à tous de créer des réservations (formulaire public)
    - Politique permettant aux utilisateurs authentifiés de lire toutes les réservations
    - Politique permettant aux utilisateurs authentifiés de modifier les réservations

  3. Performance
    - Index sur email, date de rendez-vous, statut et date de création
    - Trigger automatique pour mettre à jour `updated_at`
*/

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS rdv_bookings CASCADE;

-- Créer la table des réservations
CREATE TABLE rdv_bookings (
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
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirme', 'termine', 'annule')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE rdv_bookings ENABLE ROW LEVEL SECURITY;

-- Politique : Permettre à tous de créer des réservations (formulaire public)
CREATE POLICY "Tout le monde peut créer des réservations"
  ON rdv_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique : Permettre aux utilisateurs authentifiés de lire toutes les réservations
CREATE POLICY "Les utilisateurs authentifiés peuvent lire toutes les réservations"
  ON rdv_bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Politique : Permettre aux utilisateurs authentifiés de modifier les réservations
CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les réservations"
  ON rdv_bookings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_rdv_bookings_email ON rdv_bookings(email);
CREATE INDEX idx_rdv_bookings_date_rdv ON rdv_bookings(date_rdv);
CREATE INDEX idx_rdv_bookings_statut ON rdv_bookings(statut);
CREATE INDEX idx_rdv_bookings_created_at ON rdv_bookings(created_at);
CREATE INDEX idx_rdv_bookings_slug ON rdv_bookings(slug);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_rdv_bookings_updated_at
  BEFORE UPDATE ON rdv_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();