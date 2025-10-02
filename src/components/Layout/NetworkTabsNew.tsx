import React from 'react';
import { getChainsByType } from '../../config/chains';

interface NetworkTabsProps {
  activeNetwork: string;
  onNetworkChange: (network: string) => void;
}

export const NetworkTabs: React.FC<NetworkTabsProps> = ({ 
  activeNetwork, 
  onNetworkChange 
}) => {
  const mainnetChains = getChainsByType('mainnet');
  const testnetChains = getChainsByType('testnet');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Mainnet Networks */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mainnet</h3>
          <div className="flex flex-wrap gap-2">
            {mainnetChains.map((chain) => (
              <button
                key={chain.slug}
                onClick={() => onNetworkChange(chain.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeNetwork === chain.slug
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        {/* Testnet Networks */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Testnet</h3>
          <div className="flex flex-wrap gap-2">
            {testnetChains.map((chain) => (
              <button
                key={chain.slug}
                onClick={() => onNetworkChange(chain.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeNetwork === chain.slug
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        {/* All Networks Option */}
        <div className="flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter</h3>
          <button
            onClick={() => onNetworkChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeNetwork === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Networks
          </button>
        </div>
      </div>
    </div>
  );
};