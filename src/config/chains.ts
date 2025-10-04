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
