export default async () =>
  new Response(JSON.stringify({ ok: true, time: Date.now() }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
