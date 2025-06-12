// AuthContext.jsx - Contexto para manejar el estado de autenticación
// Este archivo maneja todo el estado global de autenticación de la aplicación
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
// Este hook facilita el acceso al contexto desde cualquier componente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Estados principales del contexto de autenticación
  const [user, setUser] = useState(null);           // Datos del usuario autenticado
  const [token, setToken] = useState(null);         // Token JWT de autenticación
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial

  // Efecto que se ejecuta al cargar la aplicación
  // Verifica si hay datos de sesión guardados en localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Obtener datos guardados del localStorage
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('userData');
        const storedCountry = localStorage.getItem('selectedCountry');
        const storedCompany = localStorage.getItem('selectedCompany');
        
        // Si existen token y datos de usuario guardados
        if (storedToken && storedUser) {
          // Verificar si el token JWT no ha expirado
          const tokenData = JSON.parse(atob(storedToken.split('.')[1])); // Decodificar payload del JWT
          const currentTime = Date.now() / 1000; // Tiempo actual en segundos
          
          // Si el token aún es válido (no ha expirado)
          if (tokenData.exp > currentTime) {
            // Restaurar el estado de autenticación
            const userData = JSON.parse(storedUser);
            
            // Si hay datos de ubicación guardados, agregarlos al usuario
            if (storedCountry && storedCompany) {
              userData.selectedCountry = JSON.parse(storedCountry);
              userData.selectedCompany = JSON.parse(storedCompany);
            }
            
            setToken(storedToken);
            setUser(userData);
            
            // Configurar el header de autorización para futuras peticiones API
            // Esto asegura que todas las peticiones incluyan el token
            if (window.apipms) {
              window.apipms.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
          } else {
            // Token expirado, limpiar todo el almacenamiento
            clearStoredAuthData();
          }
        }
      } catch (error) {
        // Si hay error al verificar el token, limpiar datos
        console.error('Error al verificar token almacenado:', error);
        clearStoredAuthData();
      } finally {
        // Terminar el estado de carga
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función auxiliar para limpiar todos los datos de autenticación del localStorage
  const clearStoredAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedCountry');
    localStorage.removeItem('selectedCompany');
    
    // Limpiar header de autorización
    if (window.apipms) {
      delete window.apipms.defaults.headers.common['Authorization'];
    }
  };

  // Función para iniciar sesión
  // Se llama desde LoginPage cuando el usuario se autentica exitosamente
  const login = (userData, authToken) => {
    try {
      // Actualizar el estado del contexto
      setUser(userData);
      setToken(authToken);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Si hay datos de ubicación en userData, guardarlos también
      if (userData.selectedCountry) {
        localStorage.setItem('selectedCountry', JSON.stringify(userData.selectedCountry));
      }
      if (userData.selectedCompany) {
        localStorage.setItem('selectedCompany', JSON.stringify(userData.selectedCompany));
      }
      
      // Configurar header de autorización para futuras peticiones
      if (window.apipms) {
        window.apipms.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      }
      
      console.log('Login exitoso:', userData.username || userData.email);
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  // Esta función limpia completamente el estado de autenticación
  const logout = async () => {
    try {
      // Opcional: Llamar al endpoint de logout del backend
      // if (token && window.apipms) {
      //   await window.apipms.post('/auth/logout');
      // }
      
      console.log('Cerrando sesión para usuario:', user?.username || user?.email);
      
      // Limpiar el estado del contexto
      setUser(null);
      setToken(null);
      
      // Limpiar todos los datos del localStorage
      clearStoredAuthData();
      
      console.log('Sesión cerrada exitosamente');
      
    } catch (error) {
      // Incluso si hay error en el backend, limpiar el estado local
      console.error('Error al cerrar sesión en el backend:', error);
      
      // Forzar limpieza local
      setUser(null);
      setToken(null);
      clearStoredAuthData();
    }
  };

  // Función para verificar si el usuario está autenticado
  // Verifica tanto el token como los datos del usuario
  const isAuthenticated = () => {
    // Verificación básica de existencia de token y usuario
    if (!token || !user) {
      return false;
    }
    
    try {
      // Verificación adicional de expiración del token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Si el token ha expirado, limpiar datos y retornar false
      if (tokenData.exp <= currentTime) {
        logout(); // Limpiar datos expirados
        return false;
      }
      
      return true;
    } catch (error) {
      // Si hay error al verificar el token, considerar no autenticado
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  };

  // Función para obtener el token para peticiones API
  // Útil para componentes que necesiten hacer peticiones autenticadas
  const getAuthToken = () => {
    return token;
  };

  // Función para obtener datos del usuario actual
  const getCurrentUser = () => {
    return user;
  };

  // Función para actualizar datos del usuario (útil para actualizaciones de perfil)
  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem('userData', JSON.stringify(newUserData));
      console.log('Datos de usuario actualizados');
    } catch (error) {
      console.error('Error al actualizar datos de usuario:', error);
      throw error;
    }
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.roles?.includes(role) || user?.role === role;
  };

  // Función para verificar si el usuario tiene permisos específicos
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  // Objeto con todos los valores y funciones que estarán disponibles
  // para los componentes que usen este contexto
  const value = {
    // Estados
    user,                    // Datos del usuario actual
    token,                   // Token de autenticación
    isLoading,              // Estado de carga inicial
    
    // Funciones principales
    login,                  // Función para iniciar sesión
    logout,                 // Función para cerrar sesión
    isAuthenticated,        // Función para verificar autenticación
    
    // Funciones auxiliares
    getAuthToken,           // Obtener token actual
    getCurrentUser,         // Obtener datos del usuario
    updateUser,             // Actualizar datos del usuario
    hasRole,                // Verificar rol del usuario
    hasPermission,          // Verificar permisos del usuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

