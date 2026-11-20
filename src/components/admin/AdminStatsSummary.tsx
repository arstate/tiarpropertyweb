'use client';

import React from 'react';
import { PropertyUnit } from '@/data/properties';
import { AgentProfile } from '@/data/agents';
import { Building2, Users, Banknote, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

interface AdminStatsSummaryProps {
  properties: PropertyUnit[];
  agents: AgentProfile[];
}

export function AdminStatsSummary({ properties, agents }: AdminStatsSummaryProps) {
  const totalClusters = properties.length;
  const surabayaClusters = properties.filter((p) => p.city === 'Surabaya').length;
  const sidoarjoClusters = properties.filter((p) => p.city === 'Sidoarjo').length;

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.isActive).length;

  // Hitung rentang cicilan
  const cicilanValues = properties
    .map((p) => p.cicilanNominal || 0)
    .filter((n) => n > 0);
  const minCicilan = cicilanValues.length ? Math.min(...cicilanValues) : 1.7;
  const maxCicilan = cicilanValues.length ? Math.max(...cicilanValues) : 5.2;

  return (
    <div className="space-y-6">
      {/* 4 Hero Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Klaster */}
        <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 relative overflow-hidden group hover:border-[#3a6356] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
              Total Klaster Aktif
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#0e241f] border border-[#16362f] flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {totalClusters} <span className="text-xs font-semibold text-white/50">Unit Klaster</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0e241f] border border-[#16362f]">
              <MapPin className="w-3 h-3 text-emerald-400" /> Sby: {surabayaClusters}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0e241f] border border-[#16362f]">
              <MapPin className="w-3 h-3 text-emerald-400" /> Sda: {sidoarjoClusters}
            </span>
          </div>
        </div>

        {/* Tim Agen Marketing */}
        <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 relative overflow-hidden group hover:border-[#3a6356] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
              Konsultan Marketing
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#0e241f] border border-[#16362f] flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeAgents} <span className="text-xs font-semibold text-white/50">Aktif ({totalAgents} Total)</span>
          </div>
          <p className="mt-3 text-xs text-white/70">
            Lead CS PIC: <span className="text-white font-bold">Mbak Ningsih</span>
          </p>
        </div>

        {/* Rentang Cicilan Promo */}
        <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 relative overflow-hidden group hover:border-[#3a6356] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
              Rentang Cicilan Promo
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#0e241f] border border-[#16362f] flex items-center justify-center text-sky-400">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {minCicilan.toFixed(1)} - {maxCicilan.toFixed(1)}{' '}
            <span className="text-xs font-semibold text-white/50">Jt / bln</span>
          </div>
          <p className="mt-3 text-xs text-white/70">
            Subsidi: <span className="text-white font-bold">Rp 1,4 Jt x 6-12 Bln</span>
          </p>
        </div>

        {/* Brand Guardrails Compliance */}
        <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 relative overflow-hidden group hover:border-[#3a6356] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
              Guardrail Status
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#0e241f] border border-[#16362f] flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
            100% <span className="text-xs font-semibold text-white/50">Patuh SOP</span>
          </div>
          <div className="mt-3 text-[11px] text-white/70">
            Info Gap & Anti-BLT: <span className="text-emerald-400 font-bold">Aktif Terproteksi</span>
          </div>
        </div>
      </div>

      {/* Strategic Callout Banner */}
      <div className="bg-gradient-to-r from-[#081613] via-[#0e241f] to-[#081613] border border-[#16362f] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-tight">
              SOP Brand Tiar Property: Information Gap Protocol & Anti-BLT
            </h4>
            <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
              Dilarang menyebutkan nama developer legal (PT Trimitra) dan nama persis perumahan di materi promosi. Wajib memakai nama samaran bernilai jual tinggi. Dilarang menyebut kata &quot;BLT&quot; (komisi internal rahasia).
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            Zero-Usage Vercel Active
          </span>
        </div>
      </div>
    </div>
  );
}
