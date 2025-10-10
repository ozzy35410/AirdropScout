export interface NFTPrice {
  amount: string;
  currency: 'ETH' | 'USD' | 'USDC' | 'WETH';
  lastUpdated: string;
  source: 'opensea' | 'zora' | 'auto' | 'manual';
}

export interface NFT {
  id: string;
  title: string;
  description?: string;
  network: 'base' | 'zora' | 'sei' | 'linea' | 'scroll' | 'giwa' | 'pharos' | 'zksync' | 'soneium';
  contract_address: string;
  token_id: string;
  token_standard: 'ERC-721' | 'ERC-1155';
  external_link?: string;
  tags?: string[];
  visible: boolean;
  imageUrl?: string;
  price_eth?: string;
  currency?: string; // Native token symbol (ETH, PHRS, GIWA, etc.)
  created_at: string;
  updated_at: string;
  owned?: boolean;
}

export interface NetworkConfig {
  name: string;
  displayName: string;
  rpcUrl: string;
  chainId: number;
  color: string;
  explorer: string;
  type: 'mainnet' | 'testnet';
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface NetworkConfigs {
  [key: string]: NetworkConfig;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface NFTListResponse {
  nfts: NFT[];
  total: number;
}

export interface AirdropTask {
  id: string;
  title: string;
  description: string;
  url: string;
  network: string;
  category: 'faucet' | 'nft' | 'swap' | 'liquidity' | 'username' | 'send' | 'lend' | 'trading' | 'rwafi' | 'bridge' | 'interaction';
  completed: boolean;
}

export interface FaucetLink {
  id: string;
  title: string;
  url: string;
  network: string;
  description: string;
}

export interface SubmittedAddress {
  id: string;
  address: string;
  timestamp: string;
  featured: boolean;
  network?: string;
}

export interface UserProgress {
  address: string;
  completedTasks: string[];
  mintedNFTs: string[];
  playedGames: string[];
  lastUpdated: string;
}

export interface WalletStats {
  overview: {
    interactions: {
      total: number;
      out: number;
      in: number;
    };
    interactedContracts: {
      unique: number;
      deploys: number;
    };
    volume: {
      nativeOut: string;
      nativeIn: string;
    };
    fees: {
      native: string;
    };
    balance: {
      native: string;
    };
    nftMint: {
      unique: number;
      total: number;
    };
    stakingLiquidity: {
      total: number;
    };
    uniqueTokensTraded: number;
    tokens: {
      erc20Unique: number;
      nftUnique: number;
    };
    lastActivity: number;
  };
  charts: {
    daily: Array<{
      date: string;
      transactions: number;
      swaps: number;
      mints: number;
    }>;
    heatmap: Record<string, number>;
  };
  txsPreview: Array<{
    hash: string;
    timestamp: number;
    to: string;
    value: string;
    type: string;
  }>;
}