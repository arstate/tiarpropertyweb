# 🔄 GIT RESTORE POINTS & ROLLBACK REGISTER

## Restore Points Log

### [Milestone 1] - Initial Marketplace Detail & Rekomendasi
- **Date:** 2026-10-19
- **Scope:** Halaman detail properti marketplace `/properti/[id]`, modal dihapus, galeri foto, tabel spek, kalkulator KPR, dan section rekomendasi properti.

### [Milestone 2] - MCP Server & Admin Panel Integration
- **Date:** 2026-10-19
- **Scope:** 7 tools MCP server di `scripts/tiar-mcp-server.ts`, panel admin `/admin` dengan proteksi PIN, manajemen klaster & agen.

### [Milestone 3] - Clean Minimal Layout & Mobile Gallery Gesture Polish
- **Date:** 2026-10-20
- **Scope:** Hapus duplikasi Section 6, aktifkan tombol panah `<>` di desktop dengan gesture drag/swipe, perbaiki thumbnail tanpa terpotong, rapikan card konsultan di hero kanan, dan bersihkan navbar container.

### [Milestone 4] - Homepage Ultra-Clean Minimal & Responsive Overhaul
- **Date:** 2026-10-21
- **Scope:** SearchFilterBar mobile single-row pill + horizontal chips, UspFeatureBar mobile swipeable ribbon, ComparisonTable stacked parameter cards di ponsel, dan refinement card padding/shadow.

### [Milestone 5] - Catalog & Agent Directory Instant Filter & Anti-Clutter Polish
- **Date:** 2026-10-21
- **Scope:** Quick filter chips horizontal 1-tap di `/properti`, swipeable single-line ribbons pada micro-tags `/properti` dan value micro-strip `/agen`.

### [Milestone 6] - Agent Directory Minimalist & Large Marketing Portrait Overhaul
- **Date:** 2026-10-21
- **Scope:** Rombak total kartu agen di `/agen` (`src/components/AgentDirectoryView.tsx`): foto marketing portrait 3:4 besar dan dominan, hapus total tumpukan teks (bio quote, badge list, area fokus, cluster chips), layout 4 kolom sejajar di desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), dan tombol WA CTA langsung.

### [Milestone 7] - Agent Directory Hero & Filter Toolbar Architectural Redesign
- **Date:** 2026-10-21
- **Scope:** Eliminasi "pill soup" (4 checkmark pills & floating badge) di `/agen`. Implementasi header arsitektural Swiss Modern dengan segmented filter toolbar terintegrasi langsung di desktop & mobile, mempercepat akses visual ke foto marketing konsultan.

### [Milestone 8] - Property Detail 2-Column Marketplace Architecture & Sticky Sidebar
- **Date:** 2026-10-21
- **Scope:** Rombak total layout halaman detail properti (`/properti/[id]` di `src/components/PropertyDetailView.tsx`) dari pulau-pulau card terisolasi menjadi arsitektur Marketplace 2-Kolom standar dunia: 8 Kolom Konten Utama (Gallery 16:10, Context Header, Promo All-In 2x2, Technical Specs Datasheet 2-kolom, Lokasi Emas Dark Luxury, KPR) + 4 Kolom Sticky Action Sidebar (`sticky top-20`) berisi harga, spek cepat, profil konsultan PIC, dan tombol WA "Mau Saya Temenin Cek Lokasi?" yang mendampingi pengunjung di sepanjang scroll.

### [Milestone 9] - Anti-Hijacking Locked Google Maps Radar Preview & WhatsApp Routing
- **Date:** 2026-10-21
- **Scope:** Implementasi kartu preview Google Maps interaktif (vector dark-mode roadmap, geofence radar, dan pin droplet) dengan Frosted Glass Curiosity Shield di halaman detail properti (`src/components/PropertyDetailView.tsx`). Mengunci titik presisi perumahan demi mencegah calon klien mendatangi lokasi sendirian dan dibajak marketing lain. Setiap interaksi klik pada peta langsung mengalirkan leads ke WhatsApp konsultan PIC dengan template chat permohonan shareloc & survei resmi.

### [Milestone 10] - Google Maps Authentic Light Visual Polish & Clean Reome Card
- **Date:** 2026-10-21
- **Scope:** Redesain visual preview Google Maps dari dark-mode pekat menjadi Google Maps Light Street Style otentik (base `#f4f3f0`, jalan tol kuning `#fbd888`, air biru `#aad3df`, taman hijau `#d2f0d0`, kontrol UI: pin merah droplet gembok, search pill, toggle Peta/Satelit, zoom `+/−`, yellow pegman 🧍, Google watermark) dengan Frosted Glass Floating Card dan tombol WhatsApp hijau `#25D366`.

### [Milestone 11] - Comprehensive Redundant Element Audit & Elimination
- **Date:** 2026-10-21
- **Scope:** Eliminasi elemen-elemen informasi duplikat di halaman detail properti: menghapus kartu judul/spek redundan di bawah galeri desktop (mencegah duplikasi dengan sticky sidebar), menghapus chips fasilitas berlebih di bawah tabel spesifikasi teknis, menyederhanakan box 5 bank rekanan menjadi footnote satu baris, dan memperbarui metrik KPR menjadi Tenor Pinjaman.

