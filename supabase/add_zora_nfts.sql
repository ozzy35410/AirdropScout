-- Add Zora NFTs to Supabase
-- Run this in Supabase SQL Editor

-- 1. icardi
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
  'icardi',
  'Noble Icardi NFT collection on Zora',
  'zora',
  '0xcFacFB1f046Ed00a27782e6A770F13adce1F97a0',
  '1',
  'ERC-721',
  'https://noble-icardi.nfts2.me/',
  'https://noble-icardi.nfts2.me/preview.png',
  0.00003,
  ARRAY['sports', 'football', 'celebrity']::text[],
  true,
  NOW()
);

-- 2. Darth Sidious
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
  'Darth Sidious',
  'Golden Darth Sidious - Star Wars themed NFT collection',
  'zora',
  '0xC151F61111A589b7ddAB4d1FEA5B8D61a7872eC6',
  '1',
  'ERC-721',
  'https://golden-darth-sidious.nfts2.me/',
  'https://golden-darth-sidious.nfts2.me/preview.png',
  0.00002,
  ARRAY['star-wars', 'movie', 'sci-fi']::text[],
  true,
  NOW()
);

-- 3. Master Yoda
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
  'Master Yoda',
  'Chic Master Yoda - Star Wars themed NFT collection',
  'zora',
  '0x24bF1C3Bd53bB630263c27E579CFafb15F699274',
  '1',
  'ERC-721',
  'https://chic-master-yoda.nfts2.me/',
  'https://chic-master-yoda.nfts2.me/preview.png',
  0.00001,
  ARRAY['star-wars', 'movie', 'sci-fi']::text[],
  true,
  NOW()
);

-- 4. Mace Windu
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
  'Mace Windu',
  'Mace Windu - Star Wars themed NFT collection',
  'zora',
  '0xD143aB3434056BE33c60EdD85cBeb0Ef06309eB4',
  '1',
  'ERC-721',
  'https://mace-windu.nfts2.me/',
  'https://mace-windu.nfts2.me/preview.png',
  0.00002,
  ARRAY['star-wars', 'movie', 'sci-fi']::text[],
  true,
  NOW()
);

-- 5. Bumblebee (FREE)
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
  'Bumblebee',
  'Bumblebee - Transformers themed NFT collection (FREE)',
  'zora',
  '0x904AfF06546B6C36E42C42B65f8461af2531cF36',
  '1',
  'ERC-721',
  'https://bumblebee.nfts2.me/',
  'https://bumblebee.nfts2.me/preview.png',
  0,
  ARRAY['transformers', 'movie', 'sci-fi', 'free']::text[],
  true,
  NOW()
);

-- 6. The Witcher
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
  'The Witcher',
  'Jazzy The Witcher - Fantasy themed NFT collection',
  'zora',
  '0xb8d1237E1fA4a8C292a63e31Fa7Da1127e5540a6',
  '1',
  'ERC-721',
  'https://jazzy-the-witcher.nfts2.me/',
  'https://jazzy-the-witcher.nfts2.me/preview.png',
  0.00001,
  ARRAY['fantasy', 'game', 'netflix']::text[],
  true,
  NOW()
);

-- 7. Yugioh
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
  'Yugioh',
  'Yugioh - Anime themed NFT collection',
  'zora',
  '0x3ad5B705DB271F1f216DD231dFeECaF728623D87',
  '1',
  'ERC-721',
  'https://yugioh.nfts2.me/',
  'https://yugioh.nfts2.me/preview.png',
  0.00001,
  ARRAY['anime', 'yugioh', 'trading-cards']::text[],
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
WHERE network = 'zora'
ORDER BY created_at DESC;
