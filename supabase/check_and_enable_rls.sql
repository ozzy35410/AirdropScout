-- Check if RLS is enabled and policies exist
-- Run in Supabase SQL Editor: https://ulungobrkoxwrwaccfwm.supabase.co/project/ulungobrkoxwrwaccfwm/sql

-- 1. Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'nfts';

-- 2. Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'nfts';

-- 3. If no policies exist, create them
-- Enable RLS (if not already enabled)
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid duplicates)
DROP POLICY IF EXISTS "Public read access for visible NFTs" ON public.nfts;

-- Create policy for public read access
CREATE POLICY "Public read access for visible NFTs"
ON public.nfts
FOR SELECT
TO anon, authenticated
USING (visible = true);

-- 4. Verify policy was created
SELECT policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'nfts';

-- 5. Test query (should return visible NFTs)
SELECT id, title, network, visible 
FROM public.nfts 
WHERE visible = true
ORDER BY created_at DESC;
