// Public RPC endpoints for each supported network
// Using reliable public RPCs with good CORS support
export const RPC_ENDPOINTS = {
  base: 'https://base.blockpi.network/v1/rpc/public', // Better than mainnet.base.org - no rate limits
  sei: 'https://evm-rpc.sei-apis.com',
  zora: 'https://rpc.zora.energy',
  ink: 'https://rpc-gel.inkonchain.com',
  soneium: 'https://rpc.soneium.org',
  mode: 'https://mainnet.mode.network',
  pharos: 'https://testnet.dplabs-internal.com',
  giwa: 'https://sepolia-rpc.giwa.io'
} as const;

export type NetworkKey = keyof typeof RPC_ENDPOINTS;