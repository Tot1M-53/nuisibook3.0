/*
  # Fix RLS policies for rdv_bookings table - Handle existing policies

  1. Security Updates
    - Safely drop all existing policies using DO blocks
    - Create new permissive policies with proper checks
    - Ensure RLS is enabled

  2. Policies Created
    - INSERT: Allow all users (anon and authenticated) to create bookings
    - SELECT: Allow authenticated users to read all bookings
    - UPDATE: Allow authenticated users to update all bookings

  This migration ensures the booking form works properly while maintaining security.
*/

-- Use DO block to safely handle policy operations
DO $$ 
BEGIN
  -- Disable RLS temporarily to avoid conflicts during policy changes
  ALTER TABLE rdv_bookings DISABLE ROW LEVEL SECURITY;
  
  -- Drop all existing policies safely (ignore if they don't exist)
  BEGIN
    DROP POLICY IF EXISTS "Tout le monde peut créer des réservations" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent lire toutes les réservations" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent modifier les réservations" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Anyone can create bookings" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Authenticated users can read bookings" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Enable insert for all users" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Enable select for authenticated users" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Enable update for authenticated users" ON rdv_bookings;
  EXCEPTION
    WHEN undefined_object THEN NULL;
  END;
  
  -- Re-enable RLS
  ALTER TABLE rdv_bookings ENABLE ROW LEVEL SECURITY;
END $$;

-- Create new policies with checks to avoid duplicates
DO $$
BEGIN
  -- Policy for INSERT (allow all users including anonymous)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rdv_bookings' 
    AND policyname = 'Enable insert for all users'
  ) THEN
    CREATE POLICY "Enable insert for all users"
      ON rdv_bookings
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for SELECT (authenticated users only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rdv_bookings' 
    AND policyname = 'Enable select for authenticated users'
  ) THEN
    CREATE POLICY "Enable select for authenticated users"
      ON rdv_bookings
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for UPDATE (authenticated users only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'rdv_bookings' 
    AND policyname = 'Enable update for authenticated users'
  ) THEN
    CREATE POLICY "Enable update for authenticated users"
      ON rdv_bookings
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;