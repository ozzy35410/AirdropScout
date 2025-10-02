/*
  # Address Submissions Table for "Send Token To Friends" Feature

  1. New Tables
    - `address_submissions`
      - `id` (uuid, primary key)
      - `address` (text, unique, not null) - EVM address submitted by users
      - `network` (text, not null) - Network identifier (pharos, giwa, base, sei)
      - `featured` (boolean, default false) - Whether address is featured
      - `created_at` (timestamptz) - Timestamp of submission
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `address_submissions` table
    - Add policy for anonymous users to insert addresses
    - Add policy for anyone to read addresses
    - Add policy for authenticated admins to update/delete

  3. Indexes
    - Index on network for faster filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS address_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text UNIQUE NOT NULL,
  network text NOT NULL DEFAULT 'pharos',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE address_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read address submissions"
  ON address_submissions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert address submissions"
  ON address_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update address submissions"
  ON address_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete address submissions"
  ON address_submissions
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_address_submissions_network
  ON address_submissions(network);

CREATE INDEX IF NOT EXISTS idx_address_submissions_created_at
  ON address_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_address_submissions_featured
  ON address_submissions(featured) WHERE featured = true;
