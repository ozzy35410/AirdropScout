# System Patterns

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                         │
│  (React Components + TailwindCSS + i18n)                   │
└─────────────┬───────────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────────┐    ┌────▼─────────┐
│   Config   │    │  Data Layer  │
│  System    │    │  (Providers) │
└───┬────────┘    └────┬─────────┘
    │                  │
    │         ┌────────┴────────────┐
    │         │                     │
┌───▼─────────▼───┐        ┌───────▼────────┐
│   Blockchain    │        │   Supabase     │
│   (viem/ethers) │        │   (PostgreSQL) │
└─────────────────┘        └────────────────┘
```

## Key Technical Decisions

### 1. Multi-Network Configuration System

**Pattern**: Centralized chain configuration with typed exports

```typescript
// src/config/chains.ts
export const CHAINS = {
  op: { slug: "op", id: 10, name: "Optimism", ... },
  base: { slug: "base", id: 8453, ... },
  // ...
} as const;

export type ChainSlug = keyof typeof CHAINS;
```

**Benefits**:
- Single source of truth for network data
- Type-safe network references
- Easy to add new networks
- Auto-complete in IDE

### 2. Dynamic Collection Loading

**Pattern**: Supabase-driven NFT data with fallback

```typescript
// src/data/collectionsProvider.ts
export async function getCollections(chain: ChainSlug) {
  // 1. Fetch from Supabase
  const supabaseNfts = await fetchAdminCollections(chain);
  
  // 2. Merge with static config (if any)
  const staticNfts = NFT_COLLECTIONS[chain] ?? [];
  
  // 3. Deduplicate by slug
  return [...staticNfts, ...supabaseNfts];
}
```

**Benefits**:
- No code deploys for new NFTs
- Admin can manage via Supabase UI
- Static fallback for critical collections
- Type-safe data mapping

### 3. Lazy-Loaded Mint Statistics

**Pattern**: On-demand RPC calls with caching

```typescript
// Component level
const [enabled, setEnabled] = useState(false);

<div onMouseEnter={() => setEnabled(true)}>
  <MintCountBadge 
    contract={nft.contract}
    chain={nft.chain}
    enabled={enabled} // Only fetches when true
  />
</div>
```

**Benefits**:
- Avoids overwhelming RPC on page load
- User-controlled loading (hover/click)
- 15-minute localStorage cache
- Prevents rate limit errors

### 4. Chunked Blockchain Queries

**Pattern**: Split large getLogs calls into smaller chunks

```typescript
// src/utils/mintStats.ts
async function getLogsChunked({
  fromBlock, toBlock,
  step = 8_000n,      // 8k blocks per request
  delayMs = 120,      // 120ms between requests
}) {
  for (let start = fromBlock; start <= toBlock; start += step) {
    const logs = await client.getLogs({ ... });
    await sleep(delayMs);
  }
}
```

**Benefits**:
- Avoids RPC timeouts
- Reduces rate limit risk
- Graceful degradation (partial data if one chunk fails)
- Works with free RPC endpoints

### 5. Smart Currency Fallback

**Pattern**: Database → Network Map → Default

```typescript
// src/utils/price.ts
export function getCurrency(
  dbCurrency?: string,
  network?: string
): string {
  if (dbCurrency) return dbCurrency;
  return NETWORK_CURRENCY_MAP[network] ?? 'ETH';
}
```

**Benefits**:
- Backward compatible (defaults to ETH)
- Network-aware fallback
- Easy to add new native tokens
- Centralized currency logic

### 6. Component Hierarchy

```
App.tsx
├── HomePage
│   └── Supported Networks (auto from CHAINS)
├── TasksPage
│   ├── Network Task Cards (from *_TASKS arrays)
│   └── TestnetProgramSection (for programs)
├── NFTsPage
│   ├── Network Tabs (auto-filtered by networkType)
│   ├── Search/Filter UI
│   └── NFTCard[]
│       └── MintCountBadge (lazy-loaded)
└── FaucetsPage
    └── Faucet Links by Network
```

### 7. State Management Pattern

**Pattern**: Local state + custom hooks, no global store

```typescript
// Hooks handle complex logic
const { mintedMap } = useMintedMap(chain, address);
const { taskProgress } = useProgress(address);
const { isConnected } = useWallet();

// Components stay simple
const isOwned = mintedMap[nft.slug];
```

**Benefits**:
- No Redux/Zustand complexity
- Co-located state with components
- Easy to test hooks independently
- Clear data flow

### 8. i18n Translation Pattern

**Pattern**: Translation files + hook-based access

```typescript
// locales/en.json, locales/tr.json
{ "Optimism": "Optimism", ... }

