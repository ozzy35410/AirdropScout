import { createPublicClient, http, parseAbiItem, encodeEventTopics } from 'viem';
import { RPC_ENDPOINTS } from '../config/rpc';
import type { ChainSlug } from '../config/chains';

// Transfer event signature for ERC-721
const TRANSFER_EVENT = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// TransferSingle for ERC-1155
const TRANSFER_SINGLE_EVENT = parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)');

// Better RPC endpoints with CORS support
const OPTIMIZED_RPC: Record<string, string> = {
  'base': 'https://base.blockpi.network/v1/rpc/public',
  'base-sepolia': 'https://sepolia.base.org',
  'zora': 'https://rpc.zora.energy',
  'zora-sepolia': 'https://sepolia.rpc.zora.energy',
};

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
 * Create optimized RPC client with retry and timeout settings
 */
function createOptimizedClient(chain: ChainSlug) {
  const rpcUrl = OPTIMIZED_RPC[chain] || RPC_ENDPOINTS[chain];
  
  if (!rpcUrl) {
    throw new Error(`No RPC URL configured for chain: ${chain}`);
  }

  return createPublicClient({
    transport: http(rpcUrl, {
      batch: false,       // Single requests for getLogs
      retryCount: 3,
      timeout: 20_000,    // 20 second timeout
    }),
  });
}

/**
 * Get logs in chunks to avoid rate limits and timeouts
 */
async function getLogsChunked({
  client,
  address,
  event,
  args,
  fromBlock,
  toBlock,
  step = 8_000n,
  delayMs = 120,
}: {
  client: ReturnType<typeof createPublicClient>;
  address: `0x${string}`;
  event: any;
  args?: any;
  fromBlock: bigint;
  toBlock: bigint;
  step?: bigint;
  delayMs?: number;
}): Promise<any[]> {
  const logs: any[] = [];
  
  for (let start = fromBlock; start <= toBlock; start += step) {
    const end = start + step - 1n > toBlock ? toBlock : start + step - 1n;
    
    try {
      const part = await client.getLogs({
        address,
        event,
        args,
        fromBlock: start,
        toBlock: end,
      });
      
      logs.push(...part);
      
      // Small delay between chunks to avoid rate limiting
      if (delayMs && start + step <= toBlock) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    } catch (error) {
      console.warn(`[mintStats] Error fetching logs from ${start} to ${end}:`, error);
      // Continue with other chunks even if one fails
    }
  }
  
  return logs;
}

/**
 * Try to get totalSupply() from contract (fastest method)
 * Returns null if not supported
 */
async function tryTotalSupply(
  client: ReturnType<typeof createPublicClient>,
  address: `0x${string}`
): Promise<bigint | null> {
  try {
    const supply = await client.readContract({
      address,
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

    return BigInt(supply as any);
  } catch {
    return null; // totalSupply() not available
  }
}

/**
 * Get mint statistics for an ERC-721 NFT collection
 * First tries totalSupply(), then falls back to event scanning
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

  try {
    const client = createOptimizedClient(chain);
    
    // 1) Try totalSupply() first (fastest method)
    const totalSupply = await tryTotalSupply(client, contract);
    
    if (totalSupply !== null) {
      const stats: MintStats = {
        totalMinted: Number(totalSupply),
        totalBurned: 0,
        circulating: Number(totalSupply),
        lastUpdated: Date.now(),
      };
      
      setCachedStats(chain, contract, stats);
      return stats;
    }

    // 2) Fall back to event scanning with chunked requests
    const latest = await client.getBlockNumber();
    
    // Determine block range (use startBlock if provided, otherwise scan last 200k blocks)
    const maxRange = 200_000n;
    const fromBlock = startBlock ?? (latest > maxRange ? latest - maxRange : 0n);

    // Get mint events (from = 0x0) in chunks
    const mintLogs = await getLogsChunked({
      client,
      address: contract,
      event: TRANSFER_EVENT,
      args: {
        from: ZERO_ADDRESS as `0x${string}`,
      },
      fromBlock,
      toBlock: latest,
      step: 8_000n,       // 8k blocks per request
      delayMs: 120,       // 120ms delay between requests
    });

    // Count unique minted token IDs
    const mintedTokenIds = new Set<string>();
    for (const log of mintLogs) {
      if (log.args.tokenId !== undefined) {
        mintedTokenIds.add(log.args.tokenId.toString());
      }
    }

    const stats: MintStats = {
      totalMinted: mintedTokenIds.size,
      totalBurned: 0,
      circulating: mintedTokenIds.size,
      lastUpdated: Date.now(),
    };

    // Cache the result
    setCachedStats(chain, contract, stats);

    return stats;
  } catch (error) {
    console.warn(`[mintStats] Error fetching stats for ${contract} on ${chain}:`, error);
    
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

  try {
    const client = createOptimizedClient(chain);
    const latest = await client.getBlockNumber();
    
    // Determine block range
    const maxRange = 200_000n;
    const fromBlock = startBlock ?? (latest > maxRange ? latest - maxRange : 0n);

    // Get TransferSingle mint events (from = 0x0) in chunks
    const mintLogs = await getLogsChunked({
      client,
      address: contract,
      event: TRANSFER_SINGLE_EVENT,
      args: {
        from: ZERO_ADDRESS as `0x${string}`,
      },
      fromBlock,
      toBlock: latest,
      step: 8_000n,
      delayMs: 120,
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
    console.warn(`[mintStats] Error fetching ERC-1155 stats for ${contract} on ${chain}:`, error);
    
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
  try {
    const client = createOptimizedClient(chain);
    
    // Try totalSupply() first
    const supply = await tryTotalSupply(client, contract);
    
    if (supply !== null) {
      return Number(supply);
    }

    // Fall back to event counting
    const stats = await getErc721MintStats({ chain, contract, startBlock });
    return stats.circulating;
  } catch (error) {
    console.warn(`[mintStats] Error getting total supply for ${contract}:`, error);
    return 0;
  }
}
