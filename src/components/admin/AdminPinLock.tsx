'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface AdminPinLockProps {
  onUnlock: () => void;
}

export function AdminPinLock({ onUnlock }: AdminPinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validPins = ['2026', 'tiar2026', 'tiarprop2026'];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validPins.includes(pin.trim())) {
      sessionStorage.setItem('tiar_admin_auth', 'true');
      onUnlock();
    } else {
      setError(true);
      setErrorMsg('PIN / Passphrase salah. Coba lagi.');
      setPin('');
      setTimeout(() => setError(false), 2500);
    }
  };

  const handleKeypad = (num: string) => {
    setError(false);
    setPin((prev) => {
      const nextPin = (prev + num).slice(0, 12);
      if (validPins.includes(nextPin)) {
        sessionStorage.setItem('tiar_admin_auth', 'true');
        onUnlock();
      }
      return nextPin;
    });
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-[#050b0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#081613] border border-[#16362f] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#5d8b7b] to-transparent" />

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0e241f] border border-[#16362f] text-[#dde8e2] mb-3.5 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Portal Admin Tiar Property
          </h1>
          <p className="text-xs text-white/70 mt-1.5">
            Area operasional & manajemen klaster perumahan internal
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="Masukkan PIN / Passphrase..."
              autoFocus
              className={`w-full bg-[#050b0a] border ${
                error ? 'border-rose-500' : 'border-[#16362f]'
              } rounded-xl px-4 py-3.5 text-center text-lg sm:text-xl font-mono text-white tracking-widest placeholder:text-white/30 placeholder:tracking-normal focus:outline-none focus:border-[#5d8b7b] transition-all`}
            />
            <KeyRound className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-medium py-1 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#050b0a] font-black text-sm py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Buka Akses Admin</span>
          </button>
        </form>

        {/* Quick Numeric Keypad for Mobile / Fast Access */}
        <div className="mt-6 pt-5 border-t border-[#16362f]">
          <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypad(digit)}
                className="h-11 rounded-xl bg-[#0e241f]/70 border border-[#16362f] text-white font-mono text-base font-bold hover:bg-[#16362f] active:scale-95 transition-all"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="h-11 rounded-xl bg-[#0e241f]/40 border border-[#16362f] text-white/60 font-mono text-xs font-medium hover:bg-[#16362f] active:scale-95 transition-all"
            >
              CLEAR
            </button>
            <button
              type="button"
              onClick={() => handleKeypad('0')}
              className="h-11 rounded-xl bg-[#0e241f]/70 border border-[#16362f] text-white font-mono text-base font-bold hover:bg-[#16362f] active:scale-95 transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-[#0e241f]/40 border border-[#16362f] text-white/60 font-mono text-xs font-medium hover:bg-[#16362f] active:scale-95 transition-all"
            >
              ⌫
            </button>
          </div>
          <p className="text-[11px] text-center text-white/40 mt-3.5">
            Default PIN internal: <span className="font-mono text-emerald-400">2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
