import React from 'react';
import { Sparkles, Shield, Zap, Globe, Plus, ExternalLink } from 'lucide-react';
import { NETWORKS, MAINNET_NETWORKS, TESTNET_NETWORKS } from '../../config/networks';
import { PROGRAMS } from '../../config/programs';
import { useWallet } from '../../hooks/useWallet';
import { useTranslation } from '../../lib/i18n';

interface HomePageProps {
  networkType: 'mainnet' | 'testnet';
  language: 'en' | 'tr';
  onPageChange: (page: string) => void;
}

export function HomePage({ networkType, language, onPageChange }: HomePageProps) {
  const { addNetwork } = useWallet();
  const { t } = useTranslation(language);
  const currentNetworks = networkType === 'mainnet' ? MAINNET_NETWORKS : TESTNET_NETWORKS;

  const handleAddNetwork = async (networkKey: string) => {
    const network = NETWORKS[networkKey];
    if (!network) return;

    try {
      await addNetwork({
        chainId: `0x${network.chainId.toString(16)}`,
        chainName: network.displayName,
        nativeCurrency: network.nativeCurrency,
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: [network.explorer]
      });
    } catch (error) {
      console.error('Failed to add network:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t('discover_complete')}</h1>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto mb-12 leading-relaxed">{t('mainnet_testnet_hub')}</p>
            <button
              onClick={() => onPageChange('tasks')}
              className="inline-flex items-center space-x-2 bg-white text-blue-700 px-8 py-4 rounded-xl hover:bg-cyan-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Sparkles className="w-6 h-6" />
              <span>{t('start_exploring')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('why_choose_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('feature_gas_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('feature_gas_desc')}</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('feature_multi_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('feature_multi_desc')}</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="bg-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('feature_progress_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('feature_progress_desc')}</p>
            </div>
          </div>
        </div>

        {/* Supported Networks */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('supported_networks')}
          </h2>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {networkType === 'mainnet' ? t('mainnet_networks') : t('testnet_networks')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentNetworks.map((network) => (
                <div
                  key={network.name}
                  className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl border border-white/20"
                >
                  <div className={`w-4 h-4 rounded-full ${network.color}`}></div>
                  <div>
                    <div className="font-semibold text-gray-900">{network.displayName}</div>
                    <div className="text-sm text-gray-600">{network.nativeCurrency.symbol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supported Protocols */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('supported_protocols')}
          </h2>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {t('all_protocols')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROGRAMS.map((program) => {
                const programName = language === 'tr' ? program.nameTR : program.nameEN;
                const visibilityBadge = program.visibility === 'mainnet' ? 'Mainnet' : 'Testnet';
                const badgeColor = program.visibility === 'mainnet' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700';
                
                return (
                  <div
                    key={program.slug}
                    className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400"></div>
                      <div className="font-semibold text-gray-900">{programName}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor}`}>
                      {visibilityBadge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}