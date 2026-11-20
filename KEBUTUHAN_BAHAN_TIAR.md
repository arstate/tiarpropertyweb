# Daftar Kebutuhan Bahan — Tiar Property Website

File ini berisi daftar bahan yang perlu lu siapin biar website **Tiar Property** maksimal untuk **Trust Klien**, **SEO Lokal**, **Meta Ads**, dan **Google Ads**.

---

## 1. Foto Properti & Bukti Akad (Wajib untuk Trust)
- [ ] **Foto Eksterior & Interior Asli** per klaster di `public/images/properties/` (minimal 3–4 foto per klaster, rasio 4:3 atau 3:4).
- [ ] **Foto Serah Terima Kunci / Akad Notaris** (minimal 3 foto klien asli, wajah boleh disamarkan/stiker kalau klien minta privasi) — untuk menggantikan testimoni teks polos di [Testimonials.tsx](src/components/Testimonials.tsx).
- [ ] **Screenshot ACC Bank (BTN / BRI / BSI / Mandiri / BNI)** (sensor data pribadi/NIK) sebagai bukti approval KPR nyata.

## 2. Foto Tim Marketing / Konsultan
- [ ] **Foto Profil Resmi** Mas Tiar, Mbak Ningsih, dan tim konsultan di `public/images/agents/` (pencahayaan bersih, latar netral).

## 3. Data Identitas & Legalitas Kantor (NAP — SEO Lokal & Trust)
- [ ] **Alamat Kantor Pemasaran Resmi** (nama jalan, kecamatan, kota, kode pos) — untuk dipasang di [Footer.tsx](src/components/Footer.tsx) & [JsonLdSchema.tsx](src/components/JsonLdSchema.tsx).
- [ ] **Link Google Maps Kantor** (jika sudah ada Google Business Profile).
- [ ] **Link Akun Sosial Media Resmi** (Instagram `@tiar.property`, TikTok jika ada).

## 4. Tracking & Ads (Meta Ads + Google Ads)
Buat file `.env.local` di root project (atau isi di dashboard hosting/Vercel) dengan variable berikut:
```env
NEXT_PUBLIC_SITE_URL=https://tiarproperty.com
NEXT_PUBLIC_META_PIXEL_ID=ISI_PIXEL_ID_META_DISINI
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
- [ ] **Meta Pixel ID** dari Meta Business Suite (event `Contact` otomatis ketembak tiap tombol WA diklik).
- [ ] **Google Analytics 4 / Google Ads Tag ID** (`G-...` atau `AW-...`) untuk tracking konversi `generate_lead`.
- [ ] **Domain Resmi Aktif** (`tiarproperty.com` atau domain pilihan lu) — supaya `sitemap.xml`, `robots.txt`, dan `canonical` mengarah ke domain asli.
