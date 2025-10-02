// Public RPC endpoints for each supported network
export const RPC_ENDPOINTS = {
  base: 'https://mainnet.base.org',
  sei: 'https://evm-rpc.sei-apis.com',
  pharos: 'https://testnet.dplabs-internal.com',
  giwa: 'https://sepolia-rpc.giwa.io'
} as const;

export type NetworkKey = keyof typeof RPC_ENDPOINTS;