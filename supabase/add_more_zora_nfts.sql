-- Add Additional Zora Network NFTs to Supabase
-- Run this in Supabase SQL Editor (after the initial Zora NFTs)

-- 8. Finn the Human (FREE)
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
  'Finn the Human',
  'Finn the Human - Adventure Time themed NFT collection (FREE)',
  'zora',
  '0xe5855C96b5023e30ecDEB5Cc91764e4cb2Bfbc77',
  '1',
  'ERC-721',
  'https://finn-the-human.nfts2.me/',
  'https://finn-the-human.nfts2.me/preview.png',
  0,
  ARRAY['adventure-time', 'cartoon', 'free']::text[],
  true,
  NOW()
);

-- 9. Lisa Simpson (FREE)
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
  'Lisa Simpson',
  'Lisa Simpson - The Simpsons themed NFT collection (FREE)',
  'zora',
  '0x02427599c35F72926026d83cF42f762282230B05',
  '1',
  'ERC-721',
  'https://lisa-simpson.nfts2.me/',
  'https://lisa-simpson.nfts2.me/preview.png',
  0,
  ARRAY['simpsons', 'cartoon', 'tv-show', 'free']::text[],
  true,
  NOW()
);

-- 10. Maggie Simpson
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
  'Maggie Simpson',
  'Maggie Simpson - The Simpsons themed NFT collection',
  'zora',
  '0x2C3696a26223A7A3dC8aBE88F6F47ce9675d127F',
  '1',
  'ERC-721',
  'https://maggie-simpson.nfts2.me/',
  'https://maggie-simpson.nfts2.me/preview.png',
  0.000005,
  ARRAY['simpsons', 'cartoon', 'tv-show']::text[],
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
