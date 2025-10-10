-- Add Ink NFT Collections
-- Total: 5 NFTs (1 FREE, 4 paid)
-- Run this in Supabase SQL Editor

-- First, add 'ink' to the network_type enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'ink' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'network_type')
  ) THEN
    ALTER TYPE network_type ADD VALUE 'ink';
  END IF;
END $$;

-- 1. Kaito (Paid: 0.0001 ETH)
INSERT INTO public.nfts (
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
  visible,
  created_at
) VALUES (
  'Kaito',
  'Kaito NFT collection on Ink network',
  'ink',
  '0x55100E0B0c5338EDD08249528282C8dAd092A732',
  '1',
  'ERC-721',
  'https://kaito-b093o3.nfts2.me/',
  'https://via.placeholder.com/400x400/667eea/ffffff?text=Kaito',
  0.0001,
  ARRAY['kaito', 'art', 'ink']::text[],
  true,
  NOW()
);

-- 2. Shani (Paid: 0.000001 ETH)
INSERT INTO public.nfts (
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
  visible,
  created_at
) VALUES (
  'Shani',
  'Shani NFT collection on Ink network',
  'ink',
  '0xb138a2a0D04430cB2F9B22a1955EA6957ba3c36b',
  '1',
  'ERC-721',
  'https://shani-6rnoqo.nfts2.me/',
  'https://via.placeholder.com/400x400/764ba2/ffffff?text=Shani',
  0.000001,
  ARRAY['shani', 'art', 'ink']::text[],
  true,
  NOW()
);

-- 3. Eldrin (FREE - price_eth = 0)
INSERT INTO public.nfts (
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
  visible,
  created_at
) VALUES (
  'Eldrin',
  'Eldrin NFT collection on Ink network - Free mint!',
  'ink',
  '0xAc58CEcDB702d376aE7cd644bE42c27542cB6a12',
  '1',
  'ERC-721',
  'https://radiant-eldrin.nfts2.me/',
  'https://via.placeholder.com/400x400/f66d9b/ffffff?text=Eldrin',
  0,
  ARRAY['eldrin', 'free', 'art', 'ink']::text[],
  true,
  NOW()
);

-- 4. Borin (Paid: 0.00001 ETH)
INSERT INTO public.nfts (
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
  visible,
  created_at
) VALUES (
  'Borin',
  'Borin NFT collection on Ink network',
  'ink',
  '0x09ccA1E380406488217B9fDdE7a91571155a0127',
  '1',
  'ERC-721',
  'https://borin.nfts2.me/',
  'https://via.placeholder.com/400x400/f093fb/ffffff?text=Borin',
  0.00001,
  ARRAY['borin', 'art', 'ink']::text[],
  true,
  NOW()
);

-- 5. Seraphina (Paid: 0.00002 ETH)
INSERT INTO public.nfts (
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
  visible,
  created_at
) VALUES (
  'Seraphina',
  'Seraphina NFT collection on Ink network',
  'ink',
  '0x4eA24780f322aB128e97ABa1986De23D22068545',
  '1',
  'ERC-721',
  'https://bright-seraphina.nfts2.me/',
  'https://via.placeholder.com/400x400/4facfe/ffffff?text=Seraphina',
  0.00002,
  ARRAY['seraphina', 'art', 'ink']::text[],
  true,
  NOW()
);

-- Verify the insertions
SELECT 
  id,
  title,
  network,
  contract_address,
  price_eth,
  external_link
FROM nfts 
WHERE network = 'ink'
ORDER BY price_eth ASC;

-- Summary
-- Total Ink NFTs: 5
-- FREE: 1 (Eldrin - price_eth = 0)
-- Paid: 4 (Shani, Borin, Seraphina, Kaito)
-- Price range: 0.000001 - 0.0001 ETH
