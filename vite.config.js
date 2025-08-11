import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        disable: isDev, // Deshabilitar completamente en desarrollo
        
        // Configuración del Service Worker
        filename: 'sw.js',
        strategies: 'generateSW',
        injectRegister: isDev ? false : 'auto', // No inyectar registro en desarrollo
        
        manifest: {
          name: "PMS App",
          short_name: "PMS",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#242424ff",
          icons: [
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        
        workbox: {
          // Solo aplicar en producción
          mode: isDev ? 'development' : 'production',
          
          // Archivos que se deben cachear al instalar la app
          globPatterns: [
            "**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"
          ],
          
          // Tamaño máximo de archivos a cachear
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
          
          // Configuración para forzar actualizaciones inmediatas
          skipWaiting: true,
          clientsClaim: true,
          
          // Limpiar caché antiguo automáticamente
          cleanupOutdatedCaches: true,
          
          // Archivos que NO se deben cachear
          dontCacheBustURLsMatching: /\.\w{8}\./,
          
          // Navegación offline fallback
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
          
          // Estrategias de caché específicas (solo en producción)
          runtimeCaching: isDev ? [] : [
            // Caché para API calls - siempre red primero
            {
              urlPattern: /^https?:\/\/.*\/api\/.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 5 * 60, // 5 minutos
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            
            // Fuentes de Google - caché primero
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            
            // Archivos de fuentes
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            
            // Imágenes - obsoleto mientras revalida
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
                },
              },
            },
            
            // Archivos JS y CSS - obsoleto mientras revalida para updates rápidos
            {
              urlPattern: /\.(?:js|css)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 24 * 60 * 60, // 1 día
                },
              },
            },
            
            // Documentos HTML - red primero para actualizaciones
            {
              urlPattern: /\.(?:html)$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 24 * 60 * 60, // 1 día
                },
              },
            },
          ],
        },
        
        devOptions: {
          enabled: false, // Siempre deshabilitar SW en desarrollo
        },
      }),
    ],
    
    server: {
      // Configuración para evitar caché en desarrollo
      headers: {
        'Cache-Control': 'no-store',
      },
    },
    
    build: {
      // Configuración de build para mejor manejo de caché
      rollupOptions: {
        output: {
          // Añadir hash a los archivos para cache busting
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks: undefined,
        },
      },
      
      // Generar source maps para debugging
      sourcemap: false, // Cambiar a true si necesitas debug en producción
    },
  };
});
