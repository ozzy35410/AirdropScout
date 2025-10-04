import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import Redis from 'redis';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Redis client (will use in-memory fallback if Redis not available)
let redisClient: any = null;
try {
  redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  await redisClient.connect();
  console.log('✅ Redis connected');
} catch (error) {
  console.log('⚠️  Redis not available, using in-memory cache');
}

// In-memory cache fallback
const memoryCache = new Map();

// Cache helper functions
const getFromCache = async (key: string) => {
  if (redisClient) {
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.warn('Redis get error:', error);
    }
  }
  return memoryCache.get(key);
};

const setToCache = async (key: string, value: string, ttl = 300) => {
  if (redisClient) {
    try {
      await redisClient.setEx(key, ttl, value);
    } catch (error) {
      console.warn('Redis set error:', error);
      memoryCache.set(key, value);
      setTimeout(() => memoryCache.delete(key), ttl * 1000);
    }
  } else {
    memoryCache.set(key, value);
    setTimeout(() => memoryCache.delete(key), ttl * 1000);
  }
};

// Initialize Supabase client (optional)
let supabase: any = null;
if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );
  console.log('✅ Supabase initialized');
} else {
  console.log('⚠️  Supabase not configured, some features may be limited');
}

// Network configurations
const NETWORK_CONFIGS = {
  linea: {
    name: 'Linea',
    rpcUrl: 'https://rpc.linea.build',
    chainId: 59144,
    color: '#000000'
  },
  zksync: {
    name: 'zkSync Era',
    rpcUrl: 'https://mainnet.era.zksync.io',
    chainId: 324,
    color: '#8C8DFC'
  },
  base: {
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    color: '#0052FF'
  },
  scroll: {
    name: 'Scroll',
    rpcUrl: 'https://rpc.scroll.io',
    chainId: 534352,
    color: '#FFEEDA'
  },
  zora: {
    name: 'Zora',
    rpcUrl: 'https://rpc.zora.energy',
    chainId: 7777777,
    color: '#000000'
  }
};

// Get provider for network
const getProvider = (network: string) => {
  const config = NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS];
  if (!config) throw new Error(`Unsupported network: ${network}`);
  return new ethers.JsonRpcProvider(config.rpcUrl);
};

// Validate Ethereum address
const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// Check NFT ownership
async function checkOwnership(
  network: string,
  contractAddress: string,
  tokenId: string,
  walletAddress: string,
  tokenStandard: string
): Promise<boolean> {
  try {
    const cacheKey = `ownership:${network}:${contractAddress}:${tokenId}:${walletAddress}`;
    const cached = await getFromCache(cacheKey);
    
    if (cached !== null && cached !== undefined) {
      return JSON.parse(cached);
    }

    const provider = getProvider(network);
    const contract = new ethers.Contract(
      contractAddress,
      tokenStandard === 'ERC-721' 
        ? ['function ownerOf(uint256) view returns (address)', 'function balanceOf(address) view returns (uint256)']
        : ['function balanceOf(address, uint256) view returns (uint256)'],
      provider
    );

    let owned = false;

    if (tokenStandard === 'ERC-721') {
      try {
        const owner = await contract.ownerOf(tokenId);
        owned = owner.toLowerCase() === walletAddress.toLowerCase();
      } catch (error) {
        // If ownerOf fails, try balanceOf
        const balance = await contract.balanceOf(walletAddress);
        owned = balance > 0;
      }
    } else if (tokenStandard === 'ERC-1155') {
      const balance = await contract.balanceOf(walletAddress, tokenId);
      owned = balance > 0;
    }

    // Cache result for 5 minutes
    await setToCache(cacheKey, JSON.stringify(owned), 300);
    return owned;
  } catch (error) {
    console.error('Ownership check error:', error);
    return false;
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all NFTs with optional filtering
app.get('/api/nfts', async (req, res) => {
  try {
    const { network, wallet, hideOwned } = req.query;
    
    let query = supabase
      .from('nfts')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false });

    if (network) {
      query = query.eq('network', network);
    }

    const { data: nfts, error } = await query;
    
    if (error) throw error;

    let filteredNfts = nfts || [];

    // Apply ownership filtering if requested
    if (wallet && hideOwned === 'true' && isValidAddress(wallet as string)) {
      const ownershipChecks = await Promise.all(
        filteredNfts.map(async (nft) => {
          const owned = await checkOwnership(
            nft.network,
            nft.contract_address,
            nft.token_id,
            wallet as string,
            nft.token_standard
          );
          return { ...nft, owned };
        })
      );

      filteredNfts = ownershipChecks.filter(nft => !nft.owned);
    }

    res.json({ nfts: filteredNfts, total: filteredNfts.length });
  } catch (error) {
    console.error('Get NFTs error:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Add new NFT (Admin)
app.post('/api/admin/nfts', async (req, res) => {
  try {
    const {
      title,
      description,
      network,
      contract_address,
      token_id,
      token_standard,
      external_link,
      tags,
      visible = true,
      price_eth
    } = req.body;

    // Validate required fields
    if (!title || !network || !contract_address || !token_id || !token_standard) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate address
    if (!isValidAddress(contract_address)) {
      return res.status(400).json({ error: 'Invalid contract address' });
    }

    // Validate network
    if (!NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS]) {
      return res.status(400).json({ error: 'Unsupported network' });
    }

    const { data, error } = await supabase
      .from('nfts')
      .insert([{
        title,
        description,
        network,
        contract_address: contract_address.toLowerCase(),
        token_id: token_id.toString(),
        token_standard,
        external_link,
        tags: tags || [],
        visible,
        price_eth
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ nft: data });
  } catch (error) {
    console.error('Add NFT error:', error);
    res.status(500).json({ error: 'Failed to add NFT' });
  }
});

// Update NFT (Admin)
app.put('/api/admin/nfts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate address if provided
    if (updates.contract_address && !isValidAddress(updates.contract_address)) {
      return res.status(400).json({ error: 'Invalid contract address' });
    }

    // Validate network if provided
    if (updates.network && !NETWORK_CONFIGS[updates.network as keyof typeof NETWORK_CONFIGS]) {
      return res.status(400).json({ error: 'Unsupported network' });
    }

    const { data, error } = await supabase
      .from('nfts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ nft: data });
  } catch (error) {
    console.error('Update NFT error:', error);
    res.status(500).json({ error: 'Failed to update NFT' });
  }
});

// Delete NFT (Admin)
app.delete('/api/admin/nfts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('nfts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'NFT deleted successfully' });
  } catch (error) {
    console.error('Delete NFT error:', error);
    res.status(500).json({ error: 'Failed to delete NFT' });
  }
});

// Get all NFTs for admin
app.get('/api/admin/nfts', async (req, res) => {
  try {
    const { data: nfts, error } = await supabase
      .from('nfts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ nfts: nfts || [] });
  } catch (error) {
    console.error('Get admin NFTs error:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Check ownership endpoint
app.post('/api/check-ownership', async (req, res) => {
  try {
    const { network, contract_address, token_id, wallet, token_standard } = req.body;

    if (!network || !contract_address || !token_id || !wallet || !token_standard) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isValidAddress(wallet) || !isValidAddress(contract_address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const owned = await checkOwnership(network, contract_address, token_id, wallet, token_standard);
    
    res.json({ owned });
  } catch (error) {
    console.error('Check ownership error:', error);
    res.status(500).json({ error: 'Failed to check ownership' });
  }
});

// Get network configurations
app.get('/api/networks', (req, res) => {
  res.json({ networks: NETWORK_CONFIGS });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});