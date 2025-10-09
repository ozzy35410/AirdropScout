import React from 'react';
import { ExternalLink, Tag, Network, DollarSign, TrendingUp } from 'lucide-react';
import { NFT } from '../types';
import { NETWORKS } from '../config/networks';
import { normalizePriceEth } from '../utils/price';

interface NFTCardProps {
  nft: NFT;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const network = NETWORKS[nft.network];

  const renderPrice = () => {
    // ✅ Normalize price: 0 = FREE, null = no badge
    const priceEth = normalizePriceEth(nft.price_eth);
    
    if (priceEth === null) {
      return (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Price not set</span>
        </div>
      );
    }

    if (priceEth === 0) {
      return (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-bold text-blue-800 text-lg">FREE</div>
              <div className="text-xs text-blue-600">
                No cost to mint
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <div>
            <div className="font-semibold text-green-800">{priceEth} ETH</div>
            <div className="text-xs text-green-600">
              Manual <span className="text-orange-500">(Outdated)</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-green-600">
          26.09.2025
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square overflow-hidden rounded-t-2xl relative bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"></div>
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${network.color} shadow-lg`}>
            <Network className="w-3 h-3" />
            {network.displayName}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs rounded-md font-medium">
            {nft.token_standard}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
            {nft.title}
          </h3>
        </div>

        {nft.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{nft.description}</p>
        )}

        <div className="space-y-3 mb-5">
          {/* Price Display */}
          {renderPrice()}
          
          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50/50 p-2 rounded-lg">
            <span>Contract:</span>
            <code className="bg-white px-2 py-1 rounded-md font-mono font-semibold text-gray-700">
              {nft.contract_address.slice(0, 6)}...{nft.contract_address.slice(-4)}
            </code>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50/50 p-2 rounded-lg">
            <span>Token ID:</span>
            <span className="font-semibold text-gray-700">{nft.token_id}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50/50 p-2 rounded-lg">
            <span>Standard:</span>
            <span className="font-semibold text-gray-700">{nft.token_standard}</span>
          </div>
        </div>

        {nft.tags && nft.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {nft.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-xs text-blue-700 rounded-full font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {nft.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-xs text-gray-500 rounded-full font-medium">
                +{nft.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {nft.external_link && (
          <a
            href={nft.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ExternalLink className="w-4 h-4" />
            View on Marketplace
          </a>
        )}
      </div>
    </div>
  );
};