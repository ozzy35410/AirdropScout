## ✅ Darth Sidious NFT Test - HAZIR!

### 🎯 NFT Bilgileri
- **İsim**: Darth Sidious
- **Network**: Base Mainnet
- **Contract**: `0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4`
- **Standard**: ERC-721
- **Mint URL**: https://cosmic-darth-sidious.nfts2.me/
- **Fiyat**: 0.00002 ETH

### 🔍 Test Wallet
- **Adres**: `0x5583BA39732db8006938A83BF64BBB029A0b12A0`
- **Durum**: ✅ Bu NFT'yi mintledi

---

## 🚀 Hızlı Test Adımları

### 1. Sunucuları Başlat

**Terminal 1 - Backend:**
```bash
cd "c:\Users\ozzy\Desktop\airdrop scout\tekrar\AirdropScout-main"
npm run dev:backend
```
Çıktı: `🚀 Server running on port 3001`

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\ozzy\Desktop\airdrop scout\tekrar\AirdropScout-main"
npm run dev:frontend
```
Çıktı: `VITE ready in ... ms` → http://localhost:5173

---

### 2. NFT Sayfasını Aç

1. Tarayıcıda aç: **http://localhost:5173**
2. Üst menüden **"NFTs"** butonuna tıkla
3. **"Base"** sekmesine tıkla (Mainnet mode)
4. **"Darth Sidious"** kartının göründüğünü kontrol et ✅

---

### 3. Mint Detection'ı Test Et

#### Adım 1: Adresi Yapıştır
"Track by Address" kutusuna test wallet'ı yapıştır:
```
0x5583BA39732db8006938A83BF64BBB029A0b12A0
```

#### Adım 2: Loading'i Gözle
- Input'un sağında **spinner** görünmeli (⚙️ dönen ikon)
- Bu API çağrısının yapıldığını gösterir
- Yaklaşık 3-10 saniye sürer

#### Adım 3: Minted Badge'i Kontrol Et
**Başarı Kriterleri:**
- ✅ Darth Sidious kartında **yeşil "Minted" badge** görünmeli
- ✅ Badge'de checkmark ikonu (✓) olmalı
- ✅ Diğer NFT'lerde badge olmamalı (eğer mintlemediyseniz)

---

### 4. Filter Butonlarını Test Et

#### Test 1: "Show Minted" (Varsayılan)
- **Sonuç**: Tüm NFT'ler görünür
- **Badge**: Darth Sidious'ta yeşil badge var

#### Test 2: "Only Minted" Butonuna Tıkla
- **Sonuç**: Sadece Darth Sidious görünür
- **Diğer NFT'ler**: Gizlenir
- **Kart Sayısı**: "1 collections found" yazmalı

#### Test 3: "Hide Minted" Butonuna Tıkla
- **Sonuç**: Darth Sidious gizlenir
- **Diğer NFT'ler**: Görünür (Base'de 5 NFT daha var)
- **Kart Sayısı**: "5 collections found" yazmalı

---

## 🔬 API'yi Manuel Test Et

### Browser Console'dan Test:
```javascript
// Browser Developer Tools → Console
fetch('http://localhost:3001/api/nft/minted?chain=base&address=0x5583BA39732db8006938A83BF64BBB029A0b12A0')
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
    "darth-sidious": true,    // ✅ ÖNEMLI: true olmalı!
    "base-names": false,
    "basepaint": false,
    "base-god": false,
    "onchain-summer": false,
    "toshi-vibe": false,
    "base-builders": false
  },
  "meta": {
    "elapsedMs": 1234,
    "cache": "MISS",
    "rateLimited": false
  }
}
```

---

## 📊 BaseScan'de Doğrula

Gerçek mint işlemini blockchain'de kontrol et:

1. Aç: https://basescan.org/address/0x5583BA39732db8006938A83BF64BBB029A0b12A0
2. **"Token Transfers"** sekmesine git
3. Ara: "Darth Sidious"
4. Görmeli:
   - **From**: `0x0000...0000` (mint)
   - **To**: `0x5583BA39...`
   - **Token ID**: Bir sayı
   - **Contract**: `0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4`

---

## ❌ Sorun Giderme

### Sorun 1: "Failed to fetch" Hatası
**Çözüm:**
1. Backend server çalışıyor mu? Port 3001'i kontrol et
2. Browser Console'da tam hata mesajını oku
3. Server terminal'inde hata logu var mı?

### Sorun 2: API 200 döndürüyor ama "darth-sidious": false
**Olası Nedenler:**
1. **RPC Rate Limit**: 
   - `meta.rateLimited: true` ise bekle, tekrar dene
   
2. **Yanlış Block Range**:
   - `startBlock` çok yüksek olabilir
   - Server loglarında "Error checking darth-sidious" var mı?

3. **Contract Adresi Yanlış**:
   - Kontrol et: https://basescan.org/address/0x4e477eC092BFd7424aED9260067d0aA6fe2DbBa4
   - Token transfers olmalı

**Debug için server loglarını kontrol et:**
```
Server terminal'inde şunları ara:
- "Error checking darth-sidious"
- "rate"
- "429"
```

### Sorun 3: Badge Görünmüyor
**Kontrol Listesi:**
1. `mintedMap` undefined mı? (React DevTools'da bak)
2. `isMinted` değeri false mı? (Console'da log at)
3. Wallet adresi lowercase mı? (API lowercase kabul ediyor)
4. Slug eşleşiyor mu? `darth-sidious` vs `darth-sidious`

---

## ✅ Başarı Kriterleri - Checklist

Tüm bunlar **EVET** ise sistem çalışıyor:

- [ ] Darth Sidious kartı Base sekmesinde görünüyor
- [ ] Wallet adresi yapıştırılınca loading spinner çıkıyor
- [ ] API çağrısı 200 OK döndürüyor (Network tab)
- [ ] Response'da `"darth-sidious": true` var
- [ ] Kartda yeşil "Minted" badge görünüyor
- [ ] "Only Minted" butonuna tıklayınca sadece Darth Sidious görünüyor
- [ ] "Hide Minted" butonuna tıklayınca Darth Sidious gizleniyor
- [ ] Console'da "Failed to fetch" yok
- [ ] Server loglarında 500 hatası yok

---

## 🎉 Test Başarılı!

Eğer yukarıdaki tüm adımlar çalışıyorsa:

✅ **Single Source of Truth** sistemi çalışıyor
✅ **Mint Detection API** doğru çalışıyor
✅ **Filter Logic** beklenen şekilde çalışıyor
✅ **Admin Integration** hazır

**Sonraki adımlar:**
1. Admin panelden yeni NFT ekleyerek test et
2. Farklı wallet adresleri dene
3. Diğer chain'leri test et (Sei, Giwa, Pharos)
