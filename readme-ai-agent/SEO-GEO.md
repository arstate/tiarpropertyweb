# 🔍 SEO, GEO & AI SEARCH ARCHITECTURE (`SEO-GEO.md`)

## 1. Peta Metadata & Hierarki Heading per Rute

| Rute URL | Title Tag (`<title>`) | H1 Utama (`<h1>` — Upright Roman) | Target Kata Kunci Utama |
|---|---|---|---|
| `/` | `Tiar Property \| Hunian Eksklusif Surabaya & Sidoarjo — DP 0% All-In Free` | `Hunian Kurasi Surabaya & Sidoarjo` (+ Giant Wordmark `tiar property`) | rumah dp 0 sidoarjo, rumah dp 0 surabaya, kpr sukodono, perumahan dekat juanda, tiar property |
| `/properti` & `/produk` | `Katalog Lengkap Rumah & Klaster Pilihan \| Tiar Property` | `Koleksi Klaster & Rumah Siap Huni.` | katalog rumah sidoarjo, rumah minimalis 2 lantai rungkut, rumah cicilan 1 jutaan sidoarjo |
| `/properti/[id]` & `/produk/[id]` | `[codeName] - [locationAreaShort] \| Tiar Property` | `[codeName]` (misal: *Tray Modern Sukodono*) | rumah murah sukodono, kpr rumah sedati juanda, cluster merr surabaya |
| `/agen` | `Tim Konsultan & Analis KPR Resmi \| Tiar Property` | `Konsultan Properti & Analis KPR.` | konsultan kpr surabaya, agen properti sidoarjo, mbak ningsih tiar property |
| `/admin` | `Portal Admin & Manajemen Klaster \| Tiar Property` | `Dashboard Inventaris Tiar Property` | `noindex, nofollow` (Area Internal) |

---

## 2. Guardrail SEO Khusus Tiar Property (Information Gap)
- **Zero Real Developer / Cluster Name Leak in Meta & JSON-LD:** Seluruh tag OpenGraph, Twitter Card, maupun Schema.org `RealEstateAgent` / `SingleFamilyResidence` wajib menggunakan `codeName` samaran (*Tray Modern Sukodono*, *Super Tiscre Juanda*, dll.) dan wilayah umum (*Sukodono, Sidoarjo*), **DILARANG** mencantumkan koordinat GPS presisi atau nama PT developer di dalam source HTML.
