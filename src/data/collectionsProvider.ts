import { NFT_COLLECTIONS, Collection } from '../config/collections';
import { ChainSlug } from '../config/chains';

/** Admin mode A: Supabase (if present) */
export async function fetchAdminCollections(chain: ChainSlug): Promise<Collection[]> {
  // Try to fetch from Supabase if available
  try {
    const response = await fetch(`http://localhost:3001/api/admin/collections?chain=${chain}`);
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

/** Admin mode B: GitHub PR flow -> file is the source (fallback) */
export async function getCollections(chain: ChainSlug): Promise<Collection[]> {
  const admin = await fetchAdminCollections(chain).catch(() => []);
  const base = NFT_COLLECTIONS[chain] ?? [];
  
  // If admin returns anything, it overrides base by slug
  if (admin.length === 0) return base;
  
  const bySlug: Record<string, Collection> = {};
  [...base, ...admin].forEach(c => { bySlug[c.slug] = c; });
  return Object.values(bySlug);
}
