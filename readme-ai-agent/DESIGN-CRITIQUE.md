# 👁️ 14-PASS VISION QA & DESIGN CRITIQUE SCORECARD (`DESIGN-CRITIQUE.md`)

## 1. Pre-Emit 6-Axis Critique (`P-H-E-S-R-V`) & Hallmark Gates Target
- **Target CSS Stamp (Milestone 1):** `/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 · macrostructure: editorial-lookbook-sticky-spine · nav: N5-top-right-drawer · footer: Ft2-split-bleed · theme: mejuma-warm-stone · contrast: pass (40-41) · numerals: 0%-serif-lining-tabular · signature: bottom-bleed-wordmark + dual-pill-gold-cta · slop: pending-qa */`
- **Signature (`Gate 82`):** Giant bottom-bleed `tiar property` serif wordmark + `Button-040` Dual-Pill Sun Gold CTA (`#FFCA4F`) yang mengarahkan langsung ke katalog klaster DP 0% Surabaya & Sidoarjo.
- **Picture Deletion Test (`Gate 83`):** Setiap foto pada Hero, Diptych Section 1, Lookbook, Footer, dan Split Detail Page menampilkan wujud nyata arsitektur hunian tropis yang telah di-upscale 4K lokal di `public/images/properties/*.webp`.
- **Competitor Swap Test:** Seluruh copywriting memakai noun & metrik spesifik Tiar Property (*Sukodono, Sedati Juanda, MERR Rungkut, UTJ Rp 1–5 Jt, Subsidi Rp 1,4 Jt/bln, Kawal 5 Bank BUMN BTN/BRI/BSI/Mandiri/BNI, "Mau saya temenin cek lokasinya kak?"*).

---

## 2. Pre-Redesign Baseline vs `Mejuma Warm Stone` Target Audit

| Area / Komponen | Kondisi Lama (`v1.0` Dark Luxury Pine) | Target Terkunci (`v2.0` Mejuma Warm Stone) | Dampak UX & Konversi |
|---|---|---|---|
| **Palet & Kanvas** | `#f7faf8` + `#ffffff` + `#081613` pine | `#F1F1F1` Warm Stone + `#E8E4E1` Travertine + `#38352C` Olive-Umber Ink (`#57534A` muted accessible) + `#FFCA4F` Sun Gold CTA | Hangat, *tactile*, bebas silau, kontras OKLCH `>= 50%`. |
| **Tipografi Angka** | `Cormorant` oldstyle numerals (`.01–.05` terlihat kecil naik-turun) | **0% Serif Numerals:** 100% angka pakai `Golos Text` / `JetBrains Mono` (`.num-clean` `lining-nums tabular-nums`) | Indeks `.01–.05`, harga, cicilan, & metrik `m²` terbaca tajam dan sejajar. |
| **Kalkulator KPR** | Ada di Homepage & Detail Unit | **Dihapus Total** (`KprCalculator.tsx` & `#simulasi-kpr` dihapus), diganti CTA langsung *"Hitung Cicilan & Cek SLIK via WhatsApp"* | Mencegah *price shock* dini dan mengarahkan konsultasi personal via WA PIC. |
| **Navbar & Drawer** | Sticky topbar standar | **Detached Top-Right Pills (`Menu =` + `Konsultasi WA`)** + **Top-Right Dark `#38352C` Floating Drawer** (`.01–.04` `.num-clean`, tanpa `#kalkulator`) | Navigasi bersih di hero tanpa memakan ruang vertikal. |
| **Hero Section (`/`)** | Banner terpotong `340px–440px` | **100svh Fullscreen Architectural Hero** + Giant Bleed Wordmark `tiar property` + Dual-Pill Gold CTA + flex guard anti-overlap | First impression editorial berkelas di layar `1280x800` & `375x812`. |
| **Katalog & Journey** | Grid 3-kolom berurutan | **Editorial Serif Marquee** + **Asymmetric Staggered Lookbook** + **Sticky Left Headline + `.01–.05` Travertine Cards** | Bebas *Adjacent Layout Clone* dan alur *Turnkey* terasa jelas. |
| **Footer** | 3 kolom teks biasa | **Split Architectural Footer (`Ft2`)**: Foto Portrait `3:4` Kiri + Panel Gelap `#38352C` & Giant Wordmark `tiar property` Kanan | Memenuhi *Peak-End Rule*, `0` tech-stack leak. |

---

## 3. 14-Pass Rubric Checklist (Verified in Milestone 6 Across 7 Viewports)
- [ ] **Pass 1:** 5-Second Stranger Test
- [ ] **Pass 2:** 2-Line Headline Law (`text-balance`, upright roman, anti two-fragment cliché)
- [ ] **Pass 3:** 4.3x Scale Contrast
- [ ] **Pass 4:** Equal Outer Frame & No Void
- [ ] **Pass 5:** Zero Adjacent Layout Clones
- [ ] **Pass 6:** 14-Point Anti-Slop Sweep (`0` emoji di UI, `0` kata terlarang, `0` `//` divider, `0%` serif numerals)
- [ ] **Pass 7:** Streamlined Funnel Check (Quick Filter Lookbook + Locked Shareloc Modal + Direct WA Credit/SLIK CTA)
- [ ] **Pass 8:** Mobile 1-Line Ergonomics (`360x800` & `390x844`, `overflow-x: clip`)
- [ ] **Pass 9:** 7 Interactive States Pass
- [ ] **Pass 10:** Motion & Physics Discipline (`cubic-bezier(0.625, 0.05, 0, 1)`)
- [ ] **Pass 11:** Optical Details & `.num-clean` (`lining-nums tabular-nums`)
- [ ] **Pass 12:** Honest Imagery & Aspect Ratio (Aset lokal 4K di `public/images/properties/*.webp` ter-upscale via `/boost`)
- [ ] **Pass 13:** 35–42% Breathing Room
- [ ] **Pass 14:** Zero-Leak Conversion Funnel (Locked Shareloc Modal + Direct WA PIC + Fix `Partner PT TMJ` -> `Partner Resmi`)
- [ ] **Pass 15:** Studio Footer Craft & Zero Tech-Stack Bleed
