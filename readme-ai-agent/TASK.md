# 📋 GRANULAR SWARM TASK CHECKLIST (`TASK.md`)

## Phase 1: Pre-Flight Inspection, Reference DNA Extraction & Planning (COMPLETED)
- [x] Inspeksi menyeluruh struktur repositori `/mnt/DATA/FILE/TIAR.PROPERTY/website/tiar-property-website/`.
- [x] Ekstrak token warna (`#F1F1F1`, `#E8E4E1`, `#C5BEB4`, `#38352C`, `#57534A`, `#82886E`, `#FFCA4F`), tipografi, dan struktur seksi ke [`DESIGN-DNA.json`](DESIGN-DNA.json).
- [x] Sajikan 5 variasi interaktif di `design-style-preview.html` (diarsipkan/dihapus setelah Phase 3 cleanup) — User menyetujui penuh **Opsi 1 (`Mejuma Warm Stone`)** dengan 2 revisi terkunci: **Hapus Total Kalkulator KPR** dan **0% Serif Numerals**.

---

## Phase 2: Step-by-Step Production Build Plan (COMPLETED)

### Milestone 0 — Planning Sync & Git Restore Baseline
- [x] Sinkronkan seluruh dokumen `readme-ai-agent/` dengan keputusan final **Hapus Total Kalkulator KPR** dan **0% Serif Numerals**.
- [x] Inisialisasi Git lokal (`f5e9614`, tag `restore-pre-redesign`) dan catat hash di `GIT-RESTORE-POINTS.md`.

### Milestone 1 — Foundation: `layout.tsx`, `globals.css`, & Detached Pill `Navbar.tsx`
- [x] Konfigurasi `Cormorant_Garamond` + `Golos_Text` + `JetBrains_Mono` di `src/app/layout.tsx` dan `src/app/icon.svg`.
- [x] Tanamkan token `Mejuma Warm Stone`, `.num-clean`, `.dual-cta`, dan `overflow-x: clip` di `src/app/globals.css`.
- [x] Rombak `src/components/Navbar.tsx` (Detached Pill Nav + Dark Drawer `.01–.04`, hidden di `/admin`).

### Milestone 2 — Local 4K Assets (`/boost`), Monumental Hero, & Editorial Diptych
- [x] Unduh & 4x CUDA upscale aset `public/images/properties/*.webp` & `public/images/agents/*.webp`.
- [x] Rombak `Hero.tsx`, `UspFeatureBar.tsx`, & `SearchFilterBar.tsx`.

### Milestone 3 — Serif Marquee & Asymmetric Property Lookbook
- [x] Rombak `PropertyCatalog.tsx` & `PropertyCard.tsx`.

### Milestone 4 — Sticky `.01–.05` Journey, Komparasi, Testimoni, FAQ, Split Footer & Hapus Total Kalkulator
- [x] Rombak `HeroOffers.tsx`, `ComparisonTable.tsx`, `Testimonials.tsx`, `FaqSection.tsx`, `Footer.tsx`, `FloatingWhatsApp.tsx`, dan hapus `KprCalculator.tsx`.

### Milestone 5 — Subpages Overhaul & Security Fix
- [x] Rombak `PropertiCatalogView.tsx`, `PropertyDetailView.tsx`, & `AgentDirectoryView.tsx` + fix `"Partner Resmi"`.

### Milestone 6 — Static Build, Zero-Leak Scan, `sloplint`, & 7-Viewport Chrome CDP Port 9223 QA
- [x] Verifikasi `tsc --noEmit`, `next build` (`27/27`), zero-leak scan, & 7-viewport CDP QA (`360x800`–`1920x1080`).

---

## Phase 3: `v2.0.1` Code Audit, Deduplication, ESLint Setup & Repo Hygiene (COMPLETED — 2026-11-19)
- [x] Buat restore tag `restore-pre-cleanup-20261119-1352` pada `023d853`.
- [x] Sentralisasi guardrail ke `src/lib/guardrails.ts` + helper `buildMainWaUrl()` & `buildPropertyMetadata()` di `src/data/properties.ts`; hapus `HERO_OFFERS` mati.
- [x] Bersihkan duplikasi link WA di 8 komponen publik & `generateMetadata` di `/properti/[id]` dan `/produk/[id]`.
- [x] Perbaiki canonical filter query di `SearchFilterBar.tsx`, single `<h1>` + timer cleanup di `PropertyDetailView.tsx`, toast timer ref di `AdminDashboard.tsx`.
- [x] Ganti fake `setTimeout` rebuild di `AdminSyncExportTab.tsx` menjadi validasi integritas skema & guardrail riil; hilangkan seluruh `: any` / `as any` di `src/` & `scripts/`.
- [x] Perbaiki schema gambar lokal `/images/...` & default foto agen lokal di `scripts/tiar-mcp-server.ts` + `scripts/verify-mcp-tools.ts`.
- [x] Tambah `eslint`, `eslint-config-next`, `@eslint/eslintrc`, `tsx`, dan `eslint.config.mjs` sehingga `npm run lint` (`eslint .`) berjalan non-interaktif dengan `0` error/warning.
- [x] Hapus legacy dead files (`src/utils/kpr.ts`, `src/utils/kpr-check.js`, 7 file QA Python v1 di root, `design-style-preview.html`, dan 7 screenshot v1 di `docs/`).
- [x] Sinkronkan dokumentasi (`README.md`, `VERSION_HISTORY.md`, `readme-ai-agent/*`) dan verifikasi `tsc --noEmit`, `npm run lint`, `npm run build`, serta `npx tsx scripts/verify-mcp-tools.ts` (`15/15` PASS).
