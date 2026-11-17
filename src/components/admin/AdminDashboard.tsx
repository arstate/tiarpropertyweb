'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertyUnit, TIAR_PROPERTIES } from '@/data/properties';
import { AgentProfile, TIAR_AGENTS } from '@/data/agents';
import { AdminPinLock } from './AdminPinLock';
import { AdminStatsSummary } from './AdminStatsSummary';
import { AdminClustersTab } from './AdminClustersTab';
import { AdminAgentsTab } from './AdminAgentsTab';
import { AdminImageCompressor } from './AdminImageCompressor';
import { AdminSyncExportTab } from './AdminSyncExportTab';
import {
  BarChart3,
  Building2,
  Users,
  Image as ImageIcon,
  Zap,
  LogOut,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'stats' | 'clusters' | 'agents' | 'compressor' | 'sync'
  >('stats');

  const [properties, setProperties] = useState<PropertyUnit[]>(TIAR_PROPERTIES);
  const [agents, setAgents] = useState<AgentProfile[]>(TIAR_AGENTS);
  const [hasLocalChanges, setHasLocalChanges] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Load auth state & saved local changes on client mount
  useEffect(() => {
    const auth = sessionStorage.getItem('tiar_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    try {
      const savedProps = localStorage.getItem('tiar_admin_properties');
      const savedAgents = localStorage.getItem('tiar_admin_agents');

      if (savedProps) {
        setProperties(JSON.parse(savedProps));
        setHasLocalChanges(true);
      }
      if (savedAgents) {
        setAgents(JSON.parse(savedAgents));
        setHasLocalChanges(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Property handlers
  const handleSaveProperty = (prop: PropertyUnit) => {
    setProperties((prev) => {
      const idx = prev.findIndex((p) => p.id === prop.id);
      let updated: PropertyUnit[];
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = prop;
      } else {
        updated = [prop, ...prev];
      }
      localStorage.setItem('tiar_admin_properties', JSON.stringify(updated));
      return updated;
    });

    // Sinkronkan juga relasi PIC agen jika di-assign
    if (prop.assignedAgentId) {
      setAgents((prev) => {
        const agIndex = prev.findIndex((a) => a.id === prop.assignedAgentId);
        if (agIndex !== -1) {
          const updatedAgents = [...prev];
          const currProps = updatedAgents[agIndex].assignedProperties || [];
          if (!currProps.includes(prop.id)) {
            updatedAgents[agIndex] = {
              ...updatedAgents[agIndex],
              assignedProperties: [...currProps, prop.id],
            };
            localStorage.setItem('tiar_admin_agents', JSON.stringify(updatedAgents));
            return updatedAgents;
          }
        }
        return prev;
      });
    }

    setHasLocalChanges(true);
    triggerToast(`Klaster "${prop.codeName}" berhasil disimpan.`);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('tiar_admin_properties', JSON.stringify(updated));
      return updated;
    });

    // Bersihkan dari daftar agen juga
    setAgents((prev) => {
      const updatedAgents = prev.map((ag) => ({
        ...ag,
        assignedProperties: (ag.assignedProperties || []).filter((pid) => pid !== id),
      }));
      localStorage.setItem('tiar_admin_agents', JSON.stringify(updatedAgents));
      return updatedAgents;
    });

    setHasLocalChanges(true);
    triggerToast('Klaster berhasil dihapus.');
  };

  // Agent handlers
  const handleSaveAgent = (agent: AgentProfile) => {
    setAgents((prev) => {
      const idx = prev.findIndex((a) => a.id === agent.id);
      let updated: AgentProfile[];
      if (idx !== -1) {
        updated = [...prev];
        updated[idx] = agent;
      } else {
        updated = [agent, ...prev];
      }
      localStorage.setItem('tiar_admin_agents', JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
    triggerToast(`Agen "${agent.name}" berhasil disimpan.`);
  };

  const handleDeleteAgent = (id: string) => {
    setAgents((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      localStorage.setItem('tiar_admin_agents', JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
    triggerToast('Agen berhasil dihapus.');
  };

  const handleToggleAgentActive = (id: string) => {
    setAgents((prev) => {
      const updated = prev.map((ag) =>
        ag.id === id ? { ...ag, isActive: !ag.isActive } : ag
      );
      localStorage.setItem('tiar_admin_agents', JSON.stringify(updated));
      return updated;
    });
    setHasLocalChanges(true);
  };

  const handleResetToDefaults = () => {
    if (confirm('Kembalikan semua data ke kondisi default awal dari repositori?')) {
      localStorage.removeItem('tiar_admin_properties');
      localStorage.removeItem('tiar_admin_agents');
      setProperties(TIAR_PROPERTIES);
      setAgents(TIAR_AGENTS);
      setHasLocalChanges(false);
      triggerToast('Data berhasil di-reset ke nilai default.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tiar_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminPinLock onUnlock={() => setIsAuthenticated(true)} />;
  }

  const navTabs = [
    { id: 'stats', label: 'Ringkasan', icon: BarChart3 },
    { id: 'clusters', label: `Klaster (${properties.length})`, icon: Building2 },
    { id: 'agents', label: `Agen (${agents.length})`, icon: Users },
    { id: 'compressor', label: 'Kompresi WebP', icon: ImageIcon },
    { id: 'sync', label: 'Sinkronisasi', icon: Zap },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050b0a] text-white">
      {/* Top Floating Toast Notification */}
      {saveToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0e241f] border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#081613]/90 backdrop-blur-md border-b border-[#16362f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <span className="text-lg sm:text-xl font-black text-white tracking-tighter">
                Tiar<span className="text-[#dde8e2]">Property</span>
              </span>
            </Link>
            <span className="h-4 w-px bg-[#16362f] hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#0e241f] border border-[#16362f] text-[11px] font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e241f] border border-[#16362f] text-white/80 hover:text-white text-xs font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e241f] border border-[#16362f] text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-bold transition-all"
              title="Kunci / Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-[#050b0a] shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-[#0e241f]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'stats' && (
          <AdminStatsSummary properties={properties} agents={agents} />
        )}

        {activeTab === 'clusters' && (
          <AdminClustersTab
            properties={properties}
            agents={agents}
            onSaveProperty={handleSaveProperty}
            onDeleteProperty={handleDeleteProperty}
          />
        )}

        {activeTab === 'agents' && (
          <AdminAgentsTab
            agents={agents}
            onSaveAgent={handleSaveAgent}
            onDeleteAgent={handleDeleteAgent}
            onToggleActive={handleToggleAgentActive}
          />
        )}

        {activeTab === 'compressor' && <AdminImageCompressor />}

        {activeTab === 'sync' && (
          <AdminSyncExportTab
            properties={properties}
            agents={agents}
            onResetToDefaults={handleResetToDefaults}
            hasLocalChanges={hasLocalChanges}
          />
        )}
      </main>
    </div>
  );
}
