-- ================================================
-- Supabase RLS Policy for NFTs Table
-- ================================================
-- Run this in Supabase SQL Editor if NFTs are not visible
-- Dashboard: https://ulungobrkoxwrwaccfwm.supabase.co/project/ulungobrkoxwrwaccfwm/sql

-- Enable Row Level Security on nfts table
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access for visible NFTs
CREATE POLICY "Public read access for visible NFTs"
ON public.nfts
FOR SELECT
TO anon, authenticated
USING (visible = true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'nfts';
