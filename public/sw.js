// public/sw.js - PWA Service Worker Anti-Crash & Zero-Bandwidth
const CACHE_NAME = 'tiar-property-bandwidth-v7';

// Pre-cache root page pada saat instalasi
const PRECACHE_ASSETS = ['/'];

// 1. Install Event: Pre-cache aset esensial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Bersihkan cache versi usang & ambil alih client
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intercept request & serve from cache
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Hanya tangani GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Guard bypass: Jangan pernah cache file Service Worker itu sendiri
  if (url.pathname === '/sw.js') return;

  // Pola 1: Static Chunks Next.js, Media, Fonts, dan Gambar Unsplash -> CACHE-FIRST
  const isLocalStatic = (url.origin === self.location.origin) && (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(woff2|woff|ttf|eot|png|jpg|jpeg|webp|avif|svg|ico|css|js)$/)
  );
  const isUnsplash = url.hostname.includes('unsplash.com');

  if (isLocalStatic || isUnsplash) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn('[SW] Fetch error for static asset:', request.url, err);
            return new Response('', { status: 408, statusText: 'Request Timed Out / Offline' });
          });
      })
    );
    return;
  }

  // Jangan tangani cross-origin tracking external (Meta Pixel, Google Analytics, dll.)
  if (url.origin !== self.location.origin) return;

  // Pola 2: Halaman Navigasi / HTML -> TRUE STALE-WHILE-REVALIDATE
  // ignoreSearch: true wajib agar URL iklan (?fbclid=..., ?gclid=...) disajikan instan
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
        // Background fetch untuk revalidasi cache tanpa memblokir rendering
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(url.pathname, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            return (
              cachedResponse ||
              (await caches.match('/', { ignoreSearch: true })) ||
              new Response('Offline', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' },
              })
            );
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
