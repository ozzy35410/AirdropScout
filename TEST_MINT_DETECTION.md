# Test NFT Mint Detection

## Test Case: Darth Sidious NFT

**NFT Details:**
- Name: Darth Sidious
- Network: Base
- Contract: `0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4`
- Standard: ERC-721
- Mint URL: https://cosmic-darth-sidious.nfts2.me/
- Price: 0.00002 ETH

**Test Wallet:**
- Address: `0x5583BA39732db8006938A83BF64BBB029A0b12A0`
- Status: ✅ Minted Darth Sidious NFT

## Test Steps:

### 1. Start the Development Servers

```bash
# Terminal 1 - Backend Server
cd "c:\Users\ozzy\Desktop\airdrop scout\tekrar\AirdropScout-main"
npm run dev:server

# Terminal 2 - Frontend
cd "c:\Users\ozzy\Desktop\airdrop scout\tekrar\AirdropScout-main"
npm run dev
```

### 2. Test Collection Loading

1. Open http://localhost:5173
2. Navigate to NFTs page
3. Click on "Base" tab
4. Verify "Darth Sidious" NFT appears in the list

### 3. Test Mint Detection

1. In the NFTs page, paste the test wallet address in the "Track by Address" field:
   ```
   0x5583BA39732db8006938A83BF64BBB029A0b12A0
   ```

2. Wait for the API call to complete (loading spinner should appear)

3. Expected Results:
   - ✅ "Darth Sidious" card should show a green "Minted" badge
   - ✅ Other NFTs should NOT have the badge (if wallet hasn't minted them)

### 4. Test Filters

1. **Show Minted** (default):
   - Should show all NFTs
   - Darth Sidious should have green badge

2. Click **"Only Minted"** button:
   - Should show ONLY Darth Sidious
   - Other NFTs should be hidden

3. Click **"Hide Minted"** button:
   - Should hide Darth Sidious
   - Other NFTs should be visible

### 5. Test API Directly

Test the mint detection API endpoint directly:

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/nft/minted?chain=base&address=0x5583BA39732db8006938A83BF64BBB029A0b12A0" | ConvertTo-Json -Depth 10
```

Expected Response:
```json
{
  "ok": true,
  "chain": "base",
  "address": "0x5583ba39732db8006938a83bf64bbb029a0b12a0",
  "minted": {
    "darth-sidious": true,
    "base-names": false,
    "basepaint": false,
    ...
  },
  "meta": {
    "elapsedMs": 1234,
    "cache": "MISS",
    "rateLimited": false
  }
}
```

### 6. Verify on BaseScan

Check the actual mint transaction:
https://basescan.org/address/0x5583BA39732db8006938A83BF64BBB029A0b12A0#tokentxns

Look for:
- Token: Darth Sidious
- Contract: 0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4
- Type: ERC-721
- From: 0x0000000000000000000000000000000000000000 (mint)
- To: 0x5583BA39732db8006938A83BF64BBB029A0b12A0

## Troubleshooting

### Issue: "Failed to fetch" error

**Solution:**
1. Make sure backend server is running on port 3001
2. Check browser console for CORS errors
3. Verify the API endpoint returns 200 OK

### Issue: API returns 404

**Solution:**
1. Check that server/index.ts has `/api/nft/minted` route
2. Restart the backend server
3. Check server logs for errors

### Issue: All NFTs show "minted: false"

**Possible causes:**
1. **RPC Rate Limiting**: Base RPC might be throttling requests
   - Wait a few minutes and try again
   - Check `meta.rateLimited` in response

2. **Wrong Block Range**: startBlock might be too high
   - Lower the startBlock value in collections.ts
   - Or remove it to scan last 200k blocks

3. **Invalid Contract Address**: Double-check the contract address
   - Verify on BaseScan: https://basescan.org/address/0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4

4. **Wrong Event Signature**: Should be using viem's parseAbiItem
   ```typescript
   event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)')
   ```

### Issue: Badge not showing

**Solution:**
1. Check that `isMinted` is being calculated correctly in NFTsPage.tsx:
   ```typescript
   const isMinted = mintedMap?.[nft.slug] === true;
   ```

2. Verify the slug matches: `darth-sidious`

3. Check that `trackingAddress` is valid and lowercase

## Success Criteria

✅ Darth Sidious NFT appears in Base chain list
✅ Pasting wallet address triggers API call (no 404/500)
✅ Green "Minted" badge appears on Darth Sidious card
✅ "Only Minted" filter shows only Darth Sidious
✅ "Hide Minted" filter hides Darth Sidious
✅ API response shows `"darth-sidious": true` in minted object
✅ No "Failed to fetch" errors in console
