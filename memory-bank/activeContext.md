# Active Context

## Current Work Focus

### Just Completed: i18n Synchronous Loading Fix
**Date**: October 12, 2025

Fixed the translation key flashing issue on first page load:

1. **Problem Identified** ✅
   - Translations were loaded asynchronously via `fetch()`
   - First render showed keys like "discover_complete", "brand" instead of actual text
   - Switching tabs triggered re-render with loaded translations

2. **Solution Implemented** ✅
   - Changed from async `fetch()` to synchronous `import`
   - Translations now bundled with application code
   - Available immediately on first render
   - No more key flashing

3. **Changes Made** ✅
   - Updated `src/lib/i18n.ts`:
     - Import translations: `import enTranslations from '../../locales/en.json'`
     - Removed async `loadTranslations()` function
     - Removed fallback translations (no longer needed)
   - Updated `tsconfig.app.json`:
     - Added `"resolveJsonModule": true` for JSON imports
   
4. **Results** ✅
   - Page always shows correct translations on first load
   - Bundle size increased slightly: 879.51 KB → 891.12 KB (~11 KB for both JSON files)
   - Trade-off: 11 KB bundle increase for perfect UX
   - No more flickering or key display

### Previously Completed: Pretty Price Formatting
**Date**: October 10, 2025

Successfully implemented elegant price formatting across all NFT cards and components:

1. **New Utility** ✅
   - Created `src/utils/formatPrice.ts`
   - Keeps up to 7 decimals, trims trailing zeros
   - Preserves tiny values (0.0000001 stays intact)
   - Handles edge cases (0, null, undefined)

2. **Applied Everywhere** ✅
   - `src/components/NFT/NFTCard.tsx` (main NFT card)
   - `src/components/NFTCard.tsx` (old card component)
   - `src/components/Pages/NFTsPage.tsx` (list view)
   - `src/components/Admin/AdminPanel.tsx` (admin panel)

3. **Results** ✅
   - `0.0100000 SEI` → `0.01 SEI`
   - `1.0000000 ETH` → `1 ETH`
   - `0.0000001 PHRS` → `0.0000001 PHRS` (preserved)
   - FREE badge still shows for 0 price
   - Currency symbols remain dynamic

### Previously Completed: Optimism (OP) Network Integration
**Date**: October 10, 2025

Successfully added full Optimism mainnet support across the entire platform:

1. **Configuration Layer** ✅
   - Added OP to `chains.ts` (chainId: 10)
   - Added OP to `networks.ts` (display config, color: red-600)
   - Added OP RPC endpoint: `optimism.blockpi.network/v1/rpc/public`
   - Added OP currency mapping (ETH) in `price.ts`

2. **Tasks System** ✅
   - Created `OP_TASKS` array with NFT minting task
   - Task: "Mint different NFTs daily to stay active"
   - Links to `/nfts?network=op`
   - Imported in `TasksPage.tsx`

3. **NFTs Page** ✅
   - OP tab automatically appears (filtered by `networkType: 'mainnet'`)
   - URL param `?network=op` works
   - Collections load from Supabase `where network='op'`

4. **Home Page** ✅
   - OP appears in Supported Networks (auto from `MAINNET_NETWORKS`)
   - Shows "Optimism" with ETH symbol

5. **i18n** ✅
   - English: "Optimism", "Open NFTs", "Mint different NFTs daily to stay active"
   - Turkish: "Optimism", "NFT'leri Aç", "Günlük farklı NFT mintleyerek aktif kal"

6. **Database** ✅
   - Migration: `add_optimism_support.sql`
   - Adds 'op' to `network_type` enum
   - Creates sample FREE OP NFT
   - Ready for real collections

## Recent Changes (Last 24 Hours)

### i18n Synchronous Loading Fix (Oct 12, PM)
- Fixed translation key flashing on first page load
- Changed from async fetch to synchronous import
- Bundle size +11 KB but perfect UX
- No more "discover_complete", "brand" key display
- `resolveJsonModule: true` added to tsconfig

### Pretty Price Formatting (Oct 10, PM)
- Created `formatPrice()` utility with 7 decimal support
- Applied to NFTCard, NFTsPage, AdminPanel
- Trims trailing zeros: `0.0100000` → `0.01`
- Preserves tiny values: `0.0000001` stays exact
- FREE badge logic unchanged for 0 prices

