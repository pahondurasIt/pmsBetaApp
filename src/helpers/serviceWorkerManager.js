// Helper para manejar actualizaciones del Service Worker
// Este archivo te permite controlar las actualizaciones desde tu app React

export class ServiceWorkerUpdateManager {
  constructor() {
    this.registration = null;
    this.updateAvailable = false;
    this.callbacks = {
      updateAvailable: [],
      updateInstalled: [],
      error: []
    };
    this.isDevelopment = import.meta.env.DEV;
  }

  // Inicializar el manager
  async init() {
    // No registrar Service Worker en desarrollo
    if (this.isDevelopment) {
      console.log('Service Worker deshabilitado en desarrollo');
      return;
    }

    if ('serviceWorker' in navigator) {
      try {
        // Verificar si el archivo del service worker existe antes de registrarlo
        const response = await fetch('/sw.js', { method: 'HEAD' });
        if (!response.ok) {
          console.log('Service Worker no encontrado, probablemente en desarrollo');
          return;
        }

        // Registrar el service worker solo si existe
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registrado exitosamente');

        // Escuchar actualizaciones
        this.registration.addEventListener('updatefound', () => {
          this.handleUpdateFound();
        });

        // Verificar si ya hay una actualización disponible
        if (this.registration.waiting) {
          this.handleUpdateAvailable();
        }

        // Verificar actualizaciones periódicamente (cada 30 minutos)
        setInterval(() => {
          this.checkForUpdates();
        }, 30 * 60 * 1000);

      } catch (error) {
        console.log('Service Worker no disponible:', error.message);
        // No notificar como error en desarrollo
        if (!this.isDevelopment) {
          this.notifyCallbacks('error', error);
        }
      }
    } else {
      console.log('Service Workers no soportados por este navegador');
    }
  }

  // Verificar actualizaciones manualmente
  async checkForUpdates() {
    if (this.isDevelopment || !this.registration) {
      return;
    }
    
    try {
      await this.registration.update();
      console.log('Verificación de actualización completada');
    } catch (error) {
      console.error('Error al verificar actualizaciones:', error);
    }
  }

  // Aplicar actualización inmediatamente
  applyUpdate() {
    if (this.registration && this.registration.waiting) {
      // Enviar mensaje al SW para que se active inmediatamente
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Recargar la página después de que el nuevo SW tome control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  // Manejar cuando se encuentra una actualización
  handleUpdateFound() {
    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // Nueva versión disponible
          this.handleUpdateAvailable();
        } else {
          // Primera instalación
          console.log('Service Worker instalado por primera vez');
          this.notifyCallbacks('updateInstalled');
        }
      }
    });
  }

  // Manejar cuando hay una actualización disponible
  handleUpdateAvailable() {
    this.updateAvailable = true;
    console.log('Nueva versión de la aplicación disponible');
    this.notifyCallbacks('updateAvailable');
  }

  // Agregar callback para eventos
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  // Notificar a los callbacks
  notifyCallbacks(event, data = null) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  // Obtener información del SW
  async getInfo() {
    if (this.isDevelopment) {
      return {
        updateAvailable: false,
        scope: null,
        active: false,
        waiting: false,
        isDevelopment: true
      };
    }

    if (this.registration) {
      return {
        updateAvailable: this.updateAvailable,
        scope: this.registration.scope,
        active: !!this.registration.active,
        waiting: !!this.registration.waiting,
        isDevelopment: false
      };
    }
    return null;
  }

  // Limpiar caché manualmente
  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('Limpiando caché:', cacheName);
          return caches.delete(cacheName);
        })
      );
      console.log('Caché limpiado completamente');
    }
  }

  // Desregistrar service worker (para casos extremos)
  async unregister() {
    if (this.registration) {
      const result = await this.registration.unregister();
      console.log('Service Worker desregistrado:', result);
      return result;
    }
    return false;
  }
}

// Crear instancia singleton
export const swUpdateManager = new ServiceWorkerUpdateManager();

// Hook de React para usar el manager
export const useServiceWorkerUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // No inicializar en desarrollo
    if (import.meta.env.DEV) {
      console.log('Service Worker hooks deshabilitados en desarrollo');
      return;
    }

    // Inicializar el manager
    swUpdateManager.init();

    // Configurar callbacks
    swUpdateManager.on('updateAvailable', () => {
      setUpdateAvailable(true);
    });

    swUpdateManager.on('error', (error) => {
      setError(error);
    });

    return () => {
      // Cleanup si es necesario
    };
  }, []);

  const applyUpdate = () => {
    if (import.meta.env.DEV) return;
    swUpdateManager.applyUpdate();
  };

  const checkForUpdates = () => {
    if (import.meta.env.DEV) return;
    swUpdateManager.checkForUpdates();
  };

  const clearCache = () => {
    swUpdateManager.clearCache();
  };

  return {
    updateAvailable,
    error,
    applyUpdate,
    checkForUpdates,
    clearCache,
    isDevelopment: import.meta.env.DEV
  };
};
