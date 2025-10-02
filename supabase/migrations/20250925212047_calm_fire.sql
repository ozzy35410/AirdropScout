/*
  # Create NFTs table for listing platform

  1. New Tables
    - `nfts`
      - `id` (uuid, primary key)
      - `title` (text, required) - NFT display name
      - `description` (text, optional) - NFT description
      - `network` (text, required) - blockchain network (linea, zksync, base, scroll, zora)
      - `contract_address` (text, required) - smart contract address
      - `token_id` (text, required) - token identifier
      - `token_standard` (text, required) - ERC-721 or ERC-1155
      - `external_link` (text, optional) - marketplace or project link
      - `tags` (text array, optional) - searchable tags
      - `visible` (boolean, default true) - public visibility
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `nfts` table
    - Add policy for public read access to visible NFTs
    - Add policy for authenticated users to manage NFTs (admin functionality)

  3. Indexes
    - Index on network for filtering
    - Index on visible for public queries
    - Index on contract_address and token_id for ownership checks
    - Index on created_at for sorting
*/

-- Create enum for supported networks
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'network_type') THEN
        CREATE TYPE network_type AS ENUM ('linea', 'zksync', 'base', 'scroll', 'zora');
    END IF;
END $$;

-- Create enum for token standards
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_standard_type') THEN
        CREATE TYPE token_standard_type AS ENUM ('ERC-721', 'ERC-1155');
    END IF;
END $$;

-- Create NFTs table
CREATE TABLE IF NOT EXISTS nfts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    network network_type NOT NULL,
    contract_address text NOT NULL,
    token_id text NOT NULL,
    token_standard token_standard_type NOT NULL DEFAULT 'ERC-721',
    external_link text,
    tags text[] DEFAULT '{}',
    visible boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_nfts_network ON nfts(network);
CREATE INDEX IF NOT EXISTS idx_nfts_visible ON nfts(visible);
CREATE INDEX IF NOT EXISTS idx_nfts_contract_token ON nfts(contract_address, token_id);
CREATE INDEX IF NOT EXISTS idx_nfts_created_at ON nfts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nfts_network_visible ON nfts(network, visible);

-- Create unique constraint on contract_address + token_id to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_nfts_unique_token 
ON nfts(contract_address, token_id, network);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_nfts_updated_at') THEN
        CREATE TRIGGER update_nfts_updated_at
            BEFORE UPDATE ON nfts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read visible NFTs
CREATE POLICY "Anyone can read visible NFTs"
    ON nfts
    FOR SELECT
    USING (visible = true);

-- Policy: Authenticated users can read all NFTs (for admin)
CREATE POLICY "Authenticated users can read all NFTs"
    ON nfts
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Authenticated users can insert NFTs (admin functionality)
CREATE POLICY "Authenticated users can insert NFTs"
    ON nfts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Authenticated users can update NFTs (admin functionality)
CREATE POLICY "Authenticated users can update NFTs"
    ON nfts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated users can delete NFTs (admin functionality)
CREATE POLICY "Authenticated users can delete NFTs"
    ON nfts
    FOR DELETE
    TO authenticated
    USING (true);

-- Insert some sample data for testing (optional - remove in production)
INSERT INTO nfts (
    title,
    description,
    network,
    contract_address,
    token_id,
    token_standard,
    external_link,
    tags,
    visible
) VALUES 
(
    'Cool Art #123',
    'A beautiful piece of digital art from the Cool Art collection',
    'base',
    '0x1234567890123456789012345678901234567890',
    '123',
    'ERC-721',
    'https://opensea.io/assets/base/0x1234567890123456789012345678901234567890/123',
    ARRAY['art', 'collectible', 'digital'],
    true
),
(
    'Zora Genesis',
    'First edition from the Zora Genesis collection',
    'zora',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '1',
    'ERC-721',
    'https://zora.co/collect/0xabcdefabcdefabcdefabcdefabcdefabcdefabcd/1',
    ARRAY['genesis', 'rare', 'zora'],
    true
),
(
    'Linea Legends #456',
    'Legendary NFT from the Linea ecosystem',
    'linea',
    '0x9876543210987654321098765432109876543210',
    '456',
    'ERC-1155',
    'https://element.market/assets/linea/0x9876543210987654321098765432109876543210/456',
    ARRAY['legends', 'linea', 'gaming'],
    true
) ON CONFLICT (contract_address, token_id, network) DO NOTHING;