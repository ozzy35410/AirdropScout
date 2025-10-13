export default async (req: Request) => {
  const url = new URL(req.url);
  const chain = url.searchParams.get('chain');
  const address = url.searchParams.get('address');

  if (!chain || !address) {
    return new Response(JSON.stringify({ error: 'missing_params' }), {
      headers: { 'content-type': 'application/json' },
      status: 400,
    });
  }

  // --- geçici demo veri (rotanın çalıştığını görmek için) ---
  const demo = {
    chain,
    address,
    interactions: { total: 7, out: 5, in: 2 },
    interactedContracts: { unique: 3, deploys: 0 },
    volume: { out: 0.12, fees: 0.0031 },
    balance: 0.0456,
    recent: [],
  };

  return new Response(JSON.stringify(demo), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
};
