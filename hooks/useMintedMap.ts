"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChainSlug } from "@/config/chains";
import { isValidAddress } from "@/lib/address";

export type MintedMap = Record<string, boolean>;
export type CacheState = "HIT" | "MISS" | "STALE" | "BYPASS";

export type UseMintedMapResult = {
  mintedMap: MintedMap | undefined;
  loading: boolean;
  error: string | null;
  lastChecked: Date | null;
  rateLimited: boolean;
  cacheState: CacheState | null;
  refresh: () => Promise<void>;
  cooldownMs: number;
};

const COOLDOWN_MS = 15_000;

export function useMintedMap(chain: ChainSlug | undefined, address: string | undefined): UseMintedMapResult {
  const [mintedMap, setMintedMap] = useState<MintedMap>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [cacheState, setCacheState] = useState<CacheState | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);
  const lastFetchRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const fetchMinted = useCallback(
    async (refresh = false) => {
      if (!chain || !address || !isValidAddress(address)) {
        setMintedMap(undefined);
        setError(null);
        setRateLimited(false);
        setCacheState(null);
        setLastChecked(null);
        return;
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ chain, address });
        if (refresh) params.set("refresh", "true");

        const response = await fetch(`/api/nft/minted?${params.toString()}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        const payload = await response.json();
        if (!payload.ok) {
          setError(payload.error ?? "UNKNOWN_ERROR");
          setMintedMap(undefined);
          setRateLimited(false);
          setCacheState(null);
          return;
        }

        setMintedMap(payload.minted ?? {});
        setRateLimited(Boolean(payload.meta?.rateLimited));
        setCacheState((payload.meta?.cache ?? "MISS") as CacheState);
        setLastChecked(new Date());
        lastFetchRef.current = Date.now();
  setCooldownMs(COOLDOWN_MS);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        setError((err as Error).message ?? "Failed to fetch minted data");
        setRateLimited(false);
      } finally {
        setLoading(false);
      }
    },
    [chain, address]
  );

  useEffect(() => {
    void fetchMinted(false);

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchMinted]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCooldownMs(Math.max(0, COOLDOWN_MS - (Date.now() - lastFetchRef.current)));
    }, 500);

    return () => window.clearInterval(interval);
  }, []);

  const refresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < COOLDOWN_MS) {
      return;
    }
    await fetchMinted(true);
  }, [fetchMinted]);

  return {
    mintedMap,
    loading,
    error,
    lastChecked,
    rateLimited,
    cacheState,
    refresh,
    cooldownMs
  };
}
