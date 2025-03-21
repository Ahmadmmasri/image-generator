const CACHE_NAME = 'site-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/preview.jpg',
  '/index-multi.html',
  '/html2canvas.min.js',
];

// Install service worker and cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker and clean old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return the cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        // Otherwise fetch from the network
        return fetch(event.request);
      })
  );
});
