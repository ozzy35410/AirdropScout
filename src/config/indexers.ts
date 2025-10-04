// Router/DEX/LP/NFT/NameService contract addresses for each chain
// Easy to update and maintain allowlists

export const INDEXER_CONTRACTS = {
  base: {
    routers: [
      // TODO: Add Base DEX router addresses
      "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24", // BaseSwap Router (example)
      "0x327df1e6de05895d2ab08513aadd9313fe505d86", // Aerodrome Router (example)
    ],
    lpPools: [
      // TODO: Add Base LP pool addresses
    ],
    nftMarketplaces: [
      // TODO: Add Base NFT marketplace addresses
      "0x00000000000001ad428e4906ae43d8f9852d0dd6", // OpenSea Seaport (example)
    ],
    nameServices: [
      // TODO: Add Base name service addresses
      "0x4ccb0bb02fcaba27e82a56646e81d8c5bc4119a5", // Basename (example)
    ]
  },
  sei: {
    routers: [
      // TODO: Add Sei DEX router addresses
    ],
    lpPools: [
      // TODO: Add Sei LP pool addresses
    ],
    nftMarketplaces: [
      // TODO: Add Sei NFT marketplace addresses
    ],
    nameServices: [
      // TODO: Add Sei name service addresses
    ]
  },
  giwa: {
    routers: [
      // TODO: Add GIWA testnet DEX router addresses
    ],
    lpPools: [
      // TODO: Add GIWA testnet LP pool addresses
    ],
    nftMarketplaces: [
      // TODO: Add GIWA testnet NFT marketplace addresses
    ],
    nameServices: [
      // TODO: Add GIWA testnet name service addresses
    ]
  },
  pharos: {
    routers: [
      // TODO: Add Pharos testnet DEX router addresses
      // ZenithSwap, FaroSwap routers will be added here
    ],
    lpPools: [
      // TODO: Add Pharos testnet LP pool addresses
    ],
    nftMarketplaces: [
      // TODO: Add Pharos testnet NFT marketplace addresses
    ],
    nameServices: [
      // TODO: Add Pharos testnet name service addresses
      // test.pharosname.com contract address
    ]
  }
};

// Event topics for different token standards
export const EVENT_TOPICS = {
  ERC20_TRANSFER: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  ERC721_TRANSFER: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  ERC1155_SINGLE: "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
  ERC1155_BATCH: "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb",
  UNISWAP_V2_SWAP: "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
  UNISWAP_V3_SWAP: "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
  UNISWAP_V2_MINT: "0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f",
  UNISWAP_V2_BURN: "0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496"
};

// Helper function to get all contract addresses for a chain
export function getAllContracts(chain: keyof typeof INDEXER_CONTRACTS): string[] {
  const contracts = INDEXER_CONTRACTS[chain];
  return [
    ...contracts.routers,
    ...contracts.lpPools,
    ...contracts.nftMarketplaces,
    ...contracts.nameServices
  ];
}

// Helper function to check if address is a known contract
export function isKnownContract(chain: keyof typeof INDEXER_CONTRACTS, address: string): boolean {
  return getAllContracts(chain).includes(address.toLowerCase());
}