import React, { useEffect, useState } from 'react';
import { ExternalLink, Droplets, ChevronDown, ChevronRight } from 'lucide-react';
import { FAUCETS, PHAROS_REFERRAL_URL } from '../../config/tasks';
import { NETWORKS } from '../../config/networks';
import { useTranslation } from '../../lib/i18n';
import { isPharosReferralOpen, openPharosReferral } from '../../lib/referral';

interface FaucetsPageProps {
  networkType: 'mainnet' | 'testnet';
  language: 'en' | 'tr';
  selectedNetwork?: string;
}

export function FaucetsPage({ networkType, language, selectedNetwork }: FaucetsPageProps) {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const { t } = useTranslation(language);
  const [pharosUnlocked, setPharosUnlocked] = useState(isPharosReferralOpen());

  useEffect(() => {
    if (selectedNetwork) {
      setExpandedProjects(prev => ({
        ...prev,
        [selectedNetwork]: true
      }));
    }
  }, [selectedNetwork]);

  const toggleProject = (networkKey: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [networkKey]: !prev[networkKey]
    }));
  };

  const handlePharosReferral = () => {
    openPharosReferral();
    setPharosUnlocked(true);
  };

  if (networkType === 'mainnet') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('testnet_faucets')}</h1>
            <p className="text-gray-600 text-lg">{t('faucets_only_testnet')}</p>
          </div>
        </div>
      </div>
    );
  }

  const faucetsByNetwork = FAUCETS.reduce((acc, faucet) => {
    if (!acc[faucet.network]) acc[faucet.network] = [];
    acc[faucet.network].push(faucet);
    return acc;
  }, {} as Record<string, typeof FAUCETS>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('testnet_faucets')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('get_free_tokens')}</p>
        </div>

        <div className="space-y-12">
          {faucetsByNetwork.pharos && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <button
                onClick={() => toggleProject('pharos')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 p-6 hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <div className="flex items-center space-x-3">
                  {expandedProjects.pharos ? (
                    <ChevronDown className="w-6 h-6 text-white" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-white" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                  <h2 className="text-2xl font-bold text-white">{NETWORKS.pharos.displayName}</h2>
                </div>
              </button>

              {expandedProjects.pharos && (
                <div className="p-6">
                  {/* Primary Pharos Button */}
                  <div className="mb-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <Droplets className="w-8 h-8 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Open Pharos</h4>
                      </div>
                      <button
                        onClick={handlePharosReferral}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center font-medium"
                      >
                        <span>{t('faucet_open')}</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!pharosUnlocked && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <p className="text-orange-800 text-sm">{t('pharos_unlock_hint')}</p>
                    </div>
                  )}

                  {pharosUnlocked && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {faucetsByNetwork.pharos.map((faucet) => (
                        <div
                          key={faucet.id}
                          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            <Droplets className="w-8 h-8 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">{t(faucet.title) || faucet.title}</h4>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{t(faucet.description) || faucet.description}</p>
                          <a
                            href={faucet.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full justify-center font-medium"
                          >
                            <span>{t('faucet_open')}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Other Networks */}
          {Object.entries(faucetsByNetwork)
            .filter(([networkKey]) => networkKey !== 'pharos')
            .map(([networkKey, faucets]) => {
              const network = NETWORKS[networkKey];
              if (!network) return null;

              return (
                <div key={networkKey} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                  <button
                    onClick={() => toggleProject(networkKey)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 p-6 hover:from-green-700 hover:to-blue-700 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {expandedProjects[networkKey] ? (
                        <ChevronDown className="w-6 h-6 text-white" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-white" />
                      )}
                      <div className={`w-6 h-6 rounded-full ${network.color}`}></div>
                      <h2 className="text-2xl font-bold text-white">{network.displayName}</h2>
                    </div>
                  </button>

                  {expandedProjects[networkKey] && (
                    <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {faucets.map((faucet) => (
                        <div
                          key={faucet.id}
                          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            <Droplets className="w-8 h-8 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">{t(faucet.title) || faucet.title}</h4>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{t(faucet.description) || faucet.description}</p>
                          <a
                            href={faucet.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full justify-center font-medium"
                          >
                            <span>{t('get_test_tokens')}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}