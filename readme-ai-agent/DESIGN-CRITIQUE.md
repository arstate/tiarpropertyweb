# 👁️ 14-PASS VISION QA & DESIGN CRITIQUE SCORECARD (`DESIGN-CRITIQUE.md`)

## 1. Pre-Emit 6-Axis Critique (`P-H-E-S-R-V`) & Hallmark Gates
- **Applied CSS Stamp (`src/app/globals.css:1`):** `/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · macrostructure: editorial-lookbook-sticky-spine · nav: N5-top-right-drawer · footer: Ft2-split-bleed · theme: mejuma-warm-stone · contrast: pass (40-41) · numerals: 0%-serif-lining-tabular · signature: bottom-bleed-wordmark + dual-pill-gold-cta · slop: 58/58 */`
- **Signature (`Gate 82`):** Giant bottom-bleed `tiar property` serif wordmark + `Button-040` Dual-Pill Sun Gold CTA (`#FFCA4F`) yang mengarahkan langsung ke katalog klaster DP 0% Surabaya & Sidoarjo.
- **Picture Deletion Test (`Gate 83`):** Seluruh foto pada Hero, Diptych Section 1, Lookbook, Footer, Split Detail Page, dan Direktori Konsultan menggunakan aset lokal WebP yang telah di-upscale 4K via CUDA (`upscale-img -m nmkd -t 256`) di `public/images/properties/*.webp` dan `public/images/agents/*.webp`.
- **Competitor Swap Test:** Seluruh copywriting memakai noun & metrik spesifik Tiar Property (*Sukodono, Sedati Juanda, MERR Rungkut, UTJ Rp 1–5 Jt, Subsidi Rp 1,4 Jt/bln, Kawal 5 Bank BUMN BTN/BRI/BSI/Mandiri/BNI, "Mau saya temenin cek lokasinya kak?"*).

---

## 2. Pre-Redesign Baseline vs `Mejuma Warm Stone` Final Build (`v2.0.0`)

| Area / Komponen | Kondisi Lama (`v1.0` Dark Luxury Pine) | Implementasi Final (`v2.0` Mejuma Warm Stone) | Verifikasi Aktual |
|---|---|---|---|
| **Palet & Kanvas** | `#f7faf8` + `#ffffff` + `#081613` pine | `#F1F1F1` Warm Stone + `#E8E4E1` Travertine + `#38352C` Olive-Umber Ink + `#57534A` muted accessible + `#FFCA4F` Sun Gold CTA | Diterapkan di seluruh rute publik (`globals.css`, komponen utama & subpage). |
| **Tipografi Angka** | `Cormorant` oldstyle numerals | **0% Serif Numerals:** 100% angka pakai `Golos Text` (`.num-clean`) / `JetBrains Mono` (`.mono-num`) dengan `lining-nums tabular-nums` | Terverifikasi DOM TreeWalker CDP: `serifNums = 0` di seluruh 7 viewport & 5 rute. |
| **Kalkulator KPR** | Ada di Homepage & Detail Unit | **Dihapus Total** (`KprCalculator.tsx`, `#kalkulator`, `#simulasi-kpr` dihapus), diganti CTA langsung *"Hitung Cicilan & Cek SLIK via WhatsApp"* | Terverifikasi via grep & DOM CDP (`has_simulasi=False`, `has_wa_cta=True`). |
| **Navbar & Drawer** | Sticky topbar standar | **Detached Top-Right Pills (`Menu` + `Konsultasi WA`)** + **Top-Right Dark `#38352C` Floating Drawer** (`.01–.04` `.num-clean`), hidden di `/admin` | Terverifikasi klik buka/tutup drawer & link valid di CDP (`1280x800`). |
| **Hero Section (`/`)** | Banner terpotong | **100svh Fullscreen Architectural Hero** + Giant Wordmark `tiar property` + Dual-Pill Gold CTA | Terverifikasi bounding-box anti-overlap & fold fit (`heroOk=True`) di 7 viewport. |
| **Subpages & Keamanan** | `Partner PT TMJ` & emoji literal `🧍📍✨` | `Partner Resmi`, `100%` `lucide-react` (0 emoji), Peta Statis + Locked Shareloc Modal + Lightbox utuh, `/admin` utuh | Terverifikasi zero-leak scan (`0` leak publik) & modal/lightbox toggle CDP. |

---

## 3. Hasil Audit 7-Viewport Chrome CDP Port `9223` (Rute Statis `out/`)

- **Viewport yang Diuji:** `360x800`, `390x844`, `412x915`, `768x1024`, `1024x768`, `1280x800`, `1920x1080`
- **Rute yang Diuji:** `/`, `/properti`, `/properti/sukodono-cluster-1`, `/agen`, `/admin` (`360x800` & `1280x800`) + `/produk`
- **Hasil Terukur:**
  - `overflow`: `False` (`scrollWidth <= innerWidth`) di seluruh 7 viewport.
  - `serifNums`: `0` di seluruh 7 viewport × 5 rute.
  - `italicHeadings`: `[]` (`0` heading miring).
  - `brokenImgs`: `0` (seluruh gambar lokal WebP terdekode `naturalWidth > 0` setelah scroll penuh).
  - `smallTargets (< 42px)`: `0` pada mobile/tablet & `0` button wrap.
  - `Console/JS errors`: `0` | `Failed network requests`: `0` (termasuk favicon via `src/app/icon.svg`).
- **Catatan Transparansi Verifikasi:** Inspeksi DOM, computed font, bounding-box anti-overlap, gambar termuat, zero-leak, dan interaksi klik dijalankan langsung via Chrome CDP port `9223`; namun inspeksi visual piksel screenshot secara manusiawi/multimodal belum dapat dievaluasi langsung di sesi subagent ini karena attachment gambar pada tool baca file tidak dirender sebagai citra di konteks. Disarankan reviewer membuka langsung `out/` di browser untuk spot-check estetika akhir.
