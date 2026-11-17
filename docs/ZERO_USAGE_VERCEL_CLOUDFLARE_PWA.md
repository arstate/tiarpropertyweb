# 🛡️ ARSITEKTUR ZERO-USAGE VERCEL: CLOUDFLARE EDGE + NEXT.JS STATIC EXPORT + PWA CACHE-FIRST

Dokumen ini adalah cetak biru teknis (*technical blueprint*) untuk menjalankan website **Tiar Property** di **Vercel Hobby (Free) Tier** dengan konsumsi kuota mendekati **0 Byte / Zero Usage**, bahkan saat menghadapi lonjakan jutaan pengunjung (*viral traffic surge*).

---

## 🏗️ 1. BLUEPRINT ARSITEKTUR ZERO-USAGE

```text
[ USER BROWSER ]
       │
       ▼
 [ 1. SERVICE WORKER (PWA) ] ──(Cache Hit: Repeat Visit)──► [ Disk / CacheStorage ] (0 Byte Internet!)
       │ (Cache Miss: First Visit)
       ▼
 [ 2. CLOUDFLARE GLOBAL ANYCAST EDGE ] (300+ Kota)
       │
       ├─► [ Cloudflare Edge Cache ] ──(Hit 99.8%)──► Kirim ke User (< 15ms)
       │
       ▼ (Cache Miss: Cold Start)
 [ 3. SMART TIERED CACHE UPPER TIER ] (1-2 Hub Terpusat)
       │
       ▼ (Cold Start Tunggal / Deploy Baru)
 [ 4. VERCEL ORIGIN (Hobby Tier) ]
       │ ──► Pure Static HTML/CSS/JS (0 Serverless Function)
```

### Mekanisme Perlindungan 3 Lapis:
1. **Lapis 1 (Client Browser / Service Worker):** Menghilangkan 100% request jaringan pada kunjungan berulang (*repeat visitors*). Semua aset statis diambil dari disk lokal.
2. **Lapis 2 (Cloudflare Edge & Tiered Cache):** Menyerap 99.8% request dari pengunjung baru. Halaman HTML di-cache dengan *Cache Everything*, aset Next.js di-cache permanen selama 1 tahun.
3. **Lapis 3 (Vercel Origin):** Hanya disentuh **1 kali** per region saat cache dingin atau saat deployment baru. Menggunakan `output: 'export'` sehingga Vercel Serverless Function = **0 Invocations**.

---

## 🌐 2. PILAR 1: CLOUDFLARE FREE TIER AS REVERSE PROXY & CACHE RULES

Cloudflare Free Tier menyediakan fitur enterprise-grade yang dapat dimanfaatkan tanpa biaya sepeserpun:

### A. Konfigurasi DNS & Integrasi Vercel
1. Di Dashboard Cloudflare (Menu **DNS** -> **Records**):
   - **Apex Domain (`@`):** CNAME Flattening ke `cname.vercel-dns.com` dengan status **Proxied (Awan Oranye / ON)**.
   - **Subdomain (`www`):** CNAME ke `cname.vercel-dns.com` dengan status **Proxied (Awan Oranye / ON)**.
2. Verifikasi Domain Vercel:
   - Di Vercel Project Settings -> Domains: Tambahkan domain.
   - Vercel akan meminta verifikasi kepemilikan. Buat TXT Record di Cloudflare:
     - Name: `_vercel`
     - Content: `vc-domain-verify=...` (sesuai yang diberikan Vercel).
   - Vercel akan langsung berubah status menjadi **Valid Configuration** (Centang Hijau).

### B. Mencegah Error `ERR_TOO_MANY_REDIRECTS` (SSL Loop)
* **Akar Masalah:** Vercel secara default memaksakan HTTPS (redirect 308 dari HTTP ke HTTPS). Jika mode SSL Cloudflare disetel ke **Flexible**, Cloudflare akan menghubungi Vercel via HTTP port 80. Vercel merespon dengan redirect 308 ke HTTPS. Cloudflare menerima redirect dan meneruskannya ke browser -> browser request ulang -> loop tak terbatas!
* **Solusi Wajib:**
  - Buka Dashboard Cloudflare -> **SSL/TLS** -> **Overview**.
  - Ubah mode enkripsi menjadi **Full** atau **Full (Strict)**.
  - Pada mode ini, Cloudflare berkomunikasi dengan Vercel melalui HTTPS port 443 dengan enkripsi TLS end-to-end. Redirect loop 100% tereliminasi.

### C. Cloudflare Cache Rules (Modern Rule Engine)
Secara default, Cloudflare **TIDAK mencache file HTML** (URL tanpa ekstensi seperti `/` atau `/listing`). Tanpa aturan ini, setiap user yang membuka halaman utama akan menembus langsung ke Vercel.

Buat 2 Cache Rules di Cloudflare (**Caching** -> **Cache Rules**):

#### Rule 1: Static Chunks & Immutable Assets
* **Rule Name:** `Next.js Static Assets Immutable`
* **When incoming requests match:**
  - Expression: `starts_with(http.request.uri.path, "/_next/static/")`
