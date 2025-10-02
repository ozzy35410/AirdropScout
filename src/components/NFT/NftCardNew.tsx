import { ExternalLink as ExternalLinkIcon, Tag as TagIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useMintedDetection } from '../../hooks/useMintedDetection';
import { NFTCollection } from '../../types';
import { MintedBadge } from './MintedBadge';

interface NftCardProps {
  collection: NFTCollection;
  onMintClick: (collection: NFTCollection) => void;
  trackingAddress?: string;
  language: 'en' | 'tr';
  chainSlug: string;
}

export function NftCard({
  collection,
  onMintClick,
  trackingAddress = '',
  language,
  chainSlug
}: NftCardProps) {
  const { mintedStatus, isLoading: isMintedLoading } = useMintedDetection({
    address: trackingAddress,
    chain: chainSlug,
    enabled: Boolean(trackingAddress)
  });

  const isMinted = useMemo(() => mintedStatus?.[collection.slug] ?? false, [mintedStatus, collection.slug]);

  const handleMintClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onMintClick(collection);
  };

  const handleVisitClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
        {collection.image ? (
          <img
            src={collection.image}
            alt={collection.name}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-bold text-white">{collection.name.charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="absolute right-3 top-3">
          <MintedBadge isMinted={isMinted} isLoading={isMintedLoading} language={language} />
        </div>

        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
          {collection.standard.toUpperCase()}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{collection.name}</h3>
            <p className="text-sm text-gray-600">{collection.symbol}</p>
          </div>
        </div>

        {collection.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">{collection.description}</p>
        )}

        {collection.tags && collection.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {collection.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
              >
                <TagIcon className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {collection.tags.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-500">+{collection.tags.length - 3} more</span>
            )}
          </div>
        )}

        <div className="mb-3 flex gap-2">
          {!isMinted && collection.mintUrl && (
            <button
              type="button"
              onClick={handleMintClick}
              className="flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 px-4 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
            >
              <span>{language === 'tr' ? 'NFT Mintle' : 'Mint NFT'}</span>
            </button>
          )}

          {collection.mintUrl && (
            <a
              href={collection.mintUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleVisitClick}
              className={`${isMinted || !collection.mintUrl ? 'flex-1' : ''} flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 px-4 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200`}
            >
              <ExternalLinkIcon className="h-4 w-4" />
              {isMinted ? (language === 'tr' ? 'Ziyaret Et' : 'Visit') : language === 'tr' ? 'Sayfayı Aç' : 'View'}
            </a>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Contract:</span>
            <code className="rounded bg-gray-100 px-2 py-1 text-gray-700">
              {collection.contract.slice(0, 6)}...{collection.contract.slice(-4)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}