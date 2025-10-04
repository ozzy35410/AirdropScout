import React from 'react';
import { NETWORKS } from '../config/networks';

interface NetworkTabsProps {
  activeNetwork: string;
  onNetworkChange: (network: string) => void;
  nftCounts: Record<string, number>;
}

export const NetworkTabs: React.FC<NetworkTabsProps> = ({
  activeNetwork,
  onNetworkChange,
  nftCounts
}) => {
  const networks = Object.values(NETWORKS);

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        <button
          onClick={() => onNetworkChange('all')}
          className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
            activeNetwork === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          All Networks
          <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
            {Object.values(nftCounts).reduce((sum, count) => sum + count, 0)}
          </span>
        </button>
        
        {networks.map((network) => (
          <button
            key={network.name}
            onClick={() => onNetworkChange(network.name)}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeNetwork === network.name
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${network.color}`} />
            {network.displayName}
            <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
              {nftCounts[network.name] || 0}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};