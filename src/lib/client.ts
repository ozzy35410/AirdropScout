import { createPublicClient, http, type Chain, defineChain } from 'viem';
import { base, mainnet } from 'viem/chains';
import { RPC_ENDPOINTS } from '../config/rpc';

// Define custom chains
export const seiChain: Chain = defineChain({
  id: 1329,
  name: 'Sei Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Sei',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: [RPC_ENDPOINTS.sei],
    },
  },
  blockExplorers: {
    default: { name: 'SeiTrace', url: 'https://seitrace.com' },
  },
});

export const giwaChain: Chain = defineChain({
  id: 91342,
  name: 'GIWA Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [RPC_ENDPOINTS.giwa],
    },
  },
  blockExplorers: {
    default: { name: 'GIWA Explorer', url: 'https://sepolia-explorer.giwa.io' },
  },
});

export const pharosChain: Chain = defineChain({
  id: 688688,
  name: 'Pharos Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'PHRS',
    symbol: 'PHRS',
  },
  rpcUrls: {
    default: {
      http: [RPC_ENDPOINTS.pharos],
    },
  },
  blockExplorers: {
    default: { name: 'Pharos Explorer', url: 'https://testnet.pharosscan.xyz' },
  },
});

// Create public clients for each chain
export const clients = {
  base: createPublicClient({
    chain: base,
    transport: http(RPC_ENDPOINTS.base),
  }),
  sei: createPublicClient({
    chain: seiChain,
    transport: http(RPC_ENDPOINTS.sei),
  }),
  pharos: createPublicClient({
    chain: pharosChain,
    transport: http(RPC_ENDPOINTS.pharos),
  }),
};

export type SupportedChain = keyof typeof clients;