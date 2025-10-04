import { useEffect, useState } from "react";

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

    const ac = new AbortController();
    setLoading(true);
    setError(undefined);

    try {
      const url = `/api/nft/minted?chain=${chain}&address=${address.toLowerCase()}${refresh ? '&refresh=true' : ''}`;
      const response = await fetch(url, { signal: ac.signal });
      const json: MintedResponse = await response.json();

      if (json.ok && json.minted) {
        setData(json.minted);
        setLastChecked(new Date());
      } else {
        setError(json.error || "UNKNOWN");
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }

    return () => ac.abort();
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
