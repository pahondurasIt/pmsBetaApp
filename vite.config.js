import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      disable: process.env.NODE_ENV === 'development', // Deshabilitar PWA en desarrollo
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
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      devOptions: {
        enabled: false, // Deshabilitar SW en desarrollo
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
    // Evitar caché agresivo en builds
    rollupOptions: {
      output: {
        // Añadir hash a los archivos para evitar caché
        manualChunks: undefined,
      },
    },
  },
});
