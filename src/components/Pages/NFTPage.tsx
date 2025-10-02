import React from 'react';
import { NetworkTabs } from '../Layout/NetworkTabsSimple';
import { NftFilters } from '../NFT/NftFiltersClean';
import { NewNftGrid } from '../NFT/NewNftGrid';
import { useConfigNFTs } from '../../hooks/useConfigNFTsNew';
import { useWallet } from '../../hooks/useWallet';
import { NFTCollection } from '../../types';

interface NFTPageProps {
  networkType: 'mainnet' | 'testnet';
}

export const NFTPage: React.FC<NFTPageProps> = ({ networkType }) => {
  const { wallet } = useWallet();
  const {
    collections,
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
  } = useConfigNFTs(networkType);

  const handleMintClick = (collection: NFTCollection) => {
    if (collection.mintUrl) {
      window.open(collection.mintUrl, '_blank', 'noopener,noreferrer');
      // Optionally refresh minted status after some time
      setTimeout(() => {
        if (wallet.address) {
          refreshMintedStatus(wallet.address);
        }
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            NFT Collections
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and mint NFTs across multiple networks
          </p>
        </div>

        {/* Network Tabs */}
        <div className="mb-6">
          <NetworkTabs 
            activeNetwork={activeNetwork}
            onNetworkChange={setActiveNetwork}
            networkType={networkType}
          />
        </div>



        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 dark:text-red-200 text-sm">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Filters */}
        <NftFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showMintedOnly={showMintedOnly}
          setShowMintedOnly={setShowMintedOnly}
          showUnmintedOnly={showUnmintedOnly}
          setShowUnmintedOnly={setShowUnmintedOnly}
        />

        {/* Loading State for Minted Status */}
        {wallet.address && isLoadingMinted && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-800 dark:text-blue-200 text-sm">
                Checking minted status for your wallet...
              </span>
            </div>
          </div>
        )}

        {/* NFT Grid */}
        <NewNftGrid
          collections={collections}
          mintedStatus={mintedStatus}
          isLoading={isLoading}
          onMintClick={handleMintClick}
        />

        {/* Stats Footer */}
        {!isLoading && collections.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Showing {collections.length} NFT collection{collections.length !== 1 ? 's' : ''} on {activeNetwork.toUpperCase()}
            {wallet.address && (
              <span className="ml-2">
                • {Object.values(mintedStatus).filter(Boolean).length} minted
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};