import { useState, useEffect } from 'react';
import { isAddress } from 'viem';

export function useAddressTracking() {
  const [trackingAddress, setTrackingAddress] = useState<string>('');
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);

  useEffect(() => {
    // Load tracking address from localStorage on mount
    const stored = localStorage.getItem('trackAddress');
    if (stored && isAddress(stored)) {
      setTrackingAddress(stored);
      setIsValidAddress(true);
    }
  }, []);

  const updateTrackingAddress = (address: string) => {
    setTrackingAddress(address);
    
    if (address && isAddress(address)) {
      setIsValidAddress(true);
      localStorage.setItem('trackAddress', address);
    } else {
      setIsValidAddress(false);
      if (address === '') {
        localStorage.removeItem('trackAddress');
      }
    }
  };

  return {
    trackingAddress,
    isValidAddress,
    updateTrackingAddress
  };
}