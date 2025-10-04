import { NFT, NFTListResponse, NetworkConfigs } from '../types';

const API_BASE = '/api';

// Generic API call function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Public endpoints
  getNFTs: (params?: { network?: string; wallet?: string; hideOwned?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.network) searchParams.set('network', params.network);
    if (params?.wallet) searchParams.set('wallet', params.wallet);
    if (params?.hideOwned) searchParams.set('hideOwned', 'true');
    
    const queryString = searchParams.toString();
    return apiCall<NFTListResponse>(`/nfts${queryString ? `?${queryString}` : ''}`);
  },

  getNetworks: () => apiCall<{ networks: NetworkConfigs }>('/networks'),

  checkOwnership: (data: {
    network: string;
    contract_address: string;
    token_id: string;
    wallet: string;
    token_standard: string;
  }) => apiCall<{ owned: boolean }>('/check-ownership', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Admin endpoints
  admin: {
    getNFTs: () => apiCall<{ nfts: NFT[] }>('/admin/nfts'),
    
    addNFT: (nft: Omit<NFT, 'id' | 'created_at' | 'updated_at'>) => 
      apiCall<{ nft: NFT }>('/admin/nfts', {
        method: 'POST',
        body: JSON.stringify(nft),
      }),
    
    updateNFT: (id: string, updates: Partial<NFT>) => 
      apiCall<{ nft: NFT }>(`/admin/nfts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    
    deleteNFT: (id: string) => 
      apiCall<{ message: string }>(`/admin/nfts/${id}`, {
        method: 'DELETE',
      }),
  },
};