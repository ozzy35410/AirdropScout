import React from 'react';
import { getChainsByType } from '../../config/chains';

interface NetworkTabsProps {
  activeNetwork: string;
  onNetworkChange: (network: string) => void;
  networkType: 'mainnet' | 'testnet';
}

export const NetworkTabs: React.FC<NetworkTabsProps> = ({ 
  activeNetwork, 
  onNetworkChange,
  networkType
}) => {
  const mainnetChains = getChainsByType('mainnet');
  const testnetChains = getChainsByType('testnet');
  
  // Show only networks based on current networkType
  const chainsToShow = networkType === 'mainnet' ? mainnetChains : testnetChains;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap gap-2">
        {/* Show only networks of the selected type */}
        {chainsToShow.map((chain) => (
          <button
            key={chain.slug}
            onClick={() => onNetworkChange(chain.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeNetwork === chain.slug
                ? networkType === 'mainnet' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {chain.name}
          </button>
        ))}
      </div>

      {/* Active Network Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Active: {activeNetwork.charAt(0).toUpperCase() + activeNetwork.slice(1)}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              networkType === 'mainnet' ? 'bg-green-500' : 'bg-orange-500'
            }`} />
            <span className="text-xs text-gray-400">
              {networkType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};