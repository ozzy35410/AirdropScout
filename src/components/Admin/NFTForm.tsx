import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { NFT } from '../../types';
import { validateNFTForm } from '../../utils/validation';

interface NFTFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nft: Omit<NFT, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; error?: string }>;
  networks: any;
  initialData?: NFT | null;
}

export function NFTForm({ isOpen, onClose, onSubmit, networks, initialData }: NFTFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    network: initialData?.network || '',
    contract_address: initialData?.contract_address || '',
    token_id: initialData?.token_id || '',
    token_standard: initialData?.token_standard || 'ERC-721' as 'ERC-721' | 'ERC-1155',
    external_link: initialData?.external_link || '',
    tags: initialData?.tags || [] as string[],
    visible: initialData?.visible ?? true,
    price_eth: initialData?.price_eth || '',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateNFTForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await onSubmit(formData);
      if (result.success) {
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          network: '',
          contract_address: '',
          token_id: '',
          token_standard: 'ERC-721',
          external_link: '',
          tags: [],
          visible: true,
        });
      } else {
        setErrors({ submit: result.error || 'Failed to save NFT' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit NFT' : 'Add New NFT'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter NFT title"
              />
              {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network *
              </label>
              <select
                value={formData.network}
                onChange={(e) => setFormData(prev => ({ ...prev, network: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.network ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select network</option>
                {Object.entries(networks).map(([key, network]) => (
                  <option key={key} value={key}>{network.displayName}</option>
                ))}
              </select>
              {errors.network && <p className="text-red-600 text-xs mt-1">{errors.network}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter NFT description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (ETH)
            </label>
            <input
              type="text"
              value={formData.price_eth}
              onChange={(e) => setFormData(prev => ({ ...prev, price_eth: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.000001"
              step="any"
            />
            <p className="text-xs text-gray-500 mt-1">Enter price in ETH (e.g., 0.000001 for very small amounts)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Address *
              </label>
              <input
                type="text"
                value={formData.contract_address}
                onChange={(e) => setFormData(prev => ({ ...prev, contract_address: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                  errors.contract_address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0x..."
              />
              {errors.contract_address && <p className="text-red-600 text-xs mt-1">{errors.contract_address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token ID *
              </label>
              <input
                type="text"
                value={formData.token_id}
                onChange={(e) => setFormData(prev => ({ ...prev, token_id: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.token_id ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123"
              />
              {errors.token_id && <p className="text-red-600 text-xs mt-1">{errors.token_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Standard *
              </label>
              <select
                value={formData.token_standard}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  token_standard: e.target.value as 'ERC-721' | 'ERC-1155' 
                }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.token_standard ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="ERC-721">ERC-721</option>
                <option value="ERC-1155">ERC-1155</option>
              </select>
              {errors.token_standard && <p className="text-red-600 text-xs mt-1">{errors.token_standard}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Link
              </label>
              <input
                type="url"
                value={formData.external_link}
                onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.external_link ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://..."
              />
              {errors.external_link && <p className="text-red-600 text-xs mt-1">{errors.external_link}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible}
              onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="visible" className="text-sm text-gray-700">
              Visible to public
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialData ? 'Update NFT' : 'Add NFT'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}