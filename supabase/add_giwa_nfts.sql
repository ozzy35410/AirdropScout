-- Add GIWA Testnet NFTs to Supabase
-- Run this in Supabase SQL Editor

-- 1. Airdrop Scout
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
  'Airdrop Scout',
  'Airdrop Scout NFT collection on GIWA Testnet',
  'giwa',
  '0xB406Eaa5C960003EB701FEEE24a5B4Abc58b4CC5',
  '1',
  'ERC-721',
  'https://airdrop-scout.testnet.nfts2.me/',
  'https://airdrop-scout.testnet.nfts2.me/preview.png',
  0.0000001,
  ARRAY['airdrop', 'scout', 'testnet']::text[],
  true,
  NOW()
);

-- 2. The Big Short (FREE)
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
  'The Big Short',
  'The Big Short NFT collection on GIWA Testnet (FREE)',
  'giwa',
  '0x31bd376731B5527421cA10c28D268be769d65768',
  '1',
  'ERC-721',
  'https://the-big-short.testnet.nfts2.me/',
  'https://the-big-short.testnet.nfts2.me/preview.png',
  0,
  ARRAY['movie', 'finance', 'free']::text[],
  true,
  NOW()
);

-- 3. Black Hole (FREE)
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
  'Black Hole',
  'Black Hole NFT collection on GIWA Testnet (FREE)',
  'giwa',
  '0xABf44B114760F13723f4314f60cA6F959cf7C8f5',
  '1',
  'ERC-721',
  'https://black-hole-3e28yv.testnet.nfts2.me/',
  'https://black-hole-3e28yv.testnet.nfts2.me/preview.png',
  0,
  ARRAY['space', 'science', 'astronomy', 'free']::text[],
  true,
  NOW()
);

-- 4. Lone in Space (FREE)
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
  'Lone in Space',
  'Lone in Space NFT collection on GIWA Testnet (FREE)',
  'giwa',
  '0xF598749E556BEF0940a217C1fFb32F7912Abb593',
  '1',
  'ERC-721',
  'https://lone-in-space.testnet.nfts2.me/',
  'https://lone-in-space.testnet.nfts2.me/preview.png',
  0,
  ARRAY['space', 'astronaut', 'sci-fi', 'free']::text[],
  true,
  NOW()
);

-- 5. The Cosmic Gazer (FREE)
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
  'The Cosmic Gazer',
  'The Cosmic Gazer NFT collection on GIWA Testnet (FREE)',
  'giwa',
  '0xA2663e8C2c38fe5E79d897fCa8136C7dD56b7Aa3',
  '1',
  'ERC-721',
  'https://the-cosmic-gazer.testnet.nfts2.me/',
  'https://the-cosmic-gazer.testnet.nfts2.me/preview.png',
  0,
  ARRAY['space', 'cosmic', 'astronomy', 'free']::text[],
  true,
  NOW()
);

-- 6. The Dragonheart Knight
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
  'The Dragonheart Knight',
  'The Dragonheart Knight NFT collection on GIWA Testnet',
  'giwa',
  '0xc11078e8e4C233E8E6C16Cda0D2c90C68145b51d',
  '1',
  'ERC-721',
  'https://the-dragonheart-knight.testnet.nfts2.me/',
  'https://the-dragonheart-knight.testnet.nfts2.me/preview.png',
  0.001,
  ARRAY['fantasy', 'knight', 'dragon', 'medieval']::text[],
  true,
  NOW()
);

-- 7. The Forest Nymph (FREE)
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
  'The Forest Nymph',
  'The Forest Nymph NFT collection on GIWA Testnet (FREE)',
  'giwa',
  '0xec3CA400738e54268bD15A4c1B6Dda8351c1a3d1',
  '1',
  'ERC-721',
  'https://the-forest-nymph.testnet.nfts2.me/',
  'https://the-forest-nymph.testnet.nfts2.me/preview.png',
  0,
  ARRAY['fantasy', 'nature', 'mythology', 'free']::text[],
  true,
  NOW()
);

-- 8. Captain Tentaclebeard
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
  'Captain Tentaclebeard',
  'Captain Tentaclebeard NFT collection on GIWA Testnet',
  'giwa',
  '0xC4f1DbDdeE8fc303335a5F3197D46026609C1895',
  '1',
  'ERC-721',
  'https://captain-tentaclebeard.testnet.nfts2.me/',
  'https://captain-tentaclebeard.testnet.nfts2.me/preview.png',
  0.0001,
  ARRAY['pirate', 'octopus', 'sea', 'adventure']::text[],
  true,
  NOW()
);

-- 9. The Clockwork Buccaneer
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
  'The Clockwork Buccaneer',
  'The Clockwork Buccaneer NFT collection on GIWA Testnet',
  'giwa',
  '0x13e076336b7F5e45B950ddAfEb79306E6aF7216D',
  '1',
  'ERC-721',
  'https://the-clockwork-buccaneer.testnet.nfts2.me/',
  'https://the-clockwork-buccaneer.testnet.nfts2.me/preview.png',
  0.000001,
  ARRAY['steampunk', 'pirate', 'clockwork', 'mechanical']::text[],
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
WHERE network = 'giwa'
ORDER BY created_at DESC;
