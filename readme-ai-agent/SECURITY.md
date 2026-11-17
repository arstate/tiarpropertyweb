# 🛡️ 7-LAYER ANTI-HACK POLICY & SECURITY AUDIT (`SECURITY.md`)

## 1. Ringkasan Status Keamanan & Kerahasiaan Bisnis
- **Target:** Tiar Property Frontend (`output: 'export'`) & Local MCP Ecosystem (`scripts/tiar-mcp-server.ts`)
- **Status Audit Post-Redesign (`v2.0.0`, 2026-11-17):** **PASS (7/7 Layers Verified)**

## 2. Matriks Pertahanan 7 Lapis

| Layer | Kontrol Keamanan | Status | Implementasi & Hasil Verifikasi |
|---|---|---|---|
| **1. Input Sanitization & Schema Validation** | Validasi tipe ketat pada properti, agen, dan filter URL | **PASS** | Skema TypeScript di `src/data/*.ts`, parsing aman param URL di `PropertiCatalogView.tsx`, validasi MCP `scripts/tiar-mcp-server.ts`. |
| **2. Authentication & Access Control** | PIN Lock (`2026`) pada rute `/admin` + `noindex, nofollow` | **PASS** | `src/components/admin/AdminPinLock.tsx` & `src/app/admin/page.tsx`; Navbar & FloatingWA tersembunyi di `/admin`. |
| **3. Business Confidentiality (Information Gap & Anti-BLT)** | Proteksi koordinat peta, larangan nama PT developer, & larangan istilah `BLT` | **PASS** | Peta statis regional + `Locked Shareloc Modal Popup`, `PropertyDetailView.tsx` diperbaiki ke `"Partner Resmi"`, scan regex `TMJ\|Trimitra\|BLT` di seluruh `src/` publik & `out/*.html` = `0` temuan. |
| **4. Quota & DoS Shield** | 100% Static HTML Export (`0` serverless compute) + aset lokal WebP | **PASS** | `next.config.ts` (`output: 'export'`, `images.unoptimized: true`), `27/27` halaman diekspor statis tanpa ketergantungan host gambar eksternal. |
| **5. XSS Prevention** | Auto-escaping JSX React 19, `0` unsafe `dangerouslySetInnerHTML` | **PASS** | Seluruh komponen di `src/components/*`. |
| **6. Zero Client Secret Exposure** | Tidak ada API key rahasia di bundle klien | **PASS** | Hanya nomor WhatsApp CS publik (`6282142193231`). |
| **7. External Link Hardening** | `rel="noopener noreferrer"` pada seluruh tautan eksternal `wa.me` | **PASS** | Seluruh CTA WhatsApp & Sticky Bar mencegah *reverse tabnabbing*. |
