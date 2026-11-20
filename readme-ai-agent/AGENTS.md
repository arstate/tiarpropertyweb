# 🤖 LIVE PROJECT BRAIN CHECKPOINT (`readme-ai-agent/AGENTS.md`)

- **Active Phase:** Phase 3 Completed (`v2.0.1` Code Audit, Refactor, Guardrail Centralization & ESLint Hardening — `27/27` static routes in `out/`).
- **Git Restore Points:** `f5e9614` (`restore-pre-redesign`) -> `ecbd52b` (`restore-v2-verified`) -> `023d853` (`restore-pre-cleanup-20261119-1352`).
- **Tech Stack Lock:** Next.js 15.5.28 App Router (`output: 'export'`), React 19, Tailwind CSS v4, ESLint 9 (`eslint .`), `tsx`, Lucide React, Pure CSS GPU Transitions (`0` serverless invocations).
- **Locked Design Tokens (`Mejuma Warm Stone`):** `#F1F1F1` Paper, `#E8E4E1` Travertine, `#C5BEB4` Border, `#38352C` Ink/Dark, `#57534A` Muted Ink, `#82886E` Sage, `#FFCA4F` Sun Gold CTA, Upright `Cormorant Garamond` + `Golos Text` (`.num-clean`) + `JetBrains Mono` (`.mono-num`).
- **Verified Enforcements (`2026-11-19`):**
  1. **Shared Modules:** `src/lib/guardrails.ts` (Info Gap & Anti-BLT), `buildMainWaUrl()` & `buildPropertyMetadata()` (`src/data/properties.ts`).
  2. **Clean Codebase & Tooling:** `0` `: any`, `npm run lint` & `tsc --noEmit` `0` error/warning, `15/15` MCP tests PASS (`npx tsx scripts/verify-mcp-tools.ts`), legacy KPR & script v1 dihapus.
  3. **Bug & DOM Fixes:** MCP local `/images/...` schema + default local agent photo, canonical filter params, single `<h1>` in `PropertyDetailView`, real integrity validator in `/admin`.
- **Next Action:** Siap deploy folder `out/` atau lanjutkan iterasi fitur baru.
