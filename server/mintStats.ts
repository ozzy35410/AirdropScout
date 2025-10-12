import { createPublicClient, http, getAbiItem, type Hex } from 'viem';
import { base, optimism, zora, sei, mainnet } from 'viem/chains';
import type { Chain } from 'viem';

// Stable public RPC endpoints for each network
const RPC_URLS: Record<string, string> = {
  base: 'https://base.blockpi.network/v1/rpc/public',
  optimism: 'https://optimism.blockpi.network/v1/rpc/public',
  zora: 'https://rpc.zora.energy',
  sei: 'https://evm-rpc.sei-apis.com',
  mode: 'https://mainnet.mode.network',
  ink: 'https://rpc-gel.inkonchain.com',
  soneium: 'https://rpc.soneium.org',
};

const CHAIN_CONFIG: Record<string, Chain> = {
  base,
  optimism,
  zora,
  sei,
  mode: mainnet, // fallback
  ink: mainnet,
  soneium: mainnet,
};

function createClient(chainKey: string) {
  const rpcUrl = RPC_URLS[chainKey];
  if (!rpcUrl) throw new Error(`Unknown chain: ${chainKey}`);

  return createPublicClient({
    chain: CHAIN_CONFIG[chainKey] || mainnet,
    transport: http(rpcUrl, {
      retryCount: 3,
      timeout: 20_000,
      batch: false,
    }),
  });
}

// ERC-721 ABI subset
const ERC721_ABI = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
  },
] as const;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Try to get mint count via totalSupply() - fastest method
 */
async function tryTotalSupply(client: any, address: Hex): Promise<bigint | null> {
  try {
    const supply = await client.readContract({
      abi: ERC721_ABI,
      address,
      functionName: 'totalSupply',
    });
    
    if (supply !== undefined && supply !== null) {
      return BigInt(supply);
    }
  } catch (err) {
    // Contract doesn't support totalSupply() or reverted
    console.log(`totalSupply() failed for ${address}:`, err instanceof Error ? err.message : 'unknown');
  }
  
  return null;
}

/**
 * Count mints via Transfer events (from == 0x0)
 * Uses 8k block chunks to avoid timeouts
 */
async function countMintsViaLogs(
  client: any,
  address: Hex,
  fromBlock: bigint,
  toBlock: bigint
): Promise<bigint> {
  const CHUNK_SIZE = 8_000n;
  const transferTopic = getAbiItem({ abi: ERC721_ABI, name: 'Transfer' })?.topic;
  
  if (!transferTopic) throw new Error('Transfer topic not found');

  let totalMints = 0n;

  for (let start = fromBlock; start <= toBlock; start += CHUNK_SIZE) {
    const end = start + CHUNK_SIZE - 1n > toBlock ? toBlock : start + CHUNK_SIZE - 1n;

    try {
      const logs = await client.getLogs({
        address,
        fromBlock: start,
        toBlock: end,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: true, name: 'tokenId', type: 'uint256' },
          ],
        },
        args: {
          from: ZERO_ADDRESS, // Only mint events (from == 0x0)
        },
      });

      totalMints += BigInt(logs.length);

      // Small delay between chunks to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 120));
    } catch (err) {
      console.error(`getLogs failed for ${address} blocks ${start}-${end}:`, err instanceof Error ? err.message : 'unknown');
      // Continue with other chunks even if one fails
    }
  }

  return totalMints;
}

/**
 * Get total mint count for an NFT contract
 * 1. Try totalSupply() first (fastest)
 * 2. Fall back to scanning Transfer events
 */
export async function getMintCount(chain: string, address: string): Promise<bigint> {
  const client = createClient(chain);
  const contractAddress = address as Hex;

  // Strategy 1: Try totalSupply() - works for most ERC-721 and ERC-721A
  const totalSupply = await tryTotalSupply(client, contractAddress);
  if (totalSupply !== null) {
    console.log(`✓ Got mint count via totalSupply() for ${address}: ${totalSupply}`);
    return totalSupply;
  }

  // Strategy 2: Scan Transfer events (slower but works for all contracts)
  console.log(`⟳ Falling back to event scanning for ${address}`);
  
  const latestBlock = await client.getBlockNumber();
  
  // Scan last 200k blocks (adjust based on network speed)
  // Base: ~200k blocks ≈ 4-5 months
  // Optimism: ~200k blocks ≈ 2-3 months
  const scanRange = 200_000n;
  const fromBlock = latestBlock > scanRange ? latestBlock - scanRange : 0n;

  const mintCount = await countMintsViaLogs(client, contractAddress, fromBlock, latestBlock);
  console.log(`✓ Got mint count via event scanning for ${address}: ${mintCount}`);

  return mintCount;
}

/**
 * Get mint count as formatted string
 */
export async function getMintCountString(chain: string, address: string): Promise<string> {
  try {
    const count = await getMintCount(chain, address);
    return count.toString();
  } catch (err) {
    console.error(`Failed to get mint count for ${chain}/${address}:`, err);
    throw err;
  }
}
