import { useState, useEffect } from 'react';
import { getErc721MintStats, getErc1155MintStats, getTotalSupply } from '../utils/mintStats';
import type { ChainSlug } from '../config/chains';

interface UseMintStatsOptions {
  chain: ChainSlug;
  contract: `0x${string}`;
  standard: 'erc721' | 'erc1155';
  startBlock?: bigint;
  enabled?: boolean;
}

interface MintStatsResult {
  totalMinted: number;
  circulating: number;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

/**
 * Hook to fetch and display mint statistics for NFT collections
 * Shows total minted count without requiring wallet connection
 */
export function useMintStats({
  chain,
  contract,
  standard,
  startBlock,
  enabled = true,
}: UseMintStatsOptions): MintStatsResult {
  const [stats, setStats] = useState<MintStatsResult>({
    totalMinted: 0,
    circulating: 0,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    if (!enabled || !contract || !chain) {
      return;
    }

    let mounted = true;

    const fetchStats = async () => {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      try {
        if (standard === 'erc721') {
          const result = await getErc721MintStats({
            chain,
            contract,
            startBlock,
          });

          if (mounted) {
            setStats({
              totalMinted: result.totalMinted,
              circulating: result.circulating,
              loading: false,
              error: null,
              lastUpdated: result.lastUpdated,
            });
          }
        } else if (standard === 'erc1155') {
          const result = await getErc1155MintStats({
            chain,
            contract,
            startBlock,
          });

          if (mounted) {
            setStats({
              totalMinted: result.totalUnits,
              circulating: result.uniqueIds,
              loading: false,
              error: null,
              lastUpdated: result.lastUpdated,
            });
          }
        }
      } catch (err) {
        if (mounted) {
          setStats(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch mint stats',
          }));
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, [chain, contract, standard, startBlock, enabled]);

  return stats;
}

/**
 * Wrap a promise with timeout
 */
function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Simpler hook that just tries totalSupply() first
 * Falls back to event counting if not available
 * Includes 8-second timeout to prevent infinite spinner
 */
export function useTotalSupply({
  chain,
  contract,
  startBlock,
  enabled = true,
}: Omit<UseMintStatsOptions, 'standard'>): {
  totalSupply: number;
  loading: boolean;
  error: string | null;
} {
  const [state, setState] = useState({
    totalSupply: 0,
    loading: false,
    error: null as string | null,
  });

  useEffect(() => {
    if (!enabled || !contract || !chain) {
      return;
    }

    let mounted = true;

    const fetch = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        // ✅ Wrap with 8-second timeout to prevent infinite spinner
        const supply = await withTimeout(
          getTotalSupply({ chain, contract, startBlock }),
          8000
        );

        if (mounted) {
          setState({
            totalSupply: supply,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch supply',
          }));
        }
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, [chain, contract, startBlock, enabled]);

  return state;
}
