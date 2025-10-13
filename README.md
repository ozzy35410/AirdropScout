<div align="center">

# 🚀 AirdropScout

### Multi-Chain NFT Aggregator & Airdrop Task Hub

**Discover, track, and mint NFTs across 9+ blockchain networks**

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)]()
[![Networks](https://img.shields.io/badge/networks-9%20chains-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)]()

[Live Demo](https://airdrop-scout-lax0.bolt.host/) • [Report Bug](https://github.com/ozzy35410/AirdropScout/issues) • [Request Feature](https://github.com/ozzy35410/AirdropScout/issues)

</div>

---

## 📖 Overview

AirdropScout is a production-ready multi-chain platform that helps crypto enthusiasts discover and mint NFTs across **7 mainnet networks** and **2 testnets**. Built with React, TypeScript, and blockchain technology, it provides real-time mint statistics, wallet tracking, and a seamless multilingual experience.

### ✨ Key Features

🌐 **Multi-Network Support**
- 7 Mainnet: Base, Optimism, Sei, Zora, Ink, Soneium, Mode
- 2 Testnet: Pharos, GIWA Sepolia
- Easy config-driven architecture for adding new networks

🎨 **NFT Discovery**
- 20+ curated NFT collections with real contract addresses
- Real-time mint count statistics from blockchain
- FREE tag highlighting for zero-cost mints
- Smart price formatting with proper currency symbols (ETH, PHRS, SEI, GIWA)

📊 **Advanced Features**
- Backend-powered mint statistics (bypasses CORS/rate limits)
- Wallet-based tracking with "Hide Minted" filter
- React Router with URL persistence and shareable links
- 15-minute intelligent caching system

🌍 **Fully Bilingual**
- Complete English & Turkish translations
- Synchronous loading (no key flashing)
- Culturally appropriate terminology

🎯 **Task System**
- Network-specific task cards
- Direct links to faucets, DEXs, and protocols
- Manual progress tracking

---

## �️ Technology Stack

### Core
- **React 18.3** - Modern UI with hooks
- **TypeScript 5.6** - Strict type safety
- **Vite 5.4** - Lightning-fast build tool
- **TailwindCSS 3.4** - Utility-first styling
- **React Router 6** - URL-based routing with persistence

### Blockchain
- **viem 2.21** - Modern Ethereum library (primary)
- **ethers 6.13** - Legacy support
- **Optimized RPC** - Chunked queries, retry logic, caching

### Backend & Data
- **Express + TypeScript** - Mint stats API server
- **Supabase** - PostgreSQL with real-time capabilities
- **In-Memory Cache** - 15-minute TTL for RPC responses

### Developer Experience
- **ESLint 9** - Code quality
- **Lucide React** - Beautiful icons
- **Auto-Deploy** - Push to main → Live in 2-3 minutes

---

## 📚 Project Structure

```
AirdropScout-main/
├── src/
│   ├── components/          # React components
│   │   ├── Pages/          # Page components (NFTs, Tasks, Home)
│   │   ├── NFT/            # NFT-related components
│   │   ├── Layout/         # Header, Footer
│   │   └── ...
│   ├── config/             # Configuration files
│   │   ├── chains.ts       # Network definitions (9 chains)
│   │   ├── networks.ts     # Display configuration
│   │   ├── rpc.ts          # RPC endpoints
│   │   ├── tasks.ts        # Task definitions by network
│   │   └── programs.ts     # Testnet programs
│   ├── hooks/              # Custom React hooks
│   │   ├── useMintStats.ts # Mint count fetching
│   │   ├── useWallet.ts    # Wallet connection
│   │   └── ...
│   ├── lib/                # Core utilities
│   │   ├── i18n.ts         # Translation system
│   │   ├── supabase.ts     # Database client
│   │   └── client.ts       # Web3 clients
│   ├── utils/              # Helper functions
│   │   ├── fetchMintCount.ts  # Backend mint API
│   │   ├── formatPrice.ts     # Price formatting (7 decimals)
│   │   └── ...
│   └── App.tsx             # Root component with React Router
├── server/                 # Express backend
│   ├── index.ts           # API server
│   └── mintStats.ts       # Backend RPC for mint counts
├── locales/               # i18n translations
│   ├── en.json            # English
│   └── tr.json            # Turkish
├── supabase/              # Database
│   ├── migrations/        # SQL migrations
│   └── *.sql              # NFT data scripts
└── memory-bank/           # Project documentation
    ├── activeContext.md   # Current work
    ├── progress.md        # Status tracker
    └── ...
```

---

## 🌐 Supported Networks

### Mainnet (7 Networks)

| Network | Chain ID | Currency | RPC Endpoint | Status |
|---------|----------|----------|--------------|--------|
| **Base** | 8453 | ETH | base.blockpi.network | ✅ Live |
| **Optimism** | 10 | ETH | optimism.blockpi.network | ✅ Live |
| **Sei** | 1329 | SEI | evm-rpc.sei-apis.com | ✅ Live |
| **Zora** | 7777777 | ETH | rpc.zora.energy | ✅ Live |
| **Ink** | 57073 | ETH | rpc-gel.inkonchain.com | ✅ Live |
| **Soneium** | 1868 | ETH | rpc.soneium.org | ✅ Live |
| **Mode** | 34443 | ETH | mainnet.mode.network | ✅ Live |

### Testnet (2 Networks)

| Network | Chain ID | Currency | Purpose |
|---------|----------|----------|---------|
| **Pharos** | 20241022 | PHRS | Airdrop farming testnet |
| **GIWA Sepolia** | 9873 | ETH | Alternative testnet |

---

## 🎯 Core Features

### 1. NFT Discovery & Minting

**Browse Collections**
- Grid view with images, titles, descriptions
- Network tabs (auto-filtered by mainnet/testnet)
- Real-time mint count badges (prefetched on mount)
- Price display with correct currency symbols

**Smart Filtering**
- Search by name
- Filter by tags (art, gaming, free, etc.)
- Hide already-minted NFTs (wallet-based)
- Sort by price, newest, name

**Mint Statistics**
- Backend-powered RPC calls (no CORS issues)
- Strategy 1: `totalSupply()` method (fast)
- Strategy 2: Event scanning with chunking (fallback)
- 15-minute cache to prevent rate limits
- 8-second timeout with "N/A" fallback

### 2. Task Management

**Network-Specific Tasks**
- Organized by network (9 task arrays)
- Categories: Faucets, NFT mints, Swaps, Liquidity
- Direct links to external platforms
- Internal navigation to NFTs/Faucets pages

**Task Cards**
- Clear instructions per task
- Visual network badges with colors
- Manual completion checkmarks
- External link icons

### 3. URL Persistence & Routing

**React Router Integration**
- Deep linking: `/nfts?network=base`
- Browser history support (back/forward)
- F5 refresh maintains page & network selection
- Shareable URLs with network state

**State Management**
- URL parameters for network selection
- localStorage for user preferences
- No Redux/Zustand (hooks + local state)

### 4. Pretty Price Formatting

**Smart Decimal Handling**
```typescript
// Examples:
0.0100000 SEI → 0.01 SEI    (trailing zeros trimmed)
1.0000000 ETH → 1 ETH        (whole number)
0.0000001 PHRS → 0.0000001 PHRS (preserved)
```

**Features**
- Up to 7 decimal places
- Automatic trailing zero removal
- Preserves tiny values
- Dynamic currency symbols
- FREE badge for 0 price

### 5. Internationalization (i18n)

**Synchronous Loading**
- Translations bundled with app
- No key flashing on first render
- Instant language switching
- +11 KB bundle size (worth it for UX)

**Languages**
- 🇬🇧 English (100% complete)
- 🇹🇷 Turkish (100% complete)

**Implementation**
```typescript
import { useTranslation } from './lib/i18n';

const { t } = useTranslation(language);
<h1>{t('brand')}</h1> // "Airdrop Scout"
```

---

## 🔧 Technical Highlights

### Backend Mint Statistics API

**Problem Solved**: Browser-based RPC calls hit CORS restrictions and rate limits.

**Solution**: Express backend proxy for RPC calls

**Endpoint**: `GET /api/mints?chain=base&address=0x...`

**Response**:
```json
{
  "ok": true,
  "minted": "12345",
  "cached": false
}
```

**Features**:
- 3 retry attempts per request
- 20-second timeout
- 15-minute in-memory cache
- Chunked event scanning (8k blocks)
- Supports all 9 networks

### RPC Optimization Strategy

**Chunked Queries**
```typescript
// Split large block ranges
for (let start = fromBlock; start <= toBlock; start += 8000n) {
  const logs = await client.getLogs({ ... });
  await sleep(120); // Rate limit protection
}
```

**Smart Fallback**
1. Try `totalSupply()` first (1 call, instant)
2. Fall back to `getLogs` event scanning (slower but reliable)
3. Cache result for 15 minutes
4. Return "N/A" on timeout (8 seconds)

**Benefits**:
- No 503/429 rate limit errors
- Works with free public RPCs
- Graceful degradation
- User feedback at every step

### Database Schema

**NFTs Table** (`nfts`)
```sql
- id (uuid, PK)
- title (text)
- description (text)
- network (enum: 'base', 'op', 'sei', ...)
- contract_address (text)
- token_id (text)
- token_standard (text: ERC-721, ERC-1155)
- price_eth (numeric)
- currency (text: 'ETH', 'PHRS', 'SEI', 'GIWA')
- tags (text[])
- image_url (text)
- external_link (text)
- start_block (bigint, optional)
- visible (boolean)
- created_at (timestamp)
```

**View** (`nfts_view`)
- Includes currency with fallback logic
- Used by all frontend queries

### Config-Driven Architecture

**Adding a New Network** (15 minutes):

1. `src/config/chains.ts` - Add chain definition
2. `src/config/networks.ts` - Add display config
3. `src/config/rpc.ts` - Add RPC endpoint
4. `src/utils/price.ts` - Add currency mapping
5. `src/config/tasks.ts` - Create task array
6. `src/components/Pages/TasksPage.tsx` - Import tasks
7. Supabase - Run `ALTER TYPE network_type ADD VALUE 'newchain'`

✅ UI auto-updates from config!

---

## 📊 API Reference

### Public Endpoints

#### Get Mint Count
```http
GET /api/mints?chain=<chain>&address=<contract>
```

**Parameters:**
- `chain` (required): Network slug (base, op, sei, etc.)
- `address` (required): NFT contract address

**Response:**
```json
{
  "ok": true,
  "minted": "1234",
  "cached": true
}
```

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-14T12:00:00.000Z"
}
```

---

---

## 🐛 Known Issues & Solutions

### 1. RPC Rate Limits (Mitigated)
**Issue**: Free RPC endpoints throttle requests

**Solutions Applied**:
- ✅ Backend proxy (no browser CORS)
- ✅ 15-minute caching
- ✅ Chunked queries (8k blocks)
- ✅ Lazy loading (prefetch on mount)
- ✅ 120ms delay between requests

### 2. Mobile Wallet UX
**Issue**: MetaMask mobile browser is clunky

**Planned**: WalletConnect integration

### 3. Supabase Enum Management
**Issue**: Adding networks requires SQL migration

**Workaround**: Keep migration templates ready

---

## 📈 Performance Metrics

### Bundle Size
- **Frontend**: ~924 KB (includes React Router)
- **Gzipped**: ~300 KB
- **Critical CSS**: Inlined

### Load Times (Good Connection)
- **Initial Load**: < 2 seconds
- **Page Navigation**: < 500ms (client-side routing)
- **Mint Count**: 2-3 seconds (cached after first load)

### Caching
- **Mint Stats**: 15 minutes (in-memory)
- **Static Assets**: Browser cache
- **RPC Responses**: viem built-in cache

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **viem** - Modern Ethereum library
- **Supabase** - Backend-as-a-Service
- **Bolt.host** - Seamless deployment
- **TailwindCSS** - Beautiful utility-first CSS
- **Lucide** - Icon library

---

## 📞 Support

### Get Help
- 📖 [Documentation](memory-bank/) - Comprehensive project docs
- 🐛 [Report Bug](https://github.com/ozzy35410/AirdropScout/issues) - GitHub Issues
- 💡 [Request Feature](https://github.com/ozzy35410/AirdropScout/issues) - Feature requests

### Project Links
- **Live Site**: [AirdropScout](https://airdrop-scout-lax0.bolt.host/)
- **GitHub**: [ozzy35410/AirdropScout](https://github.com/ozzy35410/AirdropScout)
- **Documentation**: [Memory Bank](memory-bank/)

---

<div align="center">

**Built with ❤️ by the AirdropScout Team**

⭐ Star us on GitHub if you find this useful!

</div>