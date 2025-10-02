import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { NFTCollection } from '../../types';
import { NFT_COLLECTIONS } from '../../config/collections';

interface ConfigAdminPanelProps {
  language: 'en' | 'tr';
}

export function ConfigAdminPanel({ language }: ConfigAdminPanelProps) {
  const [collections, setCollections] = useState<Record<string, NFTCollection[]>>(NFT_COLLECTIONS);
  const [editingCollection, setEditingCollection] = useState<{chain: string, index: number} | null>(null);
  const [newCollection, setNewCollection] = useState<Partial<NFTCollection>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('pharos');

  const chains = Object.keys(collections);

  const handleSaveEdit = (chain: string, index: number, updatedCollection: NFTCollection) => {
    const newCollections = { ...collections };
    newCollections[chain][index] = updatedCollection;
    setCollections(newCollections);
    setEditingCollection(null);
    
    // In a real app, you would save this to a backend or config file
    console.log('Updated NFT collections:', newCollections);
  };

  const handleAddCollection = (chain: string, collection: NFTCollection) => {
    const newCollections = { ...collections };
    if (!newCollections[chain]) {
      newCollections[chain] = [];
    }
    newCollections[chain].push({
      ...collection,
      addedAt: new Date().toISOString()
    });
    setCollections(newCollections);
    setShowAddForm(false);
    setNewCollection({});
    
    console.log('Added new NFT collection:', collection);
  };

  const handleDeleteCollection = (chain: string, index: number) => {
    if (window.confirm(language === 'tr' ? 'Bu NFT koleksiyonunu silmek istediğinizden emin misiniz?' : 'Are you sure you want to delete this NFT collection?')) {
      const newCollections = { ...collections };
      newCollections[chain].splice(index, 1);
      setCollections(newCollections);
      
      console.log('Deleted NFT collection from', chain);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {language === 'tr' ? 'NFT Koleksiyon Yönetimi' : 'NFT Collection Management'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'tr' ? 'NFT koleksiyonlarını ekleyin, düzenleyin ve yönetin' : 'Add, edit and manage NFT collections'}
        </p>
      </div>

      {/* Chain Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'tr' ? 'Ağ Seçin' : 'Select Chain'}
        </label>
        <select 
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {chains.map(chain => (
            <option key={chain} value={chain}>
              {chain.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Collection Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {language === 'tr' ? 'Yeni Koleksiyon Ekle' : 'Add New Collection'}
        </button>
      </div>

      {/* Add Collection Form */}
      {showAddForm && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">
            {language === 'tr' ? 'Yeni NFT Koleksiyonu Ekle' : 'Add New NFT Collection'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'tr' ? 'İsim' : 'Name'}
              </label>
              <input
                type="text"
                value={newCollection.name || ''}
                onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Symbol
              </label>
              <input
                type="text"
                value={newCollection.symbol || ''}
                onChange={(e) => setNewCollection({...newCollection, symbol: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'tr' ? 'Kontrat Adresi' : 'Contract Address'}
              </label>
              <input
                type="text"
                value={newCollection.contract || ''}
                onChange={(e) => setNewCollection({...newCollection, contract: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'tr' ? 'Mint URL' : 'Mint URL'}
              </label>
              <input
                type="text"
                value={newCollection.mintUrl || ''}
                onChange={(e) => setNewCollection({...newCollection, mintUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (newCollection.name && newCollection.symbol && newCollection.contract && newCollection.mintUrl) {
                  handleAddCollection(selectedChain, {
                    slug: newCollection.name?.toLowerCase().replace(/\s+/g, '-') || '',
                    name: newCollection.name || '',
                    symbol: newCollection.symbol || '',
                    contract: newCollection.contract || '',
                    standard: 'erc721',
                    image: '/images/collections/default.png',
                    description: newCollection.description || '',
                    tags: ['custom'],
                    mintUrl: newCollection.mintUrl || '',
                    addedAt: ''
                  });
                }
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {language === 'tr' ? 'Kaydet' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCollection({});
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
            >
              <X className="w-4 h-4 inline mr-2" />
              {language === 'tr' ? 'İptal' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Collections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {selectedChain.toUpperCase()} {language === 'tr' ? 'Koleksiyonları' : 'Collections'}
        </h2>
        
        {collections[selectedChain]?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {language === 'tr' ? 'Bu ağda henüz koleksiyon yok' : 'No collections on this chain yet'}
          </div>
        )}
        
        {collections[selectedChain]?.map((collection, index) => (
          <div key={`${selectedChain}-${index}`} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {collection.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {collection.symbol} • {collection.contract.slice(0, 10)}...
                </p>
                <div className="flex gap-2 mt-2">
                  {collection.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCollection({chain: selectedChain, index})}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCollection(selectedChain, index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>{language === 'tr' ? 'Not:' : 'Note:'}</strong> {' '}
          {language === 'tr' 
            ? 'Bu değişiklikler sadece bu oturum için geçerlidir. Kalıcı değişiklikler için config dosyalarını güncelleyin.'
            : 'These changes are only for this session. Update config files for permanent changes.'
          }
        </p>
      </div>
    </div>
  );
}