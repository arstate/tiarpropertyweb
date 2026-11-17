# ⚡ PANDUAN DEPLOY VERCEL & OPTIMASI EDGE CACHE (ANTI-JEBOL FREE TIER)

Dokumen ini mencatat seluruh konfigurasi teknis yang diterapkan di proyek Next.js Tiar Property agar berjalan super ringan, loading instan, dan **100% aman di Vercel Free (Hobby) Tier** tanpa risiko kehabisan kuota atau tagihan berlebih.

---

## 🛑 1. ANALISIS RISIKO VERCEL FREE TIER (KENAPA BISA JEBOL?)

Di Vercel Hobby Tier, ada 3 kuota kritis yang sering jebol pada web properti standar:
1. **Serverless Function Execution (Limit: 100.000 invocations / bulan):** Jika menggunakan SSR dinamis (`getServerSideProps` atau `force-dynamic`), setiap kali bot, crawler, atau pengunjung membuka halaman, 1 function dieksekusi. 100k hit = kuota habis.
2. **Vercel Image Optimization (Limit: 1.000 gambar ditransformasi / bulan):** Jika memakai default `next/image` dengan banyak variasi ukuran viewport di banyak listing rumah, kuota 1.000 gambar akan habis dalam hitungan hari.
3. **Fast Data Transfer / Bandwidth (Limit: 100 GB / bulan):** Bundle JS besar dan foto rumah resolusi tinggi yang tidak dikompresi menyedot bandwidth cepat.

---

## 🛡️ 2. SOLUSI & ARSITEKTUR YANG SUDAH DITERAPKAN DI PROYEK INI

### A. Static Site Generation (SSG) & Zero Serverless Invocations
- Di `src/app/page.tsx`:
  ```typescript
  export const dynamic = 'force-static';
  export const revalidate = false; // 100% Static HTML tanpa runtime function
  ```
- **Dampak Anti-Jebol:** Halaman menjadi file HTML murni di Vercel Edge Network. Jutaan user mengakses pun, **0 Serverless Function Invocations** yang dijalankan (kuota 100.000 invocations tetap utuh 0%).
- **ETags & 304 Not Modified:** Menghemat Fast Data Transfer (100GB limit) karena user yang me-refresh browser tidak mengunduh ulang HTML/CSS.

### B. Font Self-Hosted & Google Font Build-Time Injection
- Menggunakan `Playfair_Display` via `next/font/google` di `src/app/layout.tsx`.
- Font di-download dan di-embed langsung ke file static bundle saat proses build, dengan header `Cache-Control: public, max-age=31536000, immutable`. Zero latency eksternal.

### B. Bypass Image Optimization Vercel (`unoptimized: true`)
- Di `next.config.ts`:
  ```typescript
  images: {
    unoptimized: true,
  }
  ```
- **Dampak:** Gambar disajikan langsung dari sumber URL CDN atau folder statis tanpa melalui server pipeline image transformer Vercel. **0 / 1.000 kuota Vercel Image Optimization terpakai**.

### C. Zero-Bloat React Server Components (RSC)
- 90% komponen (Navbar, Hero, HeroOffers, PropertyCatalog, ComparisonTable, Footer) adalah React Server Components murni.
- Nol JavaScript hydration yang dikirim ke browser untuk komponen-komponen ini.
- Hanya `KprCalculator` dan `FloatingWhatsApp` yang menggunakan `'use client'`, menjaga ukuran JS bundle tetap mini (< 80 KB gzipped).

### D. Header Edge Cache di `vercel.json`
- Di `vercel.json`:
  ```json
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=86400, stale-while-revalidate=604800"
        }
      ]
    }
  ]
  ```
- Browser dan Edge Network Vercel menyimpan cache selama 24 jam dan memperbarui di latar belakang (*stale-while-revalidate*) selama 7 hari.

---

## 🚀 3. CARA DEPLOY KE VERCEL

1. Masuk ke direktori:
   ```bash
   cd "/mnt/HDD-2/BACKUP LINUX/FILE DATA/TIAR.PROPERTY/website/tiar-property-website"
   ```
2. Install dependensi lokal & pastikan build sukses:
   ```bash
   bun install
   bun run build
   ```
3. Push ke repositori GitHub / GitLab.
4. Di Dashboard Vercel:
   - Klik **Add New Project** -> **Import Git Repository**.
   - Root Directory: biarkan default atau pilih folder `tiar-property-website` jika satu repo dengan root.
   - Klik **Deploy**.
