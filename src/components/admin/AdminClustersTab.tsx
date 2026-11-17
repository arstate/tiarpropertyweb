'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PropertyUnit } from '@/data/properties';
import { AgentProfile } from '@/data/agents';
import { ClusterModal } from './ClusterModal';
import {
  Plus,
  Search,
  Building2,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Filter,
} from 'lucide-react';

interface AdminClustersTabProps {
  properties: PropertyUnit[];
  agents: AgentProfile[];
  onSaveProperty: (property: PropertyUnit) => void;
  onDeleteProperty: (id: string) => void;
}

export function AdminClustersTab({
  properties,
  agents,
  onSaveProperty,
  onDeleteProperty,
}: AdminClustersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<'All' | 'Surabaya' | 'Sidoarjo'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyUnit | null>(null);

  const filteredProperties = properties.filter((p) => {
    const matchSearch =
      p.codeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.locationArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = selectedCity === 'All' || p.city === selectedCity;
    return matchSearch && matchCity;
  });

  const handleEdit = (prop: PropertyUnit) => {
    setEditingProperty(prop);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProperty(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus klaster "${name}"?`)) {
      onDeleteProperty(id);
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
              placeholder="Cari klaster berdasarkan nama / area..."
              className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#050b0a] border border-[#16362f] rounded-xl p-1">
            {(['All', 'Sidoarjo', 'Surabaya'] as const).map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCity === city
                    ? 'bg-emerald-500 text-[#050b0a] shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {city === 'All' ? 'Semua Kota' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Add Cluster Button */}
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050b0a] font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Klaster Baru</span>
        </button>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden lg:block bg-[#081613] border border-[#16362f] rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-white/90">
          <thead className="bg-[#0e241f] border-b border-[#16362f] text-[11px] font-bold text-white/60 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Klaster & Area</th>
              <th className="py-3.5 px-4">Kota & Lantai</th>
              <th className="py-3.5 px-4">Harga & Cicilan</th>
              <th className="py-3.5 px-4">Spesifikasi</th>
              <th className="py-3.5 px-4">PIC Agen</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#16362f]/60 font-sans">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((prop) => {
                const pic = agents.find((a) => a.id === prop.assignedAgentId);
                return (
                  <tr key={prop.id} className="hover:bg-[#0e241f]/40 transition-colors">
                    {/* Klaster Name & Area */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#16362f] bg-[#050b0a] shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prop.imageUrl}
                            alt={prop.codeName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-black text-sm text-white tracking-tight">
                            {prop.codeName}
                          </div>
                          <div className="text-[11px] text-white/60 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate max-w-[220px]">{prop.locationAreaShort}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kota, Status, & Lantai */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#050b0a] border border-[#16362f] text-[11px] font-bold text-white">
                          {prop.city}
                        </span>
                        {prop.status === 'sold' ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                            Terjual
                          </span>
                        ) : prop.status === 'reserved' ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                            Booking
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            Tersedia
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-white/60 mt-1">
                        {prop.floors} Lantai
                      </span>
                    </td>

                    {/* Harga & Cicilan */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-emerald-400 text-xs">
                        {prop.priceStart}
                      </div>
                      <div className="text-[11px] text-white/70">
                        {prop.cicilanPromo}
                      </div>
                      <div className="text-[10px] text-amber-400 font-bold">
                        {prop.utjAmount}
                      </div>
                    </td>

                    {/* Spesifikasi */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-[11px] text-white/80">
                        <span>{prop.specs.bedrooms} KT</span>
                        <span>•</span>
                        <span>{prop.specs.bathrooms} KM</span>
                        <span>•</span>
                        <span>LT {prop.specs.luasTanah}</span>
                      </div>
                      <div className="text-[10px] text-white/50 mt-0.5">
                        LB {prop.specs.luasBangunan}
                      </div>
                    </td>

                    {/* PIC Konsultan */}
                    <td className="py-3.5 px-4">
                      {pic ? (
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pic.photoUrl}
                            alt={pic.name}
                            className="w-6 h-6 rounded-full object-cover border border-[#16362f]"
                          />
                          <div>
                            <span className="font-bold text-xs text-white block">
                              {pic.name}
                            </span>
                            <span className="text-[10px] text-white/50 block">
                              {pic.phone}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-white/40 text-[11px]">Belum di-assign</span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/properti/${prop.id}`}
                          target="_blank"
                          title="Lihat Halaman Publik"
                          className="p-1.5 rounded-lg bg-[#050b0a] border border-[#16362f] text-white/60 hover:text-white hover:border-[#3a6356] transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(prop)}
                          title="Edit Klaster"
                          className="p-1.5 rounded-lg bg-[#0e241f] border border-[#16362f] text-emerald-400 hover:bg-[#16362f] transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id, prop.codeName)}
                          title="Hapus Klaster"
                          className="p-1.5 rounded-lg bg-[#050b0a] border border-[#16362f] text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-white/40">
                  Tidak ada klaster yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((prop) => {
            const pic = agents.find((a) => a.id === prop.assignedAgentId);
            return (
              <div
                key={prop.id}
                className="bg-[#081613] border border-[#16362f] rounded-2xl p-4 space-y-3.5 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#16362f] bg-[#050b0a] shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prop.imageUrl}
                          alt={prop.codeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-white tracking-tight">
                          {prop.codeName}
                        </h4>
                        <p className="text-[11px] text-white/60 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>{prop.locationAreaShort}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-[#050b0a] border border-[#16362f] text-[10px] font-bold text-white">
                        {prop.city}
                      </span>
                      {prop.status === 'sold' ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-bold">
                          Terjual
                        </span>
                      ) : prop.status === 'reserved' ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-bold">
                          Booking
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                          Tersedia
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 bg-[#050b0a] p-2.5 rounded-xl border border-[#16362f] text-[11px]">
                    <div>
                      <span className="text-white/50 block text-[10px]">Harga Mulai</span>
                      <span className="font-mono font-bold text-emerald-400">{prop.priceStart}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[10px]">Cicilan Promo</span>
                      <span className="font-bold text-white">{prop.cicilanPromo}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/70">
                    <span>
                      {prop.specs.bedrooms} KT • {prop.specs.bathrooms} KM • {prop.floors} Lt
                    </span>
                    <span className="text-amber-400 font-bold">{prop.utjAmount}</span>
                  </div>

                  {pic && (
                    <div className="mt-2.5 pt-2.5 border-t border-[#16362f] flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pic.photoUrl}
                        alt={pic.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-white/80">
                        PIC: <strong className="text-white">{pic.name}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#16362f] flex items-center justify-end gap-2">
                  <Link
                    href={`/properti/${prop.id}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg bg-[#050b0a] border border-[#16362f] text-white/70 hover:text-white text-xs font-bold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Publik
                  </Link>
                  <button
                    onClick={() => handleEdit(prop)}
                    className="px-3 py-1.5 rounded-lg bg-[#0e241f] border border-[#16362f] text-emerald-400 hover:bg-[#16362f] text-xs font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prop.id, prop.codeName)}
                    className="px-3 py-1.5 rounded-lg bg-[#050b0a] border border-[#16362f] text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-white/40 bg-[#081613] rounded-2xl border border-[#16362f]">
            Tidak ada klaster yang cocok dengan filter.
          </div>
        )}
      </div>

      {/* Modal */}
      <ClusterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSaveProperty}
        initialData={editingProperty}
        agents={agents}
      />
    </div>
  );
}
