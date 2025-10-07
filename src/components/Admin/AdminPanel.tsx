import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, ExternalLink, Upload } from 'lucide-react';
import { NFTForm } from './NFTForm';
import { BulkImport } from './BulkImport';
import { NFT } from '../../types';
import { NFTStorage } from '../../lib/storage';
import { Toast } from '../ui/Toast';

interface AdminPanelProps {
  networks: any;
}

export function AdminPanel({ networks }: AdminPanelProps) {
  const [nfts, setNfts] = useState<NFT[]>(NFTStorage.getAllNFTs());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingNFT, setEditingNFT] = useState<NFT | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [filter, setFilter] = useState('');
  const [networkFilter, setNetworkFilter] = useState('all');

  const refreshNFTs = () => {
    setNfts(NFTStorage.getAllNFTs());
  };

  const handleAddNFT = async (nftData: Omit<NFT, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      NFTStorage.addNFT(nftData);
      refreshNFTs();
      setToast({ message: 'NFT added successfully!', type: 'success' });
      return { success: true };
    } catch (error) {
      setToast({ message: 'Failed to add NFT', type: 'error' });
      return { success: false, error: 'Failed to add NFT' };
    }
  };

  const handleUpdateNFT = async (nftData: Omit<NFT, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingNFT) return { success: false, error: 'No NFT selected for editing' };
    try {
      NFTStorage.updateNFT(editingNFT.id, nftData);
      refreshNFTs();
      setEditingNFT(null);
      setToast({ message: 'NFT updated successfully!', type: 'success' });
      return { success: true };
    } catch (error) {
      setToast({ message: 'Failed to update NFT', type: 'error' });
      return { success: false, error: 'Failed to update NFT' };
    }
  };

  const handleDeleteNFT = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this NFT? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        NFTStorage.deleteNFT(id);
        refreshNFTs();
        setToast({ message: 'NFT deleted successfully!', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete NFT', type: 'error' });
      }
      setDeletingId(null);
    }
  };

  const handleBulkImportComplete = () => {
    setShowBulkImport(false);
    refreshNFTs();
    setToast({ message: 'NFTs imported successfully!', type: 'success' });
  };

  const toggleVisibility = async (nft: NFT) => {
    NFTStorage.updateNFT(nft.id, { visible: !nft.visible });
    refreshNFTs();
  };

  const openEditForm = (nft: NFT) => {
    setEditingNFT(nft);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingNFT(null);
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.title.toLowerCase().includes(filter.toLowerCase()) ||
                         nft.description?.toLowerCase().includes(filter.toLowerCase()) ||
                         nft.contract_address.toLowerCase().includes(filter.toLowerCase());
    const matchesNetwork = networkFilter === 'all' || nft.network === networkFilter;
    return matchesSearch && matchesNetwork;
  });

  const stats = {
    total: nfts.length,
    visible: nfts.filter(n => n.visible).length,
    hidden: nfts.filter(n => !n.visible).length,
    networks: Object.keys(networks).reduce((acc, network) => {
      acc[network] = nfts.filter(n => n.network === network).length;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total NFTs</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Visible</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.visible}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Hidden</h3>
          <p className="text-3xl font-bold text-gray-600 mt-2">{stats.hidden}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">NFT Management</h2>
          <p className="text-gray-600 mt-1">Manage your NFT listings and visibility</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add NFT</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by title, description, or contract..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Networks</option>
            {Object.values(networks).map((network: any) => (
              <option key={network.name} value={network.name}>
                {network.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredNFTs.length === 0 ? (
          <div className="text-center py-16">
            <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter || networkFilter !== 'all' ? 'No NFTs Found' : 'No NFTs Added Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter || networkFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start by adding your first NFT to the collection'}
            </p>
            {!filter && networkFilter === 'all' && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First NFT</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NFT Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Network
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract & Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNFTs.map((nft) => {
                  const network = networks[nft.network];
                  const networkColor = network?.color || 'bg-gray-500';
                  
                  return (
                    <tr key={nft.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{nft.title}</div>
                          {nft.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {nft.description}
                            </div>
                          )}
                          {nft.tags && nft.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {nft.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                              {nft.tags.length > 2 && (
                                <span className="text-xs text-gray-400">+{nft.tags.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${networkColor}`}
                          />
                          <span className="text-sm text-gray-900">
                            {network?.displayName || nft.network}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {nft.token_standard}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono">
                          <div className="text-gray-900">
                            {nft.contract_address.slice(0, 8)}...{nft.contract_address.slice(-6)}
                          </div>
                          <div className="text-gray-500 mt-1">Token #{nft.token_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {nft.price_eth ? (
                            <span className="font-semibold text-green-600">
                              {parseFloat(nft.price_eth).toFixed(4)} ETH
                            </span>
                          ) : (
                            <span className="text-gray-400">Free</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          nft.visible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {nft.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {nft.external_link && (
                            <a
                              href={nft.external_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="View external link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => toggleVisibility(nft)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title={nft.visible ? 'Hide NFT' : 'Show NFT'}
                          >
                            {nft.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEditForm(nft)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit NFT"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNFT(nft.id)}
                            disabled={deletingId === nft.id}
                            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete NFT"
                          >
                            {deletingId === nft.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showBulkImport && (
        <BulkImport
          onComplete={handleBulkImportComplete}
          onCancel={() => setShowBulkImport(false)}
        />
      )}

      <NFTForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingNFT ? handleUpdateNFT : handleAddNFT}
        networks={networks}
        initialData={editingNFT}
      />
    </div>
  );
}