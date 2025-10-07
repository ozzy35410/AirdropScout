// Bolt.new compatible serverless function for NFT mint detection
import { createPublicClient, http, parseAbiItem } from 'viem';

// Chain configurations
const CHAINS = {
  base: {
    slug: "base",
    id: 8453,
    name: "Base",
    rpcUrl: "https://base.llamarpc.com"
  },
  sei: {
    slug: "sei",
    id: 1329,
    name: "Sei",
    rpcUrl: "https://evm-rpc.sei-apis.com"
  },
  giwa: {
    slug: "giwa",
    id: 91342,
    name: "GIWA Sepolia",
    rpcUrl: "https://sepolia-rpc.giwa.io"
  },
  pharos: {
    slug: "pharos",
    id: 688688,
    name: "Pharos Testnet",
    rpcUrl: "https://testnet.dplabs-internal.com"
  }
};

// NFT Collections - should be dynamically fetched from Admin API
// Keeping empty by default - collections should be added via Admin panel
const NFT_COLLECTIONS = {
  base: [],
  sei: [],
  giwa: [],
  pharos: []
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const startTime = Date.now();
  const { chain, address, refresh } = req.query;

  // Validate inputs
  if (!chain || !address) {
    return res.status(400).json({ 
      ok: false, 
      error: 'INVALID_REQUEST',
      message: 'Missing chain or address parameter' 
    });
  }

  const cleanAddress = address.toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(cleanAddress)) {
    return res.status(400).json({ 
      ok: false, 
      error: 'INVALID_ADDRESS',
      message: 'Invalid Ethereum address format'
    });
  }

  const chainConfig = CHAINS[chain];
  if (!chainConfig) {
    return res.status(400).json({ 
      ok: false, 
      error: 'CHAIN_UNAVAILABLE',
      message: 'Unsupported chain'
    });
  }

  try {
    // Get collections for this chain
    const collections = NFT_COLLECTIONS[chain] || [];
    
    if (collections.length === 0) {
      return res.json({
        ok: true,
        chain,
        address: cleanAddress,
        minted: {},
        meta: {
          elapsedMs: Date.now() - startTime,
          cache: 'MISS',
          rateLimited: false
        }
      });
    }

    // Create viem client
    const client = createPublicClient({
      transport: http(chainConfig.rpcUrl)
    });

    // Get current block
    const latestBlock = await client.getBlockNumber();

    // Detect mints for each collection
    const minted = {};
    let rateLimited = false;

    for (const collection of collections) {
      try {
        const toBlock = latestBlock;
        const fromBlock = collection.startBlock 
          ? BigInt(collection.startBlock.toString())
          : (toBlock > 200_000n ? toBlock - 200_000n : 0n);

        if (collection.standard === 'erc721') {
          // ERC-721: Transfer(address,address,uint256)
          const logs = await client.getLogs({
            address: collection.contract,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
            args: {
              from: ZERO_ADDRESS,
              to: cleanAddress
            },
            fromBlock,
            toBlock
          }).catch(() => []);

          minted[collection.slug] = logs.length > 0;

        } else if (collection.standard === 'erc1155') {
          // ERC-1155: TransferSingle and TransferBatch
          const singleLogs = await client.getLogs({
            address: collection.contract,
            event: parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)'),
            args: {
              from: ZERO_ADDRESS,
              to: cleanAddress
            },
            fromBlock,
            toBlock
          }).catch(() => []);

          const batchLogs = await client.getLogs({
            address: collection.contract,
            event: parseAbiItem('event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)'),
            args: {
              from: ZERO_ADDRESS,
              to: cleanAddress
            },
            fromBlock,
            toBlock
          }).catch(() => []);

          minted[collection.slug] = singleLogs.length > 0 || batchLogs.length > 0;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`Error checking ${collection.slug}:`, error.message);
        minted[collection.slug] = false;
        if (error.message?.includes('rate') || error.message?.includes('429')) {
          rateLimited = true;
        }
      }
    }

    return res.json({
      ok: true,
      chain,
      address: cleanAddress,
      minted,
      meta: {
        elapsedMs: Date.now() - startTime,
        cache: 'MISS',
        rateLimited
      }
    });

  } catch (error) {
    console.error('NFT mint detection error:', error);
    return res.status(500).json({ 
      ok: false, 
      error: 'UNKNOWN',
      message: error.message || 'Failed to check minted status',
      meta: {
        elapsedMs: Date.now() - startTime,
        cache: 'ERROR',
        rateLimited: false
      }
    });
  }
}
