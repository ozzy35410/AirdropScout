import { createClient } from '@supabase/supabase-js';
import { Collection, NftStd } from '../config/collections';
import { ChainSlug } from '../config/chains';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Cache for collections (10-15 minutes)
const collectionsCache = new Map<string, { data: Collection[]; timestamp: number }>();
const CACHE_TTL = 12 * 60 * 1000; // 12 minutes

export async function getCollections(chain?: ChainSlug): Promise<Collection[]> {
  const cacheKey = chain || 'all';
  const cached = collectionsCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  let query = supabase.from('collections').select('*');
  
  if (chain) {
    query = query.eq('chain', chain);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching collections:', error);
    return [];
  }

  const collections: Collection[] = (data || []).map((row: any) => ({
    slug: row.slug,
    name: row.name,
    standard: row.standard as NftStd,
    contract: row.contract as `0x${string}`,
    image: row.image,
    tags: row.tags || [],
    mintUrl: row.mint_url,
    startBlock: row.start_block ? BigInt(row.start_block) : undefined,
    addedAt: row.added_at
  }));

  collectionsCache.set(cacheKey, { data: collections, timestamp: Date.now() });
  return collections;
}

export async function upsertCollection(collection: Omit<Collection, 'addedAt'> & { chain: ChainSlug }): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase
    .from('collections')
    .upsert({
      chain: collection.chain,
      slug: collection.slug,
      name: collection.name,
      standard: collection.standard,
      contract: collection.contract,
      image: collection.image,
      tags: collection.tags || [],
      mint_url: collection.mintUrl,
      start_block: collection.startBlock ? collection.startBlock.toString() : null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'chain,slug'
    });

  if (error) {
    console.error('Error upserting collection:', error);
    return { success: false, error: error.message };
  }

  // Clear cache
  collectionsCache.clear();

  return { success: true };
}

export async function deleteCollection(chain: ChainSlug, slug: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('chain', chain)
    .eq('slug', slug);

  if (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: error.message };
  }

  // Clear cache
  collectionsCache.clear();

  return { success: true };
}
