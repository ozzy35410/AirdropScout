# Airdrop Scout - Multi-Chain Airdrop Task Hub

A comprehensive platform for discovering and completing on-chain tasks to qualify for airdrops across multiple blockchain networks.

## 🚀 Features

### 🎯 Task Management
- **Mainnet & Testnet Support**: Pharos, GIWA Sepolia (Testnet) | Base, Sei (Mainnet)
- **Auto-Detection**: Automatic task completion detection via blockchain
- **Progress Tracking**: Track completed tasks per wallet address
- **Multi-Category Tasks**: Faucets, NFT mints, swaps, liquidity, trading, etc.

### 🎨 NFT Collections (NEW!)
- **22 Real NFT Collections** with actual contract addresses
- **Multi-Chain Support**: Base, Sei, GIWA, Pharos
- **Smart Filtering**: Search, sort, and tag-based filters
- **Wallet Tracking**: See which NFTs you've minted
- **Mint Detection API**: Blockchain-based mint verification
- **Enhanced UI**: Animations, gradients, hover effects

### 💧 Faucets
- **Multi-Network Faucets**: Get free testnet tokens
- **Quick Access**: Direct links to network faucets
- **Network Selector**: Filter by specific networks

### 📊 Wallet Stats
- **On-Chain Analytics**: View wallet interactions and stats
- **Multi-Chain Data**: Base, Sei, GIWA, Pharos support
- **Transaction History**: Recent transaction preview
- **Activity Metrics**: Interactions, contracts, volume, fees

### 🌐 Internationalization
- **Multi-Language**: Full English & Turkish support
- **Dynamic Translation**: All UI elements translated
- **Easy Extension**: JSON-based translation system

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: ethers.js, viem with multi-network RPC
- **Caching**: Redis with in-memory fallback
- **UI Components**: Lucide React icons
- **Build Tool**: Vite with HMR

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (optional)
- Redis (optional - uses in-memory cache as fallback)

### Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/ozzy35410/AirdropScout.git
   cd AirdropScout
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Update with your Supabase credentials
   ```

3. **Database Setup**
   - Click "Connect to Supabase" button in the app
   - Run the migration in Supabase SQL Editor:
     ```sql
     -- Copy content from supabase/migrations/create_nfts_table.sql
     ```

4. **Start Development**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:5173) and backend (http://localhost:3001)

## Configuration

### Supported Networks

| Network | Chain ID | RPC Endpoint |
|---------|----------|-------------|
| Linea | 59144 | https://rpc.linea.build |
| zkSync Era | 324 | https://mainnet.era.zksync.io |
| Base | 8453 | https://mainnet.base.org |
| Scroll | 534352 | https://rpc.scroll.io |
| Zora | 7777777 | https://rpc.zora.energy |

### Environment Variables

```env
# Required
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
REDIS_URL=redis://localhost:6379
PORT=3001
```

## API Endpoints

### Public Endpoints
- `GET /api/nfts?network=<network>&wallet=<address>&hideOwned=true` - Get filtered NFTs
- `GET /api/networks` - Get network configurations
- `POST /api/check-ownership` - Check NFT ownership
- `GET /api/health` - Health check

### Admin Endpoints
- `GET /api/admin/nfts` - Get all NFTs (admin view)
- `POST /api/admin/nfts` - Add new NFT
- `PUT /api/admin/nfts/:id` - Update NFT
- `DELETE /api/admin/nfts/:id` - Delete NFT

## Usage Guide

### For Users (Public View)
1. Visit the application homepage
2. Browse NFTs by network using the tab navigation
3. Paste wallet address in the top-right input
4. Check "Hide owned NFTs" to filter out owned tokens
5. Click external links to view NFTs on marketplaces

### For Admins
1. Click "Admin Panel" in the header
2. Use "Add NFT" to create new listings
3. Edit or delete existing NFTs from the table
4. Toggle visibility to show/hide NFTs from public view
5. Use tags for better organization

### Adding NFTs
Required fields:
- Title
- Network (select from dropdown)
- Contract Address (valid Ethereum address)
- Token ID (numeric)
- Token Standard (ERC-721 or ERC-1155)

Optional fields:
- Description
- External Link (marketplace URL)
- Tags (comma-separated)

## Blockchain Integration

### Ownership Verification
- **ERC-721**: Uses `ownerOf(tokenId)` with `balanceOf(address)` fallback
- **ERC-1155**: Uses `balanceOf(address, tokenId)` 
- **Caching**: 5-minute cache for ownership queries
- **Error Handling**: Graceful degradation for RPC failures

### Smart Contract Interaction
```typescript
// ERC-721 Ownership Check
const owner = await contract.ownerOf(tokenId);
const isOwner = owner.toLowerCase() === walletAddress.toLowerCase();

// ERC-1155 Ownership Check  
const balance = await contract.balanceOf(walletAddress, tokenId);
const isOwner = balance > 0;
```

## Performance Optimizations

### Caching Strategy
- **Redis Primary**: 5-minute TTL for ownership queries
- **Memory Fallback**: In-memory cache when Redis unavailable
- **Cache Keys**: `ownership:{network}:{contract}:{tokenId}:{wallet}`

### Database Optimization
- Indexed queries on network, visibility, and creation date
- Unique constraints prevent duplicate entries
- Row Level Security for secure multi-tenant access

### Frontend Performance
- Lazy loading and code splitting
- Optimized re-renders with React hooks
- Responsive design with minimal bundle size

## Security Features

### Input Validation
- Ethereum address format validation (EIP-55)
- Network whitelist validation
- SQL injection prevention
- XSS protection with input sanitization

### Access Control
- Row Level Security (RLS) on database
- Public read access for visible NFTs only
- Admin operations require authentication
- Rate limiting on API endpoints

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist folder to Vercel
```

### Backend Options
- **Heroku**: `git push heroku main`
- **DigitalOcean App Platform**: Connect repository
- **Railway**: One-click deployment
- **Render**: Auto-deploy from GitHub

### Database
- Supabase managed PostgreSQL
- Run migrations through Supabase dashboard
- Configure RLS policies for security

## Monitoring & Maintenance

### Health Checks
- `GET /api/health` endpoint for uptime monitoring
- Database connection validation
- Redis connectivity status

### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Graceful degradation for external dependencies

### Cache Management
- Automatic cache invalidation
- Memory cleanup for in-memory fallback
- TTL-based expiration policies

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section below
- Review API documentation

## Troubleshooting

### Common Issues

**RPC Errors**
- Check network connectivity
- Verify RPC endpoints are accessible
- Consider using premium RPC providers for production

**Database Connection**
- Verify Supabase credentials in `.env`
- Check RLS policies are correctly configured
- Ensure migrations have been run

**Caching Issues**
- Redis connection timeout → Falls back to memory cache
- Clear cache manually if ownership data seems stale
- Monitor cache hit rates for optimization

**Ownership Check Failures**
- Contract might not implement standard interfaces
- Token might not exist or be burned
- Network RPC might be temporarily unavailable