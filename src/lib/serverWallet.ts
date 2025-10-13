import { createPublicClient, http, type Address, isAddress, formatUnits } from 'viem';
import type { ChainMeta } from '../config/chains';

// Cache with TTL
interface CacheEntry {
  data: WalletStatsResponse;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export interface WalletStatsResponse {
  address: string;
  chain: string;
  nativeSymbol: string;
  summary: {
    interactions: { total: number; in: number; out: number };
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

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  direction: 'in' | 'out' | 'self' | 'unknown';
  timestamp: number;
  blockNumber?: number;
}

// Create viem client
function createViemClient(rpcUrl: string, chainId: number) {
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

// Fetch transaction history (simplified - last 50k blocks only for speed)
async function fetchTransactionHistory(
  client: any,
  address: Address,
  maxBlocks: number = 50_000
): Promise<Transaction[]> {
  try {
    const latestBlock = await client.getBlockNumber();
    const fromBlock = latestBlock - BigInt(maxBlocks);
    
    const transactions: Transaction[] = [];
    const uniqueHashes = new Set<string>();
    
    // Simplified: scan last 50 blocks with transactions
    const scanBlocks = 50;
    for (let i = 0; i < scanBlocks; i++) {
      try {
        const blockNum = latestBlock - BigInt(i);
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
                    blockNumber: Number(block.number)
                  });
                }
              }
            }
          }
        }
      } catch (blockError) {
        // Skip failed blocks
        continue;
      }
    }
    
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

// Compute stats from transactions
function computeStats(
  transactions: Transaction[],
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

// Main function
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
    const client = createViemClient(chainMeta.rpcUrl, chainMeta.id);
    
    // Fetch balance
    const balance = await client.getBalance({ address: address as Address });
    
    // Fetch transactions
    const transactions = await fetchTransactionHistory(client, address as Address);
    
    // Compute stats
    const stats = computeStats(transactions, address as Address, balance.toString());
    
    const response: WalletStatsResponse = {
      address,
      chain: chainMeta.slug,
      nativeSymbol: chainMeta.nativeSymbol,
      ...stats
    };
    
    // Cache it
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
