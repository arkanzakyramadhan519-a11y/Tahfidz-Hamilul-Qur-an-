const CACHE_NAME = 'tahfidz-hq-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate & Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Network First, fallback to cache
self.addEventListener('fetch', (event) => {
  // Jangan cache request ke Firebase / API eksternal agar data tetap real-time
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
