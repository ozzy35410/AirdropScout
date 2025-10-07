-- Update Darth Sidious NFT with missing link
-- Run this in Supabase SQL Editor

UPDATE nfts 
SET 
  external_link = 'https://cosmic-darth-sidious.nfts2.me/',
  price_eth = '0.00002'
WHERE title = 'Darth Sidious';

-- Verify the update
SELECT 
  title,
  network,
  contract_address,
  price_eth,
  external_link,
  visible
FROM nfts 
WHERE network = 'base'
ORDER BY created_at DESC;
