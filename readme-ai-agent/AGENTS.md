# 🤖 LIVE PROJECT BRAIN CHECKPOINT (`readme-ai-agent/AGENTS.md`)

- **Active Phase:** Phase 2 — Executing Approved `Opsi 1 (Mejuma Warm Stone)` Full Redesign (Milestones 0–6).
- **Tech Stack Lock:** Option 1 — Next.js 15.4 App Router (`output: 'export'`), React 19, Tailwind CSS v4, Lucide React, Pure CSS GPU Transitions (`0` serverless invocations).
- **Locked Design Tokens (`Mejuma x Tiar`):** Paper `#F1F1F1` (`--color-paper`), Surface `#E8E4E1` (`--color-surface`), Border `#C5BEB4` (`--color-border`), Ink & Dark Panel `#38352C` (`--color-ink`), Accessible Muted Ink `#57534A` (`|L_text - L_bg| >= 50%`), Decorative Sage `#82886E`, Sun Gold CTA `#FFCA4F` (`--color-accent`), Upright Serif (`Cormorant Garamond` letters ONLY) + Body Sans (`Golos Text`) + Tabular Mono (`JetBrains Mono`).
- **Locked Final User Decisions (2026-11-17):**
  1. **Hapus Total Kalkulator KPR:** Hapus `KprCalculator.tsx` dari `/` dan file komponennya, hapus `#kalkulator` dari `Navbar.tsx`, dan hapus blok mini-simulasi KPR dari `PropertyDetailView.tsx` (`/properti/[id]`). Gantikan dengan tombol CTA langsung ke WhatsApp PIC (*"Hitung Cicilan & Cek SLIK via WhatsApp"*).
  2. **0% Serif Numerals:** Seluruh angka (`.01–.05`, `.01–.04`, `.01–.08`, harga, cicilan promo, luas `m²`, rating, statistik, indeks drawer) **WAJIB** memakai `--font-body` (`Golos Text`) atau `--font-mono` (`JetBrains Mono`) dengan `font-variant-numeric: lining-nums tabular-nums` (`.num-clean`). `Cormorant Garamond` khusus huruf editorial saja.
  3. **Security & Slop Fixes:** Sanitasi `PropertyDetailView.tsx` (`"Partner PT TMJ"` -> `"Partner Resmi"`), ganti seluruh emoji dengan `lucide-react`, ganti `overflow-x: hidden` -> `overflow-x: clip`, lokalkan & upscale 4K foto properti ke `public/images/properties/*.webp`.
- **Next Action:** Milestone 0 Git baseline -> Execute Milestones 1–6 & 7-Viewport Chrome CDP Port `9223` Vision QA.
