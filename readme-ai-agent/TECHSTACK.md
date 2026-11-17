# ⚙️ TECH STACK & ARCHITECTURAL DECISIONS (`TECHSTACK.md`)

## 1. 4-Stack Comparison Table & Co-Founder Recommendation

| Stack Option | Best Use Case | SEO / GEO & AI Search | Server Quota & Cost Shield (`web-optimization`) |
|---|---|---|---|
| **✅ Option 1: Next.js 15 App Router (Static Export `output: 'export'`) [LOCKED PICK]** | Landing Page Iklan Meta/TikTok Ads, Katalog Properti `/properti/[id]`, Kalkulator KPR Interaktif, & Direktori Agen dengan Direct WA Closing. | **S-Rank** (Pre-rendered Static HTML per unit klaster + OpenGraph + Schema.org). | **Zero Serverless (`0` invocations)**. 100% kompatibel Vercel Free Tier + Cloudflare Edge Cache + Service Worker PWA. |
| **Option 2: Next.js App Router (Fullstack Hybrid + BaaS)** | Aplikasi dengan database real-time publik, login user, & webhook server. | **S-Rank** pada halaman statis + Dynamic `/api`. | Memakai kuota Serverless Function & BaaS jika tidak di-cache ketat. |
| **Option 3: Astro 5 + React Islands** | Blog/artikel konten statis dengan sedikit interaktivitas. | **S-Rank+** (`0 KB` JS baseline). | Membutuhkan migrasi penuh dari repositori Next.js 15 yang sudah berjalan matang. |
| **Option 4: React (Vite SPA)** | Dashboard internal privat tanpa kebutuhan SEO per halaman unit. | **Buruk untuk SEO per unit** (Client-rendered SPA). | Tidak cocok untuk indeks organik per klaster Surabaya-Sidoarjo. |

### 💡 Rekomendasi Co-Founder:
Pertahankan **Option 1 — Next.js 15.4 App Router (`output: 'export'`) + React 19 + Tailwind CSS v4 + Lucide React** yang saat ini sudah terpasang di repositori. Seluruh perombakan difokuskan pada **lapisan Design System (`globals.css`), Tipografi (`layout.tsx`), Aset Visual Lokal (`/boost`), dan Arsitektur Komponen UI (`src/components/*`)** tanpa menambah library berat (`lenis`, `gsap`, `jquery`, `swiper`), sehingga pipeline static export dan MCP server lokal (`scripts/tiar-mcp-server.ts`) tetap utuh.

---

## 2. Architectural Decision Records (`ADR`)

### ADR-001: Preserve Static Export (`output: 'export'`) & Zero-Usage Vercel Shield
- **Context:** Traffic iklan Meta Ads & TikTok Tiar Property didominasi pengguna seluler yang membuka halaman katalog dan detail unit berulang kali.
- **Decision:** Tetap gunakan `output: 'export'` di `next.config.ts` dan `dynamic = 'force-static'` di seluruh rute halaman.
- **Consequences:** `0` pemanggilan Serverless Function di Vercel (anti-jebol kuota), LCP `< 1.0s`, dan seluruh halaman detail `/properti/[id]` & `/produk/[id]` ter-generate statis saat build (`generateStaticParams`).

### ADR-002: Adopt `Mejuma Tuscany` Editorial Typography (`2+1` Font Rule) via `next/font/google`
- **Context:** Web referensi `https://www.mejuma-tuscany.com/` memakai `Roxale Story` / `Made Mirage` (serif editorial) + `Golos Text` (body sans).
- **Decision:** Muat **`Cormorant Garamond`** (`400/500/600`, upright roman) sebagai `--font-display`, **`Golos Text`** (`400/500/600/700`) sebagai `--font-sans`, dan **`JetBrains Mono`** (`400/500`, maks 2 slot angka tabular) di `src/app/layout.tsx`, menggantikan `Playfair_Display`.
- **Consequences:** Zero FOIT/CLS, konsistensi 100% dengan body font asli `mejuma-tuscany.com`, dan lolos Gate 37–38a `sloplint`.

### ADR-003: Pure CSS GPU Transforms over Heavy JS/WebGL Motion Libraries
- **Context:** `mejuma-tuscany.com` memuat jQuery + Webflow + Swiper + GSAP + HLS + Lottie yang memperlambat TTI di koneksi 4G seluler.
- **Decision:** **Jangan install `lenis` atau `gsap`** pada fase ini. Replikasi seluruh efek khas Mejuma (**Giant Bleed Wordmark**, **Dual-Pill Button-040 Magnetic Hover**, **Infinite Editorial Serif Marquee**, **Sticky Left Process Spine `.01–.05`**, dan **Top-Right Floating Drawer**) menggunakan **Pure CSS GPU Transforms (`translate3d`, `cubic-bezier(0.625, 0.05, 0, 1)`, `position: sticky`)** dan React 19 state ringan.
- **Consequences:** Bundle JS tetap `< 90 KB`, animasi 60fps mulus di ponsel menengah, `overflow-x: clip` menjaga `position: sticky` berjalan sempurna.

---

## 3. Quality Bar & Anti-Cheat Constraints (`CONSTRAINTS`)
- **Zero TypeScript / Build Errors:** Setiap milestone wajib lulus `npm run build` (`next build` static export) dengan `0` error.
- **No Silencing Checks:** Dilarang menambahkan `@ts-ignore`, `@ts-expect-error`, atau menghapus test verifikasi yang sudah ada.
- **58-Gate `sloplint` Compliance:** Wajib `html, body { overflow-x: clip; }` (menggantikan `overflow-x: hidden` di `globals.css:22`), `0` tombol teks 2 baris (`white-space: nowrap`), `minmax(0, 1fr)` pada grid gambar, `0` emoji UI, dan `0` heading miring (`<em>`).
