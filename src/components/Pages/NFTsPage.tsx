import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, Tag, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { CHAINS, ChainSlug } from '../../config/chains';

interface NFTCollection {
  slug: string;
  name: string;
  contract: string;
  image?: string;
  tags?: string[];
  mintUrl?: string;
  chain: ChainSlug;
  standard: 'erc721' | 'erc1155';
}

// Static NFT collections - can be extended later
const NFT_COLLECTIONS: NFTCollection[] = [
  // Base Collections
  {
    slug: 'base-names',
    name: 'Base Names',
    contract: '0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a',
    image: 'https://i.seadn.io/s/raw/files/df34b121a2ba5e6d8d0f734dc23fb1e8.png',
    tags: ['identity', 'domain'],
    mintUrl: 'https://www.base.org/names',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'base-punks',
    name: 'Base Punks',
    contract: '0x8Cd8155e1af6AD31dd9Eec2cEd37e04145aCFCb3',
    image: 'https://i.seadn.io/gcs/files/0a5c8e3e5c4f9e3c5c4f9e3c5c4f9e3c.png',
    tags: ['pfp', 'community'],
    mintUrl: 'https://basepaint.xyz',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'base-punk-apes',
    name: 'Base Punk Apes',
    contract: '0x9D5025B327E6B863E5050141C987d988c07FD8B2',
    tags: ['pfp', 'apes'],
    mintUrl: 'https://opensea.io/collection/base-punk-apes',
    chain: 'base',
    standard: 'erc721'
  },
  {
    slug: 'base-frens',
    name: 'Base Frens',
    contract: '0x1234567890123456789012345678901234567890',
    tags: ['community', 'social'],
    mintUrl: 'https://base.org',
    chain: 'base',
    standard: 'erc721'
  },
  // Sei Collections
  {
    slug: 'sei-punks',
    name: 'Sei Punks',
    contract: '0x1234567890123456789012345678901234567890',
    tags: ['pfp', 'community'],
    mintUrl: 'https://app.sei.io',
    chain: 'sei',
    standard: 'erc721'
  },
  {
    slug: 'sei-dragons',
    name: 'Sei Dragons',
    contract: '0xabcd1234567890abcd1234567890abcd12345678',
    tags: ['pfp', 'dragons', 'gaming'],
    mintUrl: 'https://app.sei.io',
    chain: 'sei',
    standard: 'erc721'
  },
  {
    slug: 'sei-legends',
    name: 'Sei Legends',
    contract: '0x9876543210987654321098765432109876543210',
    tags: ['legendary', 'rare'],
    mintUrl: 'https://app.sei.io',
    chain: 'sei',
    standard: 'erc721'
  },
  // Giwa Collections
  {
    slug: 'giwa-genesis',
    name: 'GIWA Genesis NFT',
    contract: '0xabcdef1234567890abcdef1234567890abcdef12',
    tags: ['genesis', 'testnet'],
    mintUrl: 'https://giwa.io/mint',
    chain: 'giwa',
    standard: 'erc721'
  },
  {
    slug: 'giwa-testnet-og',
    name: 'GIWA Testnet OG',
    contract: '0x9876543210987654321098765432109876543210',
    tags: ['og', 'testnet', 'community'],
    mintUrl: 'https://giwa.io/og-mint',
    chain: 'giwa',
    standard: 'erc721'
  },
  {
    slug: 'giwa-pioneers',
    name: 'GIWA Pioneers',
    contract: '0x1111222233334444555566667777888899990000',
    tags: ['pioneer', 'early', 'testnet'],
    mintUrl: 'https://giwa.io/pioneers',
    chain: 'giwa',
    standard: 'erc721'
  },
  {
    slug: 'giwa-builders',
    name: 'GIWA Builders Badge',
    contract: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    tags: ['builder', 'badge', 'testnet'],
    mintUrl: 'https://giwa.io/builders',
    chain: 'giwa',
    standard: 'erc721'
  },
  // Pharos Collections
  {
    slug: 'pharos-explorer',
    name: 'Pharos Explorer NFT',
    contract: '0xfedcba0987654321fedcba0987654321fedcba09',
    tags: ['explorer', 'testnet'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/nft',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-early-adopter',
    name: 'Pharos Early Adopter',
    contract: '0x1111111111111111111111111111111111111111',
    tags: ['early', 'testnet', 'og'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/early-mint',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-validators',
    name: 'Pharos Validators',
    contract: '0x2222222222222222222222222222222222222222',
    tags: ['validator', 'staking', 'testnet'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/validators',
    chain: 'pharos',
    standard: 'erc721'
  },
  {
    slug: 'pharos-community',
    name: 'Pharos Community Pass',
    contract: '0x3333333333333333333333333333333333333333',
    tags: ['community', 'pass', 'access'],
    mintUrl: 'https://testnet.pharosnetwork.xyz/community',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'za'>('newest');
  const [trackingAddress, setTrackingAddress] = useState('');
  const [mintedFilter, setMintedFilter] = useState<'all' | 'show' | 'hide' | 'only'>('all');

  // Filter chains by network type
  const availableChains = useMemo(() => {
    return Object.values(CHAINS).filter(chain => chain.kind === networkType);
  }, [networkType]);

  const [activeChain, setActiveChain] = useState<ChainSlug>(
    selectedNetwork || (availableChains[0]?.slug as ChainSlug)
  );

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    NFT_COLLECTIONS.forEach(nft => {
      nft.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    let filtered = NFT_COLLECTIONS.filter(nft => {
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

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'za') return b.name.localeCompare(a.name);
      return 0; // newest (order in array)
    });

    return filtered;
  }, [activeChain, searchQuery, selectedTags, sortBy]);

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
              <input
                type="text"
                value={trackingAddress}
                onChange={(e) => setTrackingAddress(e.target.value)}
                placeholder={t('enter_address')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!trackingAddress && (
                <p className="text-xs text-gray-500 mt-1">{t('paste_address_hint')}</p>
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
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all hover:scale-105"
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                  {nft.image ? (
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-24 h-24 text-gray-300" />
                  )}
                  
                  {/* Chain Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-lg">
                    {CHAINS[nft.chain].name}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{nft.name}</h3>
                  
                  {/* Standard Badge */}
                  <div className="mb-3">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                      {nft.standard.toUpperCase()}
                    </span>
                  </div>

                  {/* Tags */}
                  {nft.tags && nft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {nft.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contract Address */}
                  <div className="mb-4">
                    <code className="text-xs text-gray-500 break-all">
                      {nft.contract.slice(0, 6)}...{nft.contract.slice(-4)}
                    </code>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {nft.mintUrl && (
                      <a
                        href={nft.mintUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium"
                      >
                        <span>{t('mint')}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`${CHAINS[nft.chain].explorer}/address/${nft.contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                      title={t('open_explorer')}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
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
