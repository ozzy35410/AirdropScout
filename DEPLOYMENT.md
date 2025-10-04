# Production Deployment Guide

## Current Changes for Production

✅ **Fixed for Production:**
- API calls now use relative paths (`/api/...`) instead of `http://localhost:3001`
- Works with Vite proxy in development
- Works with serverless functions in production

## Option 1: Vercel (Recommended)

### Setup:
1. Install Vercel CLI (if needed):
```bash
npm i -g vercel
```

2. Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

3. Convert server routes to Vercel Functions:
```bash
# Create api directory
mkdir -p api/nft
mkdir -p api/admin

# Move routes to serverless functions
# Each route becomes a separate file in /api folder
```

4. Deploy:
```bash
vercel --prod
```

### Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Option 2: Netlify

### Setup:
1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

2. Convert routes to Netlify Functions

3. Deploy:
```bash
netlify deploy --prod
```

---

## Option 3: Railway/Render (Full Stack)

### For Railway:
1. Create `railway.toml`
2. Deploy frontend and backend as separate services
3. Connect with environment variables

### For Render:
1. Create two services:
   - Web Service (Frontend)
   - Web Service (Backend)
2. Connect them via internal URLs

---

## Current Project Structure

```
project/
├── src/               # Frontend React app
│   ├── components/
│   ├── hooks/
│   │   └── useMintedMap.ts  ✅ Fixed (uses /api)
│   └── data/
│       └── collectionsProvider.ts  ✅ Fixed (uses /api)
├── server/            # Backend Express server
│   └── index.ts       # Needs conversion for serverless
├── dist/              # Build output (after npm run build)
└── package.json
```

---

## Quick Deploy (If using Vercel/Netlify already)

Simply push to GitHub:
```bash
git add .
git commit -m "Fix API paths for production deployment"
git push origin main
```

Your platform will auto-deploy if connected!

---

## Testing Production Build Locally

```bash
# Build frontend
npm run build

# Preview
npm run preview

# In separate terminal, run backend
npm run dev:backend
```

Open http://localhost:4173 (preview) and test.

---

## What's Your Current Setup?

Please tell me:
1. **Website URL**: (e.g., https://yourapp.vercel.app)
2. **Platform**: Vercel / Netlify / Other?
3. **Auto-deploy**: Connected to GitHub?

I'll provide exact steps for your setup!
