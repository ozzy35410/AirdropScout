export const CHAINS = {
  base: {
    slug: "base",
    id: 8453,
    name: "Base",
    explorer: "https://basescan.org",
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC ?? "<BASE_RPC>",
    kind: "mainnet"
  },
  sei: {
    slug: "sei",
    id: 1329,
    name: "Sei",
    explorer: "https://sei.explorers.guru",
    rpcUrl: process.env.NEXT_PUBLIC_SEI_RPC ?? "<SEI_EVM_RPC>",
    kind: "mainnet"
  },
  giwa: {
    slug: "giwa",
    id: 91342,
    name: "GIWA Sepolia",
    explorer: "https://sepolia-explorer.giwa.io",
    rpcUrl: "https://sepolia-rpc.giwa.io",
    kind: "testnet"
  },
  pharos: {
    slug: "pharos",
    id: 688688,
    name: "Pharos Testnet",
    explorer: "https://testnet.pharosscan.xyz",
    rpcUrl: "https://testnet.dplabs-internal.com",
    kind: "testnet"
  }
} as const;

export type ChainSlug = keyof typeof CHAINS;
export type ChainKind = (typeof CHAINS)[ChainSlug]["kind"];

export const MAINNET_CHAINS: ChainSlug[] = ["base", "sei"];
export const TESTNET_CHAINS: ChainSlug[] = ["giwa", "pharos"];
