-- Add imageUrl and price_eth columns to nfts table

-- Add imageUrl column
ALTER TABLE nfts 
ADD COLUMN IF NOT EXISTS image_url text;

-- Add price_eth column
ALTER TABLE nfts 
ADD COLUMN IF NOT EXISTS price_eth decimal(18, 8);

-- Add index for price queries
CREATE INDEX IF NOT EXISTS idx_nfts_price ON nfts(price_eth) WHERE price_eth IS NOT NULL;

-- Update existing enum to include new networks
DO $$
BEGIN
    -- Add 'sei', 'giwa', 'pharos', 'soneium' to network_type enum
    ALTER TYPE network_type ADD VALUE IF NOT EXISTS 'sei';
    ALTER TYPE network_type ADD VALUE IF NOT EXISTS 'giwa';
    ALTER TYPE network_type ADD VALUE IF NOT EXISTS 'pharos';
    ALTER TYPE network_type ADD VALUE IF NOT EXISTS 'soneium';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Comment on columns
COMMENT ON COLUMN nfts.image_url IS 'URL to the NFT image or thumbnail';
COMMENT ON COLUMN nfts.price_eth IS 'Price in ETH (up to 18 decimals)';
