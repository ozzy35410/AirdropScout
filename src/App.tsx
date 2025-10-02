import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Pages/HomePage';
import { TasksPage } from './components/Pages/TasksPage';
import { FaucetsPage } from './components/Pages/FaucetsPage';
import { WalletStatsPage } from './components/Pages/WalletStatsPage';
import { NFTPage } from './components/Pages/NFTPage';
import { AdminPanel } from './components/Admin/AdminPanel';
import { NETWORKS } from './config/networks';

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

  // Handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) {
      setCurrentPage(page);
    }
  }, []);

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
        return <NFTPage networkType={networkType} />;
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