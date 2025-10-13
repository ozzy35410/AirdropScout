import { RPC_ENDPOINTS } from './rpc';

export type ChainMeta = {
  slug: 'base' | 'op' | 'zora' | 'sei' | 'ink' | 'soneium' | 'mode' | 'giwa' | 'pharos';
  id: number;
  name: string;
  nativeSymbol: string;
  rpcUrl: string;
  explorer: string;
  explorerTx: (hash: string) => string;
  kind: 'mainnet' | 'testnet';
};

export const CHAINS: Record<ChainMeta['slug'], ChainMeta> = {
  base: {
    slug: "base",
    id: 8453,
    name: "Base",
    nativeSymbol: "ETH",
    rpcUrl: RPC_ENDPOINTS.base,
    explorer: "https://basescan.org",
    explorerTx: (hash) => `https://basescan.org/tx/${hash}`,
    kind: "mainnet" as const
  },
  op: {
    slug: "op",
    id: 10,
    name: "Optimism",
    nativeSymbol: "ETH",
    rpcUrl: RPC_ENDPOINTS.op,
    explorer: "https://optimistic.etherscan.io",
    explorerTx: (hash) => `https://optimistic.etherscan.io/tx/${hash}`,
    kind: "mainnet" as const
  },
  zora: {
    slug: "zora",
    id: 7777777,
    name: "Zora",
    nativeSymbol: "ETH",
    rpcUrl: RPC_ENDPOINTS.zora,
    explorer: "https://explorer.zora.energy",
    explorerTx: (hash) => `https://explorer.zora.energy/tx/${hash}`,
    kind: "mainnet" as const
  },
  sei: {
    slug: "sei",
    id: 1329,
    name: "Sei",
    nativeSymbol: "SEI",
    rpcUrl: RPC_ENDPOINTS.sei,
    explorer: "https://seitrace.com",
    explorerTx: (hash) => `https://seitrace.com/?module=transaction&action=info&id=${hash}`,
    kind: "mainnet" as const
  },
  ink: {
    slug: "ink",
    id: 57073,
    name: "Ink",
    nativeSymbol: "ETH",
    rpcUrl: RPC_ENDPOINTS.ink,
    explorer: "https://explorer.inkonchain.com",
    explorerTx: (hash) => `https://explorer.inkonchain.com/tx/${hash}`,
    kind: "mainnet" as const
  },
  soneium: {
    slug: "soneium",
    id: 1868,
    name: "Soneium",
    nativeSymbol: "ETH",
    rpcUrl: RPC_ENDPOINTS.soneium,
    explorer: "https://explorer.soneium.org",
    explorerTx: (hash) => `https://explorer.soneium.org/tx/${hash}`,
    kind: "mainnet" as const
  },
  mode: {
    slug: "mode",
    id: 34443,
    name: "Mode",
    nativeSymbol: "ETH",
    rpcUrl: RPC_ENDPOINTS.mode,
    explorer: "https://explorer.mode.network",
    explorerTx: (hash) => `https://explorer.mode.network/tx/${hash}`,
    kind: "mainnet" as const
  },
  giwa: {
    slug: "giwa",
    id: 91342,
    name: "GIWA Sepolia",
    nativeSymbol: "ETH",
    rpcUrl: RPC_ENDPOINTS.giwa,
    explorer: "https://sepolia-explorer.giwa.io",
    explorerTx: (hash) => `https://sepolia-explorer.giwa.io/tx/${hash}`,
    kind: "testnet" as const
  },
  pharos: {
    slug: "pharos",
    id: 688688,
    name: "Pharos Testnet",
    nativeSymbol: "PHRS",
    rpcUrl: RPC_ENDPOINTS.pharos,
    explorer: "https://testnet.pharosscan.xyz",
    explorerTx: (hash) => `https://testnet.pharosscan.xyz/tx/${hash}`,
    kind: "testnet" as const
  }
} as const;

export type ChainSlug = keyof typeof CHAINS;
export type Chain = ChainMeta;

// Helper functions
export const getChain = (slug: ChainSlug): ChainMeta => CHAINS[slug];
export const getMainnetChains = (): ChainMeta[] =>
  Object.values(CHAINS).filter(c => c.kind === 'mainnet');
export const getTestnetChains = (): ChainMeta[] =>
  Object.values(CHAINS).filter(c => c.kind === 'testnet');
