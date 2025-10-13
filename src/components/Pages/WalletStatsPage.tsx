import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../lib/i18n';
import { useWalletStats } from '../../hooks/useWalletStats';
import { Activity, TrendingUp, Wallet, Users, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { getMainnetChains, getTestnetChains, getChain } from '../../config/chains';
import type { ChainSlug } from '../../config/chains';
import { formatUnits } from 'viem';

interface WalletStatsPageProps {
  language: 'en' | 'tr';
}

export function WalletStatsPage({ language }: WalletStatsPageProps) {
  const { t } = useTranslation(language);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL state
  const [networkGroup, setNetworkGroup] = useState<'mainnet' | 'testnet'>(
    (searchParams.get('group') as 'mainnet' | 'testnet') || 'mainnet'
  );
  const [selectedChain, setSelectedChain] = useState<ChainSlug>(
    (searchParams.get('chain') as ChainSlug) || 'base'
  );
  const [address, setAddress] = useState(searchParams.get('address') || '');
  const [inputAddress, setInputAddress] = useState(address);
  
  // Fetch stats
  const { data: stats, loading, error, refetch } = useWalletStats(
    selectedChain,
    address,
    { enabled: !!address }
  );

  // Get chain lists
  const mainnetChains = getMainnetChains();
  const testnetChains = getTestnetChains();
  const chains = networkGroup === 'mainnet' ? mainnetChains : testnetChains;
  
  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('group', networkGroup);
    params.set('chain', selectedChain);
    if (address) {
      params.set('address', address);
    }
    setSearchParams(params, { replace: true });
  }, [networkGroup, selectedChain, address]);

  // Ensure selected chain is in the current group
  useEffect(() => {
    const chainMeta = getChain(selectedChain);
    const expectedGroup = chainMeta.kind;
    if (expectedGroup !== networkGroup) {
      // Switch to first chain in the new group
      const newChain = chains[0]?.slug || 'base';
      setSelectedChain(newChain);
    }
  }, [networkGroup]);

  const handleShowStats = () => {
    if (inputAddress.trim()) {
      setAddress(inputAddress.trim());
    }
  };

  const handleNetworkGroupChange = (group: 'mainnet' | 'testnet') => {
    setNetworkGroup(group);
    // Select first chain in the new group
    const newChain = (group === 'mainnet' ? mainnetChains : testnetChains)[0]?.slug || 'base';
    setSelectedChain(newChain);
  };

  const formatValue = (value: string, decimals: number = 4): string => {
    try {
      const formatted = formatUnits(BigInt(value), 18);
      const num = parseFloat(formatted);
      if (num === 0) return '0';
      if (num < 0.0001) return '< 0.0001';
      return num.toFixed(decimals);
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('wallet_stats')}</h1>
          <p className="text-lg text-gray-600">{t('wallet_stats_description')}</p>
        </div>

        {/* Address Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder={t('wallet_address_placeholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleShowStats}
              disabled={!inputAddress.trim() || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('show')}
            </button>
          </div>
        </div>

        {/* Network Group Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => handleNetworkGroupChange('mainnet')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                networkGroup === 'mainnet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('mainnet')}
            </button>
            <button
              onClick={() => handleNetworkGroupChange('testnet')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                networkGroup === 'testnet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('testnet')}
            </button>
          </div>
        </div>

        {/* Network Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {chains.map((chain) => (
            <button
              key={chain.slug}
              onClick={() => setSelectedChain(chain.slug)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedChain === chain.slug
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {chain.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t('loading_stats')}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">{t('wallet_fetch_error')}</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!address && !loading && (
          <div className="text-center py-16">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{t('enter_address_to_view_stats')}</p>
          </div>
        )}

        {/* Stats Display */}
        {stats && !loading && !stats.error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Activity className="w-6 h-6" />}
                title={t('wallet.interactions')}
                value={stats.summary.interactions.total.toString()}
                subtitle={`↑ ${stats.summary.interactions.out} / ↓ ${stats.summary.interactions.in}`}
                color="blue"
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                title={t('wallet.interacted_contracts')}
                value={stats.summary.uniqueContracts.toString()}
                subtitle={t('wallet.unique_contracts')}
                color="green"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title={t('wallet.volume_out')}
                value={formatValue(stats.summary.volumeOut, 6)}
                subtitle={stats.nativeSymbol}
                color="orange"
              />
              <StatCard
                icon={<Wallet className="w-6 h-6" />}
                title={t('wallet.balance')}
                value={formatValue(stats.summary.balance, 6)}
                subtitle={stats.nativeSymbol}
                color="cyan"
              />
            </div>

            {/* Recent Transactions */}
            {stats.recentTxs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('wallet.recent_transactions')}</h2>
                <div className="space-y-3">
                  {stats.recentTxs.map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          tx.direction === 'out'
                            ? 'bg-red-100 text-red-600'
                            : tx.direction === 'in'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tx.direction === 'out' ? '↑' : tx.direction === 'in' ? '↓' : '↔'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <a
                              href={getChain(selectedChain).explorerTx(tx.hash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-mono text-blue-600 hover:text-blue-800 truncate flex items-center gap-1"
                            >
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                            <span>{new Date(tx.timestamp).toLocaleString()}</span>
                            {tx.to && (
                              <span className="truncate">
                                → {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="text-sm font-medium text-gray-900">
                          {formatValue(tx.value, 6)}
                        </div>
                        <div className="text-xs text-gray-500">{stats.nativeSymbol}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Transactions */}
            {stats.recentTxs.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('wallet.no_recent_transactions')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}
