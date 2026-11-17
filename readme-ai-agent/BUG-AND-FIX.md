# 🐛 BUG AND FIX CHRONOLOGICAL LOG

## Log Format
`[Date/Time] - [Component] - [Issue] -> [Root Cause] -> [Resolution & Prevention Rule]`

---

### [2026-10-19] - Navbar Menu Background Clutter
- **Issue:** Navbar menu items memiliki background container abu-abu/border pill yang kaku dan mengurung navigasi.
- **Root Cause:** Class `bg-[#081613]/[0.03] border border-[#081613]/[0.06]` membungkus seluruh elemen `<nav>`.
- **Fix:** Menghapus container background dan border dari `<nav>`, hanya menyisakan background dark pill (`bg-[#081613] text-white`) pada item menu yang aktif.
- **Rule:** Menu bar navigasi harus berlatar transparan; kontras visual hanya diberikan ke item aktif.

### [2026-10-19] - Hero Right Box-in-a-Box Clutter
- **Issue:** Container kanan halaman detail memiliki 3 box bertumpuk (Box harga promo, Box spek 4 kolom, Box konsultan) yang membuat layout sesak dan berat.
- **Root Cause:** Membungkus setiap sub-informasi ke dalam card terpisah dengan border dan gradien berbeda.
- **Fix:** Menghapus box harga dan box spek 4 kolom, menyajikan harga dalam tipografi minimalis langsung di bawah judul, dan merapikan card konsultan PIC menjadi satu kesatuan bersih.
- **Rule:** Jangan menumpuk card di dalam card (`box-in-a-box anti-pattern`).

### [2026-10-20] - Mobile Photo Gallery Button Overload & Arrow Obscuration
- **Issue:** Foto kamar tidur di mobile tertutup oleh tombol panah melingkar kiri/kanan `<` `>`, badge teks panjang *"Unit Siap Huni"*, dan tombol *"Perbesar Galeri"*.
- **Root Cause:** Kontrol desktop dipaksakan muncul di viewport ponsel tanpa media query terisolasi.
- **Fix:** Sembunyikan tombol panah di mobile (`hidden md:flex`), aktifkan gesture swipe/drag geser alami, kurangi badge menjadi 1 pill ringkas `● DP 0% • UTJ Rp 1 Jt`, dan jadikan seluruh area foto clickable untuk membuka lightbox modal.
- **Rule:** Viewport mobile harus bebas dari tombol overlay yang menutupi subjek visual utama.

### [2026-10-20] - Duplicate Section 6 Consultant Card
- **Issue:** Card konsultan PIC kedua di bawah kalkulator KPR duplikat dengan card konsultan PIC di hero kanan.
- **Root Cause:** Sisa pengerjaan fase awal sebelum konsultan dipindahkan ke hero container.
- **Fix:** Hapus Section 6 sepenuhnya sehingga alur dari kalkulator KPR langsung mengalir bersih ke Rekomendasi Properti Lainnya.
- **Rule:** Setiap halaman detail hanya memiliki satu kartu profil konsultan utama agar tidak repetitif.

### [2026-10-21] - Mobile Homepage Clutter & Squished Comparison Table
- **Issue:** Pada homepage mobile, SearchFilterBar memakan 5 baris tebal dan UspFeatureBar membungkus 2 baris (~450px tinggi), menenggelamkan listing rumah pertama. Tabel komparasi ngontrak vs beli terhimpit pada layar ponsel.
- **Root Cause:** Layout desktop dipaksakan ke mobile dengan grid multi-baris tanpa penyederhanaan responsif.
- **Fix:** Ubah SearchFilterBar di mobile menjadi single-row search pill + chip filter ringkas; ubah UspFeatureBar menjadi single-line swipeable ribbon; ubah ComparisonTable di mobile menjadi stacked comparison cards (Sewa rose vs Tiar Property emerald).
- **Rule:** Komponen mobile harus hemat vertikal (< 100px) sebelum listing pertama, dan tabel data wajib di-stack per parameter di ponsel.

