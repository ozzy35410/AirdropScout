import { AirdropTask, FaucetLink } from '../types';

export const GIWA_TASKS: AirdropTask[] = [
  {
    id: 'giwa-faucet',
    title: 'task_faucet_giwa',
    description: 'task_faucet_giwa_desc',
    url: '/faucets?network=giwa',
    network: 'giwa',
    category: 'faucet',
    completed: false
  },
  {
    id: 'giwa-mint-nft',
    title: 'task_mint_nft_giwa',
    description: 'task_mint_nft_giwa_desc',
    url: '/nfts?network=giwa',
    network: 'giwa',
    category: 'nft',
    completed: false
  }
];

export const PHAROS_TASKS: AirdropTask[] = [
  {
    id: 'pharos-faucet',
    title: 'get_test_tokens',
    description: 'get_free_test_tokens_desc',
    url: '/faucets',
    network: 'pharos',
    category: 'faucet',
    completed: false
  },
  {
    id: 'pharos-nft-mint',
    title: 'mint_nfts',
    description: 'mint_nfts_desc',
    url: '/nfts',
    network: 'pharos',
    category: 'nft',
    completed: false
  },
  {
    id: 'pharos-swap-zenith',
    title: 'token_swaps',
    description: 'token_swaps_zenith_desc',
    url: 'https://testnet.zenithswap.xyz/swap',
    network: 'pharos',
    category: 'swap',
    completed: false
  },
  {
    id: 'pharos-swap-faros',
    title: 'token_swaps',
    description: 'token_swaps_faros_desc',
    url: 'https://faroswap.xyz/swap',
    network: 'pharos',
    category: 'swap',
    completed: false
  },
  {
    id: 'pharos-liquidity-zenith',
    title: 'provide_liquidity',
    description: 'provide_liquidity_zenith_desc',
    url: 'https://testnet.zenithswap.xyz/pool',
    network: 'pharos',
    category: 'liquidity',
    completed: false
  },
  {
    id: 'pharos-liquidity-faros',
    title: 'provide_liquidity',
    description: 'provide_liquidity_faros_desc',
    url: 'https://faroswap.xyz/pool',
    network: 'pharos',
    category: 'liquidity',
    completed: false
  },
  {
    id: 'pharos-username',
    title: 'get_web3_username',
    description: 'get_web3_username_desc',
    url: 'https://test.pharosname.com/',
    network: 'pharos',
    category: 'username',
    completed: false
  },
  {
    id: 'pharos-lend-borrow',
    title: 'lend_borrow',
    description: 'lend_borrow_desc',
    url: 'https://app.open-fi.xyz/',
    network: 'pharos',
    category: 'lend',
    completed: false
  },
  {
    id: 'pharos-trading-brokex',
    title: 'trading_brokex',
    description: 'trading_brokex_desc',
    url: 'https://app.brokex.trade/',
    network: 'pharos',
    category: 'trading',
    completed: false
  },
  {
    id: 'pharos-trading-bitverse',
    title: 'trading_bitverse',
    description: 'trading_bitverse_desc',
    url: 'https://testnet.bitverse.zone/app/?inviteCode=PF09V5',
    network: 'pharos',
    category: 'trading',
    completed: false
  },
  {
    id: 'pharos-rwafi',
    title: 'rwafi_protocol',
    description: 'rwafi_protocol_desc',
    url: 'https://playground.aquaflux.pro/',
    network: 'pharos',
    category: 'rwafi',
    completed: false
  },
  {
    id: 'pharos-send-tokens',
    title: 'send_token_friends',
    description: 'send_token_friends_desc',
    url: '#send-tokens',
    network: 'pharos',
    category: 'send',
    completed: false
  }
];

export const FAUCETS: FaucetLink[] = [
  {
    id: 'giwa-official',
    title: 'faucet_giwa_title',
    url: 'https://sepolia-faucet.giwa.io/',
    network: 'giwa',
    description: 'faucet_giwa_description',
    type: 'external'
  },
  {
    id: 'pharos-main',
    title: 'pharos_network_faucet',
    url: 'https://testnet.pharosnetwork.xyz/',
    network: 'pharos',
    description: 'pharos_network_faucet_desc',
    type: 'external'
  },
  {
    id: 'pharos-zenith',
    title: 'zenithswap_faucet',
    url: 'https://testnet.zenithswap.xyz/faucet',
    network: 'pharos',
    description: 'zenithswap_faucet_desc',
    type: 'external'
  },
  {
    id: 'pharos-brokex',
    title: 'brokex_faucet',
    url: 'https://brokex.trade/faucet',
    network: 'pharos',
    description: 'brokex_faucet_desc',
    type: 'external'
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

export const NETWORK_TASKS: Record<string, AirdropTask[]> = {
  giwa: GIWA_TASKS,
  pharos: PHAROS_TASKS,
  base: BASE_TASKS,
  sei: SEI_TASKS
};