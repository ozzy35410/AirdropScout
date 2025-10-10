/**
 * Normalize price_eth from Supabase into a consistent type.
 * @returns number | null where 0 means free, null means unknown
 */
export function normalizePriceEth(input: unknown): number | null {
  if (input === undefined || input === null) return null;
  const s = String(input).trim().toLowerCase();

  // treat empty / "free" as free
  if (s === '' || s === 'free') return 0;

  // "0", "0.", "0.0", "0.0000..." → free
  if (s === '0' || s === '0.' || /^0\.0*$/.test(s)) return 0;

  const n = Number(s);
  if (Number.isFinite(n)) return n;

  return null; // unknown price
}

/**
 * Format price with currency symbol
 * @param amount - Price amount (can be null/undefined)
 * @param currency - Currency symbol (defaults to 'ETH')
 * @returns Formatted price string or null
 */
export function formatPrice(
  amount: number | null | undefined,
  currency?: string | null
): string | null {
  if (amount === null || amount === undefined) return null;
  if (amount === 0) return 'FREE';
  
  const sym = currency?.trim() || 'ETH';
  
  // Format based on amount size
  if (amount >= 1) {
    return `${amount.toFixed(4)} ${sym}`;
  } else if (amount >= 0.0001) {
    return `${amount.toFixed(6)} ${sym}`;
  } else {
    return `${amount.toFixed(8)} ${sym}`;
  }
}

/**
 * Get default currency for a network
 * Fallback mapping when currency is not specified in database
 */
export const NETWORK_CURRENCY_MAP: Record<string, string> = {
  'pharos': 'PHRS',
  'pharos-testnet': 'PHRS',
  'giwa': 'ETH',          // GIWA Sepolia uses ETH
  'giwa-sepolia': 'ETH',
  'giwa-testnet': 'ETH',
  'base': 'ETH',
  'base-sepolia': 'ETH',
  'sei': 'SEI',
  'zora': 'ETH',
  'zora-sepolia': 'ETH',
  'ink': 'ETH',
  'soneium': 'ETH',
  'mode': 'ETH',
  'op': 'ETH',            // Optimism uses ETH
  'optimism': 'ETH',
  'linea': 'ETH',
  'zksync': 'ETH',
  'scroll': 'ETH',
};

/**
 * Get currency for an NFT with network fallback
 */
export function getCurrency(
  nftCurrency?: string | null,
  network?: string | null
): string {
  if (nftCurrency?.trim()) {
    return nftCurrency.trim();
  }
  
  if (network) {
    const fallback = NETWORK_CURRENCY_MAP[network.toLowerCase()];
    if (fallback) return fallback;
  }
  
  return 'ETH'; // Ultimate fallback
}

