'use client';

import React, { useState, useEffect } from 'react';
import { AgentProfile } from '@/data/agents';
import { X, Check, Plus, User, AlertCircle, Phone } from 'lucide-react';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: AgentProfile) => void;
  initialData?: AgentProfile | null;
}

export function AgentModal({ isOpen, onClose, onSave, initialData }: AgentModalProps) {
  const [formData, setFormData] = useState<Partial<AgentProfile>>({
    id: '',
    name: '',
    role: 'Senior Property Consultant',
    photoUrl: '/images/agents/mbak-ningsih.webp',
    phone: '6282142193231',
    citySpecialist: 'Sidoarjo',
    areaFocus: ['Sukodono', 'Sedati Juanda'],
    rating: 5.0,
    totalDealsAssisted: 10,
    badges: ['Pakar KPR', 'Survey Master'],
    bio: 'Konsultan properti ramah siap mendampingi survei lokasi akhir pekan.',
    assignedProperties: [],
    isActive: true,
    orderPriority: 5,
  });

  const [areaInput, setAreaInput] = useState('');
  const [badgeInput, setBadgeInput] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: '',
        name: '',
        role: 'Senior Property Consultant',
        photoUrl: '/images/agents/mbak-ningsih.webp',
        phone: '6282142193231',
        citySpecialist: 'Sidoarjo',
        areaFocus: ['Sukodono', 'Sedati Juanda'],
        rating: 5.0,
        totalDealsAssisted: 10,
        badges: ['Pakar KPR', 'Survey Master'],
        bio: 'Konsultan properti ramah siap mendampingi survei lokasi akhir pekan.',
        assignedProperties: [],
        isActive: true,
        orderPriority: 5,
      });
    }
    setPhoneError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validatePhone = (num: string): boolean => {
    const clean = num.replace(/[^\d]/g, '');
    return clean.startsWith('628') && clean.length >= 10 && clean.length <= 15;
  };

  const handleAddArea = () => {
    if (!areaInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      areaFocus: [...(prev.areaFocus || []), areaInput.trim()],
    }));
    setAreaInput('');
  };

  const handleRemoveArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      areaFocus: (prev.areaFocus || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddBadge = () => {
    if (!badgeInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      badges: [...(prev.badges || []), badgeInput.trim()],
    }));
    setBadgeInput('');
  };

  const handleRemoveBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      badges: (prev.badges || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = (formData.phone || '').replace(/[^\d]/g, '');
    if (!validatePhone(cleanPhone)) {
      setPhoneError('Nomor WhatsApp wajib menggunakan format Indonesia berawalan "628" (contoh: 6282142193231).');
      return;
    }

    if (!formData.name?.trim()) {
      setPhoneError('Nama konsultan marketing wajib diisi.');
      return;
    }

    const agentId =
      formData.id ||
      formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');

    const finalized: AgentProfile = {
      id: agentId,
      name: formData.name || 'Konsultan Baru',
      role: formData.role || 'Property Consultant',
      photoUrl:
        formData.photoUrl ||
        '/images/agents/mbak-ningsih.webp',
      phone: cleanPhone,
      citySpecialist: formData.citySpecialist || 'Sidoarjo',
      areaFocus: formData.areaFocus || [],
      rating: formData.rating || 5.0,
      totalDealsAssisted: formData.totalDealsAssisted || 0,
      badges: formData.badges || [],
      bio: formData.bio || '',
      assignedProperties: formData.assignedProperties || [],
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      orderPriority: Number(formData.orderPriority) || 10,
    };

    onSave(finalized);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#081613] border border-[#16362f] rounded-2xl w-full max-w-2xl my-auto overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#16362f] bg-[#0e241f]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {initialData ? 'Edit Profil Agen Marketing' : 'Daftarkan Staf Agen Baru'}
              </h3>
              <p className="text-[11px] text-white/60">
                Konsultan pendamping survei & closer WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#050b0a] border border-[#16362f] text-white/70 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-white">
          {phoneError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="text-[11px] leading-relaxed">{phoneError}</div>
            </div>
          )}

          {/* Row 1: Nama & Jabatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">
                Nama Lengkap & Gelar <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Dimas Prasetyo"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Jabatan / Role</label>
              <input
                type="text"
                required
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Senior Property Consultant"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Row 2: WhatsApp & Spesialisasi Kota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">
                Nomor WhatsApp (628...) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.phone || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setPhoneError(null);
                  }}
                  placeholder="6282142193231"
                  className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl pl-8 pr-3 py-2.5 text-xs font-mono focus:outline-none focus:border-amber-400"
                />
                <Phone className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Spesialisasi Kota</label>
              <select
                value={formData.citySpecialist || 'Sidoarjo'}
                onChange={(e) => setFormData({ ...formData, citySpecialist: e.target.value as any })}
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="Sidoarjo">Sidoarjo</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Surabaya & Sidoarjo">Surabaya & Sidoarjo</option>
              </select>
            </div>
          </div>

          {/* Row 3: Foto Profil URL */}
          <div>
            <label className="block font-bold text-white mb-1">URL Foto Profil</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.photoUrl || ''}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="/images/agents/mbak-ningsih.webp"
                className="flex-1 bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
              />
              {formData.photoUrl && (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#16362f] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Biografi */}
          <div>
            <label className="block font-bold text-white mb-1">Biografi Profesional</label>
            <textarea
              rows={2}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Pengalaman, spesialisasi survei lokasi, atau keahlian negosiasi KPR..."
              className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Row 5: Area Fokus Tags */}
          <div>
            <label className="block font-bold text-white mb-1">Area Fokus Lokasi</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArea())}
                placeholder="Tambah area (contoh: Sukodono)"
                className="flex-1 bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-3.5 py-2 bg-[#0e241f] border border-[#16362f] hover:bg-[#16362f] text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.areaFocus || []).map((area, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e241f] border border-[#16362f] text-[11px] text-white/90"
                >
                  <span>{area}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(idx)}
                    className="text-white/40 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Row 6: Badges Keahlian */}
          <div>
            <label className="block font-bold text-white mb-1">Badges Keahlian</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBadge())}
                placeholder="Tambah badge (contoh: Pakar DP 0%)"
                className="flex-1 bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddBadge}
                className="px-3.5 py-2 bg-[#0e241f] border border-[#16362f] hover:bg-[#16362f] text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.badges || []).map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e241f] border border-emerald-500/30 text-[11px] text-emerald-300"
                >
                  <span>{badge}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBadge(idx)}
                    className="text-white/40 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Row 7: Prioritas & Status Aktif */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#16362f]">
            <div>
              <label className="block font-bold text-white mb-1">Urutan Prioritas Tampilan</label>
              <input
                type="number"
                min="1"
                value={formData.orderPriority || 5}
                onChange={(e) => setFormData({ ...formData, orderPriority: parseInt(e.target.value) || 5 })}
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="isActiveAgent"
                checked={formData.isActive !== false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <label htmlFor="isActiveAgent" className="text-xs font-bold text-white cursor-pointer select-none">
                Status Agen Aktif
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#16362f] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0e241f] border border-[#16362f] text-white/70 hover:text-white font-bold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#050b0a] font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Profil Agen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
