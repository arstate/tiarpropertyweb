# 📋 GRANULAR SWARM TASK CHECKLIST (`TASK.md`)

## Phase 1: Pre-Flight Inspection, Reference DNA Extraction & Planning (COMPLETED)
- [x] Inspeksi menyeluruh struktur repositori `/mnt/HDD-2/BACKUP LINUX/FILE DATA/TIAR.PROPERTY/website/tiar-property-website/`.
- [x] Ekstrak token warna (`#F1F1F1`, `#E8E4E1`, `#C5BEB4`, `#38352C`, `#57534A`, `#82886E`, `#FFCA4F`), tipografi, dan struktur seksi ke [`DESIGN-DNA.json`](file:///mnt/HDD-2/BACKUP%20LINUX/FILE%20DATA/TIAR.PROPERTY/website/tiar-property-website/readme-ai-agent/DESIGN-DNA.json).
- [x] Sajikan 5 variasi interaktif di `design-style-preview.html` — User menyetujui penuh **Opsi 1 (`Mejuma Warm Stone`)** dengan 2 revisi terkunci: **Hapus Total Kalkulator KPR** dan **0% Serif Numerals**.

---

## Phase 2: Step-by-Step Production Build Plan (IN EXECUTION)

### Milestone 0 — Planning Sync & Git Restore Baseline
- [x] Sinkronkan seluruh dokumen `readme-ai-agent/` (`AGENTS.md`, `PRD.md`, `STYLE-GUIDE.md`, `DESIGN-DNA.json`, `USER_FLOW_AND_PAGE_ARCHITECTURE.md`, `TASK.md`, `DESIGN-CRITIQUE.md`) dengan keputusan final **Hapus Total Kalkulator KPR** dan **0% Serif Numerals**.
- [ ] Inisialisasi Git lokal (`git init && git add -A && git commit -m "chore: baseline pre-redesign"`) dan catat hash di `GIT-RESTORE-POINTS.md`.

### Milestone 1 — Foundation: `layout.tsx`, `globals.css`, & Detached Pill `Navbar.tsx`
- [ ] Konfigurasi `Cormorant_Garamond` (khusus huruf editorial, 0 italic) + `Golos_Text` (Body + `.num-clean` lining-tabular numerals) + `JetBrains_Mono` di `src/app/layout.tsx`, `themeColor: '#F1F1F1'`, body `bg-[#F1F1F1] text-[#38352C]`.
- [ ] Tanamkan token `Mejuma Warm Stone`, `.num-clean`, Dual-Pill `Button-040` (`.dual-cta`), `/* Hallmark · pre-emit critique: ... */`, dan `overflow-x: clip` di `src/app/globals.css`.
- [ ] Rombak `src/components/Navbar.tsx` menjadi Detached Top-Right Pill Nav (`TP · Tiar Property` + `Menu =` + `Konsultasi WA`) + Top-Right Floating Dark Drawer (`#38352C`), indeks `.01–.04` memakai `.num-clean` sans-serif, **tanpa `#kalkulator`**, tersembunyi di `/admin`.

### Milestone 2 — Local 4K Assets (`/boost`), Monumental Hero, & Editorial Diptych
- [ ] Unduh foto arsitektur/properti terbaik ke `public/images/properties/*.webp` dan jalankan `/boost` (`upscale-img` CUDA) serta perbarui `src/data/properties.json`.
- [ ] Rombak `src/components/Hero.tsx` (Monumental Fullscreen Hero + Giant Wordmark `tiar property` dengan `flex flex-col justify-between` anti-overlap + Dual-Pill Gold CTA).
- [ ] Rombak `src/components/UspFeatureBar.tsx` & `src/components/SearchFilterBar.tsx` menjadi Editorial Diptych Mission + Quick Filter (`lucide-react`, 0 emoji, metrik `.num-clean`).

### Milestone 3 — Serif Marquee & Asymmetric Property Lookbook
- [ ] Tambahkan Editorial Serif Marquee di `src/components/PropertyCatalog.tsx` (angka `.num-clean`, patuh `prefers-reduced-motion`).
- [ ] Rombak `PropertyCatalog.tsx` & `PropertyCard.tsx` menjadi Asymmetric Staggered Lookbook (`minmax(0, 1fr)`), harga & cicilan `.num-clean`, 100% Information Gap nama samaran.

### Milestone 4 — Sticky `.01–.05` Journey, Komparasi, Testimoni, FAQ, Split Footer & Hapus Total Kalkulator
- [ ] Rombak `src/components/HeroOffers.tsx` (Sticky Left 5-col + Right 7-col kartu `#E8E4E1`, indeks `.01–.05` `.num-clean` sans-serif `Golos Text`).
- [ ] Rombak `src/components/ComparisonTable.tsx` (Editorial story + komparasi `#E8E4E1` vs `#38352C`, `.num-clean`, CTA langsung WA PIC).
- [ ] Rombak `src/components/Testimonials.tsx` (4-col travertine `#E8E4E1`, indeks `.01–.04` `.num-clean`), `src/components/FaqSection.tsx` (`<details>/<summary>`), `src/components/Footer.tsx` (`Ft2` Split Portrait + Dark `#38352C` panel + giant wordmark `tiar property`, 0 tech-stack leak), dan `src/components/FloatingWhatsApp.tsx`.
- [ ] Hapus `<KprCalculator />` dari `src/app/page.tsx` dan hapus file `src/components/KprCalculator.tsx`.

### Milestone 5 — Subpages Overhaul (`/properti`, `/produk`, `/properti/[id]`, `/produk/[id]`, `/agen`) & Security Fix
- [ ] Rombak `PropertiCatalogView.tsx` (Editorial header + Sticky Travertine Filter Bar, URL query sync `?q=&kota=&tipe=&cicilan=`).
- [ ] Rombak `PropertyDetailView.tsx` (Split 40/60 Hero, Galeri `16:10` & Lightbox, Hairline Specs Matrix `.num-clean`, **hapus total blok mini-simulasi KPR** dan gantikan dengan CTA langsung *"Hitung Cicilan & Cek SLIK via WhatsApp"*, pertahankan 100% Peta Statis + Locked Shareloc Modal Popup, **fix `"Partner PT TMJ"` -> `"Partner Resmi"`**, ganti emoji `🧍` -> Lucide icon).
- [ ] Rombak `AgentDirectoryView.tsx` (`/agen` editorial header + segmented filter + 4-col portrait `#E8E4E1` dengan rating `.num-clean` dan Dual-Pill WA CTA), serta bersihkan dead files (`PropertyDetailModal.tsx`, `src/components/modal/*`) jika tidak terpakai.
- [ ] Jaga `/admin` 100% bebas regresi.

### Milestone 6 — Static Build, Zero-Leak Scan, `sloplint`, & 7-Viewport Chrome CDP Port 9223 Vision QA
- [ ] Jalankan `npx tsc --noEmit`, `npm run build` (`out/`), dan `node src/utils/kpr-check.js`.
- [ ] Jalankan zero-leak scan (`TMJ|Trimitra|\bBLT\b|brutalist|\bbento\b|Dibuat dengan|Tailwind CSS|Built with|KprCalculator`) & emoji scan.
- [ ] Audit 58-gate `sloplint` dan **7-Viewport Chrome CDP Port `9223` Fullscreen Vision QA** (`360x800`, `390x844`, `412x915`, `768x1024`, `1024x768`, `1280x800`, `1920x1080`) pada halaman live dari `out/`, inspeksi screenshot via `read_file`.
- [ ] Catat skor dan hasil di `DESIGN-CRITIQUE.md`, `TASK.md`, `GIT-RESTORE-POINTS.md`, `AGENTS.md`, `BUG-AND-FIX.md`, dan `VERSION_HISTORY.md`.
