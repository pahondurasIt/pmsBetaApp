// ProtectedRoute.jsx - Componente para proteger rutas que requieren autenticación
// Este componente actúa como un middleware de frontend que verifica la autenticación
// antes de permitir el acceso a rutas protegidas
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  // Obtener funciones y estados del contexto de autenticación
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Componente de loading personalizado
  const LoadingComponent = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: '#1976d2',
          marginBottom: 2 
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#666',
          fontWeight: 500,
          marginBottom: 1
        }}
      >
        Verificando autenticación...
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#999',
          textAlign: 'center',
          maxWidth: 300
        }}
      >
        Por favor espera mientras verificamos tus credenciales
      </Typography>
    </Box>
  );

  // Mostrar loading mientras se verifica la autenticación inicial
  // Esto es importante para evitar redirecciones innecesarias durante la carga
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    console.log('Usuario no autenticado, redirigiendo al login');
    
    // Guardar la ubicación actual para redirigir después del login
    // Esto permite que el usuario regrese a donde estaba después de autenticarse
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: 'Debes iniciar sesión para acceder a esta página'
        }} 
        replace 
      />
    );
  }

  // Verificación adicional: asegurar que los datos del usuario estén completos
  if (!user) {
    console.warn('Usuario autenticado pero sin datos de usuario');
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Hay un problema con los datos de tu sesión. Por favor, inicia sesión nuevamente.
        </Alert>
      </Box>
    );
  }

  // Si todo está correcto, mostrar el contenido protegido
  console.log('Acceso autorizado para usuario:', user.username || user.email);
  return children;
};

export default ProtectedRoute;

