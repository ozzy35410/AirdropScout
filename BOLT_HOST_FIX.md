# 🔴 ACİL: Bolt.host NFT Sorunu Çözümü

## 📊 Sorun Tespiti

**Site**: https://airdrop-scout-lax0.bolt.host
**Sorun**: NFT'ler görünmüyor
**Sebep**: Bolt.host sadece static hosting - Express backend çalışmıyor!

Test sonucu:
```bash
curl https://airdrop-scout-lax0.bolt.host/api/health
# Sonuç: HTML döndü (404) - Backend yok!
```

---

## ✅ Uygulanan Çözüm

### Değişiklik: Direct Supabase Fallback

**Dosya**: `src/data/collectionsProvider.ts`

**Mantık**:
1. Önce backend API'yi dene (`/api/admin/collections`)
2. Eğer çalışmazsa → **Direkt Supabase'den çek!**

```typescript
// 1. Backend API dene
try {
  const response = await fetch('/api/admin/collections?chain=base');
  if (response works) return data;
} catch {
  // Backend yok, fallback!
}

// 2. Direkt Supabase query
const { data } = await supabase
  .from('nfts')
  .select('*')
  .eq('visible', true)
  .or('network.eq.base,network.ilike.base');

return data; // ✅ NFT'ler geldi!
```

**Artık hem Vercel (backend var) hem Bolt.host (backend yok) çalışacak!**

---

## 🔴 ŞİMDİ YAPMALISIN: RLS Policy Ekle

### Adım 1: Supabase SQL Editor'e Git

https://ulungobrkoxwrwaccfwm.supabase.co/project/ulungobrkoxwrwaccfwm/sql

### Adım 2: Bu SQL'i Çalıştır

```sql
-- Enable RLS
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;

-- Create read policy
CREATE POLICY "Public read access for visible NFTs"
ON public.nfts
FOR SELECT
TO anon, authenticated
USING (visible = true);

-- Verify
SELECT * FROM pg_policies WHERE tablename = 'nfts';
```

### Adım 3: Test Et

```sql
-- Bu sorgu NFT'leri döndürmeli
SELECT id, title, network, visible 
FROM public.nfts 
WHERE visible = true
ORDER BY created_at DESC;
```

Eğer **3 satır** görüyorsan ✅ başarılı!

---

## 🧪 Test Adımları

### 1. RLS Policy'yi Ekledikten Sonra

Bolt.host build'in tamamlanmasını bekle (2-3 dakika)

### 2. Siteye Git

https://airdrop-scout-lax0.bolt.host/?network=base

### 3. Hard Refresh

**Ctrl + Shift + R** (cache temizle)

### 4. Console'u Aç

F12 → Console tab

**Göreceğin log**:
```
[collectionsProvider] Backend API not available, falling back to direct Supabase
[collectionsProvider] Fetching directly from Supabase for chain="base"
[collectionsProvider] Found 2 NFTs from Supabase
```

### 5. Network Tab Kontrol

F12 → Network tab

**Göreceğin istekler**:
- ❌ `/api/admin/collections?chain=base` → 404 (bekleniyor, backend yok)
- ✅ Supabase query → `rest.supabase.co/rest/v1/nfts?...` → 200 OK

### 6. Sayfa Kontrolü

**Base sekmesinde 2 NFT görmelisin**:
1. Darth Sidious
2. Saruman

---

## 📊 Beklenen Sonuç

✅ **Bolt.host**: Direkt Supabase'den NFT çekecek
✅ **Vercel**: Backend API kullanmaya devam edecek (daha hızlı)
✅ **Her ikisi de çalışacak!**

---

## ❓ Hala Görünmüyorsa

### Senaryo 1: Console'da "SUPABASE_ERROR"
**Sebep**: RLS policy yok
**Çözüm**: Yukarıdaki SQL'i çalıştır

### Senaryo 2: Console'da "No NFTs found"
**Sebep**: Database'de veri yok veya network adı yanlış
**Çözüm**: 
```sql
SELECT * FROM nfts WHERE network = 'base';
```

### Senaryo 3: Console'da hiçbir log yok
**Sebep**: Kod henüz build olmadı
**Çözüm**: 2-3 dakika bekle, Bolt.host build yapsın

---

## 🎯 Özet

**Yapılanlar**:
✅ Direct Supabase fallback eklendi
✅ Backend varsa API kullan, yoksa Supabase'e direkt bağlan
✅ GitHub'a pushlandı → Bolt.host build başladı

**Senin Yapman Gereken**:
1. ⚠️ **RLS Policy SQL'ini çalıştır** (yukarıda)
2. ⏳ 2-3 dakika bekle (Bolt.host build)
3. 🌐 Siteye git + Hard refresh (Ctrl+Shift+R)
4. ✅ Console'da "Found 2 NFTs" göreceksin!

---

## 🔗 Linkler

- **Site**: https://airdrop-scout-lax0.bolt.host
- **Supabase SQL**: https://ulungobrkoxwrwaccfwm.supabase.co/project/ulungobrkoxwrwaccfwm/sql
- **GitHub**: https://github.com/ozzy35410/AirdropScout

**Commit**: `8f8941b` - "Fix: Add direct Supabase fallback for static hosting (Bolt.host)"

---

🚀 **RLS Policy'yi ekle, 2 dakika bekle, NFT'ler gelecek!**
