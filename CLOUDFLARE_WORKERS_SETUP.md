# Cloudflare Workers API Setup

AirdropScout uses a separate Cloudflare Workers API for serverless backend logic because Bolt.host doesn't support Express-based backends or `/api` routes natively.

## Why Cloudflare Workers?

- ✅ **Bolt.host Compatibility**: SPA-only, no backend support
- ✅ **Serverless**: No infrastructure management
- ✅ **Edge Caching**: 15-minute cache for fast responses
- ✅ **CORS-Safe**: No cross-origin issues
- ✅ **Cost**: Free tier (100k requests/day)

## Setup Steps

### 1. Install Node.js

Download and install from https://nodejs.org/ (LTS version recommended)

### 2. Deploy the Worker

```bash
# Navigate to Worker directory
cd airdrop-api-worker

# Install dependencies
npm install

# Login to Cloudflare (opens browser)
npx wrangler login

# Test locally (optional)
npm run dev
# Visit: http://127.0.0.1:8787/api/ping

# Deploy to production
npm run deploy
```

You'll get a Worker URL like:
```
https://airdrop-api.<your-subdomain>.workers.dev
```

### 3. Configure Frontend

Create a `.env` file in the AirdropScout root:

```bash
# Copy example
cp .env.example .env

# Edit .env and add your Worker URL
VITE_API_BASE=https://airdrop-api.<your-subdomain>.workers.dev

# Also add your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Push to GitHub

```bash
git add .env .env.example src/
git commit -m "feat: Add Cloudflare Workers API integration"
git push origin main
```

Bolt.host will auto-deploy and use your Worker for all API calls.

## Testing

### Test Worker Endpoints

```bash
# Health check
curl https://airdrop-api.<your-subdomain>.workers.dev/api/ping

# Mint count (Base network)
curl "https://airdrop-api.<your-subdomain>.workers.dev/api/mints?chain=base&address=0x6BcDa569E55C90FA1AcEbe3BeE1C968Ebe697657"

# Wallet stats (Base network)
curl "https://airdrop-api.<your-subdomain>.workers.dev/api/wallet-stats?chain=base&address=0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
```

### Test Frontend Integration

1. Visit: https://airdrop-scout-lax0.bolt.host/wallet-stats
2. Select **Base** network
3. Enter wallet address: `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`
4. Click search
5. Should see:
   - Balance (in ETH)
   - Transaction count
   - No "HTML parse" errors in console

## Architecture

```
┌─────────────────┐
│   Bolt.host     │
│  (Frontend SPA) │
│  React + Vite   │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────────┐
│ Cloudflare Workers  │
│   (API Backend)     │
│  /api/ping          │
│  /api/mints         │
│  /api/wallet-stats  │
└─────────┬───────────┘
          │
          │ RPC Calls
          │
┌─────────▼──────────┐
│  Blockchain RPCs   │
│  Base, OP, Zora... │
└────────────────────┘
```

## Troubleshooting

### "API did not return JSON" error

- Worker not deployed or URL wrong in `.env`
- Check Worker URL in Cloudflare dashboard
- Verify `.env` is committed (but `.env` should be in `.gitignore` for secrets!)
- Use `.env.example` for reference, create `.env` locally

### Wallet Stats shows loading forever

- Check Worker logs: `npx wrangler tail`
- Verify RPC endpoints are working
- Test Worker endpoint directly with curl

### CORS errors

- Worker includes CORS headers automatically
- If you still see errors, check Worker deployment status
- Clear browser cache (CTRL+F5)

## Cost Estimate

Cloudflare Workers Free Tier:
- **100,000 requests/day**
- **10ms CPU time per request**
- **No credit card required**

Typical usage:
- ~1,000 users/day = ~5,000 requests/day
- Well within free tier limits

Paid plan if needed:
- $5/month for 10M requests

## Updates

To update Worker code:

```bash
cd airdrop-api-worker
# Edit src/index.ts, src/rpc.ts, etc.
npm run deploy
```

Frontend will automatically use updated Worker (no rebuild needed).

## Security

- Worker runs on Cloudflare's edge network (secure)
- No API keys exposed (RPC endpoints are public)
- CORS restricted to your domain (configure in `src/index.ts`)
- Rate limiting handled by Cloudflare automatically

## Support

If you encounter issues:
1. Check Worker logs: `npx wrangler tail`
2. Test endpoints with curl
3. Verify `.env` configuration
4. Check Cloudflare Workers dashboard for errors
