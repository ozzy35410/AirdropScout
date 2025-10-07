import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Pages/HomePage';
import { TasksPage } from './components/Pages/TasksPage';
import { FaucetsPage } from './components/Pages/FaucetsPage';
import { WalletStatsPage } from './components/Pages/WalletStatsPage';
import { NFTsPage } from './components/Pages/NFTsPage';
import { ChainSlug } from './config/chains';

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
          <NFTsPage
            networkType={networkType}
            language={language}
            selectedNetwork={selectedNetworkFromParams as ChainSlug}
          />
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
      // Admin panel removed - use Supabase Dashboard for NFT management
      // Visit: https://supabase.com/dashboard/project/ulungobrkoxwrwaccfwm
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