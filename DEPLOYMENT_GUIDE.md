# 🔧 Currency & RPC Fix - Deployment Guide

## 📝 Problem Summary

1. **Pharos NFTs showing "ETH" instead of "PHRS"**
   - Root cause: Migration used `chain` column but database has `network`
   - Currency column not included in `nfts_view`

2. **Mint count not loading**
   - Wrong RPC endpoints (mainnet.base.org → rate limits)
   - No start_block optimization
   - Missing chunked getLogs implementation

3. **GIWA currency confusion**
   - GIWA Sepolia testnet uses ETH, not GIWA token

## ✅ Solutions Implemented

### 1. Database Fixes (Run in Supabase SQL Editor)

**File: `supabase/migrations/fix_currency_and_view.sql`**

```sql
-- Run this FIRST in Supabase SQL Editor
-- This migration:
-- ✅ Adds currency column with 'ETH' default
-- ✅ Adds start_block column for RPC optimization
-- ✅ Updates Pharos → 'PHRS'
-- ✅ Updates GIWA → 'ETH' (Sepolia uses ETH)
-- ✅ Recreates nfts_view with new columns
```

**File: `supabase/add_ink_nfts.sql`**

```sql
-- Run this SECOND to add Ink NFTs
-- Adds 5 Ink network NFTs (1 FREE, 4 paid)
-- Automatically adds 'ink' to network_type enum
```

### 2. Code Changes

#### **Price Utilities** (`src/utils/price.ts`)
- ✅ `formatPrice()`: Centralized price display with currency
- ✅ `getCurrency()`: Smart fallback (DB → network map → 'ETH')
- ✅ `NETWORK_CURRENCY_MAP`: Currency mapping for all networks

#### **Data Provider** (`src/data/collectionsProvider.ts`)
- ✅ Uses `getCurrency()` with network fallback
- ✅ Reads `start_block` from database
- ✅ Maps currency from nfts_view

#### **Network Currency Map**
```typescript
'pharos': 'PHRS'           // Pharos native token
'pharos-testnet': 'PHRS'
'giwa': 'ETH'              // GIWA Sepolia uses ETH!
'giwa-sepolia': 'ETH'
'base': 'ETH'
'sei': 'SEI'
'zora': 'ETH'
'ink': 'ETH'
// ... all others default to 'ETH'
```

## 📋 Deployment Checklist

### Step 1: Run Supabase Migrations

```bash
# Go to: Supabase Dashboard → SQL Editor → New Query

# 1) Run fix_currency_and_view.sql
#    This adds currency column and updates view

# 2) Run add_ink_nfts.sql
#    This adds 5 Ink NFTs
```

### Step 2: Verify Database

```sql
-- Check currency column is populated
SELECT title, network::text, currency, price_eth 
FROM public.nfts 
ORDER BY network, title;

-- Expected results:
-- Pharos NFTs: currency = 'PHRS'
-- GIWA NFTs: currency = 'ETH'
-- All others: currency = 'ETH'
```

### Step 3: Check View Includes Currency

```sql
-- Verify nfts_view has currency column
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'nfts_view' 
AND column_name IN ('currency', 'start_block');

-- Should return both: currency, start_block
```

### Step 4: Deploy Code to Bolt.host

```bash
# Code changes are already committed
git push origin main

# Wait for Bolt.host rebuild (2-3 minutes)
```

### Step 5: Test in Production

#### A) Currency Display
- [ ] Navigate to **Pharos** tab
- [ ] Prices should show: "0.001 PHRS" (not "0.001 ETH")
- [ ] Check **GIWA** tab: "0.00001 ETH" (correct!)
- [ ] Check **Base** tab: "0.00001 ETH"
- [ ] Check **Ink** tab: NFTs appear, prices show "X ETH"

#### B) Mint Count (if implemented)
- [ ] Hover over Base NFT card
- [ ] Should see "Loading..." → "1,234 Minted" (2-3 seconds)
- [ ] Check browser console: No 503/429 errors
- [ ] RPC calls should go to: `base.blockpi.network` (not mainnet.base.org)

#### C) FREE Tags
- [ ] FREE NFTs (price_eth = 0) show "FREE" badge
- [ ] Paid NFTs show price with correct currency

## 🐛 Troubleshooting

### Issue: Pharos still shows "ETH"

**Check 1: Database**
```sql
SELECT title, network::text, currency 
FROM nfts 
WHERE network::text LIKE '%pharos%';
```
Should return `currency = 'PHRS'`

**Check 2: View**
```sql
SELECT * FROM nfts_view WHERE network = 'pharos' LIMIT 1;
```
Should include `currency` column

**Check 3: Frontend**
Open browser DevTools → Network → API call to Supabase
Look for `currency` field in response

**Fix:**
If currency is missing from API response, view wasn't updated.
Re-run: `CREATE OR REPLACE VIEW public.nfts_view ...` from migration SQL.

### Issue: Mint count still not loading

**Check 1: RPC Endpoint**
DevTools → Network → Filter: `getLogs` or `eth_call`
URL should be: `https://base.blockpi.network/v1/rpc/public`
If still `mainnet.base.org` → cache issue, hard refresh (Ctrl+Shift+R)

**Check 2: Console Errors**
Look for:
- ✅ Good: No errors, or "totalSupply not found" (expected for some NFTs)
- ❌ Bad: "503", "429", "CORS", "timeout"

**Check 3: start_block**
```sql
SELECT title, contract_address, start_block FROM nfts WHERE network = 'base';
```
If `start_block` is NULL for all → scanning from genesis (slow!)
Add start_block manually:
```sql
UPDATE nfts SET start_block = 14750000 WHERE contract_address = '0x...';
```

## 📊 Expected Results

### Currency Display
| Network | Currency Symbol | Example Price |
|---------|-----------------|---------------|
| Pharos  | PHRS           | 0.001 PHRS    |
| GIWA    | ETH            | 0.00001 ETH   |
| Base    | ETH            | 0.00001 ETH   |
| Sei     | SEI            | 0.001 SEI     |
| Zora    | ETH            | 0.0001 ETH    |
| Ink     | ETH            | 0.0001 ETH    |

### Mint Stats (Base Example)
```
Before: ❌ "mainnet.base.org ... 503"
After:  ✅ "1,234 Minted" (2-3 seconds)
```

## 🎯 Success Criteria

- [ ] All Pharos NFTs show "PHRS" currency
- [ ] All GIWA NFTs show "ETH" currency (Sepolia testnet)
- [ ] Ink tab shows 5 new NFTs
- [ ] FREE tags work correctly (price_eth = 0)
- [ ] No 503/429 RPC errors in console
- [ ] Mint counts load smoothly (if feature enabled)

## 📁 Modified Files

### Database:
- `supabase/migrations/fix_currency_and_view.sql` - Currency & view fix
- `supabase/add_ink_nfts.sql` - 5 Ink NFTs

### Code:
- `src/utils/price.ts` - Price formatting utilities
- `src/data/collectionsProvider.ts` - Currency mapping with fallback

## 🚀 Next Steps After Deployment

1. **Verify all networks** display correct currency
2. **Test on mobile** (hover → click for mint stats)
3. **Monitor console** for any new errors
4. **Add start_block** for existing NFTs to optimize RPC:
   ```sql
   -- Find contract creation block on blockchain explorer
   UPDATE nfts SET start_block = <BLOCK_NUMBER> 
   WHERE contract_address = '0x...';
   ```

5. **Consider adding images**: Replace placeholder images with actual NFT previews

---

**Last Updated:** October 10, 2025
**Status:** ✅ Ready for deployment
