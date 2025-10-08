import { AirdropTask, FaucetLink } from '../types';

export const PHAROS_TASKS: AirdropTask[] = [
  {
    id: 'pharos-faucet',
    title: 'get_test_tokens',
    description: 'Get free test tokens from Pharos faucets',
    url: '/faucets',
    network: 'pharos',
    category: 'faucet',
    completed: false
  },
  {
    id: 'pharos-nft-mint',
    title: 'mint_nfts',
    description: 'Mint NFTs from curated collections',
    url: '/nfts',
    network: 'pharos',
    category: 'nft',
    completed: false
  },
  {
    id: 'pharos-swap-zenith',
    title: 'token_swaps',
    description: 'Perform token swaps on ZenithSwap DEX',
    url: 'https://testnet.zenithswap.xyz/swap',
    network: 'pharos',
    category: 'swap',
    completed: false
  },
  {
    id: 'pharos-swap-faros',
    title: 'token_swaps',
    description: 'Trade tokens on FarosSwap platform',
    url: 'https://faroswap.xyz/swap',
    network: 'pharos',
    category: 'swap',
    completed: false
  },
  {
    id: 'pharos-liquidity-zenith',
    title: 'provide_liquidity',
    description: 'Add liquidity to pools on ZenithSwap',
    url: 'https://testnet.zenithswap.xyz/pool',
    network: 'pharos',
    category: 'liquidity',
    completed: false
  },
  {
    id: 'pharos-liquidity-faros',
    title: 'provide_liquidity',
    description: 'Add liquidity to FarosSwap pools',
    url: 'https://faroswap.xyz/pool',
    network: 'pharos',
    category: 'liquidity',
    completed: false
  },
  {
    id: 'pharos-username',
    title: 'Get Web3 Username',
    description: 'Register your Web3 username on Pharos',
    url: 'https://test.pharosname.com/',
    network: 'pharos',
    category: 'username',
    completed: false
  },
  {
    id: 'pharos-lend-borrow',
    title: 'Lend/Borrow',
    description: 'Use lending and borrowing protocols',
    url: 'https://app.open-fi.xyz/',
    network: 'pharos',
    category: 'lend',
    completed: false
  },
  {
    id: 'pharos-trading-brokex',
    title: 'Trading on BrokeX',
    description: 'Trade on BrokeX platform',
    url: 'https://app.brokex.trade/',
    network: 'pharos',
    category: 'trading',
    completed: false
  },
  {
    id: 'pharos-trading-bitverse',
    title: 'Trading on Bitverse',
    description: 'Trade with referral code on Bitverse',
    url: 'https://testnet.bitverse.zone/app/?inviteCode=PF09V5',
    network: 'pharos',
    category: 'trading',
    completed: false
  },
  {
    id: 'pharos-rwafi',
    title: 'RwaFi Protocol',
    description: 'Interact with RwaFi playground',
    url: 'https://playground.aquaflux.pro/',
    network: 'pharos',
    category: 'rwafi',
    completed: false
  },
  {
    id: 'pharos-send-tokens',
    title: 'Send Token To Friends',
    description: 'Send tokens to community addresses',
    url: '#send-tokens',
    network: 'pharos',
    category: 'send',
    completed: false
  }
];

export const GIWA_TASKS: AirdropTask[] = [
  {
    id: 'giwa-faucet',
    title: 'get_test_tokens',
    description: 'Get free test tokens from GIWA faucets',
    url: '/faucets',
    network: 'giwa',
    category: 'faucet',
    completed: false
  },
  {
    id: 'giwa-nft-mint',
    title: 'mint_nfts',
    description: 'Mint NFTs from curated collections',
    url: '/nfts',
    network: 'giwa',
    category: 'nft',
    completed: false
  }
];

export const FAUCETS: FaucetLink[] = [
  {
    id: 'giwa-faucet',
    title: 'GIWA Faucet',
    url: 'https://faucet.giwa.io/#/',
    network: 'giwa',
    description: 'Get test ETH for GIWA Sepolia network'
  },
  {
    id: 'pharos-zenith',
    title: 'ZenithSwap Faucet',
    url: 'https://testnet.zenithswap.xyz/faucet',
    network: 'pharos',
    description: 'Get test tokens for ZenithSwap'
  },
  {
    id: 'pharos-brokex',
    title: 'BrokeX Faucet',
    url: 'https://brokex.trade/faucet',
    network: 'pharos',
    description: 'Get test tokens for BrokeX trading'
  }
];

export const DEFAULT_SEND_ADDRESS = '0x5583BA39732db8006938A83BF64BBB029A0b12A0';

export const PHAROS_REFERRAL_URL = 'https://testnet.pharosnetwork.xyz/experience?inviteCode=CktVYkx8FeejVAHr';
export const PHAROS_REFERRAL_COOKIE = 'pharos_referral_opened';
export const PHAROS_REFERRAL_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// Mainnet tasks
export const BASE_TASKS: AirdropTask[] = [
  {
    id: 'base-nft-mint',
    title: 'mint_different_nfts',
    description: 'Mint different NFTs from various collections',
    url: '/nfts?network=base',
    network: 'base',
    category: 'nft',
    completed: false
  }
];

export const SEI_TASKS: AirdropTask[] = [
  {
    id: 'sei-nft-mint',
    title: 'mint_different_nfts',
    description: 'Mint different NFTs from various collections',
    url: '/nfts?network=sei',
    network: 'sei',
    category: 'nft',
    completed: false
  }
];

export const ZORA_TASKS: AirdropTask[] = [
  {
    id: 'zora-nft-mint',
    title: 'mint_different_nfts',
    description: 'Mint different NFTs from various collections',
    url: '/nfts?network=zora',
    network: 'zora',
    category: 'nft',
    completed: false
  }
];

export const INK_TASKS: AirdropTask[] = [
  {
    id: 'ink-nft-mint',
    title: 'mint_different_nfts',
    description: 'Mint different NFTs from various collections',
    url: '/nfts?network=ink',
    network: 'ink',
    category: 'nft',
    completed: false
  }
];

export const SONEIUM_TASKS: AirdropTask[] = [
  {
    id: 'soneium-nft-mint',
    title: 'mint_different_nfts',
    description: 'Mint different NFTs from various collections',
    url: '/nfts?network=soneium',
    network: 'soneium',
    category: 'nft',
    completed: false
  }
];

export const MODE_TASKS: AirdropTask[] = [
  {
    id: 'mode-nft-mint',
    title: 'mint_different_nfts',
    description: 'Mint different NFTs from various collections',
    url: '/nfts?network=mode',
    network: 'mode',
    category: 'nft',
    completed: false
  }
];