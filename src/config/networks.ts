import { NetworkConfig } from '../types';

export const NETWORKS: Record<string, NetworkConfig> = {
  // Mainnet Networks
  base: {
    name: 'base',
    displayName: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    color: 'bg-blue-500',
    explorer: 'https://basescan.org',
    type: 'mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  sei: {
    name: 'sei',
    displayName: 'Sei Network',
    rpcUrl: 'https://evm-rpc.sei-apis.com',
    chainId: 1329,
    color: 'bg-red-500',
    explorer: 'https://seitrace.com',
    type: 'mainnet',
    nativeCurrency: {
      name: 'Sei',
      symbol: 'SEI',
      decimals: 18
    }
  },
  zora: {
    name: 'zora',
    displayName: 'Zora',
    rpcUrl: 'https://rpc.zora.energy',
    chainId: 7777777,
    color: 'bg-black',
    explorer: 'https://explorer.zora.energy',
    type: 'mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  ink: {
    name: 'ink',
    displayName: 'Ink',
    rpcUrl: 'https://rpc-gel.inkonchain.com',
    chainId: 57073,
    color: 'bg-pink-500',
    explorer: 'https://explorer.inkonchain.com',
    type: 'mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  soneium: {
    name: 'soneium',
    displayName: 'Soneium',
    rpcUrl: 'https://rpc.soneium.org',
    chainId: 1868,
    color: 'bg-purple-500',
    explorer: 'https://explorer.soneium.org',
    type: 'mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  mode: {
    name: 'mode',
    displayName: 'Mode Network',
    rpcUrl: 'https://mainnet.mode.network',
    chainId: 34443,
    color: 'bg-yellow-500',
    explorer: 'https://explorer.mode.network',
    type: 'mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  op: {
    name: 'op',
    displayName: 'Optimism',
    rpcUrl: 'https://optimism.blockpi.network/v1/rpc/public',
    chainId: 10,
    color: 'bg-red-600',
    explorer: 'https://optimistic.etherscan.io',
    type: 'mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  // Testnet Networks
  giwa: {
    name: 'giwa',
    displayName: 'GIWA Sepolia',
    rpcUrl: 'https://sepolia-rpc.giwa.io',
    chainId: 91342, // 0x1652E
    color: 'bg-green-500',
    explorer: 'https://sepolia-explorer.giwa.io',
    type: 'testnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },
  pharos: {
    name: 'pharos',
    displayName: 'Pharos Testnet',
    rpcUrl: 'https://testnet.dplabs-internal.com',
    chainId: 688688, // 0xA84B0
    color: 'bg-orange-500',
    explorer: 'https://testnet.pharosscan.xyz',
    type: 'testnet',
    nativeCurrency: {
      name: 'PHRS',
      symbol: 'PHRS',
      decimals: 18
    }
  }
};

export const MAINNET_NETWORKS = Object.values(NETWORKS).filter(n => n.type === 'mainnet');
export const TESTNET_NETWORKS = Object.values(NETWORKS).filter(n => n.type === 'testnet');

export const NETWORK_OPTIONS = Object.values(NETWORKS).map(network => ({
  value: network.name,
  label: network.displayName
}));