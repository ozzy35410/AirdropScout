# Product Context

## Why This Project Exists
AirdropScout addresses the fragmented landscape of Web3 airdrop farming by providing a centralized hub for multi-chain activities. Users typically need to:
- Track multiple networks separately
- Find reliable NFT collections to mint
- Locate working testnet faucets
- Remember which tasks they've completed
- Navigate language barriers (many platforms are English-only)

## Problems We Solve

### 1. Network Fragmentation
**Problem**: Users need to visit different platforms for each blockchain network.
**Solution**: Single interface for 9+ networks with unified task tracking.

### 2. NFT Discovery Difficulty
**Problem**: Hard to find legitimate, gas-efficient NFT collections across chains.
**Solution**: Curated collections with:
- Real-time mint statistics
- Price transparency with correct currency symbols
- FREE tag for zero-cost mints
- Filtering by tags and network

### 3. Testnet Access Barriers
**Problem**: Finding working faucets and testnet activities is time-consuming.
**Solution**: Direct faucet links, testnet-specific tasks, and protocol integration.

### 4. Progress Tracking Complexity
**Problem**: Users lose track of completed activities across networks.
**Solution**: Wallet-based tracking with "Hide Minted" filters and completion indicators.

### 5. Language Accessibility
**Problem**: Most crypto platforms are English-only, limiting Turkish users.
**Solution**: Full Turkish translation with culturally appropriate terminology.

## How It Works

### User Journey

#### 1. Discovery (Home Page)
- See all supported networks at a glance
- Understand gas-only transaction benefits
- Choose mainnet or testnet mode

#### 2. Task Selection (Tasks Page)
- Browse network-specific task cards
- See clear instructions for each activity
- Direct links to external platforms (swaps, liquidity, etc.)
- Internal navigation to NFTs/Faucets

#### 3. NFT Minting (NFTs Page)
- Filter by network tab
- Search and tag-based filtering
- See mint statistics (hover to load)
- Track minted NFTs with wallet address
- Sort by price, name, or newest

#### 4. Completion Tracking
- Manual task completion checkmarks
- Wallet-based "already minted" detection
- Hide/show/only-minted filters

### Key User Flows

**Mainnet Airdrop Farmer:**
```
Home → Tasks (Mainnet) → Select Network (e.g., OP)
→ "Mint NFTs" task → Click "Open NFTs"
→ NFTs page filtered by OP → Browse collections
→ Click mint link → Complete on external site
→ Return, mark as complete
```

**Testnet Explorer:**
```
Home → Tasks (Testnet) → Select Network (e.g., Pharos)
→ Get test tokens from faucet
→ Mint test NFTs → Perform swaps on DEX
→ Add liquidity → Track progress
```

**NFT Collector:**
```
NFTs page → Select network tab
→ Search/filter collections → Check mint count
→ Enter wallet to hide already minted
→ Sort by price → Mint cheapest/free first
```

## User Experience Goals

### Clarity
- Obvious network separation (mainnet/testnet toggle)
- Clear task categories (faucet, NFT, swap, liquidity)
- Visual network indicators (colors, badges)

### Safety
- Prominent "Gas-only, no approvals" messaging
- Direct links to official platforms
- No custody of user funds

### Speed
- Fast page loads with lazy-loaded mint stats
- Cached RPC calls (15min TTL)
- Chunked blockchain queries to avoid rate limits

### Accessibility
- Full bilingual support (no English remnants in TR mode)
- Mobile-responsive design
- Color-coded network badges
- Clear pricing with currency symbols

### Trust
- Curated collections (not random/scam NFTs)
- Real-time mint counts from blockchain
- Transparent pricing
- Links to block explorers

## Success Indicators

### User Engagement
- Network diversity (users trying multiple chains)
- Task completion rates
- Repeat visits for new collections

### Technical Excellence
- Zero RPC rate limit errors
- Accurate mint statistics
- Fast page loads (<3s)
- No translation gaps

### Community Growth
- Turkish community adoption
- User-submitted addresses for tracking
- Positive feedback on social channels
