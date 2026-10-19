const CACHE = 'budgeting-static-v3-cloudflare';
const STATIC = ['offline.html', 'styles.css', 'icons/icon-192.png', 'icons/icon-512.png'].map(path => new URL(path, self.registration.scope).pathname);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // Always use the network for HTML and application JS, especially Firebase configuration.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(new URL('offline.html', self.registration.scope).pathname)));
    return;
  }
  const path = new URL(request.url).pathname;
  if (!STATIC.includes(path)) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
