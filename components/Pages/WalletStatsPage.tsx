"use client";

import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { Loader2, RefreshCw, ExternalLink, TrendingUp, Activity, Coins } from "lucide-react";
import { CHAINS, MAINNET_CHAINS, TESTNET_CHAINS, type ChainSlug } from "@/config/chains";
import { useGlobal, type GlobalState } from "@/state/useGlobal";
import { useTranslation } from "@/hooks/useTranslation";
import { isValidAddress } from "@/lib/address";

interface WalletStats {
  overview: {
    totalTransactions: number;
    sentTransactions: number;
    receivedTransactions: number;
    uniqueContracts: number;
    contractsDeployed: number;
    totalVolume: string;
    totalFees: string;
    currentBalance: string;
    nftMints: {
      unique: number;
      total: number;
    };
    uniqueTokens: number;
    lastActivity: string | null;
    firstActivity: string | null;
    activeDays: number;
  };
  recentTransactions: Array<{
    hash: string;
    timestamp: number;
    from: string;
    to: string | null;
    value: string;
    type: string;
  }>;
}

export default function WalletStatsPage() {
  const { t } = useTranslation();
  const trackAddress = useGlobal((state: GlobalState) => state.trackAddress);
  const networkMode = useGlobal((state: GlobalState) => state.networkMode);
  
  const [selectedChain, setSelectedChain] = useState<ChainSlug>("base");
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chains = networkMode === "mainnet" ? MAINNET_CHAINS : TESTNET_CHAINS;

  useEffect(() => {
    // Set default chain based on network mode
    if (networkMode === "mainnet") {
      setSelectedChain("base");
    } else {
      setSelectedChain("giwa");
    }
  }, [networkMode]);

  useEffect(() => {
    if (trackAddress && isValidAddress(trackAddress)) {
      fetchStats();
    }
  }, [trackAddress, selectedChain]);

  const fetchStats = async () => {
    if (!trackAddress || !isValidAddress(trackAddress)) {
      setError(t("invalid_address"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/wallet-stats/${selectedChain}?address=${trackAddress}`
      );
      const data = await response.json();

      if (!data.ok) {
        setError(data.error || "Failed to fetch stats");
        setStats(null);
      } else {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch stats");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatValue = (value: string) => {
    try {
      const eth = formatEther(BigInt(value));
      return parseFloat(eth).toFixed(4);
    } catch {
      return "0.0000";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {t("wallet_stats_title")}
        </h1>
        <p className="text-slate-600">{t("wallet_stats_subtitle")}</p>
      </div>

      {/* Chain Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t("select_chain")}
        </label>
        <div className="flex gap-2 flex-wrap">
          {chains.map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedChain === chain
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {CHAINS[chain].name}
            </button>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      {trackAddress && isValidAddress(trackAddress) && (
        <div className="mb-6">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("loading_stats")}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {t("refresh")}
              </>
            )}
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* No Address State */}
      {!trackAddress && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-8 text-center">
          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">{t("paste_address_hint")}</p>
        </div>
      )}

      {/* Stats Display */}
      {stats && !loading && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {t("wallet_stats_overview")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label={t("stat_total_txs")}
                value={stats.overview.totalTransactions.toString()}
                subValue={`${t("stat_sent_txs")}: ${stats.overview.sentTransactions} | ${t("stat_received_txs")}: ${stats.overview.receivedTransactions}`}
              />
              <StatCard
                icon={<Activity className="w-5 h-5" />}
                label={t("stat_unique_contracts")}
                value={stats.overview.uniqueContracts.toString()}
              />
              <StatCard
                icon={<Coins className="w-5 h-5" />}
                label={t("stat_current_balance")}
                value={`${formatValue(stats.overview.currentBalance)} ETH`}
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label={t("stat_total_volume")}
                value={`${formatValue(stats.overview.totalVolume)} ETH`}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {t("wallet_stats_transactions")}
            </h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                        {t("tx_hash")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                        {t("tx_timestamp")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                        {t("tx_type")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                        {t("tx_value")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {stats.recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          {t("no_activity")}
                        </td>
                      </tr>
                    ) : (
                      stats.recentTransactions.map((tx) => (
                        <tr key={tx.hash} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm">
                            <code className="text-slate-600">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatTimestamp(tx.timestamp)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                              {tx.type === "transfer" ? t("tx_type_transfer") : 
                               tx.type === "contract" ? t("tx_type_contract") : 
                               tx.type === "mint" ? t("tx_type_mint") : tx.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatValue(tx.value)} ETH
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <a
                              href={`${CHAINS[selectedChain].explorer}/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-600 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {subValue && (
        <div className="text-xs text-slate-500 mt-1">{subValue}</div>
      )}
    </div>
  );
}
