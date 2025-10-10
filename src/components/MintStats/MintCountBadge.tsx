import { Users } from 'lucide-react';
import { useState } from 'react';
import { useMintStats } from '../../hooks/useMintStats';
import type { ChainSlug } from '../../config/chains';

interface MintCountBadgeProps {
  chain: ChainSlug;
  contract: `0x${string}`;
  standard: 'erc721' | 'erc1155';
  startBlock?: bigint;
  compact?: boolean;
}

/**
 * Badge component that shows total minted count for an NFT collection
 * Uses blockchain events to count mints without requiring wallet connection
 * Lazy loads on hover to avoid rate limits
 */
export function MintCountBadge({ 
  chain, 
  contract, 
  standard, 
  startBlock,
  compact = false 
}: MintCountBadgeProps) {
  const [enabled, setEnabled] = useState(false);
  
  const { totalMinted, circulating, loading, error } = useMintStats({
    chain,
    contract,
    standard,
    startBlock,
    enabled, // Only fetch when enabled
  });

  if (error || !enabled) {
    // Show a button to load stats on demand
    return (
      <button
        onClick={() => setEnabled(true)}
        onMouseEnter={() => setEnabled(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-700 rounded-lg text-xs transition-colors cursor-pointer border border-gray-200 hover:border-indigo-300"
      >
        <Users className="w-3.5 h-3.5" />
        <span>View Mints</span>
      </button>
    );
  }

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
        <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (totalMinted === 0) {
    return null; // Don't show if no mints yet
  }

  const displayCount = circulating > 0 ? circulating : totalMinted;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
        <Users className="w-3 h-3" />
        <span>{displayCount.toLocaleString()}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
      <Users className="w-4 h-4 text-indigo-600" />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-indigo-900">
          {displayCount.toLocaleString()} Minted
        </span>
        {standard === 'erc721' && circulating !== totalMinted && (
          <span className="text-[10px] text-indigo-600">
            {circulating} circulating
          </span>
        )}
        {standard === 'erc1155' && (
          <span className="text-[10px] text-indigo-600">
            {circulating} unique IDs
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Simple text badge for inline display
 */
export function MintCountText({ 
  chain, 
  contract, 
  standard, 
  startBlock 
}: MintCountBadgeProps) {
  const { totalMinted, circulating, loading } = useMintStats({
    chain,
    contract,
    standard,
    startBlock,
    enabled: true,
  });

  if (loading) {
    return <span className="text-gray-400 text-sm">Loading mints...</span>;
  }

  if (totalMinted === 0) {
    return <span className="text-gray-400 text-sm">No mints yet</span>;
  }

  const displayCount = circulating > 0 ? circulating : totalMinted;

  return (
    <span className="text-indigo-600 text-sm font-semibold">
      {displayCount.toLocaleString()} minted
    </span>
  );
}
