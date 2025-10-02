import React from 'react';
import { NFTCollection } from '../../types';
import { CheckIcon, ExternalLinkIcon, TagIcon } from 'lucide-react';

interface NftCardProps {
  collection: NFTCollection;
  isMinted?: boolean;
  onMintClick: (collection: NFTCollection) => void;
}

export const NftCard: React.FC<NftCardProps> = ({ collection, isMinted = false, onMintClick }) => {
  const handleCardClick = () => {
    if (!isMinted) {
      onMintClick(collection);
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 
        transition-all duration-300 hover:shadow-xl hover:scale-105 group overflow-hidden ${
          isMinted ? 'opacity-75' : 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      onClick={handleCardClick}
    >
      {/* NFT Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/images/collections/default.png';
          }}
        />
        
        {/* Minted Badge */}
        {isMinted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            Minted
          </div>
        )}

        {/* Network Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-blue-600">
            {collection.contract.slice(0, 6)}...
          </span>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
            {collection.name}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">
            {collection.symbol}
          </span>
        </div>

        {collection.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {collection.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {collection.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {(collection.tags?.length || 0) > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{(collection.tags?.length || 0) - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMintClick(collection);
          }}
          disabled={isMinted}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isMinted
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
          }`}
        >
          {isMinted ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Already Minted
            </>
          ) : (
            <>
              <ExternalLinkIcon className="w-4 h-4" />
              Mint NFT
            </>
          )}
        </button>
      </div>
    </div>
  );
};