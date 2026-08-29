const img = new Image();
navigator.serviceWorker.register('sw.js', { scope: '../' })
    .then(reg => console.log('SW registered!', reg))
    .catch(err => console.log(err));

setTimeout(() => {
    img.src = './img/dog.svg';
    document.getElementById('dynamic-image-container').appendChild(img);
}, 3000);

img.addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            action: 'switchImage'
        });
        // Modificamos la URL para forzar al SW a intervenir y darnos la imagen nueva
        img.src = './img/dog.svg?t=' + Date.now();
        console.log('Click a la imagen mou');
    }
});