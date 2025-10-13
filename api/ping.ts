/**
 * Health check endpoint for Bolt.host serverless
 * GET /api/ping
 */
export default async function handler(req: Request): Promise<Response> {
  return new Response(
    JSON.stringify({
      ok: true,
      time: Date.now(),
      message: 'AirdropScout API is running'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}
