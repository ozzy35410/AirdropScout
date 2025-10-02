import React, { useState } from 'react';
import { Sparkles, Globe, Settings, Menu, X } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  networkType: 'mainnet' | 'testnet';
  onNetworkTypeChange: (type: 'mainnet' | 'testnet') => void;
  language: 'en' | 'tr';
  onLanguageChange: (lang: 'en' | 'tr') => void;
}

export function Header({
  currentPage,
  onPageChange,
  networkType,
  onNetworkTypeChange,
  language,
  onLanguageChange
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation(language);

  const navigation = [
    { id: 'home', label: t('home') },
    { id: 'tasks', label: t('tasks') },
    { id: 'nfts', label: t('nfts') },
    { id: 'faucets', label: t('faucets') },
    { id: 'admin', label: t('admin') }
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t('brand')}</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-cyan-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Network Type Toggle */}
            <div className="hidden sm:flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => onNetworkTypeChange('mainnet')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  networkType === 'mainnet'
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {t('mainnet')}
              </button>
              <button
                onClick={() => onNetworkTypeChange('testnet')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  networkType === 'testnet'
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {t('testnet')}
              </button>
            </div>

            {/* Language Toggle */}
            <div className="hidden sm:flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('tr')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  language === 'tr'
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                TR
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-cyan-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Mobile Network Toggle */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 mx-4 mt-4">
                <button
                  onClick={() => onNetworkTypeChange('mainnet')}
                  className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    networkType === 'mainnet'
                      ? 'bg-white text-blue-700'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {t('mainnet')}
                </button>
                <button
                  onClick={() => onNetworkTypeChange('testnet')}
                  className={`flex-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    networkType === 'testnet'
                      ? 'bg-white text-blue-700'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {t('testnet')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}