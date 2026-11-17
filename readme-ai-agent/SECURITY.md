# 🛡️ 7-LAYER ANTI-HACK POLICY & SECURITY AUDIT (`SECURITY.md`)

## 1. Ringkasan Status Keamanan & Kerahasiaan Bisnis
- **Target:** Tiar Property Frontend (`output: 'export'`) & Local MCP Ecosystem (`scripts/tiar-mcp-server.ts`)
- **Status Audit Pre-Flight:** **ACTION REQUIRED (1 Kebocoran Information Gap Eksisting Ditemukan untuk Diperbaiki di Milestone 5)**

## 2. Matriks Pertahanan 7 Lapis

| Layer | Kontrol Keamanan | Status | Implementasi & Temuan Audit di Repo |
|---|---|---|---|
| **1. Input Sanitization & Schema Validation** | Validasi tipe ketat pada properti, agen, dan kalkulator KPR | **PASS** | Skema TypeScript & validasi input pada `scripts/tiar-mcp-server.ts` serta `ClusterModal.tsx` |
| **2. Authentication & Access Control** | PIN Lock (`2026`) pada rute `/admin` + `noindex, nofollow` | **PASS** | `src/components/admin/AdminPinLock.tsx` |
| **3. Business Confidentiality (Information Gap & Anti-BLT)** | Proteksi koordinat peta, larangan nama PT developer, & larangan istilah `BLT` | **ACTION REQUIRED** | Peta statis & `Locked Shareloc Modal Popup` sudah aman, **TETAPI** baris `1407` di `src/components/PropertyDetailView.tsx` masih menulis `"Partner PT TMJ"`! Wajib diganti `"Partner Resmi"` saat Milestone 5. |
| **4. Quota & DoS Shield** | 100% Static HTML Export (`0` serverless compute) | **PASS** | `next.config.ts` (`output: 'export'`, `images.unoptimized: true`) |
| **5. XSS Prevention** | Auto-escaping JSX React 19, `0` unsafe `dangerouslySetInnerHTML` | **PASS** | Seluruh komponen di `src/components/*` |
| **6. Zero Client Secret Exposure** | Tidak ada API key rahasia di bundle klien | **PASS** | Hanya nomor WhatsApp CS publik (`6282142193231`) |
| **7. External Link Hardening** | `rel="noopener noreferrer"` pada seluruh tautan `wa.me` | **PASS** | Seluruh CTA WhatsApp mencegah *reverse tabnabbing* |
