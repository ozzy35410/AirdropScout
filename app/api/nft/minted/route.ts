import { NextRequest, NextResponse } from "next/server";
import { CHAINS, type ChainSlug } from "@/config/chains";
import { getCollections } from "@/lib/collections";
import { getPublicClient } from "@/lib/viemClient";
import {
  checksumAddress,
  isAddress,
  keccak256,
  stringToBytes,
  type GetLogsParameters,
  type Hex,
  type Log,
  type PublicClient
} from "viem";

type CacheState = "HIT" | "MISS" | "STALE" | "BYPASS";

type MintedSuccessResponse = {
  ok: true;
  chain: ChainSlug;
  address: `0x${string}`;
  minted: Record<string, boolean>;
  meta: {
    elapsedMs: number;
    cache: CacheState;
    rateLimited: boolean;
  };
};

type MintedErrorResponse = {
  ok: false;
  error: string;
};

type CacheEntry = {
  response: MintedSuccessResponse;
  createdAt: number;
};

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const DEFAULT_BLOCK_WINDOW = 200_000n;

const mintedCache = new Map<string, CacheEntry>();

const ZERO_TOPIC = topicForAddress("0x0000000000000000000000000000000000000000");
const TOPIC_ERC20_ERC721_TRANSFER = keccak256(
  stringToBytes("Transfer(address,address,uint256)")
) as Hex;
const TOPIC_ERC1155_SINGLE = keccak256(
  stringToBytes("TransferSingle(address,address,address,uint256,uint256)")
) as Hex;
const TOPIC_ERC1155_BATCH = keccak256(
  stringToBytes("TransferBatch(address,address,address,uint256[],uint256[])")
) as Hex;

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const chainParam = (params.get("chain") ?? "").toLowerCase();
    const addressParam = (params.get("address") ?? "").toLowerCase();
    const refresh = params.get("refresh") === "true";

    if (!isAddress(addressParam)) {
      return NextResponse.json<MintedErrorResponse>(
        { ok: false, error: "INVALID_ADDRESS" },
        { status: 400 }
      );
    }

    const chain = chainParam as ChainSlug;
    const chainConfig = CHAINS[chain];
    if (!chainConfig) {
      return NextResponse.json<MintedErrorResponse>(
        { ok: false, error: "CHAIN_UNAVAILABLE" },
        { status: 400 }
      );
    }

    const cacheKey = `minted:${chain}:${addressParam}`;
    const now = Date.now();

    let cacheState: CacheState = refresh ? "BYPASS" : "MISS";

    if (!refresh) {
      const cached = mintedCache.get(cacheKey);
      if (cached && now - cached.createdAt < CACHE_TTL) {
        return NextResponse.json<MintedSuccessResponse>({
          ...cached.response,
          meta: { ...cached.response.meta, cache: "HIT" }
        });
      }
      if (cached) {
        cacheState = "STALE";
      }
    }

    const client = getPublicClient(chain);
    const collections = await getCollections(chain);
    const minted: Record<string, boolean> = {};

    const startTime = Date.now();
    const latestBlock = await client.getBlockNumber();
    const addressTopic = topicForAddress(addressParam as `0x${string}`);

    let rateLimited = false;

    for (const collection of collections) {
      const toBlock = latestBlock;
  const windowStart = toBlock > DEFAULT_BLOCK_WINDOW ? toBlock - DEFAULT_BLOCK_WINDOW : 0n;
  const candidate = collection.startBlock ?? windowStart;
  const fromBlock = candidate > windowStart ? candidate : windowStart;

      try {
        if (collection.standard === "erc721") {
          const { logs, limited } = await fetchLogsResilient(client, {
            address: collection.contract,
            fromBlock,
            toBlock,
            topics: [TOPIC_ERC20_ERC721_TRANSFER, ZERO_TOPIC, addressTopic]
          });
          minted[collection.slug] = logs.length > 0;
          rateLimited = rateLimited || limited;
        } else {
          const single = await fetchLogsResilient(client, {
            address: collection.contract,
            fromBlock,
            toBlock,
            topics: [TOPIC_ERC1155_SINGLE, null, ZERO_TOPIC, addressTopic]
          });
          const batch = await fetchLogsResilient(client, {
            address: collection.contract,
            fromBlock,
            toBlock,
            topics: [TOPIC_ERC1155_BATCH, null, ZERO_TOPIC, addressTopic]
          });
          minted[collection.slug] = single.logs.length > 0 || batch.logs.length > 0;
          rateLimited = rateLimited || single.limited || batch.limited;
        }
      } catch (error) {
        console.error("Minted detection error", { chain, collection: collection.slug, error });
        minted[collection.slug] = false;
        rateLimited = true;
      }
    }

    const elapsedMs = Date.now() - startTime;
    const response: MintedSuccessResponse = {
      ok: true,
      chain,
      address: checksumAddress(addressParam as `0x${string}`),
      minted,
      meta: {
        elapsedMs,
        cache: cacheState,
        rateLimited
      }
    };

    mintedCache.set(cacheKey, {
      response,
      createdAt: now
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Minted API failure", error);
    return NextResponse.json<MintedErrorResponse>({ ok: false, error: "UNKNOWN" }, { status: 500 });
  }
}

type FetchLogsResult = { logs: Log[]; limited: boolean };
type LogRequest = {
  address: `0x${string}`;
  fromBlock: bigint;
  toBlock: bigint;
  topics: (Hex | null)[];
};

async function fetchLogsResilient(client: PublicClient, params: LogRequest, depth = 0): Promise<FetchLogsResult> {
  try {
    const logs = await client.getLogs(params as GetLogsParameters);
    return { logs, limited: false };
  } catch (error) {
    if (depth === 0) {
      console.warn("Falling back to segmented log fetch", { error, params });
    }
    if (depth >= 1 || params.fromBlock >= params.toBlock) {
      return { logs: [], limited: true };
    }

    const mid = params.fromBlock + (params.toBlock - params.fromBlock) / 2n;
    await delay(200 + Math.floor(Math.random() * 400));

    const first = await fetchLogsResilient(client, { ...params, toBlock: mid }, depth + 1);
    const second = await fetchLogsResilient(client, { ...params, fromBlock: mid + 1n }, depth + 1);

    return {
      logs: [...first.logs, ...second.logs],
      limited: first.limited || second.limited
    };
  }
}

function topicForAddress(address: `0x${string}`): Hex {
  const normalized = address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  return (`0x${normalized}`) as Hex;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
