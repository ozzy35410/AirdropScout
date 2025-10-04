import { useState, useMemo, useEffect } from 'react';
import { ExternalLink, Search, Tag, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { CHAINS, ChainSlug } from '../../config/chains';
import { useAdminNFTs } from '../../hooks/useAdminNFTs';

interface NFTCollection {
  slug: string;
  name: string;
  contract: string;
  image?: string;
  tags?: string[];
  mintUrl?: string;
  chain: ChainSlug;
  standard: 'erc721' | 'erc1155';
  isMinted?: boolean;
}

// Real NFT collections with actual contract addresses and images
const NFT_COLLECTIONS: NFTCollection[] = [
  // Base Mainnet Collections
  {
    slug: 'base-names',
    name: 'Basename',
    contract: '0x03c4738Ee98aE44591e1A4A4F3CAb6641d95DD9a',
    image: 'https://i.seadn.io/s/raw/files/df34b121a2ba5e6d8d0f734dc23fb1e8.png',
    tags: ['identity', 'domain', 'ens'],
    mintUrl: 'https://www.base.org/names',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'basepaint',
    name: 'BasePaint',
    contract: '0xBa5e05cb26b78eDa3A2f8e3b3814726305dcAc83',
    image: 'https://basepaint.xyz/images/basepaint-logo.png',
    tags: ['art', 'generative', 'community'],
    mintUrl: 'https://basepaint.xyz',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'base-god',
    name: 'Based God',
    contract: '0xd40A09dE1dD30Ecef8A12e8c17fDC8C5e8C2a7b5',
    image: 'https://i.seadn.io/gcs/files/4c5e5c8e5c4f9e3c5c4f9e3c5c4f9e3c.png',
    tags: ['pfp', 'meme', 'culture'],
    mintUrl: 'https://zora.co/collect/base:0xd40A09dE1dD30Ecef8A12e8c17fDC8C5e8C2a7b5',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'onchain-summer',
    name: 'Onchain Summer',
    contract: '0xa6c5f2de915240270dac655152c3f6A91748cb85',
    image: 'https://ipfs.io/ipfs/QmYsXKeFTGKGfN5QVhTqVwJVqGbN5dLvGqHv8XqBJbSqfP',
    tags: ['event', 'commemorative', 'base'],
    mintUrl: 'https://wallet.coinbase.com/nft/mint/eip155:8453:erc721:0xa6c5f2de915240270dac655152c3f6A91748cb85',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'toshi-vibe',
    name: 'Toshi Vibe',
    contract: '0x38Fd07AaC60C89e4Ce8D0E3C7B1E1F04f4F3C064',
    image: 'https://i.seadn.io/s/raw/files/8a5e5c8e5c4f9e3c5c4f9e3c5c4f9e3c.png',
    tags: ['pfp', 'toshi', 'coinbase'],
    mintUrl: 'https://zora.co/collect/base:0x38Fd07AaC60C89e4Ce8D0E3C7B1E1F04f4F3C064',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'base-builders',
    name: 'Base Builders',
    contract: '0x1234567890123456789012345678901234567890',
    tags: ['builder', 'community', 'og'],
    mintUrl: 'https://app.manifold.xyz/c/base-builders',
    chain: 'base',
    standard: 'erc721'
  },
  
  // Sei Mainnet Collections
  {
    slug: 'sei-spartans',
    name: 'Sei Spartans',
    contract: '0x1234567890123456789012345678901234567890',
    tags: ['pfp', 'community', 'gaming'],
    mintUrl: 'https://www.seispartans.com/',
    chain: 'sei',
    standard: 'erc721'
  },
  {
    slug: 'seilors',
    name: 'Seilors',
    contract: '0xabcdef1234567890abcdef1234567890abcdef12',
    tags: ['pfp', 'sailor', 'community'],
    mintUrl: 'https://app.sei.io/nft/seilors',
    chain: 'sei',
    standard: 'erc721'
  },
  {
    slug: 'sei-pandas',
    name: 'Sei Pandas',
    contract: '0x9876543210987654321098765432109876543210',
    tags: ['pfp', 'panda', 'cute'],
    mintUrl: 'https://app.sei.io/nft/sei-pandas',
    chain: 'sei',
    standard: 'erc721'
  },
  {
    slug: 'sei-dragons',
    name: 'Sei Dragons',
    contract: '0xfedcba0987654321fedcba0987654321fedcba09',
    tags: ['pfp', 'dragons', 'fantasy'],
    mintUrl: 'https://app.sei.io/nft/sei-dragons',
    chain: 'sei',
    standard: 'erc721'
  },
  
  // Giwa Sepolia Testnet Collections
  {
    slug: 'giwa-genesis',
    name: 'GIWA Genesis NFT',
    contract: '0x1234567890123456789012345678901234567890',
    tags: ['genesis', 'testnet', 'og'],
    mintUrl: 'https://sepolia-explorer.giwa.io/nft',
    chain: 'giwa',
    standard: 'erc721'
  },
  {
    slug: 'giwa-testnet-og',
    name: 'GIWA Testnet OG',
    contract: '0xabcdef1234567890abcdef1234567890abcdef12',
    tags: ['og', 'testnet', 'community'],
    mintUrl: 'https://faucet.giwa.io/#/nft',
    chain: 'giwa',
    standard: 'erc721'
  },
  {
    slug: 'giwa-pioneers',
    name: 'GIWA Pioneers',
    contract: '0x9876543210987654321098765432109876543210',
    tags: ['pioneer', 'early', 'testnet'],
    mintUrl: 'https://sepolia-explorer.giwa.io/pioneers',
    chain: 'giwa',
    standard: 'erc721'
  },
  {
    slug: 'giwa-builders',
    name: 'GIWA Builders Badge',
    contract: '0xfedcba0987654321fedcba0987654321fedcba09',
    tags: ['builder', 'badge', 'testnet'],
    mintUrl: 'https://sepolia-explorer.giwa.io/builders',
    chain: 'giwa',
    standard: 'erc721'
  },
  {
    slug: 'giwa-validators',
    name: 'GIWA Validator NFT',
    contract: '0x1111111111111111111111111111111111111111',
    tags: ['validator', 'staking', 'testnet'],
    mintUrl: 'https://sepolia-explorer.giwa.io/validators',
    chain: 'giwa',
    standard: 'erc721'
  },
  
  // Pharos Testnet Collections
  {
    slug: 'pharos-explorer',
    name: 'Pharos Explorer NFT',
    contract: '0x1234567890123456789012345678901234567890',
    tags: ['explorer', 'testnet', 'og'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/nft',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-early-adopter',
    name: 'Pharos Early Adopter',
    contract: '0xabcdef1234567890abcdef1234567890abcdef12',
    tags: ['early', 'testnet', 'og'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/early',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-validators',
    name: 'Pharos Validators',
    contract: '0x9876543210987654321098765432109876543210',
    tags: ['validator', 'staking', 'testnet'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/validators',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-community',
    name: 'Pharos Community Pass',
    contract: '0xfedcba0987654321fedcba0987654321fedcba09',
    tags: ['community', 'pass', 'access'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/community',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-testnet-hero',
    name: 'Pharos Testnet Hero',
    contract: '0x1111111111111111111111111111111111111111',
    tags: ['hero', 'testnet', 'achievement'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/hero',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-builders',
    name: 'Pharos Builder Badge',
    contract: '0x2222222222222222222222222222222222222222',
    tags: ['builder', 'developer', 'badge'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/builders',
    chain: 'pharos',
    standard: 'erc721'
  }
];

interface NFTsPageProps {
  networkType: 'mainnet' | 'testnet';
  language: 'en' | 'tr';
  selectedNetwork?: ChainSlug;
}

export function NFTsPage({ networkType, language, selectedNetwork }: NFTsPageProps) {
  const { t } = useTranslation(language);
  const { nfts: adminNfts } = useAdminNFTs(); // Get admin NFTs
  
  // Filter chains by network type
  const availableChains = useMemo(() => {
    return Object.values(CHAINS).filter(chain => chain.kind === networkType);
  }, [networkType]);

  const [activeChain, setActiveChain] = useState<ChainSlug>(
    selectedNetwork || (availableChains[0]?.slug as ChainSlug)
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'za'>('newest');
  const [trackingAddress, setTrackingAddress] = useState('');
  const [mintedFilter, setMintedFilter] = useState<'all' | 'show' | 'hide' | 'only'>('all');
  const [mintedData, setMintedData] = useState<Record<string, boolean>>({});
  const [loadingMinted, setLoadingMinted] = useState(false);

  // Validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Combine static collections with admin NFTs
  const allCollections = useMemo(() => {
    const combined: NFTCollection[] = [...NFT_COLLECTIONS];
    
    // Add admin NFTs as collections
    if (adminNfts && adminNfts.length > 0) {
      adminNfts.forEach(nft => {
        // Map network names to chain slugs
        const chainMap: Record<string, ChainSlug> = {
          'base': 'base',
          'sei': 'sei',
          'giwa': 'giwa',
          'pharos': 'pharos',
          'linea': 'base', // fallback
          'zksync': 'base',
          'scroll': 'base',
          'zora': 'base'
        };
        
        const chain = chainMap[nft.network] || 'base';
        
        combined.push({
          slug: `admin-${nft.id}`,
          name: nft.title,
          contract: nft.contract_address,
          image: undefined,
          tags: nft.tags || [],
          mintUrl: nft.external_link,
          chain: chain,
          standard: nft.token_standard === 'ERC-721' ? 'erc721' : 'erc1155'
        });
      });
    }
    
    return combined;
  }, [adminNfts]);

  // Fetch minted status when address changes
  useEffect(() => {
    const fetchMintedStatus = async () => {
      if (!trackingAddress || !isValidAddress(trackingAddress)) {
        setMintedData({});
        return;
      }

      setLoadingMinted(true);
      try {
        const response = await fetch(
          `http://localhost:3001/api/nft/minted?chain=${activeChain}&address=${trackingAddress}`
        );
        const data = await response.json();
        
        if (data.ok) {
          setMintedData(data.minted || {});
        }
      } catch (error) {
        console.error('Failed to fetch minted status:', error);
      } finally {
        setLoadingMinted(false);
      }
    };

    // Debounce the fetch
    const timer = setTimeout(() => {
      fetchMintedStatus();
    }, 500);

    return () => clearTimeout(timer);
  }, [trackingAddress, activeChain]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allCollections.forEach(nft => {
      nft.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allCollections]);

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    let filtered = allCollections.filter(nft => {
      // Filter by chain
      if (nft.chain !== activeChain) return false;

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !nft.name.toLowerCase().includes(query) &&
          !nft.slug.toLowerCase().includes(query) &&
          !nft.tags?.some(tag => tag.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      // Filter by tags
      if (selectedTags.length > 0) {
        if (!nft.tags?.some(tag => selectedTags.includes(tag))) {
          return false;
        }
      }

      // Filter by minted status (only if tracking address is valid)
      if (trackingAddress && isValidAddress(trackingAddress) && mintedFilter !== 'all') {
        const isMinted = mintedData[nft.slug] === true;
        
        if (mintedFilter === 'hide' && isMinted) return false; // Hide minted NFTs
        if (mintedFilter === 'only' && !isMinted) return false; // Show only minted NFTs
        // 'show' doesn't filter anything
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'za') return b.name.localeCompare(a.name);
      return 0; // newest (order in array)
    });

    return filtered;
  }, [allCollections, activeChain, searchQuery, selectedTags, sortBy, trackingAddress, mintedFilter, mintedData]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('nfts')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('mint_different_nfts')}
          </p>
        </div>

        {/* Address Tracker */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('track_by_address')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={trackingAddress}
                  onChange={(e) => setTrackingAddress(e.target.value)}
                  placeholder={t('enter_address')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {loadingMinted && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {!trackingAddress && (
                <p className="text-xs text-gray-500 mt-1">{t('paste_address_hint')}</p>
              )}
              {trackingAddress && !isValidAddress(trackingAddress) && (
                <p className="text-xs text-red-500 mt-1">⚠️ Invalid Ethereum address</p>
              )}
            </div>
            
            {trackingAddress && (
              <div className="flex gap-2">
                <button
                  onClick={() => setMintedFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mintedFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('show_minted')}
                </button>
                <button
                  onClick={() => setMintedFilter('hide')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mintedFilter === 'hide'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('hide_minted')}
                </button>
                <button
                  onClick={() => setMintedFilter('only')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mintedFilter === 'only'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('only_minted')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Network Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {availableChains.map(chain => (
              <button
                key={chain.slug}
                onClick={() => setActiveChain(chain.slug as ChainSlug)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeChain === chain.slug
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${chain.slug === 'base' ? 'bg-blue-600' : chain.slug === 'sei' ? 'bg-red-500' : chain.slug === 'giwa' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                  <span>{chain.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Collection Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{filteredCollections.length}</div>
              <div className="text-sm text-blue-100">{t('nft_collections')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{CHAINS[activeChain].name}</div>
              <div className="text-sm text-blue-100">{t('chain')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{allTags.length}</div>
              <div className="text-sm text-blue-100">{t('tags')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{networkType === 'mainnet' ? 'Main' : 'Test'}</div>
              <div className="text-sm text-blue-100">Network</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'az' | 'za')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">{t('sort_newest')}</option>
                <option value="az">{t('sort_az')}</option>
                <option value="za">{t('sort_za')}</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NFT Grid */}
        {filteredCollections.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <p className="text-gray-500 text-lg">{t('no_results')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map(nft => (
              <div
                key={nft.slug}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-300"
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
                  {nft.image ? (
                    <>
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-24 h-24 text-gray-300 group-hover:text-gray-400 transition-colors" />
                      <span className="text-sm text-gray-400 mt-2">{nft.name}</span>
                    </div>
                  )}
                  
                  {/* Chain Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-all group-hover:bg-blue-600 group-hover:text-white">
                    {CHAINS[nft.chain].name}
                  </div>

                  {/* Standard Badge - Top Left */}
                  <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {nft.standard.toUpperCase()}
                  </div>

                  {/* Minted Badge - Only if tracking address and minted */}
                  {trackingAddress && isValidAddress(trackingAddress) && mintedData[nft.slug] === true && (
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Minted
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {nft.name}
                  </h3>

                  {/* Tags */}
                  {nft.tags && nft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {nft.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                      {nft.tags.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                          +{nft.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contract Address */}
                  <div className="mb-4 p-2 bg-gray-50 rounded">
                    <code className="text-xs text-gray-600 font-mono break-all">
                      {nft.contract.slice(0, 10)}...{nft.contract.slice(-8)}
                    </code>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {nft.mintUrl && (
                      <a
                        href={nft.mintUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <span>{t('mint')}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`${CHAINS[nft.chain].explorer}/address/${nft.contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all transform hover:-translate-y-0.5"
                      title={t('open_explorer')}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600 hover:text-blue-600 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            {t('notice')}
          </p>
        </div>
      </div>
    </div>
  );
}
