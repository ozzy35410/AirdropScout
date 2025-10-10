-- Fix currency column and update view
-- Run this in Supabase SQL Editor

-- 1) Add currency column if not exists
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'ETH';

-- 2) Add start_block column for optimized event scanning
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS start_block BIGINT;

-- 3) Update currency for Pharos network (uses 'network' column, not 'chain')
UPDATE public.nfts
SET currency = 'PHRS'
WHERE LOWER(network::text) IN ('pharos', 'pharos-testnet');

-- 4) Update currency for GIWA network (uses ETH on Sepolia)
UPDATE public.nfts
SET currency = 'ETH'
WHERE LOWER(network::text) IN ('giwa', 'giwa-sepolia', 'giwa-testnet');

-- 5) Set default ETH for other networks if null
UPDATE public.nfts
SET currency = 'ETH'
WHERE currency IS NULL;

-- 6) Create or replace view to include new columns
CREATE OR REPLACE VIEW public.nfts_view AS
SELECT
  id,
  title,
  description,
  network::text as network,
  contract_address,
  token_id,
  token_standard,
  external_link,
  image_url,
  price_eth,
  tags,
  visible,
  created_at,
  updated_at,
  currency,           -- << NEW: Include currency in view
  start_block         -- << NEW: Include start_block for optimization
FROM public.nfts;

-- 7) Verify the updates
SELECT 
  title,
  network::text as network,
  currency,
  price_eth,
  start_block
FROM public.nfts
ORDER BY network, title;

-- Summary:
-- ✅ Currency column added with 'ETH' default
-- ✅ Pharos networks set to 'PHRS'
-- ✅ GIWA networks set to 'ETH' (Sepolia uses ETH)
-- ✅ start_block column added for RPC optimization
-- ✅ View updated to expose currency and start_block