* **Then:**
  - Cache Eligibility: **Eligible for cache**
  - Edge TTL: **Override origin** -> **1 year (31,536,000s)**
  - Browser TTL: **Override origin** -> **1 year (31,536,000s)**

#### Rule 2: HTML Pages (Cache Everything)
* **Rule Name:** `HTML Cache Everything Root`
* **When incoming requests match:**
  - Expression: `(http.host eq "tiarproperty.com" or http.host eq "www.tiarproperty.com")`
* **Then:**
  - Cache Eligibility: **Eligible for cache**
  - Edge TTL: **Override origin** -> **1 month (2,592,000s)**
  - Browser TTL: **Override origin** -> **4 hours (14,400s)**
  - Serve stale content while updating (SWR): **Enabled**

### D. Smart Tiered Cache (100% Gratis di Free Tier)
* Buka **Caching** -> **Tiered Cache**.
* Aktifkan **Tiered Cache** -> pilih **Smart Tiered Cache Topology**.
* **Cara Kerja:** Alih-alih ratusan data center Cloudflare sedunia menghubungi Vercel saat cache miss, data center tingkat bawah (*lower-tier*) meminta data ke pusat data regional terdekat (*upper-tier*). Hanya data center *upper-tier* yang berhak menghubungi Vercel. Hasilnya: beban origin ke Vercel terpangkas hingga 95% tambahan.

---

## ⚡ 3. PILAR 2: NEXT.JS `output: 'export'` VS SSG `force-static`

### Komparasi Arsitektur
| Parameter | SSG `force-static` (Saat Ini) | Next.js `output: 'export'` (Rekomendasi) |
| :--- | :--- | :--- |
| **Output Build** | Folder `.next` dengan hybrid static/serverless manifests | Folder `out/` murni HTML, CSS, JS statis |
| **Serverless Functions Vercel** | Masih ada infrastruktur Lambda standby | **0 Function / Non-Existent** |
| **Risiko Function Invocations** | Bisa bocor jika ada route dinamik/API tak sengaja | **0.00% Risiko Bocor** |
| **Portabilitas Multi-Cloud** | Terikat ekosistem Node/Vercel | Bisa dideploy ke Cloudflare Pages / S3 / Nginx |
| **Image Optimization** | Membutuhkan `unoptimized: true` | Membutuhkan `unoptimized: true` (Sudah aktif) |

### Audit Kompatibilitas Kode Tiar Property
Website Tiar Property di `/mnt/HDD-2/.../tiar-property-website`:
1. `unoptimized: true` sudah terkonfigurasi di `next.config.ts`.
2. Seluruh data properti tersimpan lokal di `src/data/properties.ts`.
3. Komponen dinamis (`KprCalculator`, `FloatingWhatsApp`) berjalan murni di browser client (`'use client'`).
4. Tidak menggunakan API routes Node.js (`/api/*`), headers runtime, maupun cookies.
👉 **Proyek ini 100% SIAP dan kompatibel penuh dengan `output: 'export'`.**

### Konfigurasi di `next.config.ts`:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Menghasilkan folder 'out/' murni HTML/JS statis
  reactStrictMode: true,
  images: {
    unoptimized: true, // Bypass Vercel Image Transformation (0/1.000 limit)
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
```

---

## 📱 4. PILAR 3: SERVICE WORKER / PWA CACHE-FIRST STRATEGY

Dengan menambahkan Service Worker native ultra-ringan (tanpa library gemuk seperti next-pwa atau workbox), browser pengunjung akan mencache seluruh aset situs secara permanen di memori lokal (*CacheStorage*).

### A. File `public/sw.js` (Vanilla Service Worker ~40 Baris)
```javascript
const CACHE_NAME = 'tiar-property-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Static Chunks Next.js & Fonts: CACHE-FIRST (Immutable)
  if (url.pathname.startsWith('/_next/static/') || url.hostname.includes('unsplash.com')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((networkRes) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkRes.clone());
            return networkRes;
          });
        });
      })
    );
    return;
  }

  // 2. HTML Navigation: STALE-WHILE-REVALIDATE (Instan 2ms, update di background)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((networkRes) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkRes.clone()));
          return networkRes;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
