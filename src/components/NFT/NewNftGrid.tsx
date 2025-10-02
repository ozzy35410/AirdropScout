import React from 'react';
import { NFTCollection } from '../../types';
import { NftCard } from './NftCardNew';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface NewNftGridProps {
  collections: NFTCollection[];
  isLoading: boolean;
  onMintClick: (collection: NFTCollection) => void;
  trackingAddress?: string;
  language: 'en' | 'tr';
  chainSlug: string;
}

export const NewNftGrid: React.FC<NewNftGridProps> = ({
  collections,
  isLoading,
  onMintClick,
  trackingAddress = '',
  language,
  chainSlug
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-300"
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
          <h3 className="mb-2 text-lg font-medium text-gray-900">No NFT Collections Found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filter criteria to find collections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {collections.map((collection) => (
        <NftCard
          key={collection.slug}
          collection={collection}
          onMintClick={onMintClick}
          trackingAddress={trackingAddress}
          language={language}
          chainSlug={chainSlug}
        />
      ))}
    </div>
  );
};