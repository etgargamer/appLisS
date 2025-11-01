const CACHE_NAME = 'appliss-cache-v3.9.0'; 

// Archivos esenciales que la aplicación necesita para funcionar offline
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'assets/css/style.css',
  'assets/js/app.js',
  'assets/img/logo-icon.png' // Asumiendo que esta imagen es el ícono y logo principal
];

// Instalar Service Worker (Cargar todos los archivos a la caché)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar Service Worker (Limpiar cachés antiguas)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch (Servir archivos desde la caché primero)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Sirve el archivo desde la caché si está disponible
        if (response) {
          return response;
        }
        
        // Si no está en caché, va a la red
        return fetch(event.request);
      }
    )
  );
});
