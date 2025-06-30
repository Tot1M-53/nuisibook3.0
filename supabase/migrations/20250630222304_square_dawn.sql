/*
  # Create pest control booking system

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `first_name` (text, required) - Customer first name
      - `last_name` (text, required) - Customer last name
      - `company` (text, optional) - Company name
      - `email` (text, required) - Email address
      - `phone` (text, required) - Phone number
      - `address` (text, required) - Street address
      - `city` (text, required) - City
      - `postal_code` (text, required) - Postal code
      - `appointment_date` (date, required) - Appointment date
      - `appointment_time` (text, required) - Appointment time slot
      - `treatment_type` (text, required) - Type of pest treatment
      - `status` (text, default 'pending') - Booking status
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for public insert access (customers can create bookings)
    - Add policy for authenticated users to read all bookings (admin access)
    - Add policy for authenticated users to update bookings (admin management)

  3. Indexes
    - Index on email for faster lookups
    - Index on appointment_date for scheduling queries
    - Index on status for filtering
</sql>

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  treatment_type text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create bookings (public booking form)
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all bookings (admin access)
CREATE POLICY "Authenticated users can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update bookings (admin management)
CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();