### Currency & RPC Optimization (Oct 10, AM)
- Fixed Pharos showing "ETH" instead of "PHRS"
- Added `currency` column to `nfts` table
- Created `nfts_view` with currency support
- Updated all UI components to use dynamic currency
- Added network-based currency fallback system

### RPC Rate Limit Fixes (Oct 10, AM)
- Replaced `mainnet.base.org` with `base.blockpi.network`
- Implemented chunked `getLogs` (8k blocks per request)
- Added 120ms delay between RPC calls
- Prioritized `totalSupply()` method (faster than event scanning)
- Increased scan range to 200k blocks (safe with chunking)

### Ink Network Support (Oct 10, PM)
- Added 5 Ink NFTs (1 FREE: Eldrin)
- Fixed SQL schema (used `title`, not `name`)
- Added 'ink' to network_type enum

### Optimism Support (Oct 10, PM)
- Full OP integration across all layers
- 2 commits: config + UI integration
- Git pushed to main, Bolt.host rebuilding

## Next Steps

### Immediate (User Action Required)
1. **Run Supabase Migrations** (in order):
   ```sql
   -- 1. Currency & view fix
   supabase/migrations/fix_currency_and_view.sql
   
   -- 2. Ink support
   supabase/add_ink_nfts.sql
   
   -- 3. Optimism support
   supabase/migrations/add_optimism_support.sql
   ```

2. **Test on Live Site** (after Bolt.host rebuild):
   - Verify OP appears in Home → Supported Networks
   - Check Tasks → Mainnet → OP card with task
   - Test NFTs → OP tab and filtering
   - Confirm currency symbols (Pharos: PHRS, GIWA: ETH, OP: ETH)
   - Verify mint stats work (hover to load)

### Short Term (Next Features)
1. **Add Real OP NFT Collections**:
   - Research popular OP NFT projects
   - Add 5-10 collections via Supabase SQL
   - Include FREE mints if available
   - Set `start_block` for optimization

2. **Optimize start_block for Existing Collections**:
   ```sql
   -- Find contract creation blocks on explorers
   UPDATE nfts SET start_block = <BLOCK_NUMBER>
   WHERE contract_address = '0x...';
   ```

3. **Admin Panel UI**:
   - Build React form for adding NFTs
   - Connect to Supabase insert
   - No deploy needed for new collections

4. **Mobile Wallet Support**:
   - Integrate WalletConnect
   - Test on mobile browsers
   - Improve responsive design

### Medium Term (Next Week)
1. **Error Tracking**: Add Sentry or LogRocket
2. **Analytics**: Google Analytics or Plausible
3. **Testing**: Unit tests for critical utils
4. **Documentation**: User guide for Turkish community

## Active Decisions and Considerations

### RPC Endpoint Strategy
**Decision**: Use public blockpi.network endpoints
**Reasoning**:
- No API key required
- Good CORS support
- Reliable uptime
- Retry logic in viem handles failures

**Alternative Considered**: Alchemy/Infura with API keys
**Why Not**: Adds complexity, costs, and key management

### Currency Column Approach
**Decision**: Add `currency` column to database
**Reasoning**:
- Each network has different native token
- Pharos uses PHRS, not ETH
- GIWA Sepolia uses ETH (testnet)
- Need flexibility per-network

**Implementation**: 3-tier fallback
1. Database `nfts.currency` column (explicit)
2. Network map fallback (by chain slug)
3. 'ETH' ultimate fallback

### Mint Stats Loading Strategy
**Decision**: Lazy loading on hover/click
**Reasoning**:
- Loading all NFTs' mint stats on page load = 100+ RPC calls
- Causes rate limit errors (503, 429)
- User doesn't need all stats immediately

**Implementation**: 
- Show "View Mints" button initially
- `onMouseEnter` triggers fetch
- 15-minute cache prevents duplicate calls

### Network Addition Pattern
**Decision**: Config-driven, minimal code changes
**Process**:
1. Add to `chains.ts`, `networks.ts`, `rpc.ts`
2. Create `NETWORK_TASKS` array
3. Import in `TasksPage.tsx`
4. Add to Supabase enum
5. UI auto-updates from config

