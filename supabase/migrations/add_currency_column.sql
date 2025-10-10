-- Add currency column to NFTs table
-- This allows each NFT to specify its native token (ETH, PHRS, etc.)

-- Add currency column (default 'ETH' for backward compatibility)
ALTER TABLE public.nfts 
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'ETH';

-- Update Pharos NFTs to use PHRS
UPDATE public.nfts 
SET currency = 'PHRS' 
WHERE network = 'pharos';

-- Update GIWA NFTs to use GIWA token (if needed)
UPDATE public.nfts 
SET currency = 'GIWA' 
WHERE network = 'giwa';

-- Verify changes
SELECT 
  id,
  title,
  network,
  price_eth,
  currency,
  visible
FROM public.nfts 
WHERE network IN ('pharos', 'giwa')
ORDER BY network, created_at DESC;
