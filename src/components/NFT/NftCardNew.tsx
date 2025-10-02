import React from 'react';
import { NFTCollection } from '../../types';
import { CheckIcon, ExternalLinkIcon, CalendarIcon, TagIcon } from 'lucide-react';

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
                 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] 
                 ${!isMinted ? 'cursor-pointer' : 'cursor-default'} 
                 ${isMinted ? 'ring-2 ring-green-500' : ''}`}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {collection.image ? (
          <img
            src={collection.image}
            alt={collection.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gradient background if image fails
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {collection.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Mint Status Badge */}
        {isMinted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
            <CheckIcon className="w-4 h-4" />
            Minted
          </div>
        )}

        {/* Standard Badge */}
        <div className="absolute top-3 left-3 bg-black bg-opacity-50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
          {collection.standard.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
              {collection.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {collection.symbol}
            </p>
          </div>
        </div>

        {/* Description */}
        {collection.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {collection.description}
          </p>
        )}

        {/* Tags */}
        {collection.tags && collection.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {collection.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 
                         text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                <TagIcon className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {collection.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                +{collection.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          {!isMinted && collection.mintUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMintClick(collection);
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 
                       rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>Mint NFT</span>
            </button>
          )}
          
          {collection.mintUrl && (
            <a
              href={collection.mintUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`${isMinted || !collection.mintUrl ? 'flex-1' : ''} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                       text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg 
                       transition-colors duration-200 flex items-center justify-center gap-2`}
            >
              <ExternalLinkIcon className="w-4 h-4" />
              {isMinted ? 'Visit' : 'View'}
            </a>
          )}
        </div>

        {/* Contract Address */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Contract:</span>
            <code className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {collection.contract.slice(0, 6)}...{collection.contract.slice(-4)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};