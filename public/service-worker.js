const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/logpms.png"
];

// Archivos iniciales para cachear
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache resources during install:', error);
      })
  );
  self.skipWaiting();
});

// Activación y limpieza de caches antiguos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME) {
              console.log('Deleting old cache:', key);
              return caches.delete(key);
            }
          })
        )
      )
      .catch(error => {
        console.error('Failed to clean up old caches:', error);
      })
  );
  self.clients.claim();
});

// Interceptar solicitudes
self.addEventListener("fetch", event => {
  // Solo interceptar requests HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos la respuesta en cache, la devolvemos
        if (response) {
          return response;
        }

        // Si no está en cache, intentamos fetching desde la red
        return fetch(event.request)
          .then(networkResponse => {
            // Verificar si recibimos una respuesta válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clonar la respuesta porque puede ser consumida solo una vez
            const responseToCache = networkResponse.clone();

            // Abrir cache y guardar la respuesta para futuras solicitudes
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(error => {
            console.log('Fetch failed; returning offline page instead.', error);
            
            // Si la solicitud es para una página HTML, podemos devolver una página offline
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Para otros tipos de recursos, simplemente rechazamos
            return new Response('Network error occurred', {
              status: 408,
              statusText: 'Network error occurred'
            });
          });
      })
  );
});
