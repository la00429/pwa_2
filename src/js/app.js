const img = new Image();
navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('SW registered!', reg))
    .catch(err => console.log(err));
setTimeout(() => {
    img.src = './img/dog.svg';
    document.body.appendChild(img);
}, 3000);
img.addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            action: 'switchToCat'
        });
        if (img.src.includes('cat.svg')) {
            img.src = './img/dog.svg';
        } else {
            img.src = './img/cat.svg?t=' + Date.now();
        }
        console.log('Click a la imagen mou');
    }
});