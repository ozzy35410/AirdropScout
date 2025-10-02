import { useState, useEffect, useCallback } from 'react';
import { NFTCollection } from '../types';
import { NFT_COLLECTIONS, getCollectionsByChain, searchCollections, sortCollections } from '../config/collections';
import { CHAINS } from '../config/chains';

export function useConfigNFTs() {
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [mintedStatus, setMintedStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMinted, setIsLoadingMinted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'za'>('newest');
  const [showMintedOnly, setShowMintedOnly] = useState(false);
  const [showUnmintedOnly, setShowUnmintedOnly] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState('base');

  // Available tags from all collections
  const availableTags = [...new Set(
    Object.values(NFT_COLLECTIONS)
      .flat()
      .flatMap(collection => collection.tags || [])
  )];

  // Load collections for active network
  useEffect(() => {
    setIsLoading(true);
    try {
      const chainCollections = getCollectionsByChain(activeNetwork);
      setCollections(chainCollections);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeNetwork]);

  // Apply filters and sorting
  const filteredCollections = useCallback(() => {
    let filtered = [...collections];

    // Apply search filter
    if (searchTerm) {
      filtered = searchCollections(filtered, searchTerm);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(collection => 
        collection.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Apply mint status filters
    if (showMintedOnly) {
      filtered = filtered.filter(collection => mintedStatus[collection.slug] === true);
    } else if (showUnmintedOnly) {
      filtered = filtered.filter(collection => mintedStatus[collection.slug] !== true);
    }

    // Apply sorting
    filtered = sortCollections(filtered, sortBy);

    return filtered;
  }, [collections, searchTerm, selectedTags, sortBy, showMintedOnly, showUnmintedOnly, mintedStatus]);

  // Refresh minted status
  const refreshMintedStatus = useCallback(async (walletAddress?: string) => {
    if (!walletAddress || !activeNetwork) return;

    setIsLoadingMinted(true);
    try {
      const response = await fetch(`/api/nft/minted?chain=${activeNetwork}&address=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setMintedStatus(data.minted || {});
      } else {
        console.error('Failed to fetch minted status');
      }
    } catch (err) {
      console.error('Error fetching minted status:', err);
    } finally {
      setIsLoadingMinted(false);
    }
  }, [activeNetwork]);

  return {
    collections: filteredCollections(),
    mintedStatus,
    isLoading,
    isLoadingMinted,
    error,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    availableTags,
    sortBy,
    setSortBy,
    showMintedOnly,
    setShowMintedOnly,
    showUnmintedOnly,
    setShowUnmintedOnly,
    activeNetwork,
    setActiveNetwork,
    refreshMintedStatus
  };
}
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mintedFilter, setMintedFilter] = useState<MintedFilter>('show');
  const [mintedStatus, setMintedStatus] = useState<Record<string, boolean>>({});

  // Get available chains for current network type
  const availableChains = getChainsByType(networkType);
  
  // Get current chain or default to first available
  const currentChain = selectedChain || availableChains[0]?.slug || '';

  // Fetch collections for current chain
  useEffect(() => {
    if (!currentChain) return;
    
    setLoading(true);
    try {
      const chainCollections = getCollectionsByChain(currentChain);
      setCollections(chainCollections);
      setError(null);
    } catch (err) {
      setError('Failed to load collections');
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  }, [currentChain]);

  // Fetch minted status for tracked address
  const fetchMintedStatus = useCallback(async () => {
    if (!trackAddress || !currentChain || collections.length === 0) {
      setMintedStatus({});
      return;
    }

    try {
      const response = await fetch(`/api/nft/minted?chain=${currentChain}&address=${trackAddress}`);
      if (response.ok) {
        const data = await response.json();
        setMintedStatus(data.minted || {});
      }
    } catch (err) {
      console.error('Failed to fetch minted status:', err);
      setMintedStatus({});
    }
  }, [trackAddress, currentChain, collections.length]);

  useEffect(() => {
    fetchMintedStatus();
  }, [fetchMintedStatus]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...collections];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchCollections(currentChain, searchQuery);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(collection =>
        selectedTags.some(tag => collection.tags.includes(tag))
      );
    }

    // Apply minted filter
    if (trackAddress && mintedFilter !== 'show') {
      filtered = filtered.filter(collection => {
        const isMinted = mintedStatus[collection.slug] || false;
        return mintedFilter === 'only' ? isMinted : !isMinted;
      });
    }

    // Apply sorting
    filtered = sortCollections(filtered, sortBy);

    setFilteredCollections(filtered);
  }, [collections, searchQuery, selectedTags, sortBy, mintedFilter, mintedStatus, trackAddress, currentChain]);

  // Get all unique tags from current collections
  const availableTags = collections.reduce((tags, collection) => {
    collection.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
    return tags;
  }, [] as string[]);

  return {
    // Data
    collections: filteredCollections,
    availableChains,
    currentChain,
    availableTags,
    mintedStatus,
    
    // State
    loading,
    error,
    
    // Filters
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    mintedFilter,
    setMintedFilter,
    
    // Actions
    refreshMintedStatus: fetchMintedStatus
  };
}