// Configuración adicional para el Service Worker
// Este archivo se puede usar para lógica personalizada del SW

// Versión del caché para force updates
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `pms-app-${CACHE_VERSION}`;

// Lista de recursos críticos que siempre deben estar disponibles
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Configuración de timeouts
const NETWORK_TIMEOUT = 3000; // 3 segundos

// Función para limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Eliminar cachés que no coincidan con la versión actual
            return cacheName.startsWith('pms-app-') && cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Función para forzar actualización de la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_VERSION
    });
  }
});

// Exportar configuraciones para uso en el código principal
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CACHE_VERSION,
    CACHE_NAME,
    CRITICAL_RESOURCES,
    NETWORK_TIMEOUT
  };
}
