# Tiar Property Official Website & Marketplace Portal

Portal katalog hunian eksklusif, promo DP 0% All-In Free, konsultasi cicilan langsung via WhatsApp, dan direktori konsultan resmi **Tiar Property** untuk kawasan **Surabaya & Sidoarjo** (`Next.js 15 App Router Static Export`).

## Project Brain & Architecture Docs
Seluruh dokumentasi arsitektur, Design DNA (`Mejuma Warm Stone`), alur konversi pengunjung, keamanan, dan log versi tersimpan di folder [`readme-ai-agent/`](readme-ai-agent/README.md):

- **State Checkpoint:** [`readme-ai-agent/AGENTS.md`](readme-ai-agent/AGENTS.md)
- **User Flow & Arsitektur:** [`readme-ai-agent/USER_FLOW_AND_PAGE_ARCHITECTURE.md`](readme-ai-agent/USER_FLOW_AND_PAGE_ARCHITECTURE.md)
- **Style Guide (`Mejuma × Tiar`):** [`readme-ai-agent/STYLE-GUIDE.md`](readme-ai-agent/STYLE-GUIDE.md)
- **Design DNA JSON:** [`readme-ai-agent/DESIGN-DNA.json`](readme-ai-agent/DESIGN-DNA.json)
- **Milestone Build Plan:** [`readme-ai-agent/TASK.md`](readme-ai-agent/TASK.md)
- **Guardrails Module:** [`src/lib/guardrails.ts`](src/lib/guardrails.ts) (pusat aturan *Information Gap* & *Anti-BLT* untuk Admin UI & MCP Server)

## Perintah Utama
```bash
npm run dev                         # Server development di http://localhost:3000
npm run lint                        # Audit ESLint non-interaktif (eslint .)
npx tsc --noEmit                    # Validasi strict TypeScript
npm run build                       # Static export ke ./out (27 rute, 0 serverless functions)
npx tsx scripts/verify-mcp-tools.ts # End-to-end test suite 7 tools MCP Server
```
