import { useState, useEffect } from 'react';
import type { WalletStatsResponse } from '../types/wallet';

// Use Cloudflare Workers API base URL
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface UseWalletStatsOptions {
  enabled?: boolean;
  staleTime?: number;
  retryCount?: number;
}

interface UseWalletStatsResult {
  data: WalletStatsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Simple cache implementation
const cache = new Map<string, { data: WalletStatsResponse; timestamp: number }>();
const CACHE_STALE_TIME = 60_000; // 60 seconds

export function useWalletStats(
  chain: string | null,
  address: string | null,
  options: UseWalletStatsOptions = {}
): UseWalletStatsResult {
  const {
    enabled = true,
    staleTime = CACHE_STALE_TIME,
    retryCount = 2
  } = options;

  const [data, setData] = useState<WalletStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (retries = retryCount) => {
    if (!chain || !address || !enabled) {
      return;
    }

    // Check cache
    const cacheKey = `${chain}:${address}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/wallet-stats?chain=${encodeURIComponent(chain)}&address=${encodeURIComponent(address)}`,
        {
          headers: {
            'accept': 'application/json'
          }
        }
      );

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('API did not return JSON (route missing / 404 fallback)');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: WalletStatsResponse = await response.json();

      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
      setError(result.error || null);
    } catch (err: any) {
      console.error('[useWalletStats] Error:', err);
      
      if (retries > 0) {
        // Retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchStats(retries - 1);
      }

      setError(err.message || 'Failed to fetch wallet stats');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && chain && address) {
      fetchStats();
    }
  }, [chain, address, enabled]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchStats(retryCount)
  };
}
