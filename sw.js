'use strict';

const CACHE_NAME = 'nechtonam-github-v324';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './ntn-favicon-32-pink-symbol-v157.png',
  './ntn-logo-clean-v122.png',
  './ntn-apple-touch-icon-180-pink-symbol-v157.png',
  './contact-form.js',
  './site-nav.js',
  './minimum-dialog.js',
  './supplies-flow.js',
  './v142-luxury-scenes.js',
  './v279-room-tasks-premium.js',
  './v102-theme.css',
  './v103-minimum-dialog.css',
  './v106-supplies.css',
  './v142-luxury-scenes.css',
  './v211-room-tasks.css',
  './v234-midnight-velvet.css',
  './v261-room-page.css',
  './v279-room-tasks-premium.css',
  './v281-task-info.css',
  './v301-stabilizer.css',
  './intro-midnight-velvet-v265.webp',
  './property-screen-v237.jpeg',
  './room-background-v256.webp',
  './task-background-v274.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(CORE.map(url => cache.add(new Request(url, {cache:'reload'})).catch(() => null))))
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

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, {cache:'no-store'})
        .then(response => {
          if (response.ok) {
            const copy=response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(request, {cache:'no-store'})
      .then(response => {
        if (response.ok) {
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
