-- Add Optimism (OP) Network Support
-- Run this in Supabase SQL Editor

-- 1) Add 'op' to network_type enum (if using enum)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'op' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'network_type')
  ) THEN
    ALTER TYPE network_type ADD VALUE 'op';
  END IF;
END $$;

-- 2) Ensure currency column exists
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'ETH';

-- 3) Ensure start_block column exists for RPC optimization
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS start_block BIGINT;

-- 4) Add sample Optimism NFT (optional - remove if you'll add real ones)
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
  currency,
  tags,
  visible,
  created_at
) VALUES (
  'OP Explorer NFT',
  'Sample NFT collection on Optimism network - Free mint!',
  'op',
  '0x0000000000000000000000000000000000000000', -- Replace with real contract
  '1',
  'ERC-721',
  'https://optimism.io',
  'https://via.placeholder.com/400x400/FF0420/ffffff?text=Optimism',
  0, -- FREE
  'ETH',
  ARRAY['optimism', 'op', 'free', 'sample']::text[],
  true,
  NOW()
)
ON CONFLICT (contract_address, token_id, network) DO NOTHING;

-- 5) Verify OP network is ready
SELECT 
  id,
  title,
  network::text as network,
  contract_address,
  price_eth,
  currency,
  start_block,
  external_link
FROM public.nfts 
WHERE network = 'op'
ORDER BY created_at DESC;

-- Summary:
-- ✅ OP added to network_type enum
-- ✅ currency column exists (defaults to 'ETH')
-- ✅ start_block column exists for optimization
-- ✅ Sample OP NFT added (1 FREE NFT)
-- ✅ Ready to accept real Optimism NFT collections
