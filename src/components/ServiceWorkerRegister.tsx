'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Pastikan Service Worker didukung browser dan hanya aktif di mode production
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Segera periksa update SW di server agar cache versi baru langsung terdeteksi
          registration.update().catch(() => {});

          // Monitor background update
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('[SW] Versi baru tersedia di background.');
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[SW] Pendaftaran Service Worker gagal:', error);
        });
    };

    // Anti-race condition guard:
    // Jika React hidrasi selesai setelah window onload ('complete'), daftarkan langsung.
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => window.removeEventListener('load', registerSW);
    }
  }, []);

  return null;
}
