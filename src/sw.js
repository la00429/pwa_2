let useCat = false;
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    // Cache a cat SVG
    event.waitUntil(
        caches
            .open('cacheApp')
            .then(cache => cache.add('./img/cat.svg'))
    );
});
self.addEventListener('activate', event => {
    console.log('Service Worker now ready to handle fetches!');
});
self.addEventListener('message', event => {
    if (event.data.action === 'switchToCat') {
        useCat = true;
    }
});
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname.includes('dog.svg') && useCat) {
        event.respondWith(
            caches.match('./img/cat.svg')
        );
    } else {
        event.respondWith(
            fetch(event.request)
        );
    }
});