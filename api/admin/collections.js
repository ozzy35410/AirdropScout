// Bolt.new compatible serverless function for admin collections
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const { chain } = req.query;
  
  if (!chain) {
    return res.status(400).json({ error: 'Missing chain parameter' });
  }

  try {
    // If Supabase is configured, fetch from there
    // For now, return empty array (config collections will be used as fallback)
    return res.json({ collections: [] });
    
  } catch (error) {
    console.error('Error fetching admin collections:', error);
    return res.status(500).json({ error: 'Failed to fetch collections' });
  }
}
