# 🐾 BuPati Veteriner Kliniği — Web Sitesi

Veteriner kliniği için hazırlanmış, tatlı pati temalı modern web sitesi.
Next.js 15 (App Router) + TypeScript + Tailwind CSS ile geliştirildi.

## ✨ Neler var?

| Bölüm | Açıklama |
| --- | --- |
| **Ana sayfa** | Animasyonlu hero, istatistikler, öne çıkan hizmetler, çalışma saatleri, süreç adımları, popüler ürünler, müşteri yorumları, SSS |
| **Hizmetler** | 12 hizmet (muayene, aşı, cerrahi, laboratuvar, röntgen, diş, pet kuaför, mikroçip, dahiliye, egzotik, acil, evde bakım) — her biri WhatsApp bilgi butonuyla |
| **Ürünler** | 20 ürünlük katalog; kategori, dost tipi, arama ve sıralama filtreleri. **Online satış yok** — her ürünün "WhatsApp'tan Sipariş Ver" butonu ürün adı ve fiyatını hazır mesaj olarak gönderir |
| **Hakkımızda** | Değerler, ekip kartları, klinik zaman çizelgesi, referanslar |
| **İletişim** | İletişim kanalları, WhatsApp'a dönüşen randevu formu, çalışma saatleri, acil kutusu, SSS |
| **Canlı destek** | Sağ alttaki pati balonu — çift taraflı sohbet. Ziyaretçi yazar, klinik panelden yanıtlar |
| **Yönetim paneli** | `/admin` — gelen sohbetleri görme, yanıtlama, çevrimiçi/çevrimdışı durumu ve mesaj metinlerini yönetme |

## 🚀 Kurulum

```bash
npm install
cp .env.example .env.local   # (isteğe bağlı, varsayılanlarla da çalışır)
npm run dev
```

Site: <http://localhost:3000> · Panel: <http://localhost:3000/admin>

Varsayılan panel şifresi: **bupati2024** (`.env.local` içindeki `ADMIN_PASSWORD` ile değiştirin)

## 📝 Klinik bilgilerini değiştirme

Tüm iletişim ve kimlik bilgileri tek dosyada:

**`src/data/site.ts`**

```ts
export const site = {
  name: "BuPati Veteriner Kliniği",
  whatsapp: "905321234567", // ülke kodu ile, + ve boşluk olmadan
  phoneDisplay: "0532 123 45 67",
  address: "...",
  ...
};
```

Diğer içerik dosyaları:

- `src/data/services.ts` — hizmetler
- `src/data/products.ts` — ürünler, fiyatlar, kategoriler
- `src/data/content.ts` — ekip, yorumlar, SSS, süreç adımları

## 💬 Canlı destek nasıl çalışıyor?

```
Ziyaretçi (sohbet balonu)  ⇄  /api/chat/*   ⇄  Depolama  ⇄  /api/admin/*  ⇄  Klinik (/admin)
```

- Ziyaretçi ad/telefon/konu girip sohbeti başlatır; mesajlar 3 saniyede bir yenilenir.
- Panelde sohbetler listelenir, okunmamış mesaj sayacı gösterilir, hekim yanıt yazar.
- Yanıt ziyaretçinin ekranında birkaç saniye içinde belirir; sohbet kapalıysa balonda kırmızı bildirim rozeti çıkar.
- Panelden **Çevrimiçi/Çevrimdışı** durumu, karşılama ve çevrimdışı mesajları, hatta balonun sitede görünüp görünmeyeceği kontrol edilir.

### Depolama modları

