# Technical Context

## Technologies Used

### Frontend Stack
- **React 18.3.1**: UI library with hooks
- **TypeScript 5.6.2**: Type safety and developer experience
- **Vite 5.4.8**: Build tool and dev server
- **TailwindCSS 3.4.13**: Utility-first CSS framework
- **Lucide React 0.451.0**: Icon library

### Blockchain Integration
- **viem 2.21.30**: Modern Ethereum library (primary)
- **ethers 6.13.2**: Ethereum library (legacy support)
- **wagmi**: Wallet connection management

### Backend/Database
- **Supabase**: PostgreSQL database with real-time subscriptions
  - SDK: `@supabase/supabase-js`
  - Used for: NFT collections, user submissions, admin management
- **Cloudflare Workers**: Serverless API backend (ADDED Oct 14, 2025)
  - Endpoints: /api/ping, /api/mints, /api/wallet-stats
  - Runtime: V8 isolates (edge computing, sub-100ms latency)
  - Cache: 15-minute TTL on edge (Cloudflare cache API)
  - CORS: Enabled for cross-origin requests (`access-control-allow-origin: *`)
  - Location: Separate project directory (airdrop-api-worker/)
  - Deployment: `npx wrangler deploy` (independent from frontend)
  - Free tier: 100,000 requests/day, 10ms CPU time per request
  - Dependencies: viem 2.13.7 (blockchain interactions)
  - Configuration: wrangler.toml (name, main, compatibility_date)

### Development Tools
- **ESLint 9.12.0**: Code linting
- **TypeScript ESLint**: TypeScript-specific linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### Deployment
- **Bolt.host**: Auto-deploy from GitHub main branch
- **Vercel**: Alternative hosting (configured but not active)
- **Git/GitHub**: Version control and CI/CD trigger

## Development Setup

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
Git
```

### Installation
```bash
git clone https://github.com/ozzy35410/AirdropScout.git
cd AirdropScout
npm install
```

### Environment Variables
```env
# .env file (NOT committed to Git - contains sensitive data)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# NEW (Oct 14, 2025): Cloudflare Workers API endpoint
VITE_API_BASE=https://airdrop-api.<subdomain>.workers.dev
```

**Important Notes**:
- `.env` is in `.gitignore` (never commit secrets!)
- `.env.example` shows required variables (committed to Git)
- Bolt.host reads `.env` automatically during build
- Frontend accesses via `import.meta.env.VITE_*`
- Worker URL obtained after running `npm run deploy` in airdrop-api-worker/

### Development Server
```bash
npm run dev
# Runs on http://localhost:5173
```

### Build
```bash
npm run build
# Output: dist/
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
AirdropScout-main/
├── src/
│   ├── components/          # React components
│   │   ├── Pages/          # Page-level components
│   │   │   └── WalletStatsPage.tsx  # NEW: Wallet statistics UI
│   │   ├── Layout/         # Header, Footer, etc.
│   │   ├── NFT/            # NFT-related components
│   │   ├── MintStats/      # Mint count badge
│   │   └── ...
│   ├── config/             # Configuration files
│   │   ├── chains.ts       # Network definitions
│   │   ├── networks.ts     # Network display config
│   │   ├── rpc.ts          # RPC endpoints
│   │   ├── tasks.ts        # Task definitions
│   │   └── ...
│   ├── data/               # Data providers
│   │   └── collectionsProvider.ts
│   ├── hooks/              # Custom React hooks
│   │   ├── useMintStats.ts
│   │   ├── useWallet.ts
│   │   ├── useWalletStats.ts  # NEW: Fetch wallet stats from Worker
│   │   ├── useProgress.ts
│   │   └── ...
│   ├── lib/                # Libraries/utilities
│   │   ├── i18n.ts         # Translation system
│   │   ├── supabase.ts     # Supabase client
│   │   ├── client.ts       # Web3 clients
│   │   ├── serverWallet.ts # NEW: Shared wallet logic (unused - moved to Worker)
│   │   └── ...
│   ├── types/              # TypeScript types
│   │   ├── index.ts
│   │   └── wallet.ts       # NEW: Wallet stats types
│   ├── utils/              # Utility functions
│   │   ├── mintStats.ts    # Blockchain queries
│   │   ├── price.ts        # Price formatting
│   │   ├── api.ts          # UPDATED: API wrapper with VITE_API_BASE
│   │   └── ...
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   ├── vite-env.d.ts       # UPDATED: Added VITE_API_BASE type
│   └── index.css           # Global styles
├── locales/                # i18n translations
│   ├── en.json
│   └── tr.json
├── public/                 # Static assets
├── supabase/              # Database files
│   ├── migrations/        # SQL migrations
│   └── *.sql              # NFT insertion scripts
├── memory-bank/           # AI agent memory (this)
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── activeContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   └── progress.md
├── docs/                  # Documentation
├── api/                   # DEPRECATED: Old serverless stubs (Bolt.host doesn't support)
│   ├── ping.ts            # Replaced by Cloudflare Workers
│   └── wallet-stats.ts    # Replaced by Cloudflare Workers
├── CLOUDFLARE_WORKERS_SETUP.md  # NEW: Deployment guide
├── .env.example           # UPDATED: Added VITE_API_BASE template
└── package.json           # Dependencies

