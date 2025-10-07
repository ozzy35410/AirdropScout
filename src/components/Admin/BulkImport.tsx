import React, { useState } from 'react';
import { Upload, FileJson, X } from 'lucide-react';
import { NFTStorage } from '../../lib/storage';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface BulkImportProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const BulkImport: React.FC<BulkImportProps> = ({ onComplete, onCancel }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  const sampleData = [
    {
      title: "Sample NFT #1",
      description: "A sample NFT for demonstration",
      network: "linea",
      contract_address: "0x1234567890123456789012345678901234567890",
      token_id: "1",
      token_standard: "ERC-721",
      external_link: "https://example.com/nft/1",
      tags: ["sample", "demo"],
      visible: true,
      price_eth: "0.001"
    },
    {
      title: "Sample NFT #2",
      description: "Another sample NFT",
      network: "base",
      contract_address: "0x0987654321098765432109876543210987654321",
      token_id: "2",
      token_standard: "ERC-1155",
      tags: ["sample"],
      visible: true
    }
  ];

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setImporting(true);
    setError('');

    try {
      const data = JSON.parse(jsonInput);
      const nfts = Array.isArray(data) ? data : [data];
      
      // Basic validation
      for (const nft of nfts) {
        if (!nft.title || !nft.contract_address || !nft.token_id) {
          throw new Error('Each NFT must have title, contract_address, and token_id');
        }
      }

      NFTStorage.importNFTs(nfts);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setJsonInput(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileJson className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Bulk Import NFTs</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Paste JSON Data
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Sample Format:</p>
            <pre className="text-xs text-blue-800 overflow-x-auto">
              {JSON.stringify(sampleData, null, 2)}
            </pre>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing || !jsonInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {importing ? (
              <>
                <LoadingSpinner size="sm" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import NFTs
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
