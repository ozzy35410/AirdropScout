import { NFT_COLLECTIONS, Collection } from '../config/collections';
import { ChainSlug } from '../config/chains';
import { NFTStorage } from '../lib/storage';
import { supabase } from '../lib/supabase';

/** Admin mode A: Supabase Direct (fallback to API if backend exists) */
export async function fetchAdminCollections(chain: ChainSlug): Promise<Collection[]> {
  // Normalize chain to lowercase
  const chainSlug = (chain || '').toLowerCase();
  
  // Try backend API first
  try {
    const response = await fetch(`/api/admin/collections?chain=${encodeURIComponent(chainSlug)}`, {
      headers: { 'accept': 'application/json' },
    });
    
    // If API works (not 404/HTML), use it
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const json = await response.json();
      
      if (json.ok === false) {
        throw new Error(json.error || 'bad response');
      }
      
      const collections = json.ok ? json.collections : json.collections || [];
      
      if (Array.isArray(collections) && collections.length > 0) {
        // Map API response to Collection format
        return collections.map((item: any) => ({
          slug: `admin-${item.id}`,
          name: item.name || item.title,
          contract: item.contract || item.contract_address as `0x${string}`,
          standard: (item.standard?.toLowerCase() === 'erc721' || item.token_standard?.toLowerCase() === 'erc-721' ? 'erc721' : 'erc1155') as 'erc721' | 'erc1155',
          image: item.image || item.image_url,
          tags: item.tags || [],
          mintUrl: item.mintUrl || item.mint_url || item.external_link,
          startBlock: item.start_block ? BigInt(item.start_block) : undefined,
          addedAt: item.createdAt || item.created_at
        }));
      }
    }
  } catch (apiError) {
    console.warn('Backend API not available, falling back to direct Supabase:', apiError);
  }
  
  // Fallback: Direct Supabase query (for static hosting like Bolt.host)
  try {
    console.log(`[collectionsProvider] Fetching directly from Supabase for chain="${chainSlug}"`);
    
    const { data, error } = await supabase
      .from('nfts')
      .select('*')
      .eq('visible', true)
      .or(`network.eq.${chainSlug},network.ilike.${chainSlug}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[collectionsProvider] Supabase error:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log(`[collectionsProvider] No NFTs found for chain="${chainSlug}"`);
      return [];
    }
    
    console.log(`[collectionsProvider] Found ${data.length} NFTs from Supabase`);
    
    // Map Supabase response to Collection format
    return data.map((nft: any) => {
      let standard = (nft.token_standard || '').toLowerCase();
      if (standard === 'erc-721') standard = 'erc721';
      if (standard === 'erc-1155') standard = 'erc1155';
      
      return {
        slug: `supabase-${nft.id}`,
        name: nft.title,
        contract: nft.contract_address as `0x${string}`,
        standard: standard as 'erc721' | 'erc1155',
        image: nft.image_url,
        tags: nft.tags || [],
        mintUrl: nft.external_link,
        startBlock: undefined,
        addedAt: nft.created_at,
        price: nft.price_eth
      };
    });
  } catch (supabaseError) {
    console.error('Failed to fetch from Supabase:', supabaseError);
    return [];
  }
}

/** Admin mode B: LocalStorage NFTs */
export function getLocalStorageCollections(chain: ChainSlug): Collection[] {
  try {
    const nfts = NFTStorage.getAllNFTs();
    
    // Filter by chain and convert to Collection format
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

/** Admin mode C: GitHub PR flow -> file is the source (fallback) */
export async function getCollections(chain: ChainSlug): Promise<Collection[]> {
  const admin = await fetchAdminCollections(chain).catch(() => []);
  const local = getLocalStorageCollections(chain);
  const base = NFT_COLLECTIONS[chain] ?? [];
  
  // Merge all sources, prioritizing: local > admin > base
  const bySlug: Record<string, Collection> = {};
  [...base, ...admin, ...local].forEach(c => { bySlug[c.slug] = c; });
  return Object.values(bySlug);
}