**Benefit**: Can add network in ~15 minutes

## Important Patterns and Preferences

### Code Style
- **TypeScript**: Strict mode, prefer explicit types
- **Components**: Functional components with hooks
- **File naming**: PascalCase for components, camelCase for utils
- **Exports**: Named exports preferred over default

### Error Handling
- **RPC Errors**: Silent warnings, cache empty result
- **Supabase Errors**: Log to console, show user-friendly message
- **Wallet Errors**: Show alert, don't block UI

### Commit Messages
- **Format**: `type: description`
- **Types**: feat, fix, docs, refactor, test, chore
- **Example**: `feat: Add Optimism network support`

### Git Workflow
- **Branch**: Direct commits to `main`
- **Deploy**: Push to main triggers Bolt.host rebuild
- **Rollback**: `git revert HEAD` if needed

## Learnings and Project Insights

### What Works Well
1. **Config-Driven Architecture**: Adding networks is fast and consistent
2. **Lazy Loading**: Solves RPC rate limits elegantly
3. **Supabase**: No backend needed, admin can manage data
4. **Type Safety**: Catches errors early with TypeScript
5. **i18n System**: Easy to add translations

### What Needs Improvement
1. **Type Coverage**: Some `any` types in Supabase responses
2. **Error UX**: Silent failures don't inform user
3. **Admin UI**: Direct SQL is not user-friendly
4. **Testing**: No automated tests yet
5. **Monitoring**: No visibility into production errors

### Key Insights
1. **Free RPCs are limiting**: Need chunking and caching
2. **Enums require migrations**: Can't add values without SQL
3. **Currency matters**: Users notice wrong symbols immediately
4. **Translation gaps hurt UX**: Turkish users sensitive to English text
5. **Lazy loading is essential**: Can't load everything upfront

### Performance Lessons
1. **RPC Calls are Expensive**: Cache aggressively (15min)
2. **Chunked Queries**: 8k blocks per request prevents timeouts
3. **totalSupply() First**: 1 call vs 1000s of event logs
4. **start_block Matters**: Don't scan from genesis

### User Behavior Observations
1. Users want FREE mints highlighted
2. Mint count validates legitimacy
3. Currency symbols matter (PHRS vs ETH confusion)
4. Direct task links reduce friction
5. Network separation (mainnet/testnet) is clear

## Current Challenges

### 1. Supabase Enum Management
**Issue**: Adding networks requires SQL migrations
**Impact**: Can't add network from UI
**Workaround**: Keep migration templates ready

### 2. RPC Reliability
**Issue**: Free endpoints have rate limits
**Impact**: Mint stats fail during high load
**Mitigation**: Caching, chunking, lazy loading

### 3. Mobile Wallet
**Issue**: MetaMask mobile browser not smooth
**Impact**: Mobile users have poor experience
**Plan**: Add WalletConnect integration

### 4. Admin Workflow
**Issue**: Adding NFTs requires SQL knowledge
**Impact**: Non-technical admin can't update
**Plan**: Build admin UI form

## Development Environment

### Current Setup
- **OS**: Windows (PowerShell)
- **Node**: 18.x
- **IDE**: VS Code (assumed)
- **Git**: GitHub Desktop or CLI

### Workflow
```bash
# Make changes
code .

# Test locally
npm run dev

# Commit
git add -A
git commit -m "feat: description"
git push origin main

# Wait for Bolt.host rebuild (~2-3 min)
# Test on live site
```

### Supabase Access
- **Dashboard**: https://supabase.com/dashboard
- **SQL Editor**: Run migrations and queries
- **Tables**: View/edit nfts, address_submissions

## Memory Bank Maintenance

### Last Updated
- **Date**: October 10, 2025
- **Trigger**: Completed Optimism integration
- **Files Updated**: All core Memory Bank files created

### Update Frequency
- After major features (new network, big refactor)
- When user requests "update memory bank"
- When pattern changes significantly

### Review Checklist (for next update)
- [ ] Update `progress.md` with completion status
- [ ] Document new patterns in `systemPatterns.md`
- [ ] Update `techContext.md` if dependencies change
- [ ] Clarify `activeContext.md` with new focus
- [ ] Keep `projectbrief.md` aligned with scope
