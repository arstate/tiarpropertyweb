# 🎨 STYLE GUIDE & DESIGN DNA (`Mejuma Warm Stone` × `Tiar Property`)

> **Approved Choice:** **Opsi 1 (`Mejuma Warm Stone`)** yang terinspirasi [`https://www.mejuma-tuscany.com/`](https://www.mejuma-tuscany.com/).
> **300-Ref Vault Fusion:** **Ref #093 Aman Resorts / Ref #111 Terracotta Warm Living** + **Concierge Turnkey Real Estate**.

---

## 1. OpenDesign 8 Orthogonal Brief Dimensions

| # | Dimensi | Ketetapan Desain (`Mejuma Warm Stone` Locked for `Tiar Property`) | Status |
|---|---|---|---|
| 1 | **`palette`** | **Warm Stone & Olive-Umber (`#F1F1F1` Paper + `#E8E4E1` Travertine + `#38352C` Deep Olive-Umber)** — kanvas batu hangat bebas silau dengan kontras high-trust. | `[locked by user]` |
| 2 | **`accent`** | **Warm Sun Gold (`#FFCA4F`, hover `#E8B53D`)** dengan teks gelap `#38352C` khusus untuk **Signature Dual-Pill CTA** (`[Teks Pill] + [Lingkaran Panah →]`). Sage `#82886E` dibatasi hanya untuk aksen non-teks / indikator ringan. Maksimal 2 aksen per viewport (`0` `#6366f1`, `0` `#10B981`). | `[locked by user]` |
| 3 | **`typography`** | **`Golos Text`** (`16px` body, `line-height: 1.55`, `60ch–68ch` measure) + **`JetBrains Mono`** (`tabular-nums`). **ATURAN MUTLAK 0% SERIF NUMERALS:** Semua angka (`.01–.05`, `.01–.04`, harga, cicilan, `m²`, rating, statistik, nomor drawer) **WAJIB** menggunakan `.num-clean` (`var(--font-body)` atau `var(--font-mono)` dengan `font-variant-numeric: lining-nums tabular-nums`). | `[locked by user]` |
| 4 | **`display`** | **`Cormorant Garamond`** (**khusus huruf/judul editorial saja**, **100% Upright Roman `font-style: normal`**, `0` italic headings, **0% angka serif**). Skala `clamp(2.5rem, 6.2vw, 7.5rem)` untuk statement heading dan `clamp(3.3rem, 14.2vw, 14.5rem)` untuk Giant Wordmark. | `[locked by user]` |
| 5 | **`layout`** | **Editorial Asymmetric Lookbook + Sticky Narrative Spine (`.01`–`.05`)** — rotasi layout antar seksi (`0` kloning grid 3-kolom berurutan, `minmax(0, 1fr)` pada semua grid gambar), **tanpa seksi Kalkulator KPR**. | `[locked by user]` |
| 6 | **`mood`** | **Warm Architectural Editorial & Personal Turnkey Concierge** — selaras dengan filosofi **"Saya Temenin Rule"** (Tiar Property mendampingi dari pilih unit, cek SLIK via WA, kawal 5 Bank BUMN, sampai serah terima kunci). | `[user-specified + brand-aligned]` |
| 7 | **`density`** | **Spacious Luxury Editorial (`>= 42%` open canvas)** di Homepage & Lookbook, dipadukan dengan **Compact Scannable Datasheet** pada Katalog `/properti` dan Detail `/properti/[id]`. | `[inferred from ref + domain]` |
| 8 | **`exclude`** | Haram kata `"brutalist"`, haram sebut `"BLT"`, haram bocorkan nama asli developer (`PT TMJ` / `Trimitra`) atau perumahan di UI publik, haram `<em>` miring di heading, **haram angka memakai font serif (`Cormorant Garamond`)**, **haram kalkulator KPR**, haram gradien ungu/neon AI, haram emoji UI (`📍✨💳🏠🧍`), haram karakter `//` di divider/badge UI, haram footer membocorkan nama tech stack. | `[mandatory guardrail]` |

---

## 2. Token Warna Presisi (`src/app/globals.css`) & Audit Kontras Gate 40–41

| Token CSS | Hex / Nilai | OKLCH Equivalent | Peran & Distribusi (60-30-10) |
|---|---|---|---|
| `--color-paper` | `#F1F1F1` | `oklch(95.8% 0.002 90)` | **60% Dominant Canvas:** Latar utama halaman yang tenang dan bebas silau. |
| `--color-surface` | `#E8E4E1` | `oklch(91.8% 0.008 65)` | **Warm Travertine Surface:** Kartu `.01–.05`, kartu keunggulan 4 kolom, pill `Menu =`, dan teks di atas panel gelap. |
| `--color-surface-alt` | `#FAF8F5` | `oklch(98.0% 0.004 80)` | **Elevated Alabaster Band:** Latar pita Marquee dan Seksi `.01–.05`. |
| `--color-border` | `#C5BEB4` | `oklch(80.2% 0.015 70)` | **Hairline Divider (`1px`):** Garis pemisah tabel spesifikasi, border kartu halus. |
| `--color-ink` | `#38352C` | `oklch(32.9% 0.018 92)` | **30% Structural Ink & Dark Panel:** Teks utama, judul serif, `Menu =` Drawer Overlay, tombol sekunder gelap, & panel footer kanan (`|L_text - L_paper| = 62.9%` — LOLOS Gate 40). |
| `--color-ink-muted` | `#57534A` | `oklch(42.0% 0.015 85)` | **Accessible Secondary Text:** Subtitle, indeks `.01–.05`, & metadata (`|L_text - L_paper| = 53.8% >= 50%` — LOLOS WCAG AA & Gate 40). |
| `--color-sage` | `#82886E` | `oklch(60.5% 0.038 118)` | **Decorative Sage Accent Only:** Garis aksen atau indikator non-teks kecil. |
| `--color-accent` | `#FFCA4F` | `oklch(85.4% 0.155 82)` | **10% Conversion Gold CTA:** Latar tombol utama Dual-Pill (`[Label] + [→]`) dengan teks `#38352C` (`|L_ink - L_accent| = 52.5%` — LOLOS Gate 40). |
| `--color-accent-hover` | `#E8B53D` | `oklch(79.8% 0.158 80)` | Hover state tombol utama. |

---

## 3. Utilitas Tipografi Angka Non-Serif (`.num-clean`)

```css
.num-clean {
  font-family: var(--font-body);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: -0.02em;
}
```
- **Wajib diterapkan** pada seluruh indeks kartu (`.01–.05`, `.01–.04`, `.01–.08`), indeks drawer menu (`.01–.04`), harga unit, cicilan promo, UTJ, luas `m²`, jumlah KT/KM, rating konsultan, statistik unit terjual, tahun copyright, serta digit di dalam judul serif.

---

## 4. Signature UI Patterns dari `mejuma-tuscany.com`
1. **Signature Dual-Pill Button (`Button-040` Architecture):** `[Teks Pill #FFCA4F]` + `[Lingkaran Panah #FFCA4F]` dengan `cubic-bezier(0.625, 0.05, 0, 1)` dan `active:scale-[0.97]`.
2. **Detached Floating Pill Navigation (`Nav N5`) + Top-Right Dark Drawer (`#38352C`):**
   - Kiri: `TP · Tiar Property`.
   - Kanan: Pill `Menu =` (`#E8E4E1`) + Pill `Konsultasi WA` (`#38352C` teks `#E8E4E1`).
   - Drawer gelap `#38352C` menampilkan tautan bernomor `.01–.04` (`.num-clean` sans-serif, **tanpa `#kalkulator`**).
3. **Monumental Bottom-Bleed Wordmark Hero:** Foto arsitektur lokal 4K fullscreen (`h-[100svh] min-h-[680px]`), `flex flex-col justify-between` anti-overlap, Dual-Pill Gold CTA, dan wordmark `tiar property`.
4. **Sticky Left Headline + `.01–.05` Turnkey KPR Journey:** Kiri sticky `5-col`, kanan `7-col` kartu `#E8E4E1` dengan indeks `.01–.05` dalam `.num-clean` (`Golos Text` weight `600`, tegas & sejajar).
5. **Footer Arsitektural Split (`Ft2`):** Pre-footer CTA + Kiri `4-col` foto arsitektur `3:4` + Kanan `8-col` panel gelap `#38352C` + Giant Wordmark `tiar property` (`0` tech-stack leak).
