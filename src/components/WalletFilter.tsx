import { useState } from 'react';
import { Search, EyeOff, Loader2 } from 'lucide-react';
import { BlockchainService } from '../lib/blockchain';

interface WalletFilterProps {
  onWalletChange: (wallet: string) => void;
  onFilterChange: (hideOwned: boolean) => void;
  hideOwned: boolean;
  isLoading: boolean;
  onError?: (message: string) => void;
}

export function WalletFilter({ onWalletChange, onFilterChange, hideOwned, isLoading, onError }: WalletFilterProps) {
  const [wallet, setWallet] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleWalletChange = (value: string) => {
    setWallet(value);
    
    if (value.trim() === '') {
      setIsValid(true);
      onWalletChange('');
      return;
    }

    const valid = BlockchainService.isValidAddress(value);
    setIsValid(valid);
    
    if (valid) {
      onWalletChange(value);
    } else {
      onError?.('Invalid wallet address format');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="space-y-4">
        <div>
          <label htmlFor="wallet" className="block text-sm font-semibold text-gray-700 mb-2">
            Wallet Address
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="wallet"
              type="text"
              value={wallet}
              onChange={(e) => handleWalletChange(e.target.value)}
              placeholder="Enter your wallet address (0x...)"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                !isValid 
                  ? 'border-red-300 bg-red-50 focus:border-red-500' 
                  : 'border-gray-200 bg-white focus:border-blue-500'
              }`}
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
            )}
          </div>
          {!isValid && (
            <p className="mt-2 text-sm text-red-600">
              Please enter a valid Ethereum address
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <input
            id="hideOwned"
            type="checkbox"
            checked={hideOwned}
            onChange={(e) => onFilterChange(e.target.checked)}
            disabled={!wallet || !isValid}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor="hideOwned" className={`flex items-center text-sm font-medium cursor-pointer ${(!wallet || !isValid) ? 'text-gray-400' : 'text-gray-700'}`}>
            <EyeOff className="w-4 h-4 mr-2 text-gray-500" />
            Hide NFTs I already own
          </label>
        </div>
      </div>
    </div>
  );
}