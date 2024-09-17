self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('dashboard-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/css/style.css',
                '/assets/image192.js',
                '/assets/image520.png',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
