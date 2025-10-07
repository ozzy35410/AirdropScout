import { NFT_COLLECTIONS, Collection } from '../config/collections';
import { ChainSlug } from '../config/chains';
import { NFTStorage } from '../lib/storage';

/** Admin mode A: Supabase (if present) */
export async function fetchAdminCollections(chain: ChainSlug): Promise<Collection[]> {
  // Try to fetch from Supabase if available
  try {
    const response = await fetch(`/api/admin/collections?chain=${chain}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.collections || !Array.isArray(data.collections)) return [];
    
    // Map admin collections to Collection format
    return data.collections.map((item: any) => ({
      slug: `admin-${item.id}`,
      name: item.name,
      contract: item.contract_address as `0x${string}`,
      standard: (item.token_standard?.toLowerCase() === 'erc-721' ? 'erc721' : 'erc1155') as 'erc721' | 'erc1155',
      image: item.image_url,
      tags: item.tags || [],
      mintUrl: item.mint_url,
      startBlock: item.start_block ? BigInt(item.start_block) : undefined,
      addedAt: item.created_at
    }));
  } catch (error) {
    console.warn('Failed to fetch admin collections:', error);
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

