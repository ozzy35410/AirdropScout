import React, { useState } from 'react';
import { Wallet, Filter } from 'lucide-react';
import { BlockchainService } from '../lib/blockchain';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface WalletFilterProps {
  onWalletChange: (wallet: string) => void;
  onFilterChange: (hideOwned: boolean) => void;
  hideOwned: boolean;
  isLoading: boolean;
}

export const WalletFilter: React.FC<WalletFilterProps> = ({
  onWalletChange,
  onFilterChange,
  hideOwned,
  isLoading
}) => {
  const [wallet, setWallet] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleWalletChange = (value: string) => {
    setWallet(value);
    const valid = !value || BlockchainService.isValidAddress(value);
    setIsValid(valid);
    
    if (valid) {
      onWalletChange(value);
    }
  };

  const handleFilterChange = (checked: boolean) => {
    if (checked && (!wallet || !BlockchainService.isValidAddress(wallet))) {
      return;
    }
    onFilterChange(checked);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-600" />
        Wallet Address
      </h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={wallet}
            onChange={(e) => handleWalletChange(e.target.value)}
            placeholder="Enter your wallet address"
            className={`w-full px-4 py-3 border rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400 ${
              !isValid ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500'
            }`}
          />
          {!isValid && (
            <p className="text-red-500 text-xs mt-1">Invalid wallet address format</p>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={hideOwned}
              onChange={(e) => handleFilterChange(e.target.checked)}
              disabled={!wallet || !isValid || isLoading}
              className="sr-only"
            />
            <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors ${
              hideOwned 
                ? 'bg-blue-600 border-blue-600' 
                : 'border-gray-300 bg-white'
            } ${(!wallet || !isValid || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {hideOwned && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Filter className="w-4 h-4 text-gray-500" />
            )}
            <span className={`text-sm ${(!wallet || !isValid) ? 'text-gray-400' : 'text-gray-700'}`}>
              Hide NFTs I already own
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};