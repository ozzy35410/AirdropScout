import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Pages/HomePage';
import { TasksPage } from './components/Pages/TasksPage';
import { FaucetsPage } from './components/Pages/FaucetsPage';
import { WalletStatsPage } from './components/Pages/WalletStatsPage';
import { NFTsPage } from './components/Pages/NFTsPage';

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ NetworkType ve language localStorage'dan yükle
  const [networkType, setNetworkType] = useState<'mainnet' | 'testnet'>(() => {
    return (localStorage.getItem('networkType') as 'mainnet' | 'testnet') || 'mainnet';
  });
  
  const [language, setLanguage] = useState<'en' | 'tr'>(() => {
    return (localStorage.getItem('lang') as 'en' | 'tr') || 'en';
  });

  // ✅ NetworkType değişince localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('networkType', networkType);
  }, [networkType]);

  // ✅ Language değişince localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  // ✅ Page değişimi için navigate kullan
  const handlePageChange = (page: string, params?: string) => {
    if (params) {
      navigate(`/${page}${params}`);
    } else {
      navigate(`/${page === 'home' ? '' : page}`);
    }
  };

  // ✅ Current page'i location'dan belirle
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1).split('?')[0] || 'home';

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
      
      {/* ✅ React Router Routes */}
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage
              networkType={networkType}
              language={language}
              onPageChange={handlePageChange}
            />
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <TasksPage
              networkType={networkType}
              language={language}
              onPageChange={handlePageChange}
            />
          } 
        />
        <Route 
          path="/nfts" 
          element={
            <NFTsPage
              networkType={networkType}
              language={language}
            />
          } 
        />
        <Route 
          path="/faucets" 
          element={
            <FaucetsPage
              networkType={networkType}
              language={language}
            />
          } 
        />
        <Route 
          path="/wallet-stats" 
          element={
            <WalletStatsPage
              language={language}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;