import { NFT_COLLECTIONS, Collection } from '../config/collections';
import { ChainSlug } from '../config/chains';
import { NFTStorage } from '../lib/storage';
import { supabase } from '../lib/supabase';

/**
 * Fetch NFT collections from Supabase (client-side only, no server)
 * Maps DB columns to UI format
 */
export async function fetchAdminCollections(chain: ChainSlug): Promise<Collection[]> {
  const chainSlug = (chain || '').toLowerCase();

  const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .eq('visible', true)
    .or(`network.eq.${chainSlug},network.ilike.${chainSlug}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[collectionsProvider] Supabase error:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map DB → UI format
  return data.map((nft: any) => {
    const std = String(nft.token_standard || '').toLowerCase();
    const isErc1155 = std.includes('1155');
    
    return {
      slug: `supabase-${nft.id}`,
      name: nft.title,
      contract: nft.contract_address as `0x${string}`,
      standard: isErc1155 ? 'erc1155' : 'erc721',
      image: nft.image_url || undefined,
      tags: nft.tags || [],
      mintUrl: nft.external_link || undefined,
      startBlock: undefined,
      addedAt: nft.created_at,
      price: nft.price_eth || undefined
    } as Collection;
  });
}


/** LocalStorage NFTs (optional, for offline/testing) */
export function getLocalStorageCollections(chain: ChainSlug): Collection[] {
  try {
    const nfts = NFTStorage.getAllNFTs();
    
    return nfts
      .filter(nft => nft.network === chain && nft.visible !== false)
      .map(nft => ({
        slug: `local-${nft.id}`,
        name: nft.title,
        contract: nft.contract_address as `0x${string}`,
        standard: (nft.token_standard?.toLowerCase() === 'erc-721' ? 'erc721' : 'erc1155') as 'erc721' | 'erc1155',
        image: nft.imageUrl,
        tags: nft.tags || [],
        mintUrl: nft.external_link,
        startBlock: undefined,
        addedAt: nft.created_at,
        price: nft.price_eth
      }));
  } catch (error) {
    console.warn('Failed to fetch localStorage collections:', error);
    return [];
  }
}

/**
 * Main collections getter - fetches from Supabase only (no mock/fallback NFTs)
 * Merges with static config NFTs from collections.ts
 */
export async function getCollections(chain: ChainSlug): Promise<Collection[]> {
  try {
    // Fetch from Supabase (primary source)
    const supabaseNfts = await fetchAdminCollections(chain);
    
    // Get static config NFTs (if any)
    const staticNfts = NFT_COLLECTIONS[chain] ?? [];
    
    // Merge: Supabase NFTs + static config
    const bySlug: Record<string, Collection> = {};
    [...staticNfts, ...supabaseNfts].forEach(c => { 
      bySlug[c.slug] = c; 
    });
    
    return Object.values(bySlug);
  } catch (error) {
    console.error('[getCollections] Error:', error);
    // Fallback to static config only if Supabase fails
    return NFT_COLLECTIONS[chain] ?? [];
  }
}

