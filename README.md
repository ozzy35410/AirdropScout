# Airdrop Scout — NFT Collections Tracker

Airdrop Scout is a Next.js 14 application for browsing curated NFT drops across Base, GIWA, Sei, Pharos, and more. It combines static configuration with Supabase-backed persistence, offers wallet-aware minted tracking, and ships with a protected admin console for managing collections.

## ✨ Highlights

- **Merged catalogue** sourced from static seeds and Supabase records.
- **Minted detection** via viem log scans with caching and rate-limit backoff.
- **Wallet-aware filters** to hide or isolate collections already minted.
- **Instant i18n** (English & Turkish) with persistent language preference.
- **Admin portal** with cookie auth, Supabase CRUD, and Zod validation.

## 🧱 Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **State**: Zustand for global settings, custom hooks for blockchain state
- **Blockchain**: viem clients per network for log inspection
- **Persistence**: Supabase (PostgreSQL) for admin-authored collections
- **Validation**: Zod schemas shared across server & client

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (PostgreSQL 14+)
- Supabase CLI *(optional)*

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` with the required keys:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key

# Admin auth
# Hash your passphrase once: node -e "console.log(require('crypto').createHash('sha256').update('your-secret').digest('hex'))"
ADMIN_PASSWORD_HASH=sha256-hash-of-passphrase
# Generate a random session token: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_SESSION_TOKEN=random-hex-string
```

> **Tip:** never commit the service role key or admin secrets.

### 3. Run database migration

Apply `supabase/migrations/20251005093000_nft_collections.sql` through the Supabase SQL editor or CLI:

```bash
supabase db push   # if the CLI is linked to your project
```

The migration provisions the `nft_collections` table, indices, RLS policy, and timestamp trigger.

### 4. Start the app

```bash
npm run dev
```

The site runs at `http://localhost:3000`. The admin portal lives at `/admin/login`; sign in with the passphrase that produced `ADMIN_PASSWORD_HASH` and you’ll be redirected to `/admin/nfts`.

## 🔐 Admin Workflow

1. Visit `/admin/login` and authenticate with the configured passphrase.
2. A secure, HTTP-only cookie (30 day expiry) is issued; middleware enforces all `/admin` and `/api/admin` routes.
3. Manage collections at `/admin/nfts`:
   - **Create** custom drops with chain, contract, metadata, links, start block, and tags.
   - **Edit/Delete** Supabase-backed entries (static seeds remain read-only).
   - **Filter** by chain or search text for quick triage.
   - Zod validation runs client + server side, preventing malformed payloads.

## 🌍 Public Experience

- Header controls language, tracked wallet, and mainnet/testnet mode.
- `/nfts` merges static seeds with Supabase data per chain.
- Minted status pill shows cache state (`MISS/HIT/STALE`), rate-limit warnings, and minted totals.
- Wallet input is debounced, normalised, and checksum-formatted in the UI.

## 🛠️ Project Structure

```
app/                → App Router pages & API routes (public + admin)
components/         → Layout, NFT cards, admin console UI
config/             → Static chains & collection seeds
hooks/              → Client hooks (minted map, translations, etc.)
lib/                → Auth helpers, Supabase clients, collection merger
locales/            → EN/TR dictionaries
supabase/migrations → SQL migrations for persistence
```

## 🔌 API Overview

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/nfts?chain=base` | GET | Public merged catalogue for a chain |
| `/api/nft/minted?chain=base&address=0x…` | GET | Minted map for a wallet |
| `/api/admin/session` | POST / DELETE | Admin login & logout |
| `/api/admin/nfts` | GET / POST | List or create collections (auth required) |
| `/api/admin/nfts/[chain]/[slug]` | PUT / DELETE | Update or remove Supabase records |

All admin endpoints require the middleware-issued cookie; Supabase service credentials stay server-side.

## 🧪 Quality Notes

- TypeScript strict mode and Next.js ESLint configuration are enabled.
- Minted detector caches responses in-memory for 10 minutes to lighten RPC usage.
- Collections API serialises bigint fields (startBlock) to JSON-safe strings.

## 🆘 Troubleshooting

| Issue | Remedy |
|-------|--------|
| `ADMIN_SESSION_TOKEN is not configured` | Ensure `.env.local` defines the token before `npm run dev`. |
| Admin API returns 401 | Middleware could not validate the cookie; re-login at `/admin/login`. |
| Supabase errors appear server-side | Verify service role key + migration completion, and that `SUPABASE_URL` is correct. |
| Minted API -> `CHAIN_UNAVAILABLE` | Provide a supported slug (see `config/chains.ts`). |
| Admin cookie missing in production | Cookies require HTTPS in production; set `NEXT_PUBLIC_SITE_URL` and deploy behind TLS. |

## 📄 License

MIT — see [LICENSE](LICENSE).