import type { ChainMeta } from '../config/chains';

export interface WalletStatsResponse {
  address: string;
  chain: string;
  nativeSymbol: string;
  summary: {
    interactions: {
      total: number;
      in: number;
      out: number;
    };
    uniqueContracts: number;
    volumeOut: string; // in native units, string
    balance: string; // in native units, string
  };
  recentTxs: Array<{
    hash: string;
    from: string;
    to: string | null;
    value: string; // native units
    direction: 'in' | 'out' | 'self' | 'unknown';
    timestamp: number; // ms
  }>;
  error?: string;
}

export interface WalletTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  direction: 'in' | 'out' | 'self' | 'unknown';
  timestamp: number;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
}

export interface WalletAdapterOptions {
  maxBlockScan?: number;
  chunkSize?: number;
  delayMs?: number;
  cacheSeconds?: number;
}

export interface FetchWalletStatsParams {
  address: string;
  chainMeta: ChainMeta;
  options?: WalletAdapterOptions;
}
