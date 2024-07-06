const CACHE_NAME = 'where-is-it-v1';
const urlsToCache = [
  '/wit/pages/index.html',
  '/wit/css/style.css',
  '/wit/js/script.js',
  '/wit/img/icon-192x192.png',
  '/wit/img/icon-512x512.png',
  '/wit/img/apple-icon.png',
  '/wit/manifest.json'
];

// Installation du service worker et mise en cache des fichiers essentiels
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker et nettoyage des caches obsolètes
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes et gestion du cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; 
        }
        return fetch(event.request); 
      })
  );
});
