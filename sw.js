const CACHE_NAME = 'elmirador-v2';
const ASSETS = [
  '/Contabilidad_comida-rapida/',
  '/Contabilidad_comida-rapida/index.html',
  '/Contabilidad_comida-rapida/manifest.json',
  '/Contabilidad_comida-rapida/icon-192.png',
  '/Contabilidad_comida-rapida/icon-512.png'
];

// Instalar y cachear archivos principales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar y limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: Network first, fallback a caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
