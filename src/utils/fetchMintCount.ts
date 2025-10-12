/**
 * Fetch mint count from backend API with timeout and abort support
 * 
 * @param chain - Network name (base, optimism, etc)
 * @param address - NFT contract address
 * @param timeoutMs - Request timeout in milliseconds (default: 8000)
 * @returns Mint count as string, or throws error
 */
export async function fetchMintCount(
  chain: string,
  address: string,
  timeoutMs = 8000
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `/api/mints?chain=${encodeURIComponent(chain)}&address=${encodeURIComponent(address)}`;
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    
    if (!data.ok || !data.minted) {
      throw new Error(data.error || 'Invalid response format');
    }

    return data.minted;
    
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error(`Timeout: Request took longer than ${timeoutMs}ms`);
      }
      throw err;
    }
    throw new Error('Unknown error fetching mint count');
    
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Format mint count for display
 * Adds thousand separators for readability
 */
export function formatMintCount(count: string | number): string {
  const num = typeof count === 'string' ? parseInt(count, 10) : count;
  
  if (isNaN(num)) return 'N/A';
  
  return num.toLocaleString('en-US');
}
