// Chain configurations for both mainnet and testnet
export interface ChainConfig {
  id: number;
  name: string;
  slug: string;
  displayName: string;
  rpcUrl: string;
  explorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  color: string;
  type: 'mainnet' | 'testnet';
}

export const CHAINS: Record<string, ChainConfig> = {
  // Mainnet chains
  base: {
    id: 8453,
    name: 'Base',
    slug: 'base',
    displayName: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    color: '#0052FF',
    type: 'mainnet'
  },
  sei: {
    id: 1329,
    name: 'Sei',
    slug: 'sei',
    displayName: 'Sei Network',
    rpcUrl: 'https://evm-rpc.sei-apis.com',
    explorer: 'https://seitrace.com',
    nativeCurrency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    },
    color: '#8B0000',
    type: 'mainnet'
  },
  
  // Testnet chains
  giwa: {
    id: 1248,
    name: 'GIWA Sepolia',
    slug: 'giwa',
    displayName: 'GIWA Sepolia',
    rpcUrl: 'https://rpc.sepolia.giwa.io',
    explorer: 'https://explorer.sepolia.giwa.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    color: '#FFEEDA',
    type: 'testnet'
  },
  pharos: {
    id: 1234,
    name: 'Pharos Testnet',
    slug: 'pharos',
    displayName: 'Pharos Testnet',
    rpcUrl: 'https://pharos-testnet.calderachain.xyz/http',
    explorer: 'https://pharos-testnet.calderachain.xyz',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    color: '#FF6B35',
    type: 'testnet'
  }
};

// Helper functions
export const getMainnetChains = () => 
  Object.values(CHAINS).filter(chain => chain.type === 'mainnet');

export const getTestnetChains = () => 
  Object.values(CHAINS).filter(chain => chain.type === 'testnet');

export const getChainsByType = (type: 'mainnet' | 'testnet') =>
  type === 'mainnet' ? getMainnetChains() : getTestnetChains();

export const getChainBySlug = (slug: string) => CHAINS[slug];