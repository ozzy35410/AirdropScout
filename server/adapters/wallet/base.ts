import { createPublicClient, http, type PublicClient, type Address, isAddress } from 'viem';

// Type definitions
export type ChainMeta = {
  slug: string;
  id: number;
  name: string;
  nativeSymbol: string;
  rpcUrl: string;
  explorer: string;
  explorerTx: (hash: string) => string;
  kind: 'mainnet' | 'testnet';
};

export interface WalletStatsResponse {
  address: string;
  chain: string;
  nativeSymbol: string;
  summary: {
    interactions: {
      total: number;
      in: number;
      out: number;
    };
    uniqueContracts: number;
    volumeOut: string;
    balance: string;
  };
  recentTxs: Array<{
    hash: string;
    from: string;
    to: string | null;
    value: string;
    direction: 'in' | 'out' | 'self' | 'unknown';
    timestamp: number;
  }>;
  error?: string;
}

export interface WalletTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  direction: 'in' | 'out' | 'self' | 'unknown';
  timestamp: number;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
}

// In-memory cache with TTL
interface CacheEntry {
  data: WalletStatsResponse;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

// Cache configuration
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
const MAX_BLOCK_SCAN = 200_000; // Last 200k blocks
const CHUNK_SIZE = 8_000; // 8k blocks per request
const DELAY_MS = 120; // Delay between requests

/**
 * Sleep helper for rate limiting
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a viem client with robust configuration
 */
export function createViemClient(rpcUrl: string, chainId: number): PublicClient {
  return createPublicClient({
    chain: {
      id: chainId,
      name: 'Custom',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: [rpcUrl] },
        public: { http: [rpcUrl] }
      }
    },
    transport: http(rpcUrl, {
      batch: false,
      retryCount: 3,
      timeout: 20_000
    })
  });
}

/**
 * Check if address has contract code
 */
export async function isContract(client: PublicClient, address: Address): Promise<boolean> {
  try {
    const code = await client.getBytecode({ address });
    return code !== undefined && code !== '0x';
  } catch {
    return false;
  }
}

/**
 * Get balance for address
 */
