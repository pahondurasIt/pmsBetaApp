import React, { useState, useEffect } from 'react';
import { Alert, Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { swUpdateManager } from '../../helpers/serviceWorkerManager';

export const ServiceWorkerUpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState(null);
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    // No ejecutar en desarrollo
    if (isDevelopment) {
      console.log('Service Worker notifications deshabilitadas en desarrollo');
      return;
    }

    // Inicializar el manager
    swUpdateManager.init();

    // Configurar callbacks
    swUpdateManager.on('updateAvailable', () => {
      setUpdateAvailable(true);
      setShowDialog(true);
    });

    swUpdateManager.on('error', (error) => {
      setError(error?.message || 'Error en Service Worker');
    });

    swUpdateManager.on('updateInstalled', () => {
      console.log('Aplicación instalada correctamente');
    });

    // Verificar actualizaciones al montar el componente (solo en producción)
    const timeoutId = setTimeout(() => {
      swUpdateManager.checkForUpdates();
    }, 5000); // Esperar 5 segundos después de cargar

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isDevelopment]);

  const handleUpdateApp = () => {
    if (isDevelopment) return;
    setShowDialog(false);
    swUpdateManager.applyUpdate();
  };

  const handleDismiss = () => {
    setShowDialog(false);
    setUpdateAvailable(false);
  };

  const handleClearCache = async () => {
    try {
      await swUpdateManager.clearCache();
      window.location.reload();
    } catch (error) {
      console.error('Error al limpiar caché:', error);
    }
  };

  // No renderizar nada en desarrollo
  if (isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Dialog para actualización disponible */}
      <Dialog
        open={showDialog}
        onClose={handleDismiss}
        aria-labelledby="update-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="update-dialog-title">
          Nueva versión disponible
        </DialogTitle>
        <DialogContent>
          <p>
            Hay una nueva versión de la aplicación disponible. 
            ¿Te gustaría actualizar ahora para obtener las últimas mejoras y correcciones?
          </p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            La aplicación se recargará automáticamente después de la actualización.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDismiss} color="secondary">
            Más tarde
          </Button>
          <Button 
            onClick={handleUpdateApp} 
            color="primary" 
            variant="contained"
            autoFocus
          >
            Actualizar ahora
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para errores */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={handleClearCache}>
              Limpiar caché
            </Button>
          }
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Indicador de actualización en la esquina (opcional) */}
      {updateAvailable && !showDialog && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '14px'
          }}
          onClick={() => setShowDialog(true)}
        >
          📱 Nueva versión disponible - Clic para actualizar
        </div>
      )}
    </>
  );
};

export default ServiceWorkerUpdateNotification;
