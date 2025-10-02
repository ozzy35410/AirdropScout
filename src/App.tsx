import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Pages/HomePage';
import { TasksPage } from './components/Pages/TasksPage';
import { FaucetsPage } from './components/Pages/FaucetsPage';
import { WalletStatsPage } from './components/Pages/WalletStatsPage';
import { NFTGrid } from './components/NFT/NFTGrid';
import { AdminPanel } from './components/Admin/AdminPanel';
import { useNFTs } from './hooks/useNFTs';
import { NETWORKS } from './config/networks';
import { useTranslation } from './lib/i18n';

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [networkType, setNetworkType] = useState<'mainnet' | 'testnet'>('mainnet');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [pageParams, setPageParams] = useState<string>('');
  const { t } = useTranslation(language);
  
  const {
    nfts,
    networks,
    loading,
    error,
    selectedNetwork,
    setSelectedNetwork,
    walletAddress,
    setWalletAddress,
    hideOwned,
    setHideOwned
  } = useNFTs();

  // Handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const network = urlParams.get('network');
    if (network) {
      setSelectedNetwork(network);
    }
  }, [pageParams, setSelectedNetwork]);

  const handlePageChange = (page: string, params?: string) => {
    setCurrentPage(page);
    setPageParams(params || '');
    
    // Update URL if params provided
    if (params) {
      const url = new URL(window.location.href);
      url.search = params;
      window.history.pushState({}, '', url.toString());
    }
  };

  const renderPage = () => {
    const urlParams = new URLSearchParams(pageParams);
    const selectedNetworkFromParams = urlParams.get('network');
    
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            networkType={networkType}
            language={language}
            onPageChange={handlePageChange}
          />
        );
      case 'tasks':
        return (
          <TasksPage
            networkType={networkType}
            language={language}
            onPageChange={handlePageChange}
          />
        );
      case 'nfts':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t('nft_collections')}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('mint_nfts_description')}
                </p>
              </div>
              
              <NFTGrid
                nfts={nfts}
                networks={networks}
                loading={loading}
                error={error}
                walletAddress={walletAddress}
                hideOwned={hideOwned}
                language={language}
              />
            </div>
          </div>
        );
      case 'faucets':
        return (
          <FaucetsPage
            networkType={networkType}
            language={language}
            selectedNetwork={selectedNetworkFromParams || undefined}
          />
        );
      case 'wallet-stats':
        return (
          <WalletStatsPage
            language={language}
          />
        );
      case 'admin':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdminPanel networks={NETWORKS} />
            </div>
          </div>
        );
      default:
        return (
          <HomePage
            networkType={networkType}
            language={language}
            onPageChange={setCurrentPage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
        networkType={networkType}
        onNetworkTypeChange={setNetworkType}
        language={language}
        onLanguageChange={setLanguage}
      />
      
      {renderPage()}
    </div>
  );
}

export default App;