export async function getBalance(client: PublicClient, address: Address): Promise<string> {
  try {
    const balance = await client.getBalance({ address });
    return balance.toString();
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
}

/**
 * Fetch transaction history using eth_getLogs
 * This is a fallback when explorer APIs are not available
 */
export async function fetchTransactionHistory(
  client: PublicClient,
  address: Address,
  maxBlocks: number = MAX_BLOCK_SCAN
): Promise<WalletTransaction[]> {
  try {
    const latestBlock = await client.getBlockNumber();
    const fromBlock = latestBlock - BigInt(maxBlocks);
    
    const transactions: WalletTransaction[] = [];
    const uniqueHashes = new Set<string>();
    
    // Fetch blocks in chunks
    for (let start = fromBlock; start <= latestBlock; start += BigInt(CHUNK_SIZE)) {
      const end = start + BigInt(CHUNK_SIZE) > latestBlock ? latestBlock : start + BigInt(CHUNK_SIZE);
      
      try {
        // Get blocks with transactions
        for (let blockNum = start; blockNum <= end; blockNum++) {
          try {
            const block = await client.getBlock({
              blockNumber: blockNum,
              includeTransactions: true
            });
            
            if (block.transactions && Array.isArray(block.transactions)) {
              for (const tx of block.transactions) {
                if (typeof tx === 'object' && tx !== null) {
                  const txObj = tx as any;
                  const txFrom = txObj.from?.toLowerCase();
                  const txTo = txObj.to?.toLowerCase();
                  const targetAddress = address.toLowerCase();
                  
                  if (txFrom === targetAddress || txTo === targetAddress) {
                    if (!uniqueHashes.has(txObj.hash)) {
                      uniqueHashes.add(txObj.hash);
                      
                      let direction: 'in' | 'out' | 'self' | 'unknown' = 'unknown';
                      if (txFrom === targetAddress && txTo === targetAddress) {
                        direction = 'self';
                      } else if (txFrom === targetAddress) {
                        direction = 'out';
                      } else if (txTo === targetAddress) {
                        direction = 'in';
                      }
                      
                      transactions.push({
                        hash: txObj.hash,
                        from: txObj.from,
                        to: txObj.to || null,
                        value: txObj.value?.toString() || '0',
                        direction,
                        timestamp: Number(block.timestamp) * 1000,
                        blockNumber: Number(block.number),
                        gasUsed: txObj.gas?.toString(),
                        gasPrice: txObj.gasPrice?.toString()
                      });
                    }
                  }
                }
              }
            }
          } catch (blockError) {
            // Skip failed blocks
            console.warn(`Failed to fetch block ${blockNum}:`, blockError);
          }
        }
        
        // Rate limiting
        if (end < latestBlock) {
          await sleep(DELAY_MS);
        }
      } catch (chunkError) {
        console.error(`Error fetching chunk ${start}-${end}:`, chunkError);
      }
    }
    
    // Sort by timestamp descending
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

/**
 * Compute wallet statistics from transaction history
 */
export function computeStats(
  transactions: WalletTransaction[],
  address: Address,
  balance: string
): Omit<WalletStatsResponse, 'address' | 'chain' | 'nativeSymbol'> {
  const addressLower = address.toLowerCase();
  
  let totalIn = 0;
  let totalOut = 0;
  let volumeOutBigInt = BigInt(0);
  const uniqueContracts = new Set<string>();
  
  for (const tx of transactions) {
    if (tx.direction === 'in') {
      totalIn++;
    } else if (tx.direction === 'out') {
      totalOut++;
      volumeOutBigInt += BigInt(tx.value);
    } else if (tx.direction === 'self') {
      totalIn++;
      totalOut++;
    }
    
    // Track unique contract interactions
    if (tx.to && tx.to.toLowerCase() !== addressLower) {
      uniqueContracts.add(tx.to.toLowerCase());
    }
  }
  
  return {
    summary: {
      interactions: {
        total: totalIn + totalOut,
        in: totalIn,
        out: totalOut
      },
      uniqueContracts: uniqueContracts.size,
      volumeOut: volumeOutBigInt.toString(),
      balance
    },
    recentTxs: transactions.slice(0, 10).map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      direction: tx.direction,
      timestamp: tx.timestamp
    }))
  };
}

/**
 * Main function to fetch wallet stats with caching
 */
export async function fetchWalletStats(
  address: string,
  chainMeta: ChainMeta
): Promise<WalletStatsResponse> {
  // Validate address
  if (!isAddress(address)) {
    return {
      address,
      chain: chainMeta.slug,
      nativeSymbol: chainMeta.nativeSymbol,
      summary: {
        interactions: { total: 0, in: 0, out: 0 },
        uniqueContracts: 0,
        volumeOut: '0',
        balance: '0'
      },
      recentTxs: [],
      error: 'Invalid address'
    };
  }
  
  // Check cache
  const cacheKey = `${chainMeta.slug}:${address.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  
  try {
    // Create client
    const client = createViemClient(chainMeta.rpcUrl, chainMeta.id);
    
    // Fetch balance
    const balance = await getBalance(client, address as Address);
    
    // Fetch transaction history
    const transactions = await fetchTransactionHistory(client, address as Address);
    
    // Compute stats
    const stats = computeStats(transactions, address as Address, balance);
    
    const response: WalletStatsResponse = {
      address,
      chain: chainMeta.slug,
      nativeSymbol: chainMeta.nativeSymbol,
      ...stats
    };
    
    // Cache the result
    cache.set(cacheKey, {
      data: response,
      expiresAt: Date.now() + CACHE_TTL_MS
    });
    
    return response;
  } catch (error) {
    console.error(`Error fetching wallet stats for ${chainMeta.slug}:`, error);
    
    return {
      address,
      chain: chainMeta.slug,
      nativeSymbol: chainMeta.nativeSymbol,
      summary: {
        interactions: { total: 0, in: 0, out: 0 },
        uniqueContracts: 0,
        volumeOut: '0',
        balance: '0'
      },
      recentTxs: [],
      error: 'Failed to fetch wallet stats. Please try again later.'
    };
  }
}

/**
 * Clear cache entry
 */
export function clearCache(chain: string, address: string) {
  const cacheKey = `${chain}:${address.toLowerCase()}`;
  cache.delete(cacheKey);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cache.clear();
}
