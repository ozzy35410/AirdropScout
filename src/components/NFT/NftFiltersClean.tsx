import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

interface NftFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'newest' | 'az' | 'za';
  setSortBy: (sort: 'newest' | 'az' | 'za') => void;
  showMintedOnly: boolean;
  setShowMintedOnly: (show: boolean) => void;
  showUnmintedOnly: boolean;
  setShowUnmintedOnly: (show: boolean) => void;
}

export const NftFilters: React.FC<NftFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  showMintedOnly,
  setShowMintedOnly,
  showUnmintedOnly,
  setShowUnmintedOnly
}) => {
  const clearAllFilters = () => {
    setSearchTerm('');
    setShowMintedOnly(false);
    setShowUnmintedOnly(false);
  };

  const hasActiveFilters = searchTerm || showMintedOnly || showUnmintedOnly;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search NFT collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'az' | 'za')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>

        {/* Mint Status Filters */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMintedOnly}
              onChange={(e) => {
                setShowMintedOnly(e.target.checked);
                if (e.target.checked) setShowUnmintedOnly(false);
              }}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded 
                       focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 
                       focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Minted Only
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnmintedOnly}
              onChange={(e) => {
                setShowUnmintedOnly(e.target.checked);
                if (e.target.checked) setShowMintedOnly(false);
              }}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded 
                       focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 
                       focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Unminted Only
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 
                     hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <XIcon className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>



      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active filters: {' '}
            {searchTerm && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md mr-2">
                &quot;{searchTerm}&quot;
              </span>
            )}

            {showMintedOnly && (
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-md mr-2">
                Minted Only
              </span>
            )}
            {showUnmintedOnly && (
              <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-md mr-2">
                Unminted Only
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};