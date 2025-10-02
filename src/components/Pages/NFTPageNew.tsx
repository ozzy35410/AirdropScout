import { useEffect, useMemo, useState } from 'react';
import { isAddress } from 'viem';
import { NetworkTabs } from '../Layout/NetworkTabsSimple';
import { NewNftGrid } from '../NFT/NewNftGrid';
import { MintedFilterControl, type MintedFilter } from '../NFT/MintedFilterControl';
import { useConfigNFTs } from '../../hooks/useConfigNFTsNew';
import { useMintedDetection } from '../../hooks/useMintedDetection';
import { NFTCollection } from '../../types';
import { useTranslation } from '../../lib/i18n';

interface NFTPageProps {
  networkType: 'mainnet' | 'testnet';
  language: 'en' | 'tr';
  trackingAddress?: string;
  selectedNetwork?: string;
}

export const NFTPage: React.FC<NFTPageProps> = ({
  networkType,
  language,
  trackingAddress = '',
  selectedNetwork
}) => {
  const { t } = useTranslation(language);
  const [localAddress, setLocalAddress] = useState('');
  const [mintedFilter, setMintedFilter] = useState<MintedFilter>('show');

  const effectiveAddress = trackingAddress || localAddress;

  const {
    collections,
    isLoading,
    error,
    activeNetwork,
    setActiveNetwork
  } = useConfigNFTs(networkType);

  useEffect(() => {
    if (!selectedNetwork) return;
    setActiveNetwork(prev => (prev === selectedNetwork ? prev : selectedNetwork));
  }, [selectedNetwork, setActiveNetwork]);

  const {
    mintedStatus,
    isLoading: isMintedLoading,
    error: mintedError,
    lastChecked,
    isRateLimited,
    refresh: refreshMinted
  } = useMintedDetection({
    address: effectiveAddress,
    chain: activeNetwork,
    enabled: isAddress(effectiveAddress)
  });

  const filteredCollections = useMemo(() => {
    if (!isAddress(effectiveAddress) || mintedFilter === 'show') {
      return collections;
    }

    return collections.filter((collection) => {
      const isMinted = mintedStatus[collection.slug];
      if (mintedFilter === 'only') {
        return isMinted === true;
      }
      if (mintedFilter === 'hide') {
        return isMinted !== true;
      }
      return true;
    });
  }, [collections, effectiveAddress, mintedFilter, mintedStatus]);

  const handleMintClick = (collection: NFTCollection) => {
    if (collection.mintUrl) {
      window.open(collection.mintUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const addressInputError = effectiveAddress && !isAddress(effectiveAddress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">{t('nfts')}</h1>
          <p className="mt-3 text-lg text-gray-600">
            {language === 'tr'
              ? 'Birden fazla ağda NFT koleksiyonlarını keşfedin ve mint edin'
              : 'Discover and mint NFT collections across supported networks'}
          </p>
        </div>

        {!trackingAddress && (
          <div className="mb-6">
            <div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-lg backdrop-blur">
              <label className="block text-sm font-semibold text-gray-700">
                {t('track_by_address')}
              </label>
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  value={localAddress}
                  onChange={(e) => setLocalAddress(e.target.value)}
                  placeholder={t('paste_wallet_address')}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 ${
                    addressInputError ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {addressInputError && (
                <p className="mt-2 text-sm text-red-600">{t('invalid_address')}</p>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <NetworkTabs
            activeNetwork={activeNetwork}
            onNetworkChange={setActiveNetwork}
            networkType={networkType}
          />
        </div>

        {activeNetwork === 'giwa' && (
          <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/80 p-6 text-sky-800">
            <h2 className="text-lg font-semibold">
              {t('giwa_pathfinder_callout_title')}
            </h2>
            <p className="mt-2 text-sm">
              {t('giwa_pathfinder_callout_description')}
            </p>
          </div>
        )}

        {isAddress(effectiveAddress) && (
          <div className="mb-6 rounded-2xl border border-white/40 bg-white/80 p-4 shadow-lg backdrop-blur">
            <MintedFilterControl
              filter={mintedFilter}
              onFilterChange={setMintedFilter}
              language={language}
              isLoading={isMintedLoading}
              error={mintedError}
              lastChecked={lastChecked}
              onRefresh={refreshMinted}
              isRateLimited={isRateLimited}
            />
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isRateLimited && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800">
            {t('partial_results')}
          </div>
        )}

        <NewNftGrid
          collections={filteredCollections}
          isLoading={isLoading}
          onMintClick={handleMintClick}
          trackingAddress={effectiveAddress}
          language={language}
          chainSlug={activeNetwork}
        />

        {!isLoading && filteredCollections.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {language === 'tr'
              ? `${activeNetwork.toUpperCase()} ağında ${filteredCollections.length} NFT koleksiyonu gösteriliyor`
              : `Showing ${filteredCollections.length} NFT collection${filteredCollections.length !== 1 ? 's' : ''} on ${activeNetwork.toUpperCase()}`}
            {isAddress(effectiveAddress) && (
              <span className="ml-2">
                • {Object.values(mintedStatus).filter(Boolean).length}{' '}
                {language === 'tr' ? 'mint edildi' : 'minted'}
              </span>
            )}
          </div>
        )}

        {!isLoading && filteredCollections.length === 0 && collections.length > 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-lg">
              {language === 'tr'
                ? 'Filtre kriterlerine uygun NFT bulunamadı'
                : 'No NFTs match your filter criteria'}
            </p>
            <p className="mt-2 text-sm">
              {language === 'tr'
                ? 'Filtreleri değiştirmeyi deneyin'
                : 'Try adjusting your filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};