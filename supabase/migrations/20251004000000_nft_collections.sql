-- Create collections table for NFT admin
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chain TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  standard TEXT NOT NULL CHECK (standard IN ('erc721', 'erc1155')),
  contract TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  mint_url TEXT,
  image TEXT,
  start_block BIGINT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chain, slug)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_collections_chain ON public.collections(chain);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.collections
  FOR SELECT USING (true);

-- Only service role can insert/update/delete (handled by API with service key)
CREATE POLICY "Only service role can modify" ON public.collections
  FOR ALL USING (false);
