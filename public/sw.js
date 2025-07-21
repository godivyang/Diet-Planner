self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(self.skipWaiting()); // Activate immediately
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  return self.clients.claim();
});