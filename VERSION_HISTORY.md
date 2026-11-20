# 📜 VERSION HISTORY — TIAR PROPERTY WEBSITE

## `v2.0.1` (2026-11-19) — Code Audit, Refactor, Guardrail Centralization & ESLint Hardening
- **Shared Modules & Deduplication:**
  - Memusatkan validasi *Information Gap Protocol* & *Anti-BLT* ke [`src/lib/guardrails.ts`](src/lib/guardrails.ts) (dipakai bersama oleh `ClusterModal.tsx`, `AdminSyncExportTab.tsx`, dan `scripts/tiar-mcp-server.ts`).
  - Menambahkan helper `buildMainWaUrl()` dan `buildPropertyMetadata()` di `src/data/properties.ts` untuk menghapus duplikasi CTA WhatsApp di 8 komponen publik serta duplikasi `generateMetadata` di `/properti/[id]` dan `/produk/[id]`.
  - Menghapus export mati `HERO_OFFERS`.
- **Bug Fixes & DOM Hygiene:**
  - `scripts/tiar-mcp-server.ts`: Memperbaiki validator schema gambar (`imageUrl` / `galleryImages`) agar menerima path lokal `/images/...` (sebelumnya ditolak `z.string().url()`), serta mengganti default foto agen dari URL eksternal Unsplash ke `/images/agents/mbak-ningsih.webp`.
  - `src/components/SearchFilterBar.tsx`: Menyamakan `fallbackHref` quick-filter ke parameter kanonik (`?cicilan=dibawah-2jt`, `?tipe=2`).
  - `src/components/PropertyDetailView.tsx`: Mengubah heading kartu mobile ke `<h2>` agar DOM hanya memiliki 1 `<h1>` semantik per halaman, dan menambahkan cleanup timeout via `useRef`.
  - `src/components/admin/AdminDashboard.tsx`: Menambahkan cleanup timer toast via `useRef`.
  - `src/components/admin/AdminSyncExportTab.tsx`: Mengganti simulasi palsu `setTimeout` menjadi validasi integritas skema, guardrail, gambar lokal, PIC agen, dan format WA secara riil, plus memperbarui referensi perintah MCP (`npx tsx scripts/tiar-mcp-server.ts`).
- **Type Safety, Tooling & Repo Cleanup:**
  - Menghilangkan seluruh `: any` / `as any` di `src/` dan `scripts/` (`0` tersisa).
  - Menambahkan `eslint`, `eslint-config-next`, `@eslint/eslintrc`, `tsx`, dan `eslint.config.mjs` sehingga `npm run lint` (`eslint .`) berjalan non-interaktif dengan `0` error/warning.
  - Menghapus legacy dead files (`src/utils/kpr.ts`, `src/utils/kpr-check.js`, 7 skrip QA Python v1, `design-style-preview.html`, dan 7 screenshot v1 di `docs/`).
- **Verification:** `tsc --noEmit` (`0` error), `npm run lint` (`0` error/warning), `npm run build` (`27` rute statis ke `out/`), `verify-mcp-tools.ts` (`15/15` PASS), zero-leak scan (`0` leak publik).

---

## `v2.0.0` (2026-11-17) — `Mejuma Warm Stone` Redesign, Zero Calculator & 0% Serif Numerals
- **Design System Overhaul (`Mejuma Warm Stone`):**
  - Migrasi palet ke Warm Stone (`#F1F1F1`), Travertine (`#E8E4E1`), Hairline Stone Border (`#C5BEB4`), Olive-Umber Ink (`#38352C`), Accessible Muted Ink (`#57534A`), Decorative Sage (`#82886E`), dan Dual-Pill Sun Gold CTA (`#FFCA4F`).
  - Tipografi editorial `Cormorant Garamond` (upright roman khusus huruf), `Golos Text` (`--font-body`), dan `JetBrains Mono` (`--font-mono`).
  - Penambahan `src/app/icon.svg` untuk menghilangkan request 404 `/favicon.ico`.
- **Revisi Keputusan Final User:**
  1. **Hapus Total Kalkulator KPR:** Menghapus `src/components/KprCalculator.tsx`, `<KprCalculator />` dari `src/app/page.tsx`, link `#kalkulator` di `Navbar.tsx`, dan blok `#simulasi-kpr` di `PropertyDetailView.tsx`. Seluruh halaman kini mengarahkan langsung ke *"Hitung Cicilan & Cek SLIK via WhatsApp"*.
  2. **0% Serif Numerals:** Memastikan `0` digit memakai `Cormorant Garamond`; seluruh indeks `.01–.05`, `.01–.04`, `.01–.08`, harga, cicilan, luas `m²`, rating, dan metrik memakai `.num-clean` / `.mono-num` (`lining-nums tabular-nums`).
- **Aset Lokal 4K (`/boost`):**
  - Mengunduh 12 foto arsitektur/properti (`public/images/properties/*.webp`) dan 4 portrait konsultan (`public/images/agents/*.webp`) serta melakukan 4x CUDA upscaling (`upscale-img -m nmkd -t 256`).
- **Perbaikan Keamanan, Aksesibilitas & Anti-Slop:**
  - Memperbaiki teks `"Partner PT TMJ"` -> `"Partner Resmi"` di `PropertyDetailView.tsx`.
  - Mengganti seluruh emoji dengan ikon `lucide-react`.
  - Mengubah `overflow-x: hidden` -> `overflow-x: clip` agar elemen `lg:sticky` berfungsi normal.
  - Menaikkan target sentuh tombol detail/modal/tab ke `min-h-[44px]`.
  - Membersihkan dead files (`PropertyDetailModal.tsx`, `src/components/modal/*`).
- **Verification:** `tsc --noEmit` (0 error), `next build` (`27/27` static export ke `out/`), `kpr-check.js` PASS, zero-leak scan (`0` leak publik), dan 7-viewport CDP QA (`360x800`–`1920x1080`) PASS (`0` overflow, `0` serif digits, `0` broken images).

---

## `v1.0.0` (2026-10-21 — Baseline `f5e9614`) — Dark Luxury Pine Baseline
- Desain awal Swiss Dark Luxury Pine (`#081613` & `#f7faf8`), galeri & detail klaster 2-kolom, peta statis & Locked Shareloc Modal Popup, kalkulator KPR interaktif, direktori konsultan 4-kolom, serta portal `/admin` PIN-protected.
- Git Restore Point tag: `restore-pre-redesign` (`f5e9614`).
