// Public RPC endpoints for each supported network
export const RPC_ENDPOINTS = {
  base: 'https://mainnet.base.org',
  sei: 'https://evm-rpc.sei-apis.com',
  pharos: 'https://pharos-testnet.calderachain.xyz/http'
} as const;

export type NetworkKey = keyof typeof RPC_ENDPOINTS;