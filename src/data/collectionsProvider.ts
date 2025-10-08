import { NFT_COLLECTIONS, Collection } from '../config/collections';
import { ChainSlug } from '../config/chains';
import { NFTStorage } from '../lib/storage';

/** Admin mode A: Supabase (if present) */
export async function fetchAdminCollections(chain: ChainSlug): Promise<Collection[]> {
  // Normalize chain to lowercase
  const chainSlug = (chain || '').toLowerCase();
  
  try {
    const response = await fetch(`/api/admin/collections?chain=${encodeURIComponent(chainSlug)}`, {
      headers: { 'accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`collections ${response.status}`);
    }
    
    const json = await response.json();
    
    // Check for new API format with 'ok' field
    if (json.ok === false) {
      throw new Error(json.error || 'bad response');
    }
    
    const collections = json.ok ? json.collections : json.collections || [];
    
    if (!Array.isArray(collections)) {
      console.warn('Invalid collections response:', json);
      return [];
    }
    
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
  } catch (error) {
    console.error('Failed to fetch admin collections:', error);
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