### [2026-10-21] - Properti Catalog & Agent Directory Mobile Polish
- **Issue:** Di halaman `/properti`, pengguna ponsel harus membuka modal filter untuk filter dasar; micro-tags wrap bertumpuk. Di `/agen`, micro-strip membungkus 2 baris.
- **Root Cause:** Tidak adanya chip 1-tap filter langsung di mobile dan flex-wrap pada badges.
- **Fix:** Tambahkan quick filter chips horizontal (`Semua Kota`, `Surabaya`, `Sidoarjo`, `1 Lantai`, `2 Lantai`, `< 2 Jt`) langsung di bawah search input `/properti`. Buat seluruh badges di `/properti` dan `/agen` single-line swipeable ribbon.
- **Rule:** Sediakan filter 1-tap instan di mobile sebelum modal drawer penuh.

### [2026-10-21] - Agent Directory Clutter & Small Avatar Overhaul
- **Issue:** Di halaman `/agen`, foto marketing konsultan hanya berupa avatar kerdil 80px, dibebani tumpukan teks: 4 badge chips, bio kutipan panjang, area fokus, dan chip daftar klaster berdesakan.
- **Root Cause:** Desain direktori lama menempatkan terlalu banyak atribut data profil ke dalam satu card tanpa hierarki visual.
- **Fix:** Hapus total kotak bio, barisan badge, area fokus, dan chip klaster. Perbesar foto marketing konsultan menjadi foto portrait megah 3:4 (`aspect-[3/4]`) dengan badge melayang di atas foto (`Surabaya/Sidoarjo`, `★ Rating`, `● Siap Survei`). Sajikan informasi minimalis di bawah foto (Nama, Role, Unit ACC) dan tombol direct WhatsApp CTA ("Mau Saya Temenin?"). Ubah grid menjadi 4 kolom sejajar (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
- **Rule:** Kartu profil konsultan wajib mengedepankan foto portrait profesional dominan dengan teks minimalis berkelas (Dark Luxury).

### [2026-10-21] - Agent Directory Hero & Filter Toolbar Architectural Overhaul
- **Issue:** Hero section `/agen` memiliki tumpukan 3 lapis pill terapung (badge mengambang, 4 checkmark pills, dan filter bar terisolasi dengan margin besar) yang terlihat murah dan menenggelamkan kartu agen.
- **Root Cause:** Stack vertikal elemen badge tanpa struktur arsitektural (pill-in-pill syndrome).
- **Fix:** Hapus total 4 checkmark pills dan badge atas yang mengambang. Rancang ulang header dengan tipografi editorial Swiss Modern: overline `TIM LAPANGAN & ANALIS KPR`, judul ringkas `Konsultan Properti Resmi`, 1 kalimat subjek, dan segmented control filter (`Semua`, `Sidoarjo`, `Surabaya`) yang terintegrasi langsung di samping judul di desktop / rapi di bawahnya di mobile. Pangkas margin sehingga foto marketing langsung terlihat di viewport awal.
- **Rule:** Hindari penumpukan floating pill berulang; gunakan struktur grid asimetris dengan segmented filter bar terintegrasi.

### [2026-10-21] - Property Detail Disconnected Island Sections & Sticky Marketplace Architecture
- **Issue:** Halaman detail properti (`/properti/[id]`) tampak terpecah-pecah menjadi pulau-pulau card boxy 1280px selebar layar (Promo All-In, Spesifikasi Teknis 4x3, Lokasi, KPR) tanpa kontinuitas. Begitu pengguna scroll melewai hero galeri, kartu harga dan kontak konsultan PIC menghilang dari layar.
- **Root Cause:** Setiap section dibungkus dalam `<section className="max-w-7xl mx-auto mt-16"><div className="bg-white p-8 rounded-3xl border border-[#dde8e2]">` terpisah tanpa sidebar terpadu.
- **Fix:** Satukan seluruh alur halaman detail ke dalam arsitektur **Marketplace 2-Kolom (8 Cols Konten + 4 Cols Sticky Action Sidebar)**:
  1. **Kolom Kiri (8 Cols):** Visual Gallery 16:10, Context Header Title & Quick Specs chips, Section Promo All-In Free (2x2 grid), Section Spesifikasi Teknis (Datasheet Arsitektural 2-kolom rapi), Section Lokasi Emas (Dark Luxury), dan Kalkulator KPR Interaktif.
  2. **Kolom Kanan (4 Cols):** Sticky Action Card (`sticky top-20`) yang terus mendampingi scroll pengguna: Lokasi, Judul Klaster, Harga & Cicilan Promo, Quick Specs, Checklist Promo, Profil Konsultan PIC resmi dengan rating, dan Primary CTA WhatsApp ("Mau Saya Temenin Cek Lokasi?").
  3. **Bagian Bawah (Full 12 Cols):** Rekomendasi 3 Properti Serupa di Surabaya & Sidoarjo.
- **Rule:** Halaman detail properti marketplace wajib menggunakan grid 2-kolom dengan sticky conversion sidebar di desktop agar tombol aksi PIC selalu berada di depan mata pengunjung.

### [2026-10-21] - Anti-Hijacking Locked Google Maps Radar Preview & WhatsApp Routing
- **Issue:** Calon pembeli yang melihat lokasi presisi/sherlok publik di internet berisiko langsung mendatangi lokasi perumahan sendirian dan dicegat/digondol oleh marketing in-house developer atau broker lain di lapangan (Information Gap Leak).
- **Root Cause:** Tidak adanya filter proteksi navigasi; tautan maps yang mengekspos koordinat riil membuka celah kebocoran komisi.
- **Fix:** Hadirkan preview kartu Google Maps interaktif bergaya dark-mode roadmap vector dengan geofence radar beacon dan pin droplet, namun permukaannya diproteksi **Frosted Glass Curiosity Overlay**:
  1. Badge & copy persuasif: *"Titik Koordinat Presisi Dikunci — Demi privasi penghuni & keamanan booking kavling, titik shareloc presisi dikirim langsung oleh konsultan resmi via WhatsApp sekaligus penjemputan survei gratis."*
  2. Seluruh area peta & tombol CTA berfungsi sebagai direct link WhatsApp ke PIC marketing klaster dengan prefilled message: *"Halo [Nama Agen], saya sedang melihat unit [Nama Klaster] di website Tiar Property. Boleh minta tolong kirimkan titik shareloc akuratnya kak? Sekalian mau janjian ditemenin survei langsung ke lokasinya."*
- **Rule:** Dilarang mencantumkan tautan Google Maps langsung ke perumahan; seluruh permintaan shareloc wajib dikunci via WhatsApp untuk mengamankan kepemilikan prospek tim Tiar Property (Saya Temenin Rule).

### [2026-10-21] - Google Maps Authentic Light Visual Polish & Clean Reome Card
- **Issue:** Tampilan peta awal bernuansa hijau gelap pekat bertumpuk di dalam card hitam (`muddy green soup`), sehingga tidak terbaca sebagai Google Maps otentik dan dikritik pengguna ("UI DESAINNYA JELEK BRO GA JELAS GINI").
- **Root Cause:** Palet warna dark mode pekat mengurangi kontras elemen jalan dan air, menghilangkan familiarity Google Maps yang diharapkan pengguna.
- **Fix:** Rancang ulang ke tampilan otentik Google Maps Light Street Style: base land `#f4f3f0`, jalan tol kuning `#fbd888`, air biru `#aad3df`, taman hijau `#d2f0d0`, kontrol UI Google Maps lengkap (pin merah droplet dengan icon gembok, search pill, toggle Peta/Satelit, zoom `+/−`, yellow pegman 🧍, dan Google watermark). Dibungkus Frosted Glass Floating Card putih bersih dengan tombol hijau WhatsApp resmi `#25D366` ("Minta Titik Shareloc ke [Nama Agen]").
- **Rule:** Komponen maps wajib mempertahankan visual familiar Google Maps light-street agar langsung dikenali audiens awam sebagai peta resmi.

### [2026-10-21] - Comprehensive Redundant Element Audit & Elimination
### [2026-10-21] - Interactive Clickable Map with High-Converting Shareloc Modal Popup
- **Issue:** Tampilan peta sebelumnya tertutup card statis mengambang di tengah secara permanen, terasa kaku, berantakan ("kurang rapih"), dan kurang memicu rasa penasaran pengunjung untuk mengklik.
- **Root Cause:** Overlay statis menutupi kanvas peta secara permanen alih-alih memberikan ilusi interaktif Google Maps yang mengundang klik pengguna.
- **Fix:** 
  1. Bersihkan kanvas peta secara total menjadi tampilan Google Maps otentik yang bebas halangan visual: search bar pill di kiri atas, pin merah dengan tooltip mengambang interaktif ("Klik untuk Rute Navigasi Google Maps ↗"), dan floating action pill di bawah ("Buka Rute & Titik Lokasi Google Maps ↗").
  2. Begitu pengunjung mengklik area peta, picu **Interactive Locked Shareloc Modal Popup** (`isSharelocModalOpen`):
     - Backdrop blur gelap `#081613/70`.
     - Badge & icon kunci amber: `Titik Koordinat Presisi Dikunci`.
     - Copywriting proteksi privasi warga perumahan & keamanan kavling.
     - Profil konsultan PIC resmi dengan rating bintang ★ 4.9.
     - Direct CTA WhatsApp hijau resmi `#25D366` ("Minta Titik Shareloc ke [Nama Agen]") dengan prefilled chat otomatis.
- **Rule:** Komponen peta harus tampil 100% otentik dan memicu rasa ingin tahu (curiosity hook); proteksi titik shareloc dieksekusi melalui modal popup saat diklik untuk memaksimalkan rasio konversi chat ke WhatsApp konsultan resmi.

### [2026-10-21] - Real Google Maps Static WebP Snapshot & Anti-Inspection Protocol (Milestone 13)
- **Issue:** Peta vector buatan masih berisiko di-inspect calon pembeli yang paham coding atau terasa kurang meyakinkan jika dibandingkan tangkapan satelit/street riil Google Maps, sementara iframe embed berisiko membocorkan koordinat developer (Information Gap Leak).
- **Root Cause:** Embed iframe atau vector dinamis menyimpan URL / koordinat yang dapat diintip via DevTools browser.
- **Fix:**
  1. Konversi preview peta regional Sidoarjo dan Surabaya menjadi file citra statis murni (`public/images/maps/gmaps_sidoarjo.webp` & `public/images/maps/gmaps_surabaya.webp`) berkualitas tinggi (85% Lanczos).
  2. Resolusi otomatis `mapBgImage` di `src/components/PropertyDetailView.tsx` sesuai kota unit (`property.city`).
  3. Bungkus dengan elemen UI otentik Google Maps (Search card dengan tombol "Rute", toggle Peta/Satelit, pin merah droplet + pulsating radar, speech bubble tooltip, kontrol Pegman & Zoom, Google watermark).
  4. Pengunjung yang mengklik peta memicu **Locked Shareloc Modal Popup** (`isSharelocModalOpen`) yang mengalirkan permohonan titik shareloc ke WhatsApp konsultan PIC.
- **Rule:** Dilarang menggunakan embed iframe atau menyimpan koordinat presisi di DOM; gunakan static image WebP regional tanpa titik koordinat sensitif untuk menjamin 100% anti-inspect element.

### [2026-11-17] - Pre-Redesign Technical & Guardrail Audit (Milestone 0 Planning)
- **Audit Scope:** Inspeksi menyeluruh `src/` & `globals.css` sebelum memulai rombakan `Mejuma Tuscany`.
- **Temuan Wajib Diperbaiki pada Milestone 1–5:**
  1. `src/components/PropertyDetailView.tsx:1407` masih menampilkan teks `"Partner PT TMJ"` — melanggar *Information Gap Protocol* (haram bocorkan nama developer legal ke UI publik). **Target Fix:** Ubah menjadi `"Partner Resmi"`.
  2. `src/app/globals.css:22` memakai `overflow-x: hidden` pada `body`, yang secara teknis mematahkan `position: sticky` pada layout *Sticky 5-Col Spine* (Section 4) maupun *Sticky Concierge Sidebar*. **Target Fix:** Ubah menjadi `html, body { overflow-x: clip; }`.
  3. `src/components/SearchFilterBar.tsx:48,55,63,71` & `src/components/PropertyDetailView.tsx:803` masih menggunakan emoji literal (`📍`, `✨`, `💳`, `🏠`, `🧍`) yang melanggar Gate 30–31 (`lucide-react` single icon lock). **Target Fix:** Ganti dengan komponen ikon `lucide-react` / SVG bersih.
  4. Direktori `tiar-property-website/` belum memiliki `.git` repository, dan foto properti masih mengandalkan URL Unsplash `w=800`. **Target Fix:** Jalankan `git init` baseline sebelum Milestone 1 + lokalkan & upscale aset Hero/Lookbook ke `public/images/properties/` via `/boost`.

### [2026-11-17] - Full Redesign v2.0.0 (`Mejuma Warm Stone`), Hapus Total Kalkulator KPR, & 0% Serif Numerals
- **Scope:** Rombakan menyeluruh `layout.tsx`, `globals.css`, `Navbar.tsx`, `Hero.tsx`, `UspFeatureBar.tsx`, `SearchFilterBar.tsx`, `PropertyCatalog.tsx`, `PropertyCard.tsx`, `HeroOffers.tsx`, `ComparisonTable.tsx`, `Testimonials.tsx`, `FaqSection.tsx`, `Footer.tsx`, `FloatingWhatsApp.tsx`, `PropertiCatalogView.tsx`, `PropertyDetailView.tsx`, `AgentDirectoryView.tsx`, dan aset lokal WebP 4K.
- **Root Fixes Executed:**
  1. **Information Gap Fix:** Teks `"Partner PT TMJ"` pada footer trust grid `PropertyDetailView.tsx` (dan komentar JSX internal) diganti menjadi `"Partner Resmi"` — `0` kebocoran `TMJ`/`Trimitra`/`BLT` di seluruh bundle publik.
  2. **Sticky Layout Fix:** Mengganti `overflow-x: hidden` di `globals.css` menjadi `overflow-x: clip` agar `lg:sticky` pada `HeroOffers.tsx` (5-col spine) dan `PropertyDetailView.tsx` (4-col sidebar) bekerja 100%.
  3. **Hapus Total Kalkulator KPR:** Menghapus `src/components/KprCalculator.tsx`, import di `src/app/page.tsx`, tautan `#kalkulator` di `Navbar.tsx`, dan blok `#simulasi-kpr` di `PropertyDetailView.tsx`, menggantinya dengan CTA langsung *"Hitung Cicilan & Cek SLIK via WhatsApp"*.
  4. **0% Serif Numerals:** Menambahkan class utilitas `.num-clean` (`Golos Text`) dan `.mono-num` (`JetBrains Mono`) dengan `font-variant-numeric: lining-nums tabular-nums` agar seluruh angka tidak lagi mewarisi oldstyle numerals `Cormorant Garamond`.
  5. **Iconography, Touch Target, & Asset Optimization:** Menghapus seluruh emoji di UI publik (`lucide-react` murni), memperbesar seluruh tombol interaktif mobile & modal (`Minta Shareloc Lokasi`, `Bagikan Unit`, `Profil`, tab `/agen`, tombol tutup modal) ke `min-h-[44px]`, menambahkan `src/app/icon.svg` untuk mencegah 404 favicon, serta meng-upscale 16 foto lokal via CUDA (`upscale-img -m nmkd`) ke format `.webp`.

### [2026-10-21] - Shareloc Modal UI/UX Redesign & Swiss Dark Luxury Polish (Milestone 14)
- **Issue:** Tampilan modal popup sebelumnya dinilai pengguna "kurang rapih layout design ui uxnya masih sangat jelek": lock icon kuning kotak bulky bertumpuk canggung di kiri, badge terhimpit, garis pelangi atas murahan, paragraf panjang kaku, tombol WhatsApp hijau neon bertabrakan tema, dan bullet points footer berantakan/terpotong di layar HP 390px.
- **Root Cause:** Struktur grid asimetris tidak seimbang, tombol CTA bentrok dengan palet Dark Luxury, dan footer menggunakan inline bullet text bukan grid struktural.
- **Fix:**
  1. Header Bersih: Badge kapsul modern `Akses Navigasi Google Maps` dengan pulse emerald dot + headline `Minta Titik Shareloc & Rute Presisi` + close button `X` bulat elegan di kanan atas.
  2. Kartu Konteks Unit: Sematkan mini preview foto klaster, tag kota, nama unit, dan badge `Unit Ready • Siap Dampingi`.
  3. Kartu Konsultan PIC: Avatar ring emerald, centang terverifikasi, rating ★ 4.9, dan kutipan bersahabat gaya manusia asli (*"Saya temenin survei & kirimkan titik shareloc-nya kak"* sesuai Saya Temenin Rule).
  4. Primary CTA Button: Tombol Dark Luxury `#081613` tegas dengan ikon WhatsApp hijau `#25D366` dan tanda panah, teks proporsional satu baris di 390px (`Minta Titik Shareloc ke [Nama] ->`).
  5. Trust Grid 3-Kolom: Grid terstruktur rapi bergaris pembatas vertikal (`Gratis Survei / Siap Dijemput`, `Respon Cepat / < 5 Menit di WA`, `Resmi Tiar / Partner PT TMJ`) tanpa bug text wrapping.
- **Rule:** Seluruh modal dialog wajib memiliki hierarki vertikal seimbang, kartu konteks unit yang jelas, tombol aksi beraksen Dark Luxury terpadu, dan layout anti-overflow di viewport ponsel (360px–390px).
