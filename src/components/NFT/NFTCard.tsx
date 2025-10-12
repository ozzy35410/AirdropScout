import { ExternalLink, Hash, Tag, TrendingUp, Loader2 } from 'lucide-react';
import { NFT, NetworkConfigs } from '../../types';
import { normalizePriceEth } from '../../utils/price';
import { formatPrice } from '../../utils/formatPrice';
import { useTotalSupply } from '../../hooks/useMintStats';
import type { ChainSlug } from '../../config/chains';

interface NFTCardProps {
  nft: NFT;
  networks: NetworkConfigs;
}

export function NFTCard({ nft, networks }: NFTCardProps) {
  const network = networks[nft.network];
  const networkColor = network?.color === '#FFEEDA' ? '#FFA500' : network?.color || '#6B7280';
  
  // ✅ Normalize price: 0 = FREE, null = no badge
  const priceEth = normalizePriceEth(nft.price_eth);
  
  // Get currency with fallback
  const currency = (nft as any).currency || 'ETH';

  // ✅ Fetch mint count using existing hook with timeout built-in
  const { totalSupply, loading, error } = useTotalSupply({
    chain: nft.network as ChainSlug,
    contract: nft.contract_address as `0x${string}`,
    startBlock: undefined, // Will use last 200k blocks
    enabled: true, // Always fetch
  });

  // Format mint count with thousand separators
  const formattedMintCount = error || totalSupply === 0 
    ? 'N/A' 
    : totalSupply.toLocaleString('en-US');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      {/* NFT Image - Only show if imageUrl exists */}
      {nft.imageUrl && (
        <div className="h-48 relative overflow-hidden">
          <img 
            src={nft.imageUrl} 
            alt={nft.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If image fails to load, hide the container
              e.currentTarget.parentElement!.style.display = 'none';
            }}
          />
          <div className="absolute top-4 right-4">
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg"
              style={{ backgroundColor: networkColor }}
            >
              {network?.name || nft.network}
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs rounded-md font-medium">
              {nft.token_standard}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-5">
        {/* Network badge if no image */}
        {!nft.imageUrl && (
          <div className="flex items-center justify-between mb-4">
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: networkColor }}
            >
              {network?.name || nft.network}
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
              {nft.token_standard}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{nft.title}</h3>
            {nft.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{nft.description}</p>
            )}
          </div>
        </div>

        {/* Price Section */}
        {priceEth !== null && (
          <div className={`mb-4 p-3 rounded-lg border ${
            priceEth === 0 
              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
          }`}>
            <div className="flex items-center justify-between">
              {priceEth === 0 ? (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-800">FREE</span>
                  <span className="text-sm font-medium text-blue-600">No cost to mint</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-gray-900">{formatPrice(priceEth, { maxDecimals: 7 })}</span>
                  <span className="text-sm font-medium text-green-600">{currency}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* ✅ Mint Count Display - Always visible, loads automatically */}
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600">Minted:</span>
            {loading ? (
              <span className="flex items-center space-x-1 text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Loading...</span>
              </span>
            ) : (
              <span className={`font-bold ${error ? 'text-gray-400' : 'text-purple-600'}`}>
                {formattedMintCount}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Hash className="w-4 h-4" />
            <span className="font-mono">Token ID: {nft.token_id}</span>
          </div>

          <div className="text-xs text-gray-400 font-mono break-all">
            Contract: {nft.contract_address.slice(0, 8)}...{nft.contract_address.slice(-6)}
          </div>

          {nft.tags && nft.tags.length > 0 && (
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              <Tag className="w-3 h-3 text-gray-400" />
              {nft.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {nft.external_link && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <a
              href={nft.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 text-sm font-medium transition-all duration-200"
            >
              <span>View on Marketplace</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}