| Mod | Ne zaman devreye girer | Kalıcılık |
| --- | --- | --- |
| `file` | Yerel geliştirmede varsayılan (`.data/chat.json`) | Kalıcı |
| `memory` | Vercel'de, Upstash tanımlı değilse | Geçici (sunucu uyuyunca sıfırlanır) |
| `upstash` | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` tanımlıysa **otomatik** | Kalıcı |

## 🌐 GitHub Pages ile yayınlama (statik)

Statik site `gh-pages` dalına derlenmiş olarak gönderildi. Yayına almak için depo ayarlarında iki adım:

1. **Settings → General → Change visibility → Public**
   (GitHub Pages ücretsiz planda yalnızca herkese açık depolarda çalışır; GitHub Pro varsa bu adım gerekmez.)
2. **Settings → Pages → Source: "Deploy from a branch" → Branch: `gh-pages` / `(root)` → Save**

Birkaç dakika içinde adres yayına girer:
**https://rebirthsoftware-code.github.io/bupati/**

Sonraki her push'ta `.github/workflows/pages.yml` siteyi yeniden derleyip `gh-pages` dalını günceller.

Elle derlemek için:

```bash
BASE_PATH=/bupati npm run build:static   # çıktı: out/
```

### Statik yayında neler çalışır?

| Özellik | Durum |
| --- | --- |
| 5 sayfa, tüm tasarım, animasyonlar, ürün filtreleri, SSS | ✅ Çalışır |
| WhatsApp butonları, randevu formu (WhatsApp'a yönlendirme) | ✅ Çalışır |
| Canlı destek balonu | ⚠️ Tanıtım modu — açılır, yazılır ama mesaj kliniğe ulaşmaz |
| Yönetim paneli (`/admin`) ve çift taraflı sohbet | ❌ Sunucu gerektirir → Vercel |

Sohbetin gerçekten çalışması için aşağıdaki Vercel adımlarını uygulayın; kod tarafında değişiklik gerekmez.

## ▲ Vercel'e yayınlama

1. Vercel'de **New Project** → bu GitHub deposunu seçin (ayarlara dokunmadan **Deploy**).
2. **Settings → Environment Variables** bölümüne ekleyin:

   | Değişken | Değer |
   | --- | --- |
   | `ADMIN_PASSWORD` | panel şifreniz |
   | `ADMIN_SESSION_SECRET` | rastgele uzun bir metin |
   | `NEXT_PUBLIC_SITE_URL` | `https://alan-adiniz.vercel.app` |

3. Sohbetlerin kalıcı olması için (önerilir) Vercel Marketplace'ten ücretsiz **Upstash Redis** ekleyin — `UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN` otomatik tanımlanır, uygulama modu kendiliğinden `upstash`'e geçer.
4. **Redeploy** deyin. Panelin depolama modunu `/admin → Ayarlar` sekmesinden doğrulayabilirsiniz.

## 🎨 Tasarım notları

- Renkler: nane yeşili (`mint`), krem (`cream`), mercan (`coral`) — `tailwind.config.ts`
- Yazı tipleri: Baloo 2 (başlıklar) + Nunito (metin)
- Pati izleri SVG ile çizildi, arka planda yumuşak animasyonla süzülüyor
- Ürün ve ekip görselleri emoji + degrade ile üretiliyor; harici görsel bağımlılığı yok
- Tam duyarlı (mobil/tablet/masaüstü), `prefers-reduced-motion` desteği ve klavye erişilebilirliği mevcut

## 📁 Yapı

```
src/
├─ app/
│  ├─ (site)/           # ziyaretçi sayfaları (header + footer + sohbet balonu)
│  ├─ admin/            # yönetim paneli
│  └─ api/
│     ├─ chat/          # ziyaretçi tarafı uçları
│     └─ admin/         # panel uçları (çerez ile korumalı)
├─ components/          # arayüz bileşenleri
├─ data/                # site bilgileri, hizmetler, ürünler, içerik
└─ lib/
   ├─ chat/             # sohbet deposu (file / memory / upstash)
   └─ admin/            # oturum doğrulama
```

## 🧪 Komutlar

```bash
npm run dev     # geliştirme sunucusu
npm run build   # üretim derlemesi
npm run start   # üretim sunucusu
npm run lint    # lint
```
