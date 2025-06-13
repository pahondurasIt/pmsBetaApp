// ProtectedRoute.jsx - Componente optimizado para proteger rutas que requieren autenticación
import React, { useMemo, useRef, useEffect } from 'react'; // Added useEffect
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Usar useRef para controlar si ya se mostró el log de acceso autorizado
  const hasLoggedAccess = useRef(false);

  // Componente de carga memoizado para evitar re-renderizados
  const LoadingComponent = useMemo(() => (
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
        }}
      >
        Cargando datos de usuario...
      </Typography>
    </Box>
  ), []); // No dependencies needed as it's static UI

  // Effect to reset hasLoggedAccess when authentication status might change significantly
  // This ensures the "Acceso autorizado" log appears only once per successful authentication cycle
  useEffect(() => {
    if (!isAuthenticated()) {
      hasLoggedAccess.current = false; // Reset if not authenticated
    }
  }, [isAuthenticated]); // Re-run if isAuthenticated function reference changes (shouldn't much now)

  if (isLoading) {
    // console.log('ProtectedRoute: isLoading is true, showing loading component.');
    return LoadingComponent;
  }

  // Verificar autenticación de forma simple y directa
  const isUserAuthenticated = isAuthenticated();
  const hasUserData = !!user;

  // console.log('ProtectedRoute: isUserAuthenticated =', isUserAuthenticated, ', hasUserData =', hasUserData);
  // console.log('ProtectedRoute: user =', user);
  // console.log('ProtectedRoute: location.pathname =', location.pathname);

  // Si no está autenticado o no tiene datos de usuario, redirigir al login
  if (!isUserAuthenticated || !hasUserData) {
    // Resetear el flag de log cuando se pierde la autenticación
    hasLoggedAccess.current = false; // Redundant now due to useEffect, but safe to keep

    console.log('ProtectedRoute: Usuario no autenticado o datos incompletos, redirigiendo al login');

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

  // Log de acceso autorizado solo UNA VEZ por sesión
  if (!hasLoggedAccess.current) {
    console.log('ProtectedRoute: Acceso autorizado para usuario:', user.username || user.email);
    hasLoggedAccess.current = true;
  }

  // Renderizar children si todo está correcto
  // console.log('ProtectedRoute: Renderizando children para ruta:', location.pathname);
  return children;
};

export default ProtectedRoute;