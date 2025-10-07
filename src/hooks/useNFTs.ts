import { useState, useEffect, useCallback } from 'react';
import { NFT, NetworkConfigs } from '../types';
import { api } from '../utils/api';

export function useNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [networks, setNetworks] = useState<NetworkConfigs>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [hideOwned, setHideOwned] = useState<boolean>(false);

  // Fetch networks configuration
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await api.getNetworks();
        setNetworks(response.networks);
      } catch (err) {
        console.error('Failed to fetch networks:', err);
      }
    };

    fetchNetworks();
  }, []);

  // Fetch NFTs
  const fetchNFTs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (selectedNetwork) params.network = selectedNetwork;
      if (walletAddress && hideOwned) {
        params.wallet = walletAddress;
        params.hideOwned = true;
      }

      const response = await api.getNFTs(params);
      setNfts(response.nfts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs';
      setError(errorMessage);
      console.error('Failed to fetch NFTs:', err);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedNetwork, walletAddress, hideOwned]);

  // Fetch NFTs when dependencies change
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    networks,
    loading,
    error,
    selectedNetwork,
    setSelectedNetwork,
    walletAddress,
    setWalletAddress,
    hideOwned,
    setHideOwned,
    refetch: fetchNFTs
  };
}