// Component usage
const { t } = useTranslation(language);
<h1>{t('Optimism')}</h1>
```

**Benefits**:
- Type-safe keys (can add validation)
- Language switching without re-render
- Easy to spot missing translations
- Supports nested keys

### 9. RPC Endpoint Strategy

**Pattern**: Public CORS-enabled endpoints with retry

```typescript
// src/config/rpc.ts
export const RPC_ENDPOINTS = {
  op: 'https://optimism.blockpi.network/v1/rpc/public',
  base: 'https://base.blockpi.network/v1/rpc/public',
};

// Usage with retry
createPublicClient({
  transport: http(RPC_ENDPOINTS[chain], {
    batch: false,
    retryCount: 3,
    timeout: 20_000,
  }),
});
```

**Benefits**:
- Reliable public endpoints
- No API key management
- Automatic retry on failure
- Timeout protection

## Critical Implementation Paths

### Adding a New Network

1. **Add to `chains.ts`**:
   ```typescript
   newchain: {
     slug: "newchain", id: 12345,
     name: "New Chain", rpcUrl: "...",
     kind: "mainnet" | "testnet"
   }
   ```

2. **Add to `networks.ts`** (display config):
   ```typescript
   newchain: {
     name: 'newchain',
     displayName: 'New Chain',
     color: 'bg-blue-500',
     ...
   }
   ```

3. **Add RPC endpoint (`rpc.ts`)**:
   ```typescript
   newchain: 'https://rpc.newchain.io'
   ```

4. **Add currency mapping (`price.ts`)**:
   ```typescript
   'newchain': 'NEWTOKEN'
   ```

5. **Create tasks (`tasks.ts`)**:
   ```typescript
   export const NEWCHAIN_TASKS: AirdropTask[] = [...]
   ```

6. **Import tasks in `TasksPage.tsx`**:
   ```typescript
   import { NEWCHAIN_TASKS } from '../../config/tasks';
   const allTasks = [..., ...NEWCHAIN_TASKS];
   ```

7. **Supabase migration**:
   ```sql
   ALTER TYPE network_type ADD VALUE 'newchain';
   ```

8. **Test**:
   - Home: Network appears in list
   - Tasks: Network card shows
   - NFTs: Network tab appears
   - Mint stats: Uses correct RPC

### Adding New NFT Collections

**Via Supabase SQL:**
```sql
INSERT INTO public.nfts (
  title, description, network,
  contract_address, token_id, token_standard,
  external_link, image_url,
  price_eth, currency, tags,
  visible, created_at
) VALUES (
  'Cool NFT', 'Description', 'op',
  '0x...', '1', 'ERC-721',
  'https://mint.site', 'https://image.url',
  0.001, 'ETH', ARRAY['art','cool']::text[],
  true, NOW()
);
```

**Via Admin Panel (future feature)**:
- UI form to input NFT details
- Supabase client-side insert
- Immediate reflection without deploy

## Design Patterns in Use

### 1. Factory Pattern (RPC Clients)
```typescript
function createOptimizedClient(chain: ChainSlug) {
  return createPublicClient({
    transport: http(RPC_ENDPOINTS[chain], { ... }),
  });
}
```

### 2. Provider Pattern (Data Loading)
```typescript
// collectionsProvider.ts abstracts data source
export async function getCollections(chain) {
  // Could be Supabase, API, static, etc.
}
```

### 3. Hook Pattern (React State)
```typescript
export function useMintStats(contract, chain, enabled) {
  const [data, setData] = useState(null);
  useEffect(() => { ... }, [enabled]);
  return { data, loading, error };
}
```

### 4. Render Props (Conditional UI)
```typescript
{loading ? <Spinner /> : <Content data={data} />}
```

### 5. Composition (Component Building)
```typescript
<NFTCard>
  <NFTImage />
  <NFTTitle />
  <MintCountBadge />
  <PriceTag />
</NFTCard>
```

## Component Relationships

### Data Flow
```
User Action (click/hover)
  ↓
Component Event Handler
  ↓
Hook (useMintStats, useProgress, etc.)
  ↓
Utils/Providers (mintStats.ts, collectionsProvider.ts)
  ↓
External Services (Supabase, RPC)
  ↓
State Update
  ↓
Re-render with new data
```

### Network Tab Flow
```
NFTsPage receives networkType prop
  ↓
Filter CHAINS by networkType
  ↓
Map to tab buttons
  ↓
User clicks tab → setActiveChain
  ↓
Trigger getCollections(activeChain)
  ↓
Fetch from Supabase where network=activeChain
  ↓
Render filtered NFTs
```
