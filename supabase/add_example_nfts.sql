-- Add Darth Sidious and Saruman NFTs to database
-- Run this in Supabase SQL Editor: https://ulungobrkoxwrwaccfwm.supabase.co/project/ulungobrkoxwrwaccfwm/sql

INSERT INTO nfts (
  title,
  description,
  network,
  contract_address,
  token_id,
  token_standard,
  external_link,
  image_url,
  price_eth,
  tags,
  visible
) VALUES 
(
  'Darth Sidious',
  'Star Wars themed NFT collection. Previously minted with wallet 0x5583ba39732db8006938a83bf64bbb029a0b12a0',
  'base',
  '0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4',
  '1',
  'ERC-721',
  'https://cosmic-darth-sidious.nfts2.me/',
  null, -- Image URL will be auto-detected or can be added later
  '0.00002',
  ARRAY['star-wars', 'cosmic', 'character'],
  true
),
(
  'Saruman',
  'Lord of the Rings themed NFT collection. Previously minted with wallet 0x5583ba39732db8006938a83bf64bbb029a0b12a0',
  'base',
  '0x4a3991821402153c77ed25f7e054bB293759Ccad',
  '1',
  'ERC-721',
  'https://saruman.nfts2.me/',
  null, -- Image URL will be auto-detected or can be added later
  '0.00002',
  ARRAY['lotr', 'wizard', 'character'],
  true
);

-- Verify the NFTs were added
SELECT 
  id,
  title,
  network,
  contract_address,
  price_eth,
  external_link,
  created_at
FROM nfts 
WHERE title IN ('Darth Sidious', 'Saruman')
ORDER BY created_at DESC;
