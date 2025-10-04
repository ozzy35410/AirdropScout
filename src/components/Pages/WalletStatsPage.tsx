import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';
import { useAddressTracking } from '../../hooks/useAddressTracking';
import { Activity, TrendingUp, Wallet, Zap, Coins, Package, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { WalletStats } from '../../types';

interface WalletStatsPageProps {
  language: 'en' | 'tr';
}

export function WalletStatsPage({ language }: WalletStatsPageProps) {
  const { t } = useTranslation(language);
  const { trackingAddress, isValidAddress } = useAddressTracking();
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<'base' | 'sei' | 'giwa' | 'pharos'>('base');

  useEffect(() => {
    if (isValidAddress && trackingAddress) {
      fetchStats();
    }
  }, [trackingAddress, isValidAddress, selectedChain]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/wallet-stats/${selectedChain}?address=${trackingAddress}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStats({
        overview: {
          interactions: { total: 42, out: 28, in: 14 },
          interactedContracts: { unique: 8, deploys: 2 },
          volume: { nativeOut: "1.25", nativeIn: "0.85" },
          fees: { native: "0.0245" },
          balance: { native: "0.1234" },
          nftMint: { unique: 3, total: 7 },
          stakingLiquidity: { total: 5 },
          uniqueTokensTraded: 12,
          tokens: { erc20Unique: 15, nftUnique: 8 },
          lastActivity: Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60
        },
        charts: {
          daily: [
            { date: '2024-01-01', transactions: 5, swaps: 2, mints: 1 },
            { date: '2024-01-02', transactions: 8, swaps: 3, mints: 0 },
            { date: '2024-01-03', transactions: 3, swaps: 1, mints: 2 },
          ],
          heatmap: {
            '2024-01-01': 5,
            '2024-01-02': 8,
            '2024-01-03': 3,
          }
        },
        txsPreview: [
          {
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            timestamp: Math.floor(Date.now() / 1000) - 60,
            to: '0xabcdef1234567890abcdef1234567890abcdef12',
            value: '0.01',
            type: 'transfer'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isValidAddress || !trackingAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('wallet_stats')}</h1>
            <p className="text-gray-600 text-lg">{t('enter_address')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('wallet_stats')}</h1>
          <p className="text-xl text-gray-600">
            {trackingAddress.slice(0, 6)}...{trackingAddress.slice(-4)}
          </p>
        </div>

        <div className="flex justify-center mb-8 space-x-2">
          {(['base', 'sei', 'giwa', 'pharos'] as const).map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedChain === chain
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {chain.toUpperCase()}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading stats...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {stats && !loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Activity className="w-6 h-6" />}
                title={t('interactions')}
                value={stats.overview.interactions.total.toString()}
                subtitle={`${stats.overview.interactions.out} out / ${stats.overview.interactions.in} in`}
                color="blue"
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                title={t('interacted_contracts')}
                value={stats.overview.interactedContracts.unique.toString()}
                subtitle={`${stats.overview.interactedContracts.deploys} deploys`}
                color="green"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                title={t('volume')}
                value={parseFloat(stats.overview.volume.nativeOut).toFixed(4)}
                subtitle={`Out: ${parseFloat(stats.overview.volume.nativeOut).toFixed(4)}`}
                color="orange"
              />
              <StatCard
                icon={<Wallet className="w-6 h-6" />}
                title={t('balance')}
                value={parseFloat(stats.overview.balance.native).toFixed(4)}
                subtitle={`Fees: ${parseFloat(stats.overview.fees.native).toFixed(4)}`}
                color="cyan"
              />
              <StatCard
                icon={<Package className="w-6 h-6" />}
                title={t('nft_mint')}
                value={`${stats.overview.nftMint.unique} / ${stats.overview.nftMint.total}`}
                subtitle="Unique / Total"
                color="purple"
              />
              <StatCard
                icon={<Coins className="w-6 h-6" />}
                title={t('staking_liquidity')}
                value={stats.overview.stakingLiquidity.total.toString()}
                subtitle={t('interactions')}
                color="indigo"
              />
              <StatCard
                icon={<Zap className="w-6 h-6" />}
                title={t('unique_tokens_traded')}
                value={stats.overview.uniqueTokensTraded.toString()}
                subtitle={`${stats.overview.tokens.erc20Unique} ERC20`}
                color="yellow"
              />
              <StatCard
                icon={<Calendar className="w-6 h-6" />}
                title={t('last_activity')}
                value={new Date(stats.overview.lastActivity * 1000).toLocaleDateString()}
                subtitle={t('streak')}
                color="red"
              />
            </div>

            {stats.charts.daily.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Activity</h2>
                <div className="space-y-2">
                  {stats.charts.daily.slice(0, 30).map((day, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 w-24">{day.date}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min((day.transactions / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-16 text-right">
                        {day.transactions} txs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.txsPreview.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
                <div className="space-y-3">
                  {stats.txsPreview.slice(0, 10).map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'out' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {tx.type === 'out' ? (
                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <code className="text-sm font-mono text-gray-900">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </code>
                            <span className="text-xs text-gray-500">
                              {new Date(tx.timestamp * 1000).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            To: {tx.to.slice(0, 10)}...{tx.to.slice(-8)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {parseFloat(tx.value).toFixed(6)}
                        </div>
                        <div className="text-xs text-gray-500">{tx.type.toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
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
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
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
