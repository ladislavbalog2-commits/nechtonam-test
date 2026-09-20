'use strict';

const CACHE_NAME = 'nechtonam-v301';
const CORE = [
  "/assets/v305-account-fix.css?v=301",
  "/v305-account-fix.js?v=301",
  "/",
  "/index.html",
  "/manifest.webmanifest?v=235",
  "/assets/images/ntn-favicon-32-pink-symbol-v157.png?v=157",
  "/assets/images/ntn-logo-clean-v122.png",
  "/assets/images/ntn-apple-touch-icon-180-pink-symbol-v157.png?v=157",
  "/contact-form.js?v=193",
  "/assets/v102-theme.css?v=102",
  "/assets/v103-minimum-dialog.css?v=134-ios-keyboard-stable",
  "/assets/v106-supplies.css?v=134-ios-keyboard-stable",
  "/site-nav.js?v=164-customer-buttons-r1",
  "/minimum-dialog.js?v=103",
  "/supplies-flow.js?v=299-skip-empty-equipment",
  "/assets/v142-luxury-scenes.css?v=144",
  "/v142-luxury-scenes.js?v=275",
  "/assets/v211-room-tasks.css?v=213",
  "/assets/v234-midnight-velvet.css?v=265",
  "/assets/v261-room-page.css?v=255",
  "/assets/v279-room-tasks-premium.css?v=279",
  "/assets/v279-room-tasks-premium.js?v=279",
  "/assets/images/intro-midnight-velvet-v265.webp",
  "/assets/images/property-screen-v237.jpeg",
  "/assets/images/room-background-v256.webp",
  "/assets/images/task-background-v274.jpg",
  "/assets/images/city-photo-chomutov-v232.webp",
  "/assets/images/city-photo-jirkov-v232.webp",
  "/assets/images/city-photo-kadan-v232.webp",
  "/assets/images/city-photo-klasterec-v232.webp"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE.map(path => new Request(path, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.endsWith('.php')) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response.ok && !url.search) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  const freshShell = url.pathname === '/index.html'
    || url.pathname === '/manifest.webmanifest'
    || url.pathname === '/sw.js';
  if (freshShell) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
