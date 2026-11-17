# 🤖 LIVE PROJECT BRAIN CHECKPOINT (`readme-ai-agent/AGENTS.md`)

- **Active Phase:** Phase 2 Completed — `v2.0.0` (`Mejuma Warm Stone`) Redesign Executed, Built (`27/27` static pages in `out/`), & Audited.
- **Git Restore Points:** `f5e9614` (`restore-pre-redesign`) -> `ecbd52b` (`feat(web): Mejuma Warm Stone v2.0.0 redesign...`, tag: `restore-v2-verified`).
- **Tech Stack Lock:** Next.js 15.5.28 App Router (`output: 'export'`), React 19, Tailwind CSS v4, Lucide React, Pure CSS GPU Transitions (`0` serverless invocations).
- **Locked Design Tokens (`Mejuma Warm Stone`):** Paper `#F1F1F1`, Surface `#E8E4E1`, Border `#C5BEB4`, Ink & Dark Panel `#38352C`, Accessible Muted Ink `#57534A`, Decorative Sage `#82886E`, Sun Gold CTA `#FFCA4F`, Upright `Cormorant Garamond` (letters ONLY) + `Golos Text` (`.num-clean`) + `JetBrains Mono` (`.mono-num`).
- **Verified Enforcements (2026-11-17):**
  1. **Kalkulator KPR Dihapus Total:** `KprCalculator.tsx`, `#kalkulator`, dan `#simulasi-kpr` telah dihapus; digantikan CTA langsung *"Hitung Cicilan & Cek SLIK via WhatsApp"*.
  2. **0% Serif Numerals:** Terverifikasi DOM TreeWalker CDP (`serifNums=0` di `360x800`–`1920x1080`).
  3. **Keamanan & Aset:** `"Partner PT TMJ"` -> `"Partner Resmi"`, `0` leak publik, `0` emoji publik, 16 foto lokal WebP 4K (`/boost`), `overflow-x: clip`, `src/app/icon.svg`, `/admin` bebas regresi.
- **Next Action:** Lakukan spot-check visual manusia di browser pada `out/` sebelum deploy produksi (lihat `readme-ai-agent/DESIGN-CRITIQUE.md`).
