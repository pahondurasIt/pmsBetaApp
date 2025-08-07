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
import { ToastProvider } from './context/ToastContext.jsx';
import 'rsuite/dist/rsuite.min.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <ThemeProvider theme={BlackTheme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  </React.StrictMode>
);

