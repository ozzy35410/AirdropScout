export const CHAINS = {
  base: {
    slug: "base",
    id: 8453,
    name: "Base",
    explorer: "https://basescan.org",
    rpcUrl: "https://base.llamarpc.com",
    kind: "mainnet" as const
  },
  sei: {
    slug: "sei",
    id: 1329,
    name: "Sei",
    explorer: "https://seitrace.com",
    rpcUrl: "https://evm-rpc.sei-apis.com",
    kind: "mainnet" as const
  },
  zora: {
    slug: "zora",
    id: 7777777,
    name: "Zora",
    explorer: "https://explorer.zora.energy",
    rpcUrl: "https://rpc.zora.energy",
    kind: "mainnet" as const
  },
  ink: {
    slug: "ink",
    id: 57073,
    name: "Ink",
    explorer: "https://explorer.inkonchain.com",
    rpcUrl: "https://rpc-gel.inkonchain.com",
    kind: "mainnet" as const
  },
  soneium: {
    slug: "soneium",
    id: 1868,
    name: "Soneium",
    explorer: "https://explorer.soneium.org",
    rpcUrl: "https://rpc.soneium.org",
    kind: "mainnet" as const
  },
  mode: {
    slug: "mode",
    id: 34443,
    name: "Mode",
    explorer: "https://explorer.mode.network",
    rpcUrl: "https://mainnet.mode.network",
    kind: "mainnet" as const
  },
  op: {
    slug: "op",
    id: 10,
    name: "Optimism",
    explorer: "https://optimistic.etherscan.io",
    rpcUrl: "https://optimism.blockpi.network/v1/rpc/public",
    kind: "mainnet" as const
  },
  giwa: {
    slug: "giwa",
    id: 91342,
    name: "GIWA Sepolia",
    explorer: "https://sepolia-explorer.giwa.io",
    rpcUrl: "https://sepolia-rpc.giwa.io",
    kind: "testnet" as const
  },
  pharos: {
    slug: "pharos",
    id: 688688,
    name: "Pharos Testnet",
    explorer: "https://testnet.pharosscan.xyz",
    rpcUrl: "https://testnet.dplabs-internal.com",
    kind: "testnet" as const
  }
} as const;

export type ChainSlug = keyof typeof CHAINS;
export type Chain = typeof CHAINS[ChainSlug];
