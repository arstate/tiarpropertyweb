'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Check, Image as ImageIcon, Sliders, RefreshCw, Sparkles } from 'lucide-react';

export function AdminImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.82);
  const [maxWidth, setMaxWidth] = useState<number>(1200);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File, q: number, maxW: number) => {
    setIsProcessing(true);
    setOriginalFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setOriginalPreview(src);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const webpUrl = canvas.toDataURL('image/webp', q);
        setCompressedDataUrl(webpUrl);

        // Approximate byte size of base64
        const head = 'data:image/webp;base64,';
        const base64Len = webpUrl.length - head.length;
        const sizeInBytes = Math.round((base64Len * 3) / 4);
        setCompressedSize(sizeInBytes);
        setIsProcessing(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file, quality, maxWidth);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalFile) {
      processImage(originalFile, newQ, maxWidth);
    }
  };

  const handleMaxWidthChange = (newMaxW: number) => {
    setMaxWidth(newMaxW);
    if (originalFile) {
      processImage(originalFile, quality, newMaxW);
    }
  };

  const handleDownload = () => {
    if (!compressedDataUrl) return;
    const link = document.createElement('a');
    const originalName = originalFile?.name.replace(/\.[^/.]+$/, '') || 'tiar-property-asset';
    link.download = `${originalName}-optimized.webp`;
    link.href = compressedDataUrl;
    link.click();
  };

  const handleCopyDataUrl = () => {
    if (!compressedDataUrl) return;
    navigator.clipboard.writeText(compressedDataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb >= 1024) {
      return `${(kb / 1024).toFixed(2)} MB`;
    }
    return `${kb.toFixed(1)} KB`;
  };

  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <div className="bg-[#081613] border border-[#16362f] rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#16362f]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ImageIcon className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Studio Kompresi WebP Canvas Client-Side
            </h3>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Optimasi foto klaster rumah & profil agen ke format WebP super cepat tanpa membebani server/Vercel bandwith.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#0e241f] border border-[#16362f] text-emerald-400 text-xs font-mono font-bold">
            100% Client Browser
          </span>
        </div>
      </div>

      {/* Upload Zone & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload Dropzone */}
        <div className="lg:col-span-1 space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#16362f] hover:border-[#5d8b7b] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#050b0a]/50 hover:bg-[#0e241f]/30 min-h-[220px]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-[#0e241f] border border-[#16362f] flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-white">
              Klik atau Drag & Drop Foto Rumah
            </p>
            <p className="text-[11px] text-white/50 mt-1">
              JPG, PNG, atau WEBP hingga 10 MB
            </p>
          </div>

          {/* Preset Controls */}
          <div className="bg-[#050b0a] border border-[#16362f] rounded-xl p-4 space-y-4 text-xs">
            <div className="flex items-center justify-between font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kualitas WebP</span>
              </span>
              <span className="font-mono text-emerald-400">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={quality}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            <div className="pt-2 border-t border-[#16362f]">
              <div className="flex items-center justify-between font-bold text-white mb-2">
                <span>Lebar Maksimal (px)</span>
                <span className="font-mono text-emerald-400">{maxWidth} px</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[800, 1200, 1600].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleMaxWidthChange(w)}
                    className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                      maxWidth === w
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-[#0e241f] border-[#16362f] text-white/70 hover:bg-[#16362f]'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comparison & Output Preview */}
        <div className="lg:col-span-2">
          {compressedDataUrl ? (
            <div className="space-y-4">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 bg-[#050b0a] border border-[#16362f] rounded-xl p-3.5 text-center">
                <div>
                  <span className="text-[10px] text-white/50 uppercase font-bold">Ukuran Asli</span>
                  <p className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
                    {formatSize(originalSize)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400/80 uppercase font-bold">Hasil WebP</span>
                  <p className="text-sm sm:text-base font-mono font-bold text-emerald-400 mt-0.5">
                    {formatSize(compressedSize)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-amber-400/80 uppercase font-bold">Penghematan</span>
                  <p className="text-sm sm:text-base font-mono font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{savingsPercent > 0 ? `-${savingsPercent}%` : 'Optimal'}</span>
                  </p>
                </div>
              </div>

              {/* Image Preview Box */}
              <div className="relative rounded-2xl overflow-hidden border border-[#16362f] bg-[#050b0a] aspect-video flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compressedDataUrl}
                  alt="WebP Preview"
                  className="w-full h-full object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-2 text-white text-xs font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Memproses WebP...</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050b0a] font-black text-xs transition-all shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .WebP</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDataUrl}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e241f] border border-[#16362f] text-white hover:bg-[#16362f] font-bold text-xs transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Base64 Data URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-[#16362f] rounded-2xl bg-[#050b0a]/30 h-[280px] flex flex-col items-center justify-center text-center p-6 text-white/50">
              <ImageIcon className="w-12 h-12 stroke-[1.2] mb-3 text-white/30" />
              <p className="text-xs sm:text-sm font-semibold">Belum ada foto yang dipilih</p>
              <p className="text-[11px] text-white/40 mt-1 max-w-sm">
                Unggah foto tampak depan perumahan atau foto profil agen untuk melihat hasil kompresi WebP otomatis secara real-time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
