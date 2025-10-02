import { useCallback, useEffect, useState } from 'react';

interface MintedDetectionOptions {
  address?: string;
  chain?: string;
  enabled?: boolean;
}

interface MintedDetectionResult {
  mintedStatus: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
  isRateLimited: boolean;
  refresh: () => Promise<void>;
}

interface MintedApiResponse {
  minted?: Record<string, boolean>;
  error?: string;
  partial?: boolean;
}

const EMPTY_RESULT: MintedDetectionResult = {
  mintedStatus: {},
  isLoading: false,
  error: null,
  lastChecked: null,
  isRateLimited: false,
  refresh: async () => {}
};

export function useMintedDetection(options: MintedDetectionOptions): MintedDetectionResult {
  const { address, chain, enabled = true } = options;

  const [mintedStatus, setMintedStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const shouldFetch = Boolean(enabled && address && chain);

  const executeFetch = useCallback(
    async (signal?: AbortSignal) => {
      if (!shouldFetch) {
        setMintedStatus({});
        setIsRateLimited(false);
        setError(null);
        setLastChecked(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsRateLimited(false);

      try {
        const response = await fetch(
          `/api/nft/minted?chain=${chain}&address=${address}`,
          { signal }
        );

        if (response.status === 429) {
          setIsRateLimited(true);
          setError(null);
          return;
        }

        if (!response.ok) {
          const message = `Failed to fetch minted status (${response.status})`;
          setError(message);
          return;
        }

        const data = (await response.json()) as MintedApiResponse;
        setMintedStatus(data.minted ?? {});
        setError(data.error ?? null);
        setIsRateLimited(Boolean(data.partial));
        setLastChecked(new Date());
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch minted status');
      } finally {
        if (!signal || !signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [address, chain, shouldFetch]
  );

  useEffect(() => {
    const controller = new AbortController();
    void executeFetch(controller.signal);

    return () => {
      controller.abort();
    };
  }, [executeFetch]);

  const refresh = useCallback(async () => {
    await executeFetch();
  }, [executeFetch]);

  if (!shouldFetch) {
    return {
      ...EMPTY_RESULT,
      refresh,
    };
  }

  return {
    mintedStatus,
    isLoading,
    error,
    lastChecked,
    isRateLimited,
    refresh
  };
}
