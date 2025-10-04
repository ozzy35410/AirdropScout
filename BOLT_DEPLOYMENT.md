# 🚀 Bolt.new Deployment Guide

## ✅ Yapılan Değişiklikler

### API Routes → Serverless Functions

Bolt.new için `server/index.ts` yerine `/api` klasörü kullanıyoruz:

```
api/
├── nft/
│   └── minted.js       # GET /api/nft/minted
└── admin/
    └── collections.js  # GET /api/admin/collections
```

### Özellikler:
- ✅ CORS otomatik yapılandırılmış
- ✅ viem ile blockchain queries
- ✅ ERC-721 ve ERC-1155 desteği
- ✅ Rate limiting koruması
- ✅ Error handling

---

## 📝 Deployment Adımları (Bolt.new)

### 1. GitHub'a Push Yap
```bash
git add .
git commit -m "Add Bolt-compatible serverless API functions"
git push origin main
```

### 2. Bolt.new'de Publish Et

1. Bolt.new editöründe **"Changes detected"** uyarısını gör
2. **"Publish"** veya **"Deploy"** butonuna tıkla
3. Deploy işleminin bitmesini bekle (1-3 dakika)
4. ✅ Website otomatik güncellenir

---

## 🧪 Test Etme

### Website URL:
```
https://airdrop-scout-lax0.bolt.host
```

### Test Adımları:

#### 1. NFTs Sayfasına Git
```
https://airdrop-scout-lax0.bolt.host
```
- NFTs menüsüne tıkla
- Base sekmesini seç
- **Darth Sidious** kartını gör

#### 2. Wallet Adresi Gir
"Track by Address" kutusuna:
```
0x5583BA39732db8006938A83BF64BBB029A0b12A0
```

#### 3. Sonuç
- ⏳ Loading spinner görünecek
- ✅ Darth Sidious'ta yeşil "Minted" badge çıkacak
- 🎯 "Only Minted" butonuna tıklayınca sadece o görünecek

---

## 🔍 API Test (Browser Console)

```javascript
// F12 → Console
fetch('/api/nft/minted?chain=base&address=0x5583BA39732db8006938A83BF64BBB029A0b12A0')
  .then(r => r.json())
  .then(console.log)
```

**Beklenen Response:**
```json
{
  "ok": true,
  "chain": "base",
  "address": "0x5583ba39732db8006938a83bf64bbb029a0b12a0",
  "minted": {
    "darth-sidious": true,  // ✅
    "base-names": false,
    ...
  },
  "meta": {
    "elapsedMs": 2341,
    "cache": "MISS",
    "rateLimited": false
  }
}
```

---

## 📦 NFT Collections

### Base Chain (7 NFTs)
1. ⭐ **Darth Sidious** - Test NFT
   - Contract: `0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4`
   - Test Wallet: `0x5583BA39732db8006938A83BF64BBB029A0b12A0` (minted ✅)

2. **Basename** - Official Base domain
3. **BasePaint** - Generative art
4. **Based God** - PFP collection
5. **Onchain Summer** - Event commemorative
6. **Toshi Vibe** - Mascot NFT
7. **Base Builders** - OG builder NFT

---

## ⚙️ Teknik Detaylar

### API Endpoints

#### GET `/api/nft/minted`
**Query Params:**
- `chain`: base | sei | giwa | pharos
- `address`: 0x... (Ethereum address)
- `refresh`: true (optional, bypass cache)

**Response:**
```typescript
{
  ok: boolean;
  chain: string;
  address: string;
  minted: Record<string, boolean>;
  meta: {
    elapsedMs: number;
    cache: "HIT" | "MISS";
    rateLimited: boolean;
  }
}
```

#### GET `/api/admin/collections`
**Query Params:**
- `chain`: base | sei | giwa | pharos

**Response:**
```typescript
{
  collections: Array<{
    id: string;
    name: string;
    contract_address: string;
    token_standard: string;
    ...
  }>
}
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" hatası
**Çözüm:**
1. Browser Console'da (F12) tam hata mesajını oku
2. Network tab'da request durumunu kontrol et
3. API response 200 OK mi yoksa 500 mı?

### Issue: Tüm NFT'ler "minted: false" dönüyor
**Çözüm:**
1. `meta.rateLimited: true` mi? → Birkaç dakika bekle
2. RPC endpoint çalışıyor mu? → Console'da hata var mı?
3. Contract address doğru mu? → BaseScan'de kontrol et

### Issue: Badge görünmüyor
**Çözüm:**
1. Wallet adresi geçerli mi? (0x + 40 hex)
2. API response `"darth-sidious": true` döndürüyor mu?
3. Browser cache'i temizle (Ctrl+Shift+R)

---

## 📊 Performance

- **API Response Time**: ~2-5 saniye (7 NFT için)
- **RPC Calls**: Her NFT için 1 call (ERC-721) veya 2 call (ERC-1155)
- **Rate Limiting**: 50ms delay between collections
- **Caching**: Yok (serverless, her request fresh)

---

## 🎯 Sonraki Adımlar

### Özellik Eklemeleri:
1. **More Chains**: Sei, Giwa, Pharos için NFT'ler ekle
2. **Admin Panel**: Bolt.new'de localStorage ile NFT ekleme
3. **Caching**: Vercel KV veya Upstash Redis ekle
4. **Analytics**: Mint detection istatistikleri

### Optimizasyonlar:
1. **Parallel Requests**: Tüm NFT'leri parallel kontrol et
2. **Block Range**: Daha akıllı block window stratejisi
3. **Error Retry**: Başarısız RPC call'ları yeniden dene

---

## ✅ Checklist

Deploy öncesi kontrol listesi:

- [x] API routes `/api` klasöründe
- [x] CORS headers ekli
- [x] viem dependency package.json'da
- [x] Frontend relative paths kullanıyor (`/api`)
- [x] Collections config doğru
- [x] Test wallet adresi var
- [ ] GitHub'a pushlandi
- [ ] Bolt.new'de publish edildi
- [ ] Live website'de test edildi

---

## 🌐 Live URL
```
https://airdrop-scout-lax0.bolt.host
```

**Test başarılı olunca bu README'yi güncelleyin!** ✅
