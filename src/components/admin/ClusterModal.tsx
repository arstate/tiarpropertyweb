'use client';

import React, { useState, useEffect } from 'react';
import { PropertyUnit } from '@/data/properties';
import { AgentProfile } from '@/data/agents';
import { X, ShieldAlert, Check, Plus, Trash2, Home, AlertCircle } from 'lucide-react';

interface ClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: PropertyUnit) => void;
  initialData?: PropertyUnit | null;
  agents: AgentProfile[];
}

export function ClusterModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  agents,
}: ClusterModalProps) {
  const [formData, setFormData] = useState<Partial<PropertyUnit>>({
    id: '',
    codeName: '',
    locationArea: '',
    locationAreaShort: '',
    city: 'Sidoarjo',
    floors: 1,
    priceStart: 'Rp 320 Jt',
    priceStrikethrough: 'Rp 380 Jt',
    cicilanPromo: 'Rp 1,9 Jt / bln',
    cicilanNominal: 1.9,
    subsidiInfo: 'Subsidi Angsuran Rp 1,4 Juta x 6 Bulan',
    utjAmount: 'UTJ Rp 1 Jt',
    rating: 5,
    specs: {
      bedrooms: 2,
      bathrooms: 1,
      luasTanah: '72 m²',
      luasBangunan: '36 m²',
    },
    features: ['DP 0% (Tanpa DP)', 'Free BPHTB, AJB, Notaris, & KPR', 'Row Jalan 8 Meter'],
    imageUrl: '/images/properties/cluster-sukodono.webp',
    galleryImages: [],
    assignedAgentId: 'mbak-ningsih',
    status: 'available',
  });

  const [featureInput, setFeatureInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [violationError, setViolationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        status: initialData.status || 'available',
      });
    } else {
      setFormData({
        id: '',
        codeName: '',
        locationArea: 'Sukodono, Sidoarjo (10 Menit ke Waru / Cito)',
        locationAreaShort: 'Sukodono, Sidoarjo',
        city: 'Sidoarjo',
        floors: 1,
        priceStart: 'Rp 320 Jt',
        priceStrikethrough: 'Rp 380 Jt',
        cicilanPromo: 'Rp 1,9 Jt / bln',
        cicilanNominal: 1.9,
        subsidiInfo: 'Subsidi Angsuran Rp 1,4 Juta x 6 Bulan',
        utjAmount: 'UTJ Rp 1 Jt',
        rating: 5,
        specs: {
          bedrooms: 2,
          bathrooms: 1,
          luasTanah: '72 m²',
          luasBangunan: '36 m²',
        },
        features: ['DP 0% (Tanpa DP)', 'Free BPHTB, AJB, Notaris, & KPR', 'Row Jalan 8 Meter'],
        imageUrl: '/images/properties/cluster-sukodono.webp',
        galleryImages: [],
        assignedAgentId: 'mbak-ningsih',
        status: 'available',
      });
    }
    setViolationError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Real-time guardrail check
  const checkTextForGuardrail = (val: string): string | null => {
    const devRegex = /\b(pt\s*\.?\s*)?trimitra(\s+manunggal\s+jaya)?\b/i;
    if (devRegex.test(val)) {
      return 'Pelanggaran Information Gap Protocol: Dilarang menyebutkan nama legal developer PT Trimitra / Trimitra Manunggal Jaya. Wajib gunakan nama samaran strategis (contoh: "Cluster Modern Sukodono").';
    }

    const realEstatePatterns = [
      /\bgrand\s+park\s+anggaswangi\b/i,
      /\bgrand\s+masangan\s+permai\b/i,
      /\bgrand\s+east\s+residence\b/i,
      /\b(cluster\s+)?hazel\b/i,
      /\btampak\s+siring\b/i,
      /\bpuri\s+gading(\s+mas\s+raya)?\b/i,
      /\balera\s+grove\b/i,
      /\b(klopo|kelopo)\s+sepuluh\b/i,
      /\b(gmp|ger|pgmr|gpa)\b/i,
    ];
    for (const p of realEstatePatterns) {
      if (p.test(val)) {
        return 'Pelanggaran Information Gap Protocol: Dilarang menyebutkan nama perumahan asli (seperti Grand Park Anggaswangi, Grand Masangan Permai, Grand East Residence, Cluster Hazel, Tampak Siring, Alera Grove, Puri Gading Mas Raya). Wajib gunakan nama samaran strategis dengan daya tarik tinggi (contoh: "Cluster Modern Sukodono", "Cluster Minimalis Juanda", "Cluster Sultan MERR").';
      }
    }

    const bltRegex = /\b(blt|bantuan\s+likuiditas\s+transaksi)\b/i;
    if (bltRegex.test(val)) {
      return 'Pelanggaran Protokol Kerahasiaan: Dilarang mencantumkan kata "BLT" (komisi internal marketing)!';
    }
    return null;
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    const v = checkTextForGuardrail(featureInput);
    if (v) {
      setViolationError(v);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()],
    }));
    setFeatureInput('');
    setViolationError(null);
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddGallery = () => {
    if (!galleryInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), galleryInput.trim()],
    }));
    setGalleryInput('');
  };

  const handleRemoveGallery = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check all text
    const fullText = JSON.stringify(formData);
    const guardError = checkTextForGuardrail(fullText);
    if (guardError) {
      setViolationError(guardError);
      return;
    }

    if (!formData.codeName?.trim()) {
      setViolationError('Nama klaster (samaran) wajib diisi.');
      return;
    }

    // Auto-generate ID if empty
    const clusterId =
      formData.id ||
      formData.codeName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-') +
        '-' +
        formData.city?.toLowerCase();

    const finalized: PropertyUnit = {
      id: clusterId,
      codeName: formData.codeName || 'Klaster Modern',
      locationArea: formData.locationArea || 'Surabaya / Sidoarjo',
      locationAreaShort: formData.locationAreaShort || formData.locationArea || 'Sidoarjo',
      city: formData.city || 'Sidoarjo',
      floors: formData.floors || 1,
      priceStart: formData.priceStart || 'Rp 300 Jt',
      priceStrikethrough: formData.priceStrikethrough || 'Rp 360 Jt',
      cicilanPromo: formData.cicilanPromo || 'Rp 1,9 Jt / bln',
      cicilanNominal: Number(formData.cicilanNominal) || 1.9,
      subsidiInfo: formData.subsidiInfo || 'Subsidi Angsuran Rp 1,4 Jt x 6 Bln',
      utjAmount: formData.utjAmount || 'UTJ Rp 1 Jt',
      rating: formData.rating || 5,
      specs: {
        bedrooms: Number(formData.specs?.bedrooms) || 2,
        bathrooms: Number(formData.specs?.bathrooms) || 1,
        luasTanah: formData.specs?.luasTanah || '72 m²',
        luasBangunan: formData.specs?.luasBangunan || '36 m²',
      },
      features: formData.features || [],
      imageUrl: formData.imageUrl || '/images/properties/cluster-sukodono.webp',
      galleryImages: formData.galleryImages && formData.galleryImages.length > 0 ? formData.galleryImages : [formData.imageUrl || ''],
      assignedAgentId: formData.assignedAgentId || 'mbak-ningsih',
      status: formData.status || 'available',
    };

    onSave(finalized);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#081613] border border-[#16362f] rounded-2xl w-full max-w-3xl my-auto overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#16362f] bg-[#0e241f]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {initialData ? 'Edit Klaster Properti' : 'Tambah Unit Klaster Baru'}
              </h3>
              <p className="text-[11px] text-white/60">
                Patuhi Information Gap Protocol & format harga promo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            data-testid="close-cluster-modal"
            className="w-8 h-8 rounded-lg bg-[#050b0a] border border-[#16362f] text-white/70 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-white">
          {violationError && (
            <div data-testid="guardrail-violation-error" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="text-[11px] leading-relaxed">{violationError}</div>
            </div>
          )}

          {/* Row 1: Nama Samaran, Kota, & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-white mb-1">
                Nama Samaran Klaster <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                data-testid="input-cluster-codename"
                value={formData.codeName || ''}
                onInput={(e) => {
                  const val = (e.target as HTMLInputElement).value;
                  setFormData((prev) => ({ ...prev, codeName: val }));
                  const v = checkTextForGuardrail(val);
                  setViolationError(v);
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({ ...prev, codeName: val }));
                  const v = checkTextForGuardrail(val);
                  setViolationError(v);
                }}
                placeholder="Contoh: Cluster Modern Sukodono (Bukan nama PT Trimitra)"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-white/50 mt-1 block">
                Information Gap: Gunakan nama samaran bernilai jual tinggi untuk memicu chat WA.
              </span>
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Kota Pemasaran</label>
              <select
                value={formData.city || 'Sidoarjo'}
                onChange={(e) => setFormData({ ...formData, city: e.target.value as any })}
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Sidoarjo">Sidoarjo</option>
                <option value="Surabaya">Surabaya</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Status Unit</label>
              <select
                value={formData.status || 'available'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-bold"
              >
                <option value="available">Tersedia (Ready)</option>
                <option value="reserved">Booking (Reserved)</option>
                <option value="sold">Terjual (Sold Out)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Deskripsi Lokasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white mb-1">Area Lokasi Detail</label>
              <input
                type="text"
                required
                value={formData.locationArea || ''}
                onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                placeholder="Contoh: Sukodono, Sidoarjo (10 Menit ke Waru / Cito)"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Ringkasan Area (Short)</label>
              <input
                type="text"
                required
                value={formData.locationAreaShort || ''}
                onChange={(e) => setFormData({ ...formData, locationAreaShort: e.target.value })}
                placeholder="Contoh: Sukodono, Sidoarjo"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Row 3: Harga & Cicilan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#050b0a] p-3.5 rounded-xl border border-[#16362f]">
            <div>
              <label className="block font-bold text-white mb-1">Harga Mulai</label>
              <input
                type="text"
                value={formData.priceStart || ''}
                onChange={(e) => setFormData({ ...formData, priceStart: e.target.value })}
                placeholder="Rp 300 Jt"
                className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Harga Coret</label>
              <input
                type="text"
                value={formData.priceStrikethrough || ''}
                onChange={(e) => setFormData({ ...formData, priceStrikethrough: e.target.value })}
                placeholder="Rp 360 Jt"
                className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Cicilan Promo</label>
              <input
                type="text"
                value={formData.cicilanPromo || ''}
                onChange={(e) => setFormData({ ...formData, cicilanPromo: e.target.value })}
                placeholder="Rp 1,9 Jt / bln"
                className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-white mb-1">Nominal (Jt)</label>
              <input
                type="number"
                step="0.1"
                value={formData.cicilanNominal || 1.9}
                onChange={(e) => setFormData({ ...formData, cicilanNominal: parseFloat(e.target.value) })}
                className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Row 4: UTJ & Subsidi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-white mb-1">Nominal UTJ</label>
              <input
                type="text"
                value={formData.utjAmount || 'UTJ Rp 1 Jt'}
                onChange={(e) => setFormData({ ...formData, utjAmount: e.target.value })}
                placeholder="UTJ Rp 1 Jt"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-white mb-1">Info Subsidi / Promo</label>
              <input
                type="text"
                value={formData.subsidiInfo || ''}
                onChange={(e) => setFormData({ ...formData, subsidiInfo: e.target.value })}
                placeholder="Contoh: Subsidi Angsuran Rp 1,4 Juta x 6 Bulan"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Row 5: Spesifikasi */}
          <div className="bg-[#050b0a] p-3.5 rounded-xl border border-[#16362f] space-y-2">
            <span className="block font-bold text-white text-[11px] uppercase tracking-wider text-emerald-400">
              Spesifikasi Bangunan Fisik
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Kamar Tidur</label>
                <input
                  type="number"
                  min="1"
                  value={formData.specs?.bedrooms || 2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, bedrooms: parseInt(e.target.value) || 2 },
                    })
                  }
                  className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Kamar Mandi</label>
                <input
                  type="number"
                  min="1"
                  value={formData.specs?.bathrooms || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, bathrooms: parseInt(e.target.value) || 1 },
                    })
                  }
                  className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Luas Tanah</label>
                <input
                  type="text"
                  value={formData.specs?.luasTanah || '72 m²'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, luasTanah: e.target.value },
                    })
                  }
                  className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/70 mb-1">Luas Bangunan</label>
                <input
                  type="text"
                  value={formData.specs?.luasBangunan || '36 m²'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specs: { ...formData.specs!, luasBangunan: e.target.value },
                    })
                  }
                  className="w-full bg-[#081613] border border-[#16362f] rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Fitur Keunggulan */}
          <div>
            <label className="block font-bold text-white mb-1.5">Fitur Keunggulan</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="Tambah poin keunggulan (misal: Free Pompa Air)"
                className="flex-1 bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 bg-[#0e241f] border border-[#16362f] hover:bg-[#16362f] text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.features || []).map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e241f] border border-[#16362f] text-[11px] text-white/90"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-white/40 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Row 7: Foto Utama & Galeri */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-white mb-1">URL Foto Utama</label>
              <input
                type="text"
                required
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/images/properties/cluster-sukodono.webp"
                className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Galeri Foto Tambahan</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGallery())}
                  placeholder="/images/properties/... atau URL foto tambahan"
                  className="flex-1 bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddGallery}
                  className="px-3.5 py-2 bg-[#0e241f] border border-[#16362f] hover:bg-[#16362f] text-white font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>
              <div className="space-y-1">
                {(formData.galleryImages || []).map((url, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#050b0a] border border-[#16362f] text-[11px]"
                  >
                    <span className="truncate max-w-md text-white/70">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGallery(idx)}
                      className="text-white/40 hover:text-rose-400 shrink-0 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 8: Konsultan PIC Agen */}
          <div>
            <label className="block font-bold text-white mb-1">Konsultan PIC Pendamping</label>
            <select
              value={formData.assignedAgentId || 'mbak-ningsih'}
              onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
              className="w-full bg-[#050b0a] border border-[#16362f] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role}) - Spesialis {ag.citySpecialist}
                </option>
              ))}
            </select>
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
              data-testid="btn-submit-cluster"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050b0a] font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Klaster</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
