'use client';

import React, { useState } from 'react';
import { AgentProfile } from '@/data/agents';
import { AgentModal } from './AgentModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface AdminAgentsTabProps {
  agents: AgentProfile[];
  onSaveAgent: (agent: AgentProfile) => void;
  onDeleteAgent: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function AdminAgentsTab({
  agents,
  onSaveAgent,
  onDeleteAgent,
  onToggleActive,
}: AdminAgentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentProfile | null>(null);

  const filteredAgents = agents.filter((ag) => {
    const matchSearch =
      ag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ag.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ag.bio || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity =
      selectedCity === 'All' ||
      ag.citySpecialist.toLowerCase().includes(selectedCity.toLowerCase());
    return matchSearch && matchCity;
  });

  const handleEdit = (agent: AgentProfile) => {
    setEditingAgent(agent);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAgent(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus agen "${name}"?`)) {
      onDeleteAgent(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#081613] border border-[#16362f] rounded-2xl p-4">
        {/* Search & City Filter */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari agen berdasarkan nama / jabatan / keahlian..."
              className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#050b0a] border border-[#16362f] rounded-xl p-1">
            {['All', 'Sidoarjo', 'Surabaya'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === city
                    ? 'bg-amber-400 text-[#050b0a] shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {city === 'All' ? 'Semua Area' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Add Agent Button */}
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#050b0a] font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agen Baru</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-[#081613] border border-[#16362f] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-white/90">
          <thead className="bg-[#0e241f] border-b border-[#16362f] text-[11px] font-bold text-white/60 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Konsultan & Kontak</th>
              <th className="py-3.5 px-4">Spesialisasi & Area</th>
              <th className="py-3.5 px-4">Klaster Dampingan</th>
              <th className="py-3.5 px-4">Badges & Prestasi</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16362f]/60 font-sans">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-[#0e241f]/40 transition-colors">
                  {/* Name & Phone */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-[#16362f] bg-[#050b0a] shrink-0">
                        <img
                          src={ag.photoUrl}
                          alt={ag.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-black text-sm text-white tracking-tight">
                          {ag.name}
                        </div>
                        <div className="text-[11px] text-white/60 mt-0.5">{ag.role}</div>
                        <a
                          href={`https://wa.me/${ag.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 hover:underline mt-0.5"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>+{ag.phone}</span>
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Specialist */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#050b0a] border border-[#16362f] text-[11px] font-bold text-amber-300">
                      {ag.citySpecialist}
                    </span>
                    <div className="text-[10px] text-white/50 mt-1 max-w-[180px] truncate">
                      {ag.areaFocus.join(', ')}
                    </div>
                  </td>

                  {/* Assigned Properties */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e241f] border border-[#16362f] text-xs font-bold text-white">
                      <span>{(ag.assignedProperties || []).length} Klaster</span>
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {ag.badges.slice(0, 2).map((b, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-medium text-emerald-300"
                        >
                          {b}
                        </span>
                      ))}
                      {ag.badges.length > 2 && (
                        <span className="text-[10px] text-white/40 font-mono">
                          +{ag.badges.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onToggleActive(ag.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                        ag.isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {ag.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Aktif
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Nonaktif
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(ag)}
                        title="Edit Profil"
                        className="p-1.5 rounded-lg bg-[#0e241f] border border-[#16362f] text-amber-400 hover:bg-[#16362f] transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ag.id, ag.name)}
                        title="Hapus Agen"
                        className="p-1.5 rounded-lg bg-[#050b0a] border border-[#16362f] text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-white/40">
                  Tidak ada konsultan yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((ag) => (
            <div
              key={ag.id}
              className="bg-[#081613] border border-[#16362f] rounded-2xl p-4 space-y-3 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-[#16362f] bg-[#050b0a] shrink-0">
                      <img src={ag.photoUrl} alt={ag.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white tracking-tight">{ag.name}</h4>
                      <p className="text-[11px] text-white/60 mt-0.5">{ag.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleActive(ag.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ag.isActive
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {ag.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                <div className="mt-3 bg-[#050b0a] p-2.5 rounded-xl border border-[#16362f] space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Spesialis:</span>
                    <strong className="text-amber-300">{ag.citySpecialist}</strong>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>Unit Dampingan:</span>
                    <strong className="text-white">{(ag.assignedProperties || []).length} Klaster</strong>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>WhatsApp:</span>
                    <a
                      href={`https://wa.me/${ag.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-emerald-400 hover:underline"
                    >
                      +{ag.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {ag.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#0e241f] border border-[#16362f] text-[10px] text-white/80"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#16362f] flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(ag)}
                  className="px-3 py-1.5 rounded-lg bg-[#0e241f] border border-[#16362f] text-amber-400 hover:bg-[#16362f] text-xs font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(ag.id, ag.name)}
                  className="px-3 py-1.5 rounded-lg bg-[#050b0a] border border-[#16362f] text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-white/40 bg-[#081613] rounded-2xl border border-[#16362f]">
            Tidak ada konsultan yang cocok.
          </div>
        )}
      </div>

      {/* Modal */}
      <AgentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSaveAgent}
        initialData={editingAgent}
      />
    </div>
  );
}
