import { useState, useMemo, useEffect } from 'react';
import { ExternalLink, Search, Tag, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';
import { CHAINS, ChainSlug } from '../../config/chains';
import { Collection } from '../../config/collections';
import { getCollections } from '../../data/collectionsProvider';
import { useMintedMap } from '../../hooks/useMintedMap';

interface NFTsPageProps {
  networkType: 'mainnet' | 'testnet';
  language: 'en' | 'tr';
  selectedNetwork?: ChainSlug;
}

type MintedFilter = 'show' | 'hide' | 'only';

export function NFTsPage({ networkType, language, selectedNetwork }: NFTsPageProps) {
  const { t } = useTranslation(language);
  
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
  const [mintedFilter, setMintedFilter] = useState<MintedFilter>('show');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  // Validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Use minted map hook
  const { mintedMap, loading: loadingMinted, error: mintedError, lastChecked, refresh } = 
    useMintedMap(activeChain, trackingAddress && isValidAddress(trackingAddress) ? trackingAddress : undefined);

  // Load collections when chain changes
  useEffect(() => {
    let mounted = true;
    setLoadingCollections(true);
    
    getCollections(activeChain)
      .then(cols => {
        if (mounted) {
          setCollections(cols);
          setLoadingCollections(false);
        }
      })
      .catch(err => {
        console.error('Failed to load collections:', err);
        if (mounted) {
          setCollections([]);
          setLoadingCollections(false);
        }
      });
    
    return () => { mounted = false; };
  }, [activeChain]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    collections.forEach(nft => {
      nft.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [collections]);

  // Apply minted filter function
  const applyMintedFilter = (collections: Collection[]) => {
    if (!mintedMap || !trackingAddress || !isValidAddress(trackingAddress)) {
      return collections; // No filtering if no address
    }

    if (mintedFilter === 'hide') {
      return collections.filter(c => !mintedMap[c.slug]);
    }
    if (mintedFilter === 'only') {
      return collections.filter(c => mintedMap[c.slug] === true);
    }
    return collections; // 'show' - no filtering
  };

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    let filtered = [...collections];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(nft =>
        nft.name.toLowerCase().includes(query) ||
        nft.slug.toLowerCase().includes(query) ||
        nft.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(nft =>
        nft.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Apply minted filter
    filtered = applyMintedFilter(filtered);

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'za') return b.name.localeCompare(a.name);
      return 0; // newest (order in array)
    });

    return filtered;
  }, [collections, searchQuery, selectedTags, sortBy, mintedMap, mintedFilter, trackingAddress]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Format last checked time
  const formatLastChecked = () => {
    if (!lastChecked) return '';
    return lastChecked.toLocaleTimeString(language, { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('nft_collections')}
          </h1>
          <p className="text-gray-600">
            {t('discover_mint_nfts')}
          </p>
        </div>

        {/* Chain Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {availableChains.map(chain => (
            <button
              key={chain.slug}
              onClick={() => setActiveChain(chain.slug as ChainSlug)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeChain === chain.slug
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              {chain.name}
            </button>
          ))}
        </div>

        {/* Address Tracking */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <p className="text-xs text-red-500 mt-1">⚠️ {t('invalid_address')}</p>
              )}
              {mintedError && (
                <p className="text-xs text-red-500 mt-1">⚠️ Error: {mintedError}</p>
              )}
            </div>
            
            {trackingAddress && isValidAddress(trackingAddress) && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMintedFilter('show')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      mintedFilter === 'show'
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
                {lastChecked && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{t('last_checked')}: {formatLastChecked()}</span>
                    <button
                      onClick={() => refresh()}
                      disabled={loadingMinted}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                      title={t('refresh')}
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingMinted ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_collections')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sort_by')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">{t('newest')}</option>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <div className="font-semibold text-2xl text-blue-600">
                  {filteredCollections.length}
                </div>
                <div>{t('collections_found')}</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                {t('filter_by_tags')}
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NFT Grid */}
        {loadingCollections ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t('loading')}
            </h3>
            <p className="text-gray-500">
              {t('loading_collections')}...
            </p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t('no_results')}
            </h3>
            <p className="text-gray-500">
              {collections.length === 0 ? t('no_collections_available') : t('try_different_filters')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map(nft => {
              const isMinted = mintedMap?.[nft.slug] === true;
              
              return (
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="w-24 h-24 text-gray-300 group-hover:text-gray-400 transition-colors" />
                        <span className="text-sm text-gray-400 mt-2">{nft.name}</span>
                      </div>
                    )}
                    
                    {/* Chain Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {CHAINS[activeChain].name}
                    </div>

                    {/* Standard Badge */}
                    <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {nft.standard.toUpperCase()}
                    </div>

                    {/* Minted Badge */}
                    {trackingAddress && isValidAddress(trackingAddress) && isMinted && (
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t('minted')}
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
                            onClick={() => toggleTag(tag)}
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
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t('mint')}
                        </a>
                      )}
                      <a
                        href={`${CHAINS[activeChain].explorer}/address/${nft.contract}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        title={t('view_on_explorer')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
