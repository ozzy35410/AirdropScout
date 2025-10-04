"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCcw, Search } from "lucide-react";
import { clsx } from "clsx";
import { MAINNET_CHAINS, TESTNET_CHAINS, type ChainSlug } from "@/config/chains";
import { useTranslation } from "@/hooks/useTranslation";
import { useGlobal, type GlobalState } from "@/state/useGlobal";
import { NetworkTabs } from "@/components/nfts/NetworkTabs";
import { NftCard } from "@/components/nfts/NftCard";
import { normalizeAddress, isValidAddress } from "@/lib/address";
import { useMintedMap } from "@/hooks/useMintedMap";

type SortOption = "newest" | "az" | "za";
type MintFilter = "show" | "hide" | "only";

type CollectionItem = {
  chain: ChainSlug;
  slug: string;
  name: string;
  standard: "erc721" | "erc1155";
  contract: `0x${string}`;
  image?: string;
  tags?: string[];
  mintUrl?: string;
  startBlock?: string;
  addedAt?: string;
  source: "config" | "database";
  updatedAt?: string;
};

type ApiCollectionPayload = {
  chain: string;
  slug: string;
  name: string;
  standard: "erc721" | "erc1155";
  contract: `0x${string}`;
  image?: string | null;
  tags?: string[] | null;
  mintUrl?: string | null;
  startBlock?: string | null;
  addedAt?: string | null;
  source?: "config" | "database";
  updatedAt?: string | null;
};

type CollectionsResponse =
  | { ok: true; collections: ApiCollectionPayload[] }
  | { ok: false; error?: string };

type PersistedFilters = {
  search: string;
  sort: SortOption;
  mintedFilter: MintFilter;
  tags: string[];
};

const FILTER_STORAGE_KEY = "airdropscout:nft-filters";

const defaultFilters: PersistedFilters = {
  search: "",
  sort: "newest",
  mintedFilter: "show",
  tags: []
};

