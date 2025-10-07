# NFT & Admin Panel - Improved Features

## Yapılan İyileştirmeler

### 1. Toast Notification Sistemi
- Custom Toast bileşeni eklendi (`src/components/ui/Toast.tsx`)
- `useToast` hook'u eklendi (`src/hooks/useToast.ts`)
- react-hot-toast yerine kendi toast sistemimiz

### 2. Blockchain Service İyileştirmeleri
- **Önbellekleme (Caching)**: 5 dakikalık ownership cache
- **Gelişmiş Hata Yönetimi**: RPC hataları artık throw ediliyor
- **ERC-721 & ERC-1155 desteği** tam olarak implement edildi

### 3. Admin Panel İyileştirmeleri
- ✅ **Price kolonu eklendi** - NFT fiyatları artık tabloda görünüyor
- ✅ **Bulk Import özelliği** - JSON ile toplu NFT yükleme
- ✅ **Toast notifications** - Başarılı/hatalı işlemler için bildirim
- ✅ **Gelişmiş filtreleme** - Network ve arama filtreleri
- ✅ **İstatistik kartları** - Total, Visible, Hidden NFT sayıları

### 4. WalletFilter İyileştirmeleri
- ✅ **Hata callback'i** - `onError` prop ile hata mesajları
- ✅ **Daha iyi validasyon** - Wallet adresi kontrolü
- ✅ **Kullanıcı dostu mesajlar**

## Kullanım Örnekleri

### Admin Panelinde Toast Kullanımı

```tsx
import { Toast } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';

function MyComponent() {
  const { toast, showToast, hideToast } = useToast();

  const handleSuccess = () => {
    showToast('NFT başarıyla eklendi!', 'success');
  };

  const handleError = () => {
    showToast('Bir hata oluştu', 'error');
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      {/* Your component content */}
    </>
  );
}
```

### WalletFilter ile Hata Yönetimi

```tsx
import { WalletFilter } from './components/WalletFilter';
import { useToast } from './hooks/useToast';

function App() {
  const { showToast } = useToast();
  
  return (
    <WalletFilter
      onWalletChange={(wallet) => setWallet(wallet)}
      onFilterChange={(hide) => setHideOwned(hide)}
      hideOwned={hideOwned}
      isLoading={loading}
      onError={(message) => showToast(message, 'error')}
    />
  );
}
```

### Blockchain Service ile Hata Yakalama

```tsx
import { BlockchainService } from './lib/blockchain';

async function checkOwnership() {
  try {
    const owned = await BlockchainService.checkOwnership(wallet, nft);
    console.log('Owned:', owned);
  } catch (error) {
    // RPC hatası, timeout, vb.
    showToast('RPC bağlantı hatası: ' + error.message, 'error');
  }
}
```

### Bulk Import Kullanımı

Admin panelinde "Bulk Import" butonuna tıklayın ve JSON formatında NFT verilerini yükleyin:

```json
[
  {
    "title": "My NFT #1",
    "description": "Cool NFT",
    "network": "base",
    "contract_address": "0x...",
    "token_id": "1",
    "token_standard": "ERC-721",
    "price_eth": "0.001",
    "tags": ["art", "collectible"],
    "visible": true
  }
]
```

## Yeni Tip Tanımlamaları

### NFT Type
```typescript
export interface NFT {
  id: string;
  title: string;
  description?: string;
  network: 'base' | 'zora' | 'sei' | 'linea' | 'scroll' | 'giwa' | 'pharos' | 'zksync' | 'soneium';
  contract_address: string;
  token_id: string;
  token_standard: 'ERC-721' | 'ERC-1155';
  external_link?: string;
  tags?: string[];
  visible: boolean;
  imageUrl?: string;
  price_eth?: string; // ✅ Price field eklendi
  created_at: string;
  updated_at: string;
  owned?: boolean;
}
```

## Admin Panel Özellikleri

### İstatistikler
- **Total NFTs**: Toplam NFT sayısı
- **Visible**: Görünür NFT sayısı
- **Hidden**: Gizli NFT sayısı

### Filtreleme
- **Arama**: Title, description, contract address'e göre
- **Network Filter**: Belirli bir ağa göre filtreleme

### Tablo Kolonları
1. NFT Details (Title, Description, Tags)
2. Network (Ağ adı, Token standardı)
3. Contract & Token (Contract address, Token ID)
4. **Price** ✅ (ETH cinsinden fiyat)
5. Status (Visible/Hidden)
6. Actions (View, Edit, Delete, Toggle visibility)

## Notlar

- Tüm blockchain işlemleri artık hata fırlatıyor (throw error)
- Ownership cache 5 dakika boyunca geçerli
- Admin panelinde fiyat gösterimi: `parseFloat(nft.price_eth).toFixed(4)` ETH
- Bulk import sırasında eksik alanlar otomatik default değerlerle doldurulur
