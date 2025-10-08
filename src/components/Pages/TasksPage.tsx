import React from 'react';
import { CheckCircle, Circle, ExternalLink, Users, ChevronDown, ChevronRight, Droplets, Palette, Zap, Wallet, Activity, TrendingUp, Coins, Package, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PHAROS_TASKS, GIWA_TASKS, BASE_TASKS, SEI_TASKS, ZORA_TASKS, INK_TASKS, SONEIUM_TASKS, MODE_TASKS, DEFAULT_SEND_ADDRESS } from '../../config/tasks';
import { NETWORKS } from '../../config/networks';
import { PROGRAMS } from '../../config/programs';
import { useProgress } from '../../hooks/useProgress';
import { useAddressTracking } from '../../hooks/useAddressTracking';
import { useAutoDetection } from '../../hooks/useAutoDetection';
import { useTranslation } from '../../lib/i18n';
import { useState, useEffect } from 'react';
import { WalletStats } from '../../types';
import { TestnetProgramSection } from '../TestnetProgramSection';

interface TasksPageProps {
  networkType: 'mainnet' | 'testnet';
  language: 'en' | 'tr';
  onPageChange?: (page: string, params?: string) => void;
}

export function TasksPage({ networkType, language, onPageChange }: TasksPageProps) {
  const { trackingAddress, isValidAddress, updateTrackingAddress } = useAddressTracking();
  const { progress, markTaskCompleted } = useProgress(trackingAddress);
  const { t } = useTranslation(language);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [showAddresses, setShowAddresses] = useState(false);
  const [submittedAddresses, setSubmittedAddresses] = useState<string[]>([DEFAULT_SEND_ADDRESS]);
  const [newAddress, setNewAddress] = useState('');
  const [sentAddresses, setSentAddresses] = useState<string[]>([]);
  const [filterSent, setFilterSent] = useState(false);
  const [showWalletStats, setShowWalletStats] = useState(false);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<'base' | 'sei' | 'giwa' | 'pharos'>('base');

  // Auto-detection component for individual tasks
  function TaskWithDetection({ task, networkKey }: { task: any; networkKey: string }) {
    const { isDetected, isChecking } = useAutoDetection(
      isValidAddress ? trackingAddress : '',
      networkKey,
      task.id
    );
    const completed = isTaskCompleted(task.id) || isDetected;

    return (
      <div
        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
          completed
            ? 'bg-green-50 border-green-200'
            : 'bg-white border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleMarkCompleted(task.id)}
            disabled={!isValidAddress}
            className="text-2xl disabled:opacity-50"
          >
            {completed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600" />
            )}
          </button>
          
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{t(task.title)}</h4>
              {isDetected && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {t('auto')}
                </span>
              )}
              {isChecking && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Checking...
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {completed && (
            <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
              {t('completed')}
            </span>
          )}
          
          {task.url !== '#' && task.url !== '#send-tokens' && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleTaskClick(task);
              }}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-sm font-medium">{t('open_task')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  }

  const allTasks = networkType === 'mainnet' 
    ? [...BASE_TASKS, ...SEI_TASKS, ...ZORA_TASKS, ...INK_TASKS, ...SONEIUM_TASKS, ...MODE_TASKS]
    : [...PHAROS_TASKS, ...GIWA_TASKS];
  const tasksByNetwork = allTasks.reduce((acc, task) => {
    if (!acc[task.network]) acc[task.network] = [];
    acc[task.network].push(task);
    return acc;
  }, {} as Record<string, typeof allTasks>);

  const handleMarkCompleted = (taskId: string) => {
    if (!isValidAddress) return;
    markTaskCompleted(taskId);
  };

  const isTaskCompleted = (taskId: string) => {
    return progress?.completedTasks.includes(taskId) || false;
  };

  const toggleProject = (networkKey: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [networkKey]: !prev[networkKey]
    }));
  };

  const handleAddressSubmit = () => {
    if (newAddress && !submittedAddresses.includes(newAddress)) {
      setSubmittedAddresses(prev => [...prev, newAddress]);
      setNewAddress('');
    }
  };

  const handleTaskClick = (task: any) => {
    if (task.url.startsWith('/faucets')) {
      const params = task.url.includes('?') ? task.url.split('?')[1] : '';
      onPageChange?.('faucets', params);
    } else if (task.url.startsWith('/nfts')) {
      const params = task.url.includes('?') ? task.url.split('?')[1] : '';
      onPageChange?.('nfts', params);
    } else if (task.url !== '#' && task.url !== '#send-tokens') {
      window.open(task.url, '_blank');
    }
  };

  const filteredAddresses = filterSent
    ? submittedAddresses.filter(addr => !sentAddresses.includes(addr))
    : submittedAddresses;

  useEffect(() => {
    if (isValidAddress && trackingAddress && showWalletStats) {
      fetchStats();
    }
  }, [trackingAddress, isValidAddress, selectedChain, showWalletStats]);

  const fetchStats = async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      const response = await fetch(`/api/wallet-stats/${selectedChain}?address=${trackingAddress}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Unknown error');
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
      setLoadingStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('airdrop_tasks')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('complete_tasks_description')}</p>
        </div>

        {/* Address Tracker & Wallet Stats Section */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3 flex-1 w-full md:w-auto">
                <Wallet className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={trackingAddress}
                  onChange={(e) => updateTrackingAddress(e.target.value)}
                  placeholder={t('enter_address')}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    trackingAddress && !isValidAddress
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              <button
                onClick={() => setShowWalletStats(!showWalletStats)}
                disabled={!isValidAddress}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Activity className="w-4 h-4" />
                <span>{showWalletStats ? 'Hide Stats' : 'Show Wallet Stats'}</span>
              </button>
            </div>
            {trackingAddress && !isValidAddress && (
              <p className="text-xs text-red-600 mt-2">Invalid address format</p>
            )}
            {isValidAddress && (
              <p className="text-xs text-green-600 mt-2">
                Tracking: {trackingAddress.slice(0, 6)}...{trackingAddress.slice(-4)}
              </p>
            )}
          </div>

          {/* Wallet Stats Display */}
          {showWalletStats && isValidAddress && (
            <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">{t('wallet_stats')}</h2>
                <div className="flex space-x-2">
                  {(['base', 'sei', 'giwa', 'pharos'] as const).map((chain) => (
                    <button
                      key={chain}
                      onClick={() => setSelectedChain(chain)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedChain === chain
                          ? 'bg-white text-blue-700'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {chain.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {loadingStats && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading stats...</p>
                  </div>
                )}

                {statsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-4">
                    <p className="text-red-800">{statsError}</p>
                  </div>
                )}

                {stats && !loadingStats && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <StatCard
                        icon={<Activity className="w-5 h-5" />}
                        title={t('interactions')}
                        value={stats.overview.interactions.total.toString()}
                        subtitle={`${stats.overview.interactions.out} out / ${stats.overview.interactions.in} in`}
                        color="blue"
                      />
                      <StatCard
                        icon={<Users className="w-5 h-5" />}
                        title={t('interacted_contracts')}
                        value={stats.overview.interactedContracts.unique.toString()}
                        subtitle={`${stats.overview.interactedContracts.deploys} deploys`}
                        color="green"
                      />
                      <StatCard
                        icon={<TrendingUp className="w-5 h-5" />}
                        title={t('volume')}
                        value={parseFloat(stats.overview.volume.nativeOut).toFixed(4)}
                        subtitle={`Out: ${parseFloat(stats.overview.volume.nativeOut).toFixed(4)}`}
                        color="orange"
                      />
                      <StatCard
                        icon={<Wallet className="w-5 h-5" />}
                        title={t('balance')}
                        value={parseFloat(stats.overview.balance.native).toFixed(4)}
                        subtitle={`Fees: ${parseFloat(stats.overview.fees.native).toFixed(4)}`}
                        color="cyan"
                      />
                    </div>

                    {stats.txsPreview.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                        <div className="space-y-2">
                          {stats.txsPreview.slice(0, 5).map((tx, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className={`p-2 rounded-lg ${
                                  tx.type === 'out' ? 'bg-red-100' : 'bg-green-100'
                                }`}>
                                  {tx.type === 'out' ? (
                                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                                  ) : (
                                    <ArrowDownRight className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <code className="text-xs font-mono text-gray-900 block truncate">
                                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                                  </code>
                                  <span className="text-xs text-gray-500">
                                    {new Date(tx.timestamp * 1000).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {parseFloat(tx.value).toFixed(6)}
                                </div>
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
          )}
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Network Sections */}
          {Object.entries(tasksByNetwork).map(([networkKey, tasks]) => {
            const network = NETWORKS[networkKey];
            if (!network) return null;
            
            const isExpanded = expandedProjects[networkKey];

            const tasksByCategory = tasks.reduce((acc, task) => {
              if (!acc[task.category]) acc[task.category] = [];
              acc[task.category].push(task);
              return acc;
            }, {} as Record<string, typeof tasks>);

            return (
              <div key={networkKey} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleProject(networkKey)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 p-6 hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-white" />
                    )}
                    <div className={`w-6 h-6 rounded-full ${network.color}`}></div>
                    <h2 className="text-2xl font-bold text-white">{network.displayName}</h2>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6">
                  {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
                    <div key={category} className="mb-8 last:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {t(category)}
                      </h3>
                      
                      <div className="space-y-3">
                        {categoryTasks.map((task) => {
                          return <TaskWithDetection key={task.id} task={task} networkKey={networkKey} />;
                        })}
                      </div>

                      {/* Send Token To Friends Section for Pharos */}
                      {networkKey === 'pharos' && category === 'send' && categoryTasks.some(task => task.id === 'pharos-send-tokens') && (
                        <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span>Send Token To Friends</span>
                          </h4>
                          
                          <div className="mb-4 space-y-3">
                            <button
                              onClick={() => setShowAddresses(!showAddresses)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {showAddresses ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              <span>{showAddresses ? 'Hide Addresses' : 'Show Addresses'}</span>
                            </button>
                            
                            {showAddresses && (
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="filterSent"
                                    checked={filterSent}
                                    onChange={(e) => setFilterSent(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label htmlFor="filterSent" className="text-sm text-gray-600">
                                    Filter addresses I've sent to
                                  </label>
                                </div>
                                
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {filteredAddresses.map((address, index) => (
                                    <div key={index} className="bg-white p-2 rounded border">
                                      <code className="text-xs font-mono text-gray-700">{address}</code>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">You can submit your address to be listed here</p>
                            <div className="flex space-x-3">
                            <input
                              type="text"
                              value={newAddress}
                              onChange={(e) => setNewAddress(e.target.value)}
                              placeholder="Enter your address..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                              onClick={handleAddressSubmit}
                              disabled={!newAddress}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                            >
                              Submit Address
                            </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Program Sections - Filtered by visibility */}
          {PROGRAMS.filter(p => {
            const visibility = p.visibility ?? "testnet";
            return networkType === "testnet" ? visibility === "testnet" : visibility === "mainnet";
          }).map(program => (
            <TestnetProgramSection
              key={program.slug}
              program={program}
              language={language}
            />
          ))}
        </div>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2 mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        <h3 className="text-xs font-medium text-gray-600">{title}</h3>
      </div>
      <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}