### [Milestone 12] - Interactive Clickable Map with High-Converting Shareloc Modal Popup
- **Date:** 2026-10-21
- **Scope:** Menghilangkan card statis yang menutupi bagian tengah peta. Menggantinya dengan kanvas peta Google Maps light street yang 100% bersih, interaktif, dan clickable (search bar, red pin dengan speech bubble tooltip, dan bottom floating pill). Menambahkan event handler click pada seluruh kanvas peta yang memunculkan Locked Shareloc Modal Popup (`isSharelocModalOpen`): proteksi privasi warga, profil konsultan PIC resmi (rating ★ 4.9), dan direct CTA WhatsApp `#25D366` ("Minta Titik Shareloc ke [Nama Agen]") untuk mengunci prospek chat.

### [Milestone 13] - Real Google Maps Static WebP Snapshot & Anti-Inspection Protocol
- **Date:** 2026-10-21
- **Scope:** Mengganti render vector/iframe peta dengan gambar statis Google Maps asli regional (`public/images/maps/gmaps_sidoarjo.webp` & `public/images/maps/gmaps_surabaya.webp`) berkualitas tinggi (85% Lanczos). Dilengkapi UI kontrol Google Maps otentik (Search card + tombol Rute, toggle Peta/Satelit, pin merah droplet dengan geofence radar beacon, tooltip ajakan klik, kontrol Zoom & Pegman, serta watermark resmi). Menjamin 100% proteksi anti-inspect element agar koordinat asli perumahan tidak dapat dicuri calon klien atau broker lain (Information Gap Protocol & Anti-Gondol Rule). Klik pada kanvas tetap memicu Locked Shareloc Modal Popup ke WhatsApp PIC resmi.

### [Milestone 14] - Shareloc Modal UI/UX Redesign & Swiss Dark Luxury Polish
- **Date:** 2026-10-21
- **Scope:** Redesain total layout visual modal popup penguncian shareloc (`isSharelocModalOpen`) di `src/components/PropertyDetailView.tsx`. Menghilangkan lock box kotak bulky, garis pelangi murahan, dan tombol neon green yang bentrok. Menggantinya dengan arsitektur Swiss Dark Luxury yang rapi dan elegan: header title dengan badge navigasi + pulse dot, kartu konteks unit properti lengkap dengan mini thumbnail, kartu profil konsultan PIC concierge (ring emerald, rating bintang, kutipan ramah manusia asli "Saya Temenin Rule"), tombol CTA WhatsApp Dark Luxury `#081613` satu baris tegas di ponsel 390px, dan footer 3-kolom garansi terstruktur tanpa wrap glitch.

### [Milestone 15 / v2.0.0] - `Mejuma Warm Stone` Full Redesign, Zero KPR Calculator & 0% Serif Numerals
- **Date:** 2026-11-17
- **Commits & Tags:**
  - Pre-redesign Baseline: `f5e9614` (tag: `restore-pre-redesign`)
  - Production Redesign (`v2.0.0`): `ecbd52b` (tag: `restore-v2-verified`)
- **Scope:** Eksekusi penuh Milestone 0–6: palet `Mejuma Warm Stone` (`#F1F1F1`/`#E8E4E1`/`#C5BEB4`/`#38352C`/`#57534A`/`#FFCA4F`), Detached Floating Pill `Navbar` + Dark Drawer (`.01–.04`), `100svh` Monumental Hero + wordmark `tiar property`, 16 aset lokal WebP 4K (`/boost` CUDA `upscale-img`), Serif Marquee + Asymmetric Lookbook, Sticky `.01–.05` Journey, Komparasi, Testimoni, FAQ `<details>`, Split Footer `Ft2`, **hapus total `KprCalculator.tsx` & `#simulasi-kpr`**, **0% serif numerals** (`.num-clean`/`.mono-num`), fix `"Partner PT TMJ"` -> `"Partner Resmi"`, 0 emoji (`lucide-react`), `src/app/icon.svg`, `overflow-x: clip`, dan verifikasi build `out/` (`27/27` rute) + 7-viewport Chrome CDP port `9223`.

### [Milestone 16 / v2.0.1] - Code Audit, Deduplication, ESLint Setup & Repo Hygiene
- **Date:** 2026-11-19
- **Pre-Cleanup Restore Point:** `023d853` (tag: `restore-pre-cleanup-20261119-1352`)
- **Scope:** Sentralisasi `src/lib/guardrails.ts`, helper `buildMainWaUrl()` & `buildPropertyMetadata()`, penghapusan duplikasi di 8 komponen publik & 2 route metadata, perbaikan bug schema gambar lokal MCP Server & default foto lokal agen, perbaikan filter URL kanonik (`SearchFilterBar.tsx`), single `<h1>` (`PropertyDetailView.tsx`), validasi integritas nyata (`/admin`), setup non-interaktif `npm run lint` (`eslint .`), eliminasi `0` `: any`, penghapusan 17 file legacy v1, serta verifikasi `15/15` tes MCP + `27/27` build statis.

## Git Status & Rollback Command Helper
```bash
git status
git log --oneline -n 5
# Rollback ke pre-redesign v1.0.0 jika diperlukan:
git checkout restore-pre-redesign -- src/
```


