import { CHAINS, type ChainSlug } from "@/config/chains";
import { NFT_COLLECTIONS, type Collection } from "@/config/collections";
import { getPublicSupabase, getServiceSupabase } from "@/lib/supabase/server";

type CollectionSource = "config" | "database";

export type CollectionRecord = Collection & {
  chain: ChainSlug;
  source: CollectionSource;
  id?: string;
  updatedAt?: string | null;
  visible?: boolean;
};

type DbCollectionRow = {
  id: string;
  chain: string;
  slug: string;
  name: string;
  standard: Collection["standard"];
  contract: string;
  image_url: string | null;
  tags: string[] | null;
  mint_url: string | null;
  start_block: string | number | null;
  added_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  visible: boolean | null;
};

const TABLE = "nft_collections";

type SupabaseReader = ReturnType<typeof getPublicSupabase>;
type SupabaseWriter = ReturnType<typeof getServiceSupabase>;

type FetcherOptions = {
  chain?: ChainSlug;
  includeHidden?: boolean;
};

type UpsertPayload = {
  chain: ChainSlug;
  slug: string;
  name: string;
  standard: Collection["standard"];
  contract: `0x${string}`;
  image?: string | null;
  tags?: string[];
  mintUrl?: string | null;
  startBlock?: string | null;
  addedAt?: string | null;
  visible?: boolean;
};

function transformDbRow(row: DbCollectionRow): CollectionRecord | null {
  if (!row.visible) return null;
  if (!isValidChain(row.chain)) return null;

  let startBlock: bigint | undefined;
  if (row.start_block !== null && row.start_block !== undefined && row.start_block !== "") {
    try {
      const value = typeof row.start_block === "number" ? Math.trunc(row.start_block).toString() : row.start_block;
      startBlock = BigInt(value);
    } catch (error) {
      console.warn("Invalid start_block for collection", { slug: row.slug, error });
    }
  }

  return {
    id: row.id,
    chain: row.chain as ChainSlug,
    slug: row.slug,
    name: row.name,
    standard: row.standard,
    contract: row.contract as `0x${string}`,
    image: row.image_url ?? undefined,
    tags: row.tags ?? undefined,
    mintUrl: row.mint_url ?? undefined,
    startBlock,
    addedAt: row.added_at ?? row.created_at ?? undefined,
    updatedAt: row.updated_at,
    source: "database",
    visible: row.visible ?? undefined
  };
}

function isValidChain(chain: string): chain is ChainSlug {
  return Object.prototype.hasOwnProperty.call(CHAINS, chain);
}

function mergeCollections(config: CollectionRecord[], database: CollectionRecord[]): CollectionRecord[] {
  const map = new Map<string, CollectionRecord>();

  for (const item of config) {
    map.set(item.chain + ":" + item.slug, item);
  }

  for (const item of database) {
    map.set(item.chain + ":" + item.slug, item);
  }

  return Array.from(map.values()).sort((a, b) => {
    const aDate = a.addedAt ? Date.parse(a.addedAt) : 0;
    const bDate = b.addedAt ? Date.parse(b.addedAt) : 0;
    if (bDate !== aDate) return bDate - aDate;
    return a.name.localeCompare(b.name);
  });
}

async function fetchDatabaseCollections(options: FetcherOptions = {}): Promise<CollectionRecord[]> {
  let client: SupabaseReader;
  try {
    client = getPublicSupabase();
  } catch (error) {
    console.warn("Supabase public client not configured, skipping database collections.", error);
    return [];
  }

  let query = client.from(TABLE).select("*");
  if (options.chain) {
    query = query.eq("chain", options.chain);
  }
  if (!options.includeHidden) {
    query = query.eq("visible", true);
  }
  query = query.order("updated_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch collections from Supabase", error);
    return [];
  }

  const rows = (data ?? []) as DbCollectionRow[];
  return rows
    .map(transformDbRow)
    .filter((item): item is CollectionRecord => Boolean(item));
}

export async function getCollections(chain?: ChainSlug): Promise<CollectionRecord[]> {
  const chains = chain ? [chain] : (Object.keys(CHAINS) as ChainSlug[]);

  const configRecords: CollectionRecord[] = chains.flatMap((chainSlug) => {
    const collections = NFT_COLLECTIONS[chainSlug] ?? [];
    return collections.map<CollectionRecord>((collection) => ({
      ...collection,
      chain: chainSlug,
      source: "config",
      visible: true
    }));
  });

  const databaseRecords = await fetchDatabaseCollections({ chain });
  return mergeCollections(configRecords, databaseRecords);
}

export function serializeCollection(record: CollectionRecord) {
  return {
    ...record,
    startBlock: record.startBlock ? record.startBlock.toString() : null
  };
}

export async function upsertCollection(payload: UpsertPayload) {
  const client: SupabaseWriter = getServiceSupabase();

  const upsertPayload = {
    chain: payload.chain,
    slug: payload.slug,
    name: payload.name,
    standard: payload.standard,
    contract: payload.contract,
    image_url: payload.image ?? null,
    tags: payload.tags ?? [],
    mint_url: payload.mintUrl ?? null,
    start_block: payload.startBlock ?? null,
    added_at: payload.addedAt ?? null,
    visible: payload.visible ?? true
  };

  const { error, data } = await client
    .from(TABLE)
    .upsert(upsertPayload, { onConflict: "chain,slug" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return transformDbRow(data as DbCollectionRow);
}

export async function deleteCollection(chain: ChainSlug, slug: string) {
  const client: SupabaseWriter = getServiceSupabase();
  const { error } = await client
    .from(TABLE)
    .delete()
    .eq("chain", chain)
    .eq("slug", slug);

  if (error) {
    throw error;
  }
}
