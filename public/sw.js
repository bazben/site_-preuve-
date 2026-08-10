


// Cashe
const CACH_NAME = 'bazben-cashe-v1';
const urls = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Installation
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACH_NAME)
        .then(cache => cache.addAll(urls))
    );
    self.skipWaiting();
});

// Activation
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// Activation
self.addEventListener('fetch', event => {
   event.respondWith(
   caches.match(event.request)
       .then(response => response || fetch(event.request))
   ); 
});
