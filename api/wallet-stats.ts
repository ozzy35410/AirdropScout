/**
 * Wallet Stats endpoint for Bolt.host serverless
 * GET /api/wallet-stats?chain=base&address=0x...
 */
import { fetchWalletStats } from '../src/lib/serverWallet';
import { CHAINS } from '../src/config/chains';

export default async function handler(req: Request): Promise<Response> {
  // Parse query parameters
  const url = new URL(req.url);
  const chain = url.searchParams.get('chain');
  const address = url.searchParams.get('address');
  
  // Validate inputs
  if (!chain) {
    return new Response(
      JSON.stringify({
        error: 'Missing required parameter: chain'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
  
  if (!address) {
    return new Response(
      JSON.stringify({
        error: 'Missing required parameter: address'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
  
  // Get chain metadata
  const chainMeta = CHAINS[chain as keyof typeof CHAINS];
  if (!chainMeta) {
    return new Response(
      JSON.stringify({
        error: `Unknown chain: ${chain}. Supported chains: ${Object.keys(CHAINS).join(', ')}`
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
  
  try {
    // Fetch wallet stats
    const stats = await fetchWalletStats(address, chainMeta);
    
    return new Response(
      JSON.stringify(stats),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60' // 60 seconds cache
        }
      }
    );
  } catch (error) {
    console.error('Error in wallet-stats handler:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}