airdrop-api-worker/        # NEW: Cloudflare Workers API project
├── src/
│   ├── index.ts           # Main Worker (fetch handler)
│   ├── rpc.ts             # RPC endpoints & chain metadata
│   └── ercAbis.ts         # ERC721/1155 ABIs
├── package.json           # Dependencies (viem, wrangler)
├── wrangler.toml          # Cloudflare Workers config
└── README.md              # API documentation
```

## Technical Constraints

### RPC Rate Limits
- **Problem**: Free RPC endpoints have rate limits
- **Solutions**:
  - Chunked getLogs (8k blocks at a time)
  - 120ms delay between requests
  - 15-minute cache in localStorage
  - Lazy loading (hover/click to fetch)
  - Public CORS-enabled endpoints (blockpi.network)

### Blockchain Query Performance
- **Challenge**: Scanning millions of blocks for events
- **Solutions**:
  - Use `start_block` from database (skip old blocks)
  - Try `totalSupply()` first (1 call vs thousands)
  - Chunked queries with progress indicators
  - Error handling with silent fallback

### Supabase Enum Types
- **Constraint**: `network` column uses PostgreSQL ENUM
- **Implication**: New networks require ALTER TYPE migration
- **Workaround**: None - must run SQL before adding NFTs

### Browser Compatibility
- **Target**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Web3**: Requires MetaMask or compatible wallet extension
- **Mobile**: Responsive design, but wallet connection via WalletConnect (future)

### TypeScript Strictness
- **Mode**: Strict mode enabled
- **Challenges**: 
  - Supabase responses are `any` by default
  - Blockchain data needs runtime validation
  - Type casting sometimes necessary (`as any`, `as const`)

## Dependencies

### Core Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "~5.6.2",
  "vite": "^5.4.8",
  "tailwindcss": "^3.4.13",
  "viem": "^2.21.30",
  "ethers": "^6.13.2",
  "@supabase/supabase-js": "^2.45.4"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.3.10",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.2",
  "eslint": "^9.12.0",
  "postcss": "^8.4.47",
  "autoprefixer": "^10.4.20"
}
```

### Dependency Management
- **Lock file**: `package-lock.json` (committed)
- **Updates**: Manual, test before deploying
- **Security**: Dependabot alerts enabled on GitHub

## Tool Usage Patterns

### viem (Primary Blockchain Library)
```typescript
import { createPublicClient, http } from 'viem';
import { optimism } from 'viem/chains';

const client = createPublicClient({
  chain: optimism,
  transport: http('https://optimism.blockpi.network/v1/rpc/public', {
    batch: false,
    retryCount: 3,
    timeout: 20_000,
  }),
});

// Read contract
const supply = await client.readContract({
  address: '0x...',
  abi: [...],
  functionName: 'totalSupply',
});

// Get logs
const logs = await client.getLogs({
  address: '0x...',
  event: parseAbiItem('event Transfer(...)'),
  fromBlock: 120000000n,
  toBlock: 'latest',
});
```

### Supabase (Database)
```typescript
import { supabase } from '../lib/supabase';

// Query
const { data, error } = await supabase
  .from('nfts')
  .select('*')
  .eq('network', 'op')
  .eq('visible', true)
  .order('created_at', { ascending: false });

// Insert
const { error } = await supabase
  .from('nfts')
  .insert({ title: 'New NFT', ... });
```

### TailwindCSS (Styling)
```tsx
// Utility classes
<div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
  
// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Conditional
<div className={`px-6 py-3 ${isActive ? 'bg-blue-600' : 'bg-white'}`}>
```

### i18n (Translations)
```typescript
import { useTranslation } from '../lib/i18n';

function Component({ language }: { language: 'en' | 'tr' }) {
  const { t } = useTranslation(language);
  
  return <h1>{t('welcome_message')}</h1>;
}
```

## Build & Deployment

### Build Process
```bash
npm run build
# 1. TypeScript compilation
# 2. Vite bundling
# 3. TailwindCSS purging
# 4. Output to dist/
```

### Deployment Flow
```
Local Development
  ↓ (git commit)
Git Repository (main branch)
  ↓ (webhook)
Bolt.host
  ↓ (auto-build: npm install && npm run build)
Production (live site)
```

### Deployment Checklist
- [ ] All TypeScript errors resolved
- [ ] i18n keys added for both EN/TR
- [ ] Supabase migrations run (if any)
- [ ] Environment variables set in Bolt.host
- [ ] Git commit & push to main
- [ ] Wait for Bolt.host rebuild (~2-3 min)
- [ ] Test on live site

### Rollback Strategy
```bash
# If deployment breaks
git revert HEAD
git push origin main
# Bolt.host auto-deploys previous version
```

## Performance Optimizations

### Code Splitting
- Vite automatically splits by route
- Lazy load heavy components (future)

### Asset Optimization
- Images: Use placeholder services or optimized PNGs
- Icons: Lucide React (tree-shakeable)
- CSS: TailwindCSS purges unused classes

### Caching Strategy
- **Mint stats**: 15min localStorage cache
- **Collections**: React state (refresh on chain change)
- **RPC responses**: viem built-in cache

### Bundle Size
- Current: ~500KB (gzipped)
- Target: <1MB total
- Monitor with `npm run build -- --report`

## Known Technical Debt

1. **Type Safety**: Some `any` types in Supabase responses
2. **Error Handling**: Silent failures in some mint stat queries
3. **Mobile Wallet**: No WalletConnect integration yet
4. **Admin Panel**: UI not built (direct Supabase SQL for now)
5. **Testing**: No unit tests yet
6. **Monitoring**: No error tracking (Sentry, LogRocket)

## Future Technical Improvements

1. **GraphQL**: Replace Supabase direct queries with GraphQL
2. **WebSocket**: Real-time mint count updates
3. **Service Worker**: Offline mode for static content
4. **Web3Modal**: Better wallet connection UX
5. **E2E Tests**: Playwright or Cypress
6. **Storybook**: Component library documentation