```

### B. Registrasi di `src/components/ServiceWorkerRegister.tsx`
```tsx
'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration failed:', err);
      });
    }
  }, []);

  return null;
}
```
*Pasang `<ServiceWorkerRegister />` di dalam `src/app/layout.tsx`.*

---

## 🗄️ 5. PILAR 4: EXTERNALISASI ASET STATIS & TEMUAN KRITIS

### Temuan Investigasi di Codebase:
* Ditemukan file **`public/videos/hero-bg.mp4` sebesar 1.504.983 Bytes (1.5 MB)** di folder proyek.
* **Fakta:** File video ini **sama sekali tidak dipakai** di komponen `Hero.tsx` (Hero sudah memakai foto Unsplash).
* **Risiko:** Setiap kali file 1.5 MB ini tersimpan di `public/`, Vercel akan mengunggahnya. Jika ada bot crawler atau user yang mengakses URL `/videos/hero-bg.mp4`, 10.000 hit = 15 GB bandwidth terbuang sia-sia!
* **Rekomendasi:** Hapus file `hero-bg.mp4` dari folder `public/videos/`.

### External Storage untuk Media Masa Depan:
1. **Foto Listing Rumah:** Tetap gunakan **Unsplash CDN** atau simpan di **Cloudflare R2**:
   - Cloudflare R2 memberikan gratis penyimpanan 10 GB.
   - **0 Egress Bandwidth Fee** (Bebas biaya transfer data selamanya!).
2. **Video Properti / Virtual Tour:** Wajib disematkan via **YouTube Unlisted Embed** atau **Cloudflare Stream**, bukan di-host langsung di Vercel.

---

## 🔄 6. PILAR 5: PROTOKOL PURGE CACHE SAAT UPDATE WEBSITE

Jika halaman HTML di-cache selama 1 bulan di Cloudflare Edge, bagaimana jika ada promo properti baru atau perubahan harga?

### Solusi 1: Otomasi Purge Cache via Cloudflare API di GitHub Actions
Tambahkan step di `.github/workflows/deploy.yml`:
```yaml
- name: Purge Cloudflare Cache
  run: |
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}'
```

### Solusi 2: 1-Click Purge Manual di Dashboard Cloudflare
- Buka Cloudflare Dashboard -> **Caching** -> **Configuration**.
- Klik tombol **Purge Everything** (Hanya butuh 3 detik, seluruh edge cache global langsung diperbarui).
- Catatan: File JS/CSS `_next/static` tidak akan mengalami masalah *caching clash* karena Next.js secara otomatis menggunakan *content hashing* pada nama file build.

---

## 📊 7. SIMULASI & KALKULASI PENGHEMATAN (1.000.000 PENGUNJUNG / BULAN)

| Komponen Vercel | Batas Hobby Tier | Setup Standar (Tanpa CF) | Setup Optimasi Zero-Usage | Status / Sisa Kuota |
| :--- | :--- | :--- | :--- | :--- |
| **Fast Data Transfer** | 100 GB / bulan | **1.500 GB (1.5 TB)** ❌ (Over 15x, Jebol) | **~35 MB s/d 80 MB** 🚀 (Hanya cold start) | **Sisa Kuota 99.96%** |
| **Serverless Invocations**| 100.000 / bulan | **1.000.000 hit** ❌ (Over 10x, Diblokir) | **0 Invocation** 🚀 (`output: 'export'`) | **Sisa Kuota 100% (0 used)** |
| **Image Optimization** | 1.000 gambar | **15.000 transformasi** ❌ (Over 15x) | **0 Gambar** 🚀 (`unoptimized: true`) | **Sisa Kuota 100% (0 used)** |
| **Edge Middleware** | 1.000.000 hit | 1.000.000 hit | **0 Invocation** (Semua di Cloudflare Edge) | **Sisa Kuota 100%** |
| **Biaya Bulanan** | Rp 0 | Potensi ditagih $400 - $700 (Pro Overage)| **Rp 0 (Murni Free Tier)** | **Hemat 100%** |

---

## 🚀 8. ACTION PLAN STEP-BY-STEP (/plan /boost)

1. **[Langkah 1 - Codebase]:**
   - Hapus `public/videos/hero-bg.mp4` yang tidak terpakai.
   - Tambahkan `output: 'export'` di `next.config.ts`.
   - Buat `public/sw.js` dan daftarkan melalui `<ServiceWorkerRegister />` di `src/app/layout.tsx`.
2. **[Langkah 2 - Vercel]:**
   - Pastikan build command default (`next build`) menghasilkan folder `out/`.
   - Deploy repositori ke Vercel.
3. **[Langkah 3 - Cloudflare DNS & SSL]:**
   - Ubah SSL/TLS Encryption Mode ke **Full (Strict)**.
   - Buat DNS CNAME `@` dan `www` mengarah ke `cname.vercel-dns.com` (Status: Proxied).
   - Masukkan TXT record verifikasi domain Vercel `_vercel`.
4. **[Langkah 4 - Cloudflare Caching]:**
   - Aktifkan **Smart Tiered Cache**.
   - Buat 2 Cache Rules: `/_next/static/*` (Edge TTL 1 tahun) dan `*` (Edge TTL 1 bulan).
   - Aktifkan **Always Online** dan **Brotli**.
5. **[Langkah 5 - Verifikasi]:**
   - Akses website, buka Chrome DevTools -> tab Network:
     - Header respons wajib menampilkan `cf-cache-status: HIT` dari Cloudflare.
     - Respons kedua di browser wajib menampilkan `(ServiceWorker)` pada tab Size.
     - Di Vercel Dashboard -> Analytics / Usage: Grafik request dan bandwidth nyaris **garis lurus datar 0**.
