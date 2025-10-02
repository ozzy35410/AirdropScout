import React from 'react';
import { NFTCollection } from '../../types';
import { NftCard } from './NftCardNew';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface NewNftGridProps {
  collections: NFTCollection[];
  mintedStatus: Record<string, boolean>;
  isLoading: boolean;
  onMintClick: (collection: NFTCollection) => void;
}

export const NewNftGrid: React.FC<NewNftGridProps> = ({ 
  collections, 
  mintedStatus, 
  isLoading, 
  onMintClick 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto max-w-md">
          <svg 
            className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No NFT Collections Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filter criteria to find collections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <NftCard
          key={collection.slug}
          collection={collection}
          isMinted={mintedStatus[collection.slug] || false}
          onMintClick={onMintClick}
        />
      ))}
    </div>
  );
};