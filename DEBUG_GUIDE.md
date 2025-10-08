# 🔍 Bolt.host NFT Sorunu - Debug Rehberi

## 🎯 Durum

✅ **Supabase**: 3 NFT var (test edildi)
✅ **RLS Policy**: Aktif ve doğru (3 policy var)
✅ **Code**: GitHub'a pushlandı (commit: 8f8941b)
⏳ **Bolt.host**: Build süreci devam ediyor olabilir

---

## 🧪 Test Adımları

### Adım 1: Bolt.host Build Tamamlandı mı?

**Git**: https://airdrop-scout-lax0.bolt.host/?network=base

**Hard Refresh Yap**: 
- Windows: `Ctrl + Shift + R`
- veya `Ctrl + F5`

Bu cache'i temizler ve en son build'i çeker.

---

### Adım 2: Browser Console'u Aç

1. **F12** tuşuna bas
2. **Console** tab'ına geç
3. Sayfayı yenile
4. Console'da **şu logları ara**:

#### ✅ Başarılı Senaryo:
```
[collectionsProvider] Backend API not available, falling back to direct Supabase
[collectionsProvider] Fetching directly from Supabase for chain="base"
[collectionsProvider] Found 2 NFTs from Supabase
```

#### ❌ Hata Senaryoları:

**Senaryo A**: Eski kod hala çalışıyor
```
Failed to fetch admin collections
```
**Çözüm**: Hard refresh yap, cache temizle

**Senaryo B**: Supabase bağlantı hatası
```
[collectionsProvider] Supabase error: ...
```
**Çözüm**: Supabase credentials kontrol et

**Senaryo C**: Hiçbir log yok
```
(boş console)
```
**Çözüm**: collectionsProvider çalışmıyor, kod güncel değil

---

### Adım 3: Network Tab Kontrolü

1. F12 → **Network** tab
2. **XHR** veya **Fetch** filtresi
3. Sayfayı yenile
4. **Ara**:

#### Backend API (404 olmalı - bekleniyor):
```
/api/admin/collections?chain=base
Status: 404 (beklenen)
```

#### Supabase Request (200 olmalı - önemli):
```
https://ulungobrkoxwrwaccfwm.supabase.co/rest/v1/nfts?...
Status: 200 ✅
Response: [{ "id": "...", "title": "Darth Sidious" }, ...]
```

Eğer Supabase request **yok** → Kod henüz deploy olmamış
Eğer Supabase request **403/401** → RLS policy sorunu (ama zaten doğru)
Eğer Supabase request **200** ama data boş → Database'de veri yok (ama var)

---

### Adım 4: Manuel Supabase Test (Browser Console'da)

Console'a bu kodu yapıştır:

```javascript
fetch('https://ulungobrkoxwrwaccfwm.supabase.co/rest/v1/nfts?visible=eq.true&or=(network.eq.base,network.ilike.base)&order=created_at.desc', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdW5nb2Jya294d3J3YWNjZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjA1MDYsImV4cCI6MjA3NTQzNjUwNn0.Y2VaULV2jZ6lp7NvSYb5PKy-yH1wtUSiJddvkUfiz2c',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdW5nb2Jya294d3J3YWNjZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NjA1MDYsImV4cCI6MjA3NTQzNjUwNn0.Y2VaULV2jZ6lp7NvSYb5PKy-yH1wtUSiJddvkUfiz2c'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Supabase Response:', d));
```

**Beklenen Sonuç**: 2 NFT objesi

---

### Adım 5: React DevTools (Opsiyonel)

Eğer React DevTools extension'ın varsa:

1. **Components** tab'ına git
2. **NFTsPage** componentini bul
3. **State** kısmında `collections` array'ine bak
4. Boş mu dolu mu?

---

## 🚨 En Olası Sorunlar

### 1. Bolt.host Henüz Build Yapmadı ⏳

**Belirti**: Console'da eski loglar var
**Çözüm**: 5-10 dakika daha bekle, tekrar hard refresh

### 2. Build Cache Problemi 🔄

**Belirti**: Hard refresh sonrası hala eski kod
**Çözüm**: 
```javascript
// Console'da çalıştır
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

### 3. Import Hatası 📦

**Belirti**: Console'da "Cannot find module" hatası
**Çözüm**: package.json'da @supabase/supabase-js var mı kontrol et (var)

### 4. CORS Problemi 🚫

**Belirti**: Console'da "CORS policy" hatası
**Çözüm**: Supabase Dashboard → Settings → API → CORS allowed origins'e Bolt.host URL'ini ekle

---

## ✅ Başarı Kriterleri

NFT'ler görünüyor diyebilmek için:

1. ✅ Console'da: `Found 2 NFTs from Supabase`
2. ✅ Network'te: Supabase request 200 OK
3. ✅ Sayfada: 2 NFT kartı render oldu
4. ✅ Kartlarda: Darth Sidious ve Saruman isimleri görünüyor

---

## 🎬 Şimdi Ne Yapmalısın?

### Hemen Yap:

1. **Git**: https://airdrop-scout-lax0.bolt.host/?network=base
2. **Hard Refresh**: Ctrl + Shift + R
3. **F12**: Console'u aç
4. **Console logları bana gönder** (screenshot)
5. **Network tab** screenshot'u da al

### 10 Dakika Sonra Hala Yoksa:

Bolt.host build log'unu kontrol et:
- Bolt.host dashboard'a git
- Deployments kısmına bak
- Son deployment başarılı mı?

---

## 📸 Bana Göndermen Gerekenler

1. **Console screenshot** (tüm loglar görünsün)
2. **Network tab screenshot** (Supabase request var mı?)
3. **Page screenshot** (NFT'ler görünüyor mu?)

Bu 3 bilgiyle sorunun tam olarak ne olduğunu görebilirim! 🔍

---

## 🎯 Özet

**Bekle**: 5-10 dakika (Bolt.host build)
**Test Et**: Console + Network tab
**Gönder**: Screenshots
**Çözülecek**: Kesin! 🚀
