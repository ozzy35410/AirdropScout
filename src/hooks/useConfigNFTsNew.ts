import { useState, useEffect, useCallback } from 'react';
import { NFTCollection } from '../types';
import { getCollectionsByChain } from '../config/collections';

// Local helper functions
const searchCollectionsLocal = (collections: NFTCollection[], query: string): NFTCollection[] => {
  const lowercaseQuery = query.toLowerCase();
  return collections.filter(collection =>
    collection.name.toLowerCase().includes(lowercaseQuery) ||
    collection.symbol.toLowerCase().includes(lowercaseQuery) ||
    collection.description?.toLowerCase().includes(lowercaseQuery) ||
    collection.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

const sortCollectionsLocal = (collections: NFTCollection[], sortBy: 'newest' | 'az' | 'za'): NFTCollection[] => {
  return [...collections].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.addedAt || '').getTime() - new Date(a.addedAt || '').getTime();
      case 'az':
        return a.name.localeCompare(b.name);
      case 'za':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
};

export function useConfigNFTs(networkType: 'mainnet' | 'testnet') {
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [mintedStatus, setMintedStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMinted, setIsLoadingMinted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'za'>('newest');
  const [showMintedOnly, setShowMintedOnly] = useState(false);
  const [showUnmintedOnly, setShowUnmintedOnly] = useState(false);
  
  // Set default network based on networkType
  const getDefaultNetwork = () => {
    return networkType === 'mainnet' ? 'base' : 'giwa';
  };
  
  const [activeNetwork, setActiveNetwork] = useState(getDefaultNetwork());

  // Update active network when networkType changes
  useEffect(() => {
    setActiveNetwork(getDefaultNetwork());
  }, [networkType]);

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
      filtered = searchCollectionsLocal(filtered, searchTerm);
    }

    // Apply mint status filters
    if (showMintedOnly) {
      filtered = filtered.filter(collection => mintedStatus[collection.slug] === true);
    } else if (showUnmintedOnly) {
      filtered = filtered.filter(collection => mintedStatus[collection.slug] !== true);
    }

    // Apply sorting
    filtered = sortCollectionsLocal(filtered, sortBy);

    return filtered;
  }, [collections, searchTerm, sortBy, showMintedOnly, showUnmintedOnly, mintedStatus]);

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