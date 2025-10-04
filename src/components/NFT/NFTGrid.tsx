import React from 'react';
import { NFTCard } from './NFTCard';
import { NFT, NetworkConfigs } from '../../types';
import { Loader2, Database, Wallet } from 'lucide-react';

interface NFTGridProps {
  nfts: NFT[];
  networks: NetworkConfigs;
  loading: boolean;
  error: string | null;
  walletAddress: string;
  hideOwned: boolean;
}

export function NFTGrid({ nfts, networks, loading, error, walletAddress, hideOwned }: NFTGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading NFTs...</p>
          {walletAddress && hideOwned && (
            <p className="text-sm text-gray-500 mt-2">Checking ownership for filtering...</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading NFTs</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          {walletAddress && hideOwned ? (
            <>
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All NFTs Filtered Out</h3>
              <p className="text-gray-600">
                You already own all the NFTs in this collection. Try unchecking "Hide owned NFTs" 
                to see the full collection.
              </p>
            </>
          ) : (
            <>
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No NFTs Available</h3>
              <p className="text-gray-600">
                There are no NFTs listed for the selected network. Check back later or select a different network.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}
          {walletAddress && hideOwned && (
            <span className="text-blue-600 ml-1">(filtered by wallet ownership)</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} networks={networks} />
        ))}
      </div>
    </>
  );
}