export function NftsView({ initialNetwork }: { initialNetwork?: ChainSlug }) {
  const { t } = useTranslation();
  const networkMode = useGlobal((state: GlobalState) => state.networkMode);
  const trackAddressRaw = useGlobal((state: GlobalState) => state.trackAddress);

  const availableChains = networkMode === "mainnet" ? MAINNET_CHAINS : TESTNET_CHAINS;
  const [activeChain, setActiveChain] = useState<ChainSlug>(
    initialNetwork && availableChains.includes(initialNetwork) ? initialNetwork : availableChains[0]
  );

  const [filters, setFilters] = useState<PersistedFilters>(defaultFilters);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(FILTER_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as PersistedFilters;
      setFilters({ ...defaultFilters, ...parsed });
    } catch (error) {
      console.warn("Failed to parse stored filters", error);
    }
  }, []);

  useEffect(() => {
    if (availableChains.includes(activeChain)) return;
    setActiveChain(availableChains[0]);
  }, [availableChains, activeChain]);

  useEffect(() => {
    if (!initialNetwork) return;
    if (availableChains.includes(initialNetwork)) {
      setActiveChain(initialNetwork);
    }
  }, [initialNetwork, availableChains]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const setSearch = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const setSort = useCallback((value: SortOption) => {
    setFilters((prev) => ({ ...prev, sort: value }));
  }, []);

  const setMintedFilter = useCallback((value: MintFilter) => {
    setFilters((prev) => ({ ...prev, mintedFilter: value }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag]
      };
    });
  }, []);

  const normalizedAddress = normalizeAddress(trackAddressRaw);
  const addressValid = isValidAddress(normalizedAddress as `0x${string}`);

  useEffect(() => {
    if (!addressValid && filters.mintedFilter !== "show") {
      setFilters((prev) => ({ ...prev, mintedFilter: "show" }));
    }
  }, [addressValid, filters.mintedFilter, setFilters]);

  const { mintedMap, loading, error, lastChecked, rateLimited, cacheState, refresh, cooldownMs } = useMintedMap(
    activeChain,
    addressValid ? normalizedAddress : undefined
  );

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    async function loadCollections() {
      setCollectionsLoading(true);
      setCollectionsError(null);

      try {
        const response = await fetch(`/api/nfts?chain=${activeChain}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache"
          }
        });

        const payload = (await response.json()) as CollectionsResponse;
        if (!response.ok) {
          throw new Error(response.statusText || "FAILED");
        }
        if (!payload.ok) {
          throw new Error(payload.error ?? "FAILED");
        }

        if (isCancelled) return;

        const fetched = payload.collections.map<CollectionItem>((item) => ({
          chain: item.chain as ChainSlug,
          slug: item.slug,
          name: item.name,
          standard: item.standard,
          contract: item.contract,
          image: item.image ?? undefined,
          tags: item.tags ?? undefined,
          mintUrl: item.mintUrl ?? undefined,
          startBlock: item.startBlock ?? undefined,
          addedAt: item.addedAt ?? undefined,
          source: item.source ?? "config",
          updatedAt: item.updatedAt ?? undefined
        }));

        setCollections(fetched);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Failed to load NFT collections", error);
        if (!isCancelled) {
          setCollections([]);
          setCollectionsError(t("admin_error_load"));
        }
      } finally {
        if (!isCancelled) {
          setCollectionsLoading(false);
        }
      }
    }

    void loadCollections();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [activeChain, t]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    collections.forEach((collection) => {
      collection.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [collections]);

  const filteredCollections = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const requiredTags = new Set(filters.tags);

    const filtered = collections.filter((collection) => {
      if (query) {
        const haystack = [collection.name, collection.slug, ...(collection.tags ?? [])]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (requiredTags.size > 0) {
        const tags = new Set(collection.tags ?? []);
        for (const tag of requiredTags) {
          if (!tags.has(tag)) {
            return false;
          }
        }
      }

      if (!mintedMap || !addressValid || filters.mintedFilter === "show") {
        return true;
      }

      const minted = mintedMap[collection.slug];
      if (filters.mintedFilter === "hide") {
        return minted !== true;
      }
      return minted === true;
    });

    return filtered.sort((a, b) => sortCollections(a, b, filters.sort));
  }, [collections, filters, mintedMap, addressValid]);

  const mintedSummary = useMemo(() => {
    if (!mintedMap) return 0;
    return Object.values(mintedMap).filter(Boolean).length;
  }, [mintedMap]);

  const mintedFilterDisabled = !addressValid;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">{t("nfts")}</h1>
          <p className="text-sm text-slate-500">{t(networkMode === "mainnet" ? "network_mainnet" : "network_testnet")}</p>
        </div>
        <NetworkTabs
          chains={availableChains}
          active={activeChain}
          onChange={setActiveChain}
        />
      </section>

      <section className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2">
            <label className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus-within:border-sky-300 focus-within:text-sky-600">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("search")}
                className="w-full bg-transparent text-base text-slate-900 outline-none"
              />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("sort")}</span>
            <select
              value={filters.sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="newest">{t("sort_newest")}</option>
              <option value="az">{t("sort_az")}</option>
              <option value="za">{t("sort_za")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("minted_filter")}</span>
            <select
              value={filters.mintedFilter}
              onChange={(event) => setMintedFilter(event.target.value as MintFilter)}
              disabled={mintedFilterDisabled}
              className={clsx(
                "rounded-xl border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200",
                mintedFilterDisabled ? "border-slate-200 bg-slate-50 text-slate-400" : "border-slate-200 bg-white"
              )}
            >
              <option value="show">{t("show_minted")}</option>
              <option value="hide">{t("hide_minted")}</option>
              <option value="only">{t("only_minted")}</option>
            </select>
            {mintedFilterDisabled && (
              <p className="text-xs text-slate-400">{t("minted_status_wait")}</p>
            )}
          </div>
        </div>

        {availableTags.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{t("tags")}</span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const selected = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={clsx(
                      "rounded-full px-3 py-1 text-xs font-medium transition",
                      selected
                        ? "bg-sky-500 text-white shadow"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-sky-600">
                <Loader2 size={16} className="animate-spin" />
                {t("loading_nfts")}
              </span>
            ) : (
              <span>
                {lastChecked
                  ? `${t("last_checked")}: ${lastChecked.toLocaleTimeString()}`
                  : t("minted_status_wait")}
              </span>
            )}
            {collectionsLoading && (
              <span className="inline-flex items-center gap-2 text-sky-600">
                <Loader2 size={16} className="animate-spin" />
                {t("loading_nfts")}
              </span>
            )}
            {cacheState && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                {t("cache_label")}: {cacheState}
              </span>
            )}
            {rateLimited && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {t("rpc_throttled")}
              </span>
            )}
            {addressValid && mintedMap && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {t("minted")}: {mintedSummary}/{collections.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={cooldownMs > 0 || !addressValid}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring",
              cooldownMs > 0 || !addressValid
                ? "border-slate-200 text-slate-400"
                : "border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900"
            )}
          >
            <RefreshCcw size={14} />
            {t("refresh")}
            {cooldownMs > 0 ? `(${Math.ceil(cooldownMs / 1000)}s)` : null}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section>
        {collectionsError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-600">
            {collectionsError}
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 py-16 text-center text-slate-400">
            {t("no_results")}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCollections.map((collection) => (
              <NftCard
                key={collection.slug}
                chain={activeChain}
                collection={collection}
                minted={mintedMap ? mintedMap[collection.slug] : undefined}
                t={t}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function sortCollections(a: CollectionItem, b: CollectionItem, mode: SortOption): number {
  if (mode === "az") return a.name.localeCompare(b.name);
  if (mode === "za") return b.name.localeCompare(a.name);

  const aDate = a.addedAt ? Date.parse(a.addedAt) : 0;
  const bDate = b.addedAt ? Date.parse(b.addedAt) : 0;
  return bDate - aDate;
}
