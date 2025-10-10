-- Add Base Network NFTs to Supabase
-- Run this in Supabase SQL Editor

-- 1. Metamask
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
  'Metamask',
  'Great Metamask NFT collection on Base',
  'base',
  '0x09c6d9afe2f098b19C5A3d855a00F12D212ED216',
  '1',
  'ERC-721',
  'https://great-metamask.nfts2.me/',
  'https://great-metamask.nfts2.me/preview.png',
  0.00001,
  ARRAY['metamask', 'wallet', 'crypto']::text[],
  true,
  NOW()
);

-- 2. pixelart2
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
  'pixelart2',
  'Pixel Art NFT collection on Base',
  'base',
  '0xd0d6912ff69834B6189D844e47B46E235F61e277',
  '1',
  'ERC-721',
  'https://pixelart2.nfts2.me/',
  'https://pixelart2.nfts2.me/preview.png',
  0.00002,
  ARRAY['pixel-art', 'art', 'retro']::text[],
  true,
  NOW()
);

-- 3. pixelart1
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
  'pixelart1',
  'Pixel Art NFT collection on Base',
  'base',
  '0x716dF63b11E270c2BDE8Ba1c68Bbba49D43C0FA8',
  '1',
  'ERC-721',
  'https://pixelart1.nfts2.me/',
  'https://pixelart1.nfts2.me/preview.png',
  0.000001,
  ARRAY['pixel-art', 'art', 'retro']::text[],
  true,
  NOW()
);

-- 4. Your Son Made it Mama
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
  'Your Son Made it Mama',
  'Motivational NFT collection on Base',
  'base',
  '0x11b2C072834b1f3e97440cD5f4f024F54A35f7A5',
  '1',
  'ERC-721',
  'https://your-son-made-it-mama.nfts2.me/',
  'https://your-son-made-it-mama.nfts2.me/preview.png',
  0.00001,
  ARRAY['motivation', 'family', 'success']::text[],
  true,
  NOW()
);

-- 5. GRAVES
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
  'GRAVES',
  'GRAVES NFT collection on Base',
  'base',
  '0x15Fe7DF8050B60bc4FED30ab56C5FCe86f9FB292',
  '1',
  'ERC-721',
  'https://graves.nfts2.me/',
  'https://graves.nfts2.me/preview.png',
  0.00001,
  ARRAY['gaming', 'esports']::text[],
  true,
  NOW()
);

-- 6. ders programi (FREE)
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
  'ders programi',
  'School Schedule NFT collection on Base (FREE)',
  'base',
  '0x8dad2C484f358C4876EB72d93896ea7F088d2E73',
  '1',
  'ERC-721',
  'https://ders-programi.nfts2.me/',
  'https://ders-programi.nfts2.me/preview.png',
  0,
  ARRAY['education', 'school', 'free']::text[],
  true,
  NOW()
);

-- 7. Patrick (FREE)
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
  'Patrick',
  'Fun Patrick NFT collection on Base (FREE)',
  'base',
  '0x46E5f5343aC97713822Cfe5d34AEd5e53F10d623',
  '1',
  'ERC-721',
  'https://fun-patrick.nfts2.me/',
  'https://fun-patrick.nfts2.me/preview.png',
  0,
  ARRAY['cartoon', 'spongebob', 'fun', 'free']::text[],
  true,
  NOW()
);

-- 8. Liberal Demokrat Parti
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
  'Liberal Demokrat Parti',
  'Liberal Democrat Party NFT collection on Base',
  'base',
  '0x38F1028Fb7C283041aC5d8178CDA0F19C7D8d2fe',
  '1',
  'ERC-721',
  'https://liberal-demokrat-parti.nfts2.me/',
  'https://liberal-demokrat-parti.nfts2.me/preview.png',
  0.00002,
  ARRAY['politics', 'turkey', 'party']::text[],
  true,
  NOW()
);

-- 9. 8000 times free Rigby (FREE)
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
  '8000 times free Rigby',
  '8000 times free Rigby NFT collection on Base (FREE)',
  'base',
  '0x89Bd8167A05e786fEeF36B411825F55255844f8C',
  '1',
  'ERC-721',
  'https://8000-times-free-rigby.nfts2.me/',
  'https://8000-times-free-rigby.nfts2.me/preview.png',
  0,
  ARRAY['cartoon', 'regular-show', 'rigby', 'free']::text[],
  true,
  NOW()
);

-- 10. Phoenix
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
  'Phoenix',
  'Phoenix NFT collection on Base',
  'base',
  '0x83c9f116143C2067AA7f6c313e8664e1B48b2C6D',
  '1',
  'ERC-721',
  'https://phoenixx.nfts2.me/',
  'https://phoenixx.nfts2.me/preview.png',
  0.00001,
  ARRAY['mythical', 'bird', 'fantasy']::text[],
  true,
  NOW()
);

-- 11. Cak Beslik Hayalet
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
  'Cak Beslik Hayalet',
  'Cak Beslik Ghost NFT collection on Base',
  'base',
  '0x29F44e70C2EdD71D8cfe6394a85E1D446712776B',
  '1',
  'ERC-721',
  'https://cak-beslik-hayalet.nfts2.me/',
  'https://cak-beslik-hayalet.nfts2.me/preview.png',
  0.00002,
  ARRAY['ghost', 'horror', 'turkish']::text[],
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
WHERE network = 'base'
ORDER BY created_at DESC;
