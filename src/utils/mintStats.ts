import { createPublicClient, http, parseAbiItem } from 'viem';
import { RPC_ENDPOINTS } from '../config/rpc';
import type { ChainSlug } from '../config/chains';

// Transfer event signature for ERC-721
const TRANSFER_EVENT = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// TransferSingle for ERC-1155
const TRANSFER_SINGLE_EVENT = parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)');

interface MintStats {
  totalMinted: number;
  totalBurned: number;
  circulating: number;
  lastUpdated: number;
}

// Cache mint stats in localStorage (15 min TTL)
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const CACHE_VERSION = 'v1';

function getCacheKey(chain: ChainSlug, contract: string): string {
  return `mint_stats:${CACHE_VERSION}:${chain}:${contract.toLowerCase()}`;
}

function getCachedStats(chain: ChainSlug, contract: string): MintStats | null {
  try {
    const key = getCacheKey(chain, contract);
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const data = JSON.parse(cached) as MintStats;
    const age = Date.now() - data.lastUpdated;
    
    if (age < CACHE_TTL) {
      return data;
    }
    
    // Expired - remove
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

function setCachedStats(chain: ChainSlug, contract: string, stats: MintStats): void {
  try {
    const key = getCacheKey(chain, contract);
    localStorage.setItem(key, JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get mint statistics for an ERC-721 NFT collection
 * Shows total minted tokens and optionally burned tokens
 */
export async function getErc721MintStats({
  chain,
  contract,
  startBlock,
}: {
  chain: ChainSlug;
  contract: `0x${string}`;
  startBlock?: bigint;
}): Promise<MintStats> {
  // Check cache first
  const cached = getCachedStats(chain, contract);
  if (cached) {
    return cached;
  }

  const rpcUrl = RPC_ENDPOINTS[chain];
  if (!rpcUrl) {
    throw new Error(`No RPC URL configured for chain: ${chain}`);
  }

  const client = createPublicClient({
    transport: http(rpcUrl),
  });

  try {
    const latest = await client.getBlockNumber();
    // Use smaller range to avoid rate limits (50k blocks max)
    const maxRange = 50_000n;
    const defaultRange = latest > maxRange ? latest - maxRange : 0n;
    const fromBlock = startBlock ?? defaultRange;

    // Get mint events (from = 0x0)
    const mintLogs = await client.getLogs({
      address: contract,
      event: TRANSFER_EVENT,
      args: {
        from: ZERO_ADDRESS as `0x${string}`,
      },
      fromBlock,
      toBlock: latest,
    });

    // Count unique minted token IDs
    const mintedTokenIds = new Set<string>();
    for (const log of mintLogs) {
      if (log.args.tokenId !== undefined) {
        mintedTokenIds.add(log.args.tokenId.toString());
      }
    }

    // Skip burn tracking to reduce RPC calls (rate limit issues)
    const burnedTokenIds = new Set<string>();

    const stats: MintStats = {
      totalMinted: mintedTokenIds.size,
      totalBurned: burnedTokenIds.size,
      circulating: mintedTokenIds.size - burnedTokenIds.size,
      lastUpdated: Date.now(),
    };

    // Cache the result
    setCachedStats(chain, contract, stats);

    return stats;
  } catch (error) {
    console.warn(`[mintStats] Rate limit or RPC error for ${contract}, using cached/empty data`);
    
    // Return empty stats on error (will be cached so we don't retry immediately)
    const emptyStats: MintStats = {
      totalMinted: 0,
      totalBurned: 0,
      circulating: 0,
      lastUpdated: Date.now(),
    };
    
    // Cache empty result to avoid immediate retries
    setCachedStats(chain, contract, emptyStats);
    
    return emptyStats;
  }
}

/**
 * Get mint statistics for an ERC-1155 NFT collection
 * Shows total minted units and unique token IDs
 */
export async function getErc1155MintStats({
  chain,
  contract,
  startBlock,
}: {
  chain: ChainSlug;
  contract: `0x${string}`;
  startBlock?: bigint;
}): Promise<{ totalUnits: number; uniqueIds: number; lastUpdated: number }> {
  const cached = getCachedStats(chain, contract);
  if (cached) {
    return {
      totalUnits: cached.totalMinted,
      uniqueIds: cached.circulating,
      lastUpdated: cached.lastUpdated,
    };
  }

  const rpcUrl = RPC_ENDPOINTS[chain];
  if (!rpcUrl) {
    throw new Error(`No RPC URL configured for chain: ${chain}`);
  }

  const client = createPublicClient({
    transport: http(rpcUrl),
  });

  try {
    const latest = await client.getBlockNumber();
    // Use smaller range to avoid rate limits (50k blocks max)
    const maxRange = 50_000n;
    const defaultRange = latest > maxRange ? latest - maxRange : 0n;
    const fromBlock = startBlock ?? defaultRange;

    // Get TransferSingle mint events (from = 0x0)
    const mintLogs = await client.getLogs({
      address: contract,
      event: TRANSFER_SINGLE_EVENT,
      args: {
        from: ZERO_ADDRESS as `0x${string}`,
      },
      fromBlock,
      toBlock: latest,
    });

    let totalUnits = 0;
    const uniqueIds = new Set<string>();

    for (const log of mintLogs) {
      if (log.args.id !== undefined && log.args.value !== undefined) {
        uniqueIds.add(log.args.id.toString());
        totalUnits += Number(log.args.value);
      }
    }

    const result = {
      totalUnits,
      uniqueIds: uniqueIds.size,
      lastUpdated: Date.now(),
    };

    // Cache as MintStats format
    setCachedStats(chain, contract, {
      totalMinted: totalUnits,
      totalBurned: 0,
      circulating: uniqueIds.size,
      lastUpdated: Date.now(),
    });

    return result;
  } catch (error) {
    console.warn(`[mintStats] Rate limit or RPC error for ERC-1155 ${contract}`);
    
    const emptyResult = {
      totalUnits: 0,
      uniqueIds: 0,
      lastUpdated: Date.now(),
    };
    
    // Cache to avoid immediate retries
    setCachedStats(chain, contract, {
      totalMinted: 0,
      totalBurned: 0,
      circulating: 0,
      lastUpdated: Date.now(),
    });
    
    return emptyResult;
  }
}

/**
 * Try to get totalSupply() from contract (if supported)
 * Falls back to event-based counting if not available
 */
export async function getTotalSupply({
  chain,
  contract,
  startBlock,
}: {
  chain: ChainSlug;
  contract: `0x${string}`;
  startBlock?: bigint;
}): Promise<number> {
  const rpcUrl = RPC_ENDPOINTS[chain];
  if (!rpcUrl) {
    return 0;
  }

  const client = createPublicClient({
    transport: http(rpcUrl),
  });

  try {
    // Try calling totalSupply() function
    const supply = await client.readContract({
      address: contract,
      abi: [
        {
          name: 'totalSupply',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'uint256' }],
        },
      ],
      functionName: 'totalSupply',
    });

    return Number(supply);
  } catch {
    // totalSupply() not available, fall back to event counting
    const stats = await getErc721MintStats({ chain, contract, startBlock });
    return stats.circulating;
  }
}
