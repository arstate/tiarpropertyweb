'use client';

import React, { useState } from 'react';
import { PropertyUnit } from '@/data/properties';
import { AgentProfile } from '@/data/agents';
import { validateTiarGuardrails } from '@/lib/guardrails';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  FileCode,
  RotateCcw,
  Sparkles,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface AdminSyncExportTabProps {
  properties: PropertyUnit[];
  agents: AgentProfile[];
  onResetToDefaults: () => void;
  hasLocalChanges: boolean;
}

interface ValidationResult {
  success: boolean;
  routesCount: number;
  timestamp: string;
  issues: string[];
}

export function AdminSyncExportTab({
  properties,
  agents,
  onResetToDefaults,
  hasLocalChanges,
}: AdminSyncExportTabProps) {
  const [copiedProp, setCopiedProp] = useState(false);
  const [copiedAgent, setCopiedAgent] = useState(false);
  const [copiedMcpCmd, setCopiedMcpCmd] = useState(false);
  const [copiedBuildCmd, setCopiedBuildCmd] = useState(false);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const downloadJson = (filename: string, data: unknown) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllSyncBundle = () => {
    downloadJson('properties.json', properties);
    setTimeout(() => {
      downloadJson('agents.json', agents);
    }, 300);
  };

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleValidateIntegrity = () => {
    const issues: string[] = [];
    const agentIds = new Set(agents.map((a) => a.id));
    const propIds = new Set<string>();

    for (const prop of properties) {
      if (!prop.id || !prop.codeName.trim()) {
        issues.push(`Klaster tanpa ID/nama valid ditemukan.`);
      } else if (propIds.has(prop.id)) {
        issues.push(`Duplikasi ID klaster "${prop.id}".`);
      } else {
        propIds.add(prop.id);
      }

      const guard = validateTiarGuardrails(prop);
      if (!guard.ok) {
        issues.push(`[${prop.codeName}] ${guard.reason}`);
      }

      if (!prop.imageUrl || (!prop.imageUrl.startsWith('/') && !prop.imageUrl.startsWith('https://'))) {
        issues.push(`[${prop.codeName}] Path foto utama "${prop.imageUrl}" tidak valid.`);
      }

      if (prop.assignedAgentId && !agentIds.has(prop.assignedAgentId)) {
        issues.push(`[${prop.codeName}] PIC agen "${prop.assignedAgentId}" tidak ditemukan di agents.json.`);
      }
    }

    for (const agent of agents) {
      const cleanPhone = agent.phone.replace(/[^\d]/g, '');
      if (!cleanPhone.startsWith('628') || cleanPhone.length < 10) {
        issues.push(`[Agen ${agent.name}] Format WhatsApp "${agent.phone}" harus diawali 628.`);
      }
    }

    // Total static routes: 5 main routes (/, /properti, /produk, /agen, /admin) + 2 detail prefixes per cluster
    const routesCount = 5 + properties.length * 2;

    setValidationResult({
      success: issues.length === 0,
      routesCount,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      issues,
    });
  };

  const mcpCommand = `npx tsx scripts/tiar-mcp-server.ts`;
  const buildCommand = `npm run build`;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#16362f]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Sinkronisasi Data & Ekspor JSON</span>
            </h3>
            <p className="text-xs text-white/70 mt-1">
              Data tersimpan otomatis di browser (localStorage) dan dapat diekspor langsung ke berkas JSON proyek.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasLocalChanges ? (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                Ada Perubahan Lokal
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Data Sinkron
              </span>
            )}
          </div>
        </div>

        {/* 2 Export Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Properties.json */}
          <div className="bg-[#050b0a] border border-[#16362f] rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>properties.json</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {properties.length} Unit Klaster
              </span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Daftar seluruh klaster perumahan aktif Surabaya & Sidoarjo beserta spesifikasi, harga promo, status unit, dan PIC agen.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => downloadJson('properties.json', properties)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#050b0a] font-bold text-xs transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> Download JSON
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(properties, null, 2), setCopiedProp)}
                className="px-3 py-2 rounded-lg bg-[#0e241f] border border-[#16362f] text-white hover:bg-[#16362f] font-bold text-xs transition-all"
              >
                {copiedProp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Agents.json */}
          <div className="bg-[#050b0a] border border-[#16362f] rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>agents.json</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {agents.length} Konsultan
              </span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Profil staf agen marketing, spesialisasi kota, kontak WhatsApp valid (628...), bio, dan daftar unit dampingan.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => downloadJson('agents.json', agents)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#050b0a] font-bold text-xs transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> Download JSON
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(agents, null, 2), setCopiedAgent)}
                className="px-3 py-2 rounded-lg bg-[#0e241f] border border-[#16362f] text-white hover:bg-[#16362f] font-bold text-xs transition-all"
              >
                {copiedAgent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sync Bundle Download & Revert */}
        <div className="pt-3 border-t border-[#16362f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={downloadAllSyncBundle}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0e241f] border border-[#16362f] hover:border-emerald-500/50 text-emerald-400 font-bold text-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ekspor Semua Berkas JSON (Bundle)</span>
          </button>

          {hasLocalChanges && (
            <button
              type="button"
              onClick={onResetToDefaults}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e241f] border border-[#16362f] text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset ke Default
            </button>
          )}
        </div>
      </div>

      {/* Real Schema & Guardrail Integrity Check Card */}
      <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Validasi Skema, Guardrail &amp; Rute Statis</span>
            </h4>
            <p className="text-xs text-white/70 mt-1">
              Memeriksa kelengkapan data klaster, relasi PIC agen, format WA, dan kepatuhan Information Gap &amp; Anti-BLT sebelum ekspor.
            </p>
          </div>

          <button
            type="button"
            data-testid="btn-trigger-rebuild"
            onClick={handleValidateIntegrity}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050b0a] font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Validasi Integritas Data</span>
          </button>
        </div>

        {/* Result Feedback */}
        {validationResult && (
          <div
            className={`p-4 rounded-xl border text-white text-xs space-y-2 ${
              validationResult.success
                ? 'bg-[#0e241f] border-emerald-500/50'
                : 'bg-rose-950/30 border-rose-500/50'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-bold ${
                validationResult.success ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {validationResult.success ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>
                {validationResult.success
                  ? `Validasi Skema & Guardrail Lolos (${validationResult.timestamp})`
                  : `Ditemukan ${validationResult.issues.length} Masalah Data (${validationResult.timestamp})`}
              </span>
            </div>
            {validationResult.success ? (
              <p className="text-[11px] text-white/70">
                Estimasi {validationResult.routesCount} rute statis siap diekspor. Simpan berkas JSON di{' '}
                <code className="text-emerald-400">src/data/</code> lalu jalankan{' '}
                <code className="text-amber-400">npm run build</code> atau tool MCP{' '}
                <code className="text-amber-400">tiar_rebuild_and_deploy</code>.
              </p>
            ) : (
              <ul className="list-disc pl-5 text-[11px] text-rose-200 space-y-1">
                {validationResult.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Terminal Rebuild & MCP Server Command Reference */}
      <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-black text-sm">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Panduan Rebuild &amp; AI MCP Server</span>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          Karena website menggunakan arsitektur statis 100% Zero-Usage Vercel (
          <code className="text-emerald-400 font-mono">output: &apos;export&apos;</code>), setelah memperbarui berkas JSON, jalankan perintah build lokal atau gunakan MCP server:
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#050b0a] border border-[#16362f] rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-white/40 block text-[10px] mb-1 uppercase font-bold">
                1. Jalankan AI MCP Server:
              </span>
              <span className="text-emerald-400 font-bold break-all">{mcpCommand}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(mcpCommand, setCopiedMcpCmd)}
              className="p-2 rounded-lg bg-[#0e241f] border border-[#16362f] text-white/70 hover:text-white shrink-0"
            >
              {copiedMcpCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="bg-[#050b0a] border border-[#16362f] rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-white/40 block text-[10px] mb-1 uppercase font-bold">
                2. Eksekusi Static Export (27+ Rute):
              </span>
              <span className="text-amber-300 font-bold break-all">{buildCommand}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(buildCommand, setCopiedBuildCmd)}
              className="p-2 rounded-lg bg-[#0e241f] border border-[#16362f] text-white/70 hover:text-white shrink-0"
            >
              {copiedBuildCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
