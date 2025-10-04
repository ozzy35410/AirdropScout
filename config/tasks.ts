export const TASK_CONFIG = {
  giwa: [
    {
      id: "giwa-faucet",
      titleKey: "task_faucet_giwa",
      url: "https://faucet.giwa.io/#/",
      external: true
    },
    {
      id: "giwa-mint-nft",
      titleKey: "task_mint_nft_giwa",
      url: "/nfts?network=giwa",
      external: false
    }
  ],
  pharos: [
    {
      id: "pharos-swap-zenith",
      titleKey: "task_swap",
      url: "https://testnet.zenithswap.xyz/swap",
      external: true,
      group: "swap"
    },
    {
      id: "pharos-swap-faroswap",
      titleKey: "task_swap",
      url: "https://faroswap.xyz/swap",
      external: true,
      group: "swap"
    },
    {
      id: "pharos-liquidity-zenith",
      titleKey: "task_add_liquidity",
      url: "https://testnet.zenithswap.xyz/pool",
      external: true,
      group: "liquidity"
    },
    {
      id: "pharos-liquidity-faroswap",
      titleKey: "task_add_liquidity",
      url: "https://faroswap.xyz/pool",
      external: true,
      group: "liquidity"
    },
    {
      id: "pharos-web3-username",
      titleKey: "task_web3_username",
      url: "https://test.pharosname.com/",
      external: true
    },
    {
      id: "pharos-send-token",
      titleKey: "task_send_token",
      defaultAddress: "0x5583BA39732db8006938A83BF64BBB029A0b12A0",
      external: false
    },
    {
      id: "pharos-lend-borrow",
      titleKey: "task_lend_borrow",
      url: "https://app.open-fi.xyz/",
      external: true
    },
    {
      id: "pharos-trading-brokex",
      titleKey: "task_trading",
      url: "https://app.brokex.trade/",
      external: true,
      group: "trading"
    },
    {
      id: "pharos-trading-bitverse",
      titleKey: "task_trading",
      url: "https://testnet.bitverse.zone/app/?inviteCode=PF09V5",
      external: true,
      group: "trading"
    },
    {
      id: "pharos-rwafi",
      titleKey: "task_rwafi",
      url: "https://playground.aquaflux.pro/",
      external: true
    }
  ],
  base: [
    {
      id: "base-mint-nfts",
      titleKey: "mint_nfts",
      url: "/nfts?network=base",
      external: false
    }
  ],
  sei: [
    {
      id: "sei-mint-nfts",
      titleKey: "mint_nfts",
      url: "/nfts?network=sei",
      external: false
    }
  ]
} as const;
