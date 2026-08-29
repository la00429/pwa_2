let currentImageIndex = 0;
const images = ['./img/dog.svg', './img/cat.svg', './img/tucan.svg'];

self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open('cacheApp').then(cache => cache.addAll(images))
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker now ready to handle fetches!');
});

// Restauramos el evento message de tu código original de clase
self.addEventListener('message', event => {
    if (event.data.action === 'switchImage') {
        let newIndex;
        // Elegimos un índice aleatorio distinto al actual
        do {
            newIndex = Math.floor(Math.random() * images.length);
        } while (newIndex === currentImageIndex);

        currentImageIndex = newIndex;
    }
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname.includes('.svg')) {
        event.respondWith(
            caches.match(images[currentImageIndex]).then(res => res || fetch(images[currentImageIndex]))
        );
    }
});

// FUNCIONALIDAD ADICIONAL 1: Mostrar mensaje de "Sin Conexión" si falla la red al cargar HTML
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(
                    '<div style="text-align:center; padding:50px;"><h1>Estas sin conexion</h1><p>Por favor revisa tu red local o wifi.</p></div>',
                    { headers: { 'Content-Type': 'text/html' } }
                );
            })
        );
    }
});

// FUNCIONALIDAD ADICIONAL 2: Interceptar imágenes JPG/PNG rotas y mostrar el gato por defecto
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (event.request.destination === 'image' && !url.pathname.includes('.svg')) {
        event.respondWith(
            fetch(event.request).then(response => {
                if (!response.ok) {
                    return caches.match('./img/cat.svg'); // Fallback si es error 404
                }
                return response;
            }).catch(() => {
                return caches.match('./img/cat.svg'); // Fallback si no hay red
            })
        );
    }
});