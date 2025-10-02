import { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http, getContract, parseAbiItem } from 'viem';
import { getChainBySlug } from '../../../src/config/chains';
import { getCollectionsByChain } from '../../../src/config/collections';

// Cache for minted status (simple in-memory cache)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// ERC-721 Transfer event ABI
const ERC721_TRANSFER_ABI = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)');

// ERC-1155 Transfer events ABI
const ERC1155_TRANSFER_SINGLE_ABI = parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)');
const ERC1155_TRANSFER_BATCH_ABI = parseAbiItem('event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chain, address } = req.query;

  if (!chain || !address) {
    return res.status(400).json({ error: 'Chain and address parameters are required' });
  }

  const chainSlug = chain as string;
  const userAddress = address as string;

  // Validate address format (basic EVM address check)
  if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
    return res.status(400).json({ error: 'Invalid address format' });
  }

  // Check cache first
  const cacheKey = `${chainSlug}-${userAddress}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  try {
    // Get chain configuration
    const chainConfig = getChainBySlug(chainSlug);
    if (!chainConfig) {
      return res.status(404).json({ error: 'Chain not found' });
    }

    // Get collections for this chain
    const collections = getCollectionsByChain(chainSlug);
    if (collections.length === 0) {
      return res.status(200).json({ minted: {} });
    }

    // Create viem public client
    const client = createPublicClient({
      chain: {
        id: chainConfig.id,
        name: chainConfig.name,
        network: chainConfig.slug,
        nativeCurrency: chainConfig.nativeCurrency,
        rpcUrls: {
          default: { http: [chainConfig.rpcUrl] },
          public: { http: [chainConfig.rpcUrl] }
        },
        blockExplorers: {
          default: { name: 'Explorer', url: chainConfig.explorer }
        }
      },
      transport: http(chainConfig.rpcUrl)
    });

    // Get current block number
    const currentBlock = await client.getBlockNumber();
    const fromBlock = currentBlock - BigInt(100000); // Look back 100k blocks

    const mintedStatus: Record<string, boolean> = {};

    // Check each collection
    for (const collection of collections) {
      try {
        let isMinted = false;

        if (collection.standard === 'erc721') {
          // Check ERC-721 mint events (Transfer from 0x0 to user)
          const logs = await client.getLogs({
            address: collection.contract as `0x${string}`,
            event: ERC721_TRANSFER_ABI,
            args: {
              from: '0x0000000000000000000000000000000000000000',
              to: userAddress as `0x${string}`
            },
            fromBlock: fromBlock > 0n ? fromBlock : 0n,
            toBlock: currentBlock
          });

          isMinted = logs.length > 0;
        } else if (collection.standard === 'erc1155') {
          // Check ERC-1155 mint events
          const [singleLogs, batchLogs] = await Promise.all([
            client.getLogs({
              address: collection.contract as `0x${string}`,
              event: ERC1155_TRANSFER_SINGLE_ABI,
              args: {
                from: '0x0000000000000000000000000000000000000000',
                to: userAddress as `0x${string}`
              },
              fromBlock: fromBlock > 0n ? fromBlock : 0n,
              toBlock: currentBlock
            }),
            client.getLogs({
              address: collection.contract as `0x${string}`,
              event: ERC1155_TRANSFER_BATCH_ABI,
              args: {
                from: '0x0000000000000000000000000000000000000000',
                to: userAddress as `0x${string}`
              },
              fromBlock: fromBlock > 0n ? fromBlock : 0n,
              toBlock: currentBlock
            })
          ]);

          isMinted = singleLogs.length > 0 || batchLogs.length > 0;
        }

        mintedStatus[collection.slug] = isMinted;
      } catch (err) {
        console.error(`Error checking collection ${collection.slug}:`, err);
        mintedStatus[collection.slug] = false;
      }
    }

    const result = { minted: mintedStatus };

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    // Clean old cache entries
    for (const [key, value] of cache.entries()) {
      if (Date.now() - value.timestamp > CACHE_DURATION) {
        cache.delete(key);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in minted detection:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}