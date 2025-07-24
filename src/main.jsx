import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BlackTheme } from './theme/BlackTheme.jsx';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { registerSW } from 'virtual:pwa-register';
registerSW();
// registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
// });

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={BlackTheme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('ServiceWorker registrado con éxito:', registration);
      },
      error => {
        console.error('Error al registrar el ServiceWorker:', error);
      }
    );
  });
}

