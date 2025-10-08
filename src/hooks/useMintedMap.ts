import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { RPC_ENDPOINTS } from '../config/rpc';

interface MintedResponse {
  ok: boolean;
  chain?: string;
  address?: string;
  minted?: Record<string, boolean>;
  meta?: {
    elapsedMs: number;
    cache: "HIT" | "MISS" | "STALE";
    rateLimited: boolean;
  };
  error?: string;
}

// ERC721 ABI for balanceOf
const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)'
];

// ERC1155 ABI for balanceOf
const ERC1155_ABI = [
  'function balanceOf(address account, uint256 id) view returns (uint256)'
];

/**
 * Client-side minted detection hook
 * Checks NFT ownership directly from blockchain (no backend needed)
 */
export function useMintedMap(chain: string, address?: string) {
  const [data, setData] = useState<Record<string, boolean>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [lastChecked, setLastChecked] = useState<Date>();

  const fetchMinted = async (refresh = false) => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setData(undefined);
      setError(undefined);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      // Try backend API first (if available, e.g., on Vercel)
      const url = `/api/nft/minted?chain=${chain}&address=${address.toLowerCase()}${refresh ? '&refresh=true' : ''}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      
      // If backend works, use it
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const json: MintedResponse = await response.json();
        if (json.ok && json.minted) {
          setData(json.minted);
          setLastChecked(new Date());
          setLoading(false);
          return;
        }
      }
    } catch (backendError) {
      console.log('[useMintedMap] Backend not available, using client-side detection');
    }

    // Fallback: Client-side blockchain check (for static hosting like Bolt)
    try {
      const rpcUrl = RPC_ENDPOINTS[chain as keyof typeof RPC_ENDPOINTS];
      if (!rpcUrl) {
        throw new Error(`No RPC URL for chain: ${chain}`);
      }

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Import collections dynamically to check
      const { getCollections } = await import('../data/collectionsProvider');
      const collections = await getCollections(chain as any);
      
      const mintedMap: Record<string, boolean> = {};
      
      // Check ownership for each collection
      await Promise.all(
        collections.map(async (collection) => {
          try {
            const contract = new ethers.Contract(
              collection.contract,
              collection.standard === 'erc721' ? ERC721_ABI : ERC1155_ABI,
              provider
            );

            if (collection.standard === 'erc721') {
              const balance = await contract.balanceOf(address);
              mintedMap[collection.slug] = balance > 0n;
            } else {
              // ERC1155 - assume tokenId 1 if not specified
              const tokenId = 1; // You may need to adjust this
              const balance = await contract.balanceOf(address, tokenId);
              mintedMap[collection.slug] = balance > 0n;
            }
          } catch (err) {
            console.warn(`[useMintedMap] Failed to check ${collection.slug}:`, err);
            mintedMap[collection.slug] = false;
          }
        })
      );

      setData(mintedMap);
      setLastChecked(new Date());
    } catch (e: any) {
      console.error('[useMintedMap] Client-side check failed:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinted();
  }, [chain, address]);

  return {
    mintedMap: data,
    loading,
    error,
    lastChecked,
    refresh: () => fetchMinted(true)
  };
}
