# 🎯 PRODUCT REQUIREMENTS DOCUMENT (`PRD.md`)

## 1. Primary Business Goals & Conversion KPIs
- **Primary Conversion Channel:** 1-Click Direct WhatsApp Closing (*"Mau saya temenin cek lokasinya kak?"* / *"Hitung Cicilan & Cek SLIK via WhatsApp"*) ke Mbak Ningsih (`6282142193231`) atau konsultan PIC unit terkait dengan pesan *pre-filled* spesifik unit.
- **Target Performance & UX:**
  - **LCP < 1.0s** pada jaringan 4G seluler (100% Static HTML Export `output: 'export'`, `0` Serverless Function Invocations).
  - **Visual & Editorial Upgrade (Locked: Opsi 1 `Mejuma Warm Stone`):** Mengadopsi tata letak editorial, palet *Warm Stone & Olive-Umber* (`#F1F1F1` / `#E8E4E1` / `#38352C`), tipografi *Upright Roman Serif* (`Cormorant Garamond` khusus huruf) + *Geometric Sans* (`Golos Text` untuk body & **100% angka `.num-clean` lining-tabular**), serta *Dual-Pill Sun Gold CTA* (`#FFCA4F`).
  - **Streamlined Concierge Funnel (Tanpa Kalkulator KPR):** Seluruh komponen kalkulator KPR di Homepage (`/`) dan mini-simulasi di halaman Detail Unit (`/properti/[id]`) **dihapus total** untuk mencegah *price shock* dini dan mengarahkan perhitungan angsuran serta pengecekan SLIK langsung ke WhatsApp konsultan PIC.
  - **Zero Drop-Off Funnel:** Klik kartu properti langsung mengarah ke halaman detail `/properti/[id]`; klik peta mengarah ke **Locked Shareloc Modal Popup**; kebutuhan hitung cicilan mengarah langsung ke WhatsApp PIC.

---

## 2. Verified Business Data (`[stated]` — Zero Guessing)
- **Brand:** **Tiar Property** (Partner Pemasaran Resmi Developer Surabaya & Sidoarjo).
- **Area Pemasaran:**
  - **Sidoarjo:** Sukodono, Anggaswangi, Masangan, Sedati, Kwangsan, Akses Bandara Juanda, Waru, Gedangan.
  - **Surabaya:** Jalur MERR, Rungkut, Surabaya Timur, Wiyung / Karangpilang.
- **Hero Offers Resmi:**
  1. **DP 0% (Tanpa DP):** Cukup tanda jadi (**UTJ Rp 1 Juta – Rp 5 Juta** sesuai klaster di `src/data/properties.json`) langsung memotong harga & proses berkas KPR.
  2. **All-In Free Biaya:** Gratis BPHTB, AJB, BBN (Balik Nama), Biaya Notaris/PPAT, dan Subsidi Biaya KPR s/d Rp 20 Juta.
  3. **Cicilan Ringan & Subsidi Angsuran:** Bunga promo KPR `3,4%` (cicilan mulai Rp 1,7 Jt – Rp 4,5 Jt/bln tergantung klaster) + **Subsidi Angsuran Rp 1,4 Juta/bulan selama 6–12 bulan pertama**.
  4. **Bonus Langsung:** Free Pompa Air, Meja Dapur, & Free IPL 6 Bulan (atau Smart Door Lock & Kanopi khusus unit 2 lantai tertentu).
  5. **Kawal Berkas 100% ACC:** Tim analis mendampingi pengajuan KPR (termasuk skema *Joint Income* & pengecekan SLIK OJK privat) ke **5 Bank BUMN Rekanan (BTN, BRI, BSI, Mandiri, BNI)**.
- **Kontak WhatsApp Resmi:** `6282142193231` (Mbak Ningsih — Lead Consultant & CS Closer) + 4 Konsultan PIC di `src/data/agents.json`.

---

## 3. Strict Confidentiality & Brand Guardrails (Non-Negotiable)
1. **DILARANG SEBUT BLT:** Istilah `"BLT"` (*Bantuan Likuiditas Transaksi*) adalah komisi internal marketing dan **HARAM** muncul di kode frontend, meta tag, atau teks publik.
2. **INFORMATION GAP (RAHASIA NAMA PERUMAHAN & TITIK LOKASI):**
   - Dilarang menampilkan nama resmi developer (`PT. Trimitra Manunggal Jaya` / `PT TMJ`) atau nama perumahan asli di halaman publik.
   - **Wajib Sanitasi:** Ubah `"Partner PT TMJ"` pada `PropertyDetailView.tsx` menjadi `"Partner Resmi"`.
   - Wajib menggunakan `codeName` samaran (*Tray Modern Sukodono*, *Super Tiscre Juanda*, *Style Hoto MERR*, *Trry Netonil Anggaswangi*, *Narminio Masangan Living*, *Hgrman Morta Waru*, *Grand Botanica Rungkut*, *Dian Premiere Wiyung*, *Skyline Juanda Gateway*).
   - Peta lokasi wajib menggunakan gambar statis regional (`/images/maps/gmaps_sidoarjo.webp` & `gmaps_surabaya.webp`) yang ketika diklik membuka **Locked Shareloc Modal Popup** ke WhatsApp PIC.
3. **SAYA TEMENIN RULE:** Gunakan sapaan hangat manusia asli (*"Mau saya temenin cek lokasinya kak?"*), bukan bahasa korporat kaku.

---

## 4. Visual Asset & `/boost` (`upscale-img`) Reality Check
- **Target Aset Lokal 4K:** Unduh foto arsitektur terbaik untuk Hero, Diptych, Footer, dan 9 klaster `src/data/properties.json` ke `public/images/properties/*.webp`, lalu jalankan **`/boost` (`upscale-img`)** dengan model PyTorch `4xNomos8kSCHAT-S.pth` / `4x_NMKD-Superscale-SP_178000_G.pth` (bebas ONNX NaN trap) agar tajam di `1920x1080` fullscreen tanpa hotlink eksternal.

---

## 5. Redesign Regression Guard Inventory (`sloplint --before` & `--kept`)
Seluruh rute, state interaktif, dan data berikut **WAJIB 100% DIPERTAHANKAN** saat perombakan visual dilaksanakan:
- **Routes:** `/`, `/properti`, `/properti/[id]`, `/produk`, `/produk/[id]`, `/agen`, `/admin`.
- **Removed by User Decision (Intentional):** `src/components/KprCalculator.tsx`, tautan `#kalkulator` di `Navbar.tsx`, dan blok `#simulasi-kpr` di `PropertyDetailView.tsx` (diganti CTA WhatsApp langsung *"Hitung Cicilan & Cek SLIK via WhatsApp"*).
- **Data Schemas:** `src/data/properties.json` (9 unit klaster), `src/data/agents.json` (4 konsultan), `src/utils/kpr.ts` tetap aman untuk kompatibilitas utilitas/skrip.
- **Interactive Features:**
  - Filter URL-synced di `/properti` & `/produk` (`?q=`, `?kota=`, `?tipe=`, `?cicilan=`).
  - Galeri swipe/drag + Lightbox Modal (`isLightboxOpen`) di `/properti/[id]`.
  - Peta Google Maps statis + **Locked Shareloc Modal Popup (`isSharelocModalOpen`)** di `/properti/[id]`.
  - Panel Admin PIN-protected (`/admin`) & Local MCP Server (`scripts/tiar-mcp-server.ts`).
- **Legacy Files Cleanup:** Hapus komponen mati `PropertyDetailModal.tsx` & `src/components/modal/*` bila tidak di-import rute aktif.
