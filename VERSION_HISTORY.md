# 📜 VERSION HISTORY — TIAR PROPERTY WEBSITE

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
- **Verification:** `tsc --noEmit` (0 error), `next build` (`27/27` static export ke `out/`), `kpr-check.js` PASS, zero-leak scan (`0` leak publik), dan 7-viewport CDP QA (`360x800`–`1920x1080`) PASS (`0` overflow, `0` serif digits, `0` console errors, `0` broken images).

---

## `v1.0.0` (2026-10-21 — Baseline `f5e9614`) — Dark Luxury Pine Baseline
- Desain awal Swiss Dark Luxury Pine (`#081613` & `#f7faf8`), galeri & detail klaster 2-kolom, peta statis & Locked Shareloc Modal Popup, kalkulator KPR interaktif, direktori konsultan 4-kolom, serta portal `/admin` PIN-protected.
- Git Restore Point tag: `restore-pre-redesign` (`f5e9614`).
