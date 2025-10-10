-- Add Pharos Testnet NFTs to Supabase
-- Run this in Supabase SQL Editor

-- 1. The Cyber Ninja (FREE)
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
  'The Cyber Ninja',
  'The Cyber Ninja NFT collection on Pharos Testnet (FREE)',
  'pharos',
  '0xf146688cE5BDf4284638b6C2fB09c3DDe70036bd',
  '1',
  'ERC-721',
  'https://the-cyber-ninja.testnet.nfts2.me/',
  'https://the-cyber-ninja.testnet.nfts2.me/preview.png',
  0,
  ARRAY['cyberpunk', 'ninja', 'futuristic', 'free']::text[],
  true,
  NOW()
);

-- 2. The Mountain Dweller (FREE)
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
  'The Mountain Dweller',
  'The Mountain Dweller NFT collection on Pharos Testnet (FREE)',
  'pharos',
  '0x9350Cb345a857aA5d0b225aD2A54660eC798b8a5',
  '1',
  'ERC-721',
  'https://the-mountain-dweller.testnet.nfts2.me/',
  'https://the-mountain-dweller.testnet.nfts2.me/preview.png',
  0,
  ARRAY['nature', 'mountain', 'fantasy', 'free']::text[],
  true,
  NOW()
);

-- 3. The Astral Sorceress
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
  'The Astral Sorceress',
  'The Astral Sorceress NFT collection on Pharos Testnet',
  'pharos',
  '0x1CFa91578e0Cfc7DCEed5dbB1b94aE8CAf7cE570',
  '1',
  'ERC-721',
  'https://the-astral-sorceress.testnet.nfts2.me/',
  'https://the-astral-sorceress.testnet.nfts2.me/preview.png',
  0.001,
  ARRAY['magic', 'sorceress', 'fantasy', 'astral']::text[],
  true,
  NOW()
);

-- 4. The Rogue Bard
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
  'The Rogue Bard',
  'The Rogue Bard NFT collection on Pharos Testnet',
  'pharos',
  '0xfCcA080b16DB399C7E9D65e4F41febABF8AD0B97',
  '1',
  'ERC-721',
  'https://the-rogue-bard.testnet.nfts2.me/',
  'https://the-rogue-bard.testnet.nfts2.me/preview.png',
  0.00001,
  ARRAY['bard', 'music', 'rogue', 'fantasy']::text[],
  true,
  NOW()
);

-- 5. The Alchemist's Apprentice
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
  'The Alchemist''s Apprentice',
  'The Alchemist''s Apprentice NFT collection on Pharos Testnet',
  'pharos',
  '0x470e02061aCe579d2f82b71FEB464E4A9dA48C72',
  '1',
  'ERC-721',
  'https://the-alchemist-s-apprentice.testnet.nfts2.me/',
  'https://the-alchemist-s-apprentice.testnet.nfts2.me/preview.png',
  0.000001,
  ARRAY['alchemy', 'apprentice', 'magic', 'fantasy']::text[],
  true,
  NOW()
);

-- 6. The Time Weaver
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
  'The Time Weaver',
  'The Time Weaver NFT collection on Pharos Testnet',
  'pharos',
  '0xf7D9cE2Db0e478fc7e57E09953f7ed810b424158',
  '1',
  'ERC-721',
  'https://the-time-weaver.testnet.nfts2.me/',
  'https://the-time-weaver.testnet.nfts2.me/preview.png',
  0.0000001,
  ARRAY['time', 'weaver', 'magic', 'fantasy']::text[],
  true,
  NOW()
);

-- 7. Akari
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
  'Akari',
  'Sleek Akari NFT collection on Pharos Testnet',
  'pharos',
  '0xBF46b7C92856866479ca8f1b4EBeae5be321c647',
  '1',
  'ERC-721',
  'https://sleek-akari.testnet.nfts2.me/',
  'https://sleek-akari.testnet.nfts2.me/preview.png',
  0.00000001,
  ARRAY['anime', 'character', 'sleek']::text[],
  true,
  NOW()
);

-- 8. Lyra
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
  'Lyra',
  'Lyra NFT collection on Pharos Testnet',
  'pharos',
  '0x97f0dF61D1afE00dc3c34Cf1647d8c7189034079',
  '1',
  'ERC-721',
  'https://n2m-lyra-7x5eeh.testnet.nfts2.me/',
  'https://n2m-lyra-7x5eeh.testnet.nfts2.me/preview.png',
  0.00000001,
  ARRAY['anime', 'character', 'music']::text[],
  true,
  NOW()
);

-- 9. Captain Blackwood (FREE)
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
  'Captain Blackwood',
  'Captain Blackwood NFT collection on Pharos Testnet (FREE)',
  'pharos',
  '0x5efFa16195983A5A4d78759400E4210666500D9c',
  '1',
  'ERC-721',
  'https://captain-blackwood.testnet.nfts2.me/',
  'https://captain-blackwood.testnet.nfts2.me/preview.png',
  0,
  ARRAY['pirate', 'captain', 'adventure', 'free']::text[],
  true,
  NOW()
);

-- Verify insertion
SELECT 
  id,
  title,
  network,
  contract_address,
  price_eth,
  visible
FROM public.nfts 
WHERE network = 'pharos'
ORDER BY created_at DESC;
