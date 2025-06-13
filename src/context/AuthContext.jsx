// AuthContext.jsx - Contexto para manejar el estado de autenticación
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Componente proveedor del contexto de autenticación
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let initializationTimeout;
    
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("userData");
        const storedCountry = localStorage.getItem("selectedCountry");
        const storedCompany = localStorage.getItem("selectedCompany");
        
        if (storedToken && storedUser) {
          const tokenData = JSON.parse(atob(storedToken.split(".")[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenData.exp > currentTime) {
            const userData = JSON.parse(storedUser);
            
            if (storedCountry && storedCompany) {
              userData.selectedCountry = JSON.parse(storedCountry);
              userData.selectedCompany = JSON.parse(storedCompany);
            }
            
            setToken(storedToken);
            setUser(userData);
            
            if (window.apipms) {
              window.apipms.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            }
          } else {
            clearStoredAuthData();
          }
        }
      } catch (error) {
        console.error("Error al verificar token almacenado:", error);
        clearStoredAuthData();
      } finally {
        initializationTimeout = setTimeout(() => {
          setIsLoading(false);
        }, 500); // Mínimo 500ms para que el loader sea visible
      }
    };

    initializeAuth();
    
    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
    };
  }, []); // Empty dependency array to run only once on mount

  const clearStoredAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedCountry');
    localStorage.removeItem('selectedCompany');
    
    if (window.apipms) {
      delete window.apipms.defaults.headers.common['Authorization'];
    }
  };

  const login = (userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      if (userData.selectedCountry) {
        localStorage.setItem("selectedCountry", JSON.stringify(userData.selectedCountry));
      }
      if (userData.selectedCompany) {
        localStorage.setItem("selectedCompany", JSON.stringify(userData.selectedCompany));
      }
      
      if (window.apipms) {
        window.apipms.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      }
      
      console.log("Login exitoso:", userData.username || userData.email);
    } catch (error) {
      console.error("Error durante el login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Cerrando sesión para usuario:", user?.username || user?.email);
      setUser(null);
      setToken(null);
      clearStoredAuthData();
      console.log("Sesión cerrada exitosamente");
      
    } catch (error) {
      console.error("Error al cerrar sesión en el backend:", error);
      setUser(null);
      setToken(null);
      clearStoredAuthData();
    }
  };

  const isAuthenticated = () => {
    if (!token || !user) {
      return false;
    }
    
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      
      // Agregar un buffer de 30 segundos antes de la expiración para evitar problemas de timing
      const bufferTime = 30; // 30 segundos de buffer
      
      if (tokenData.exp <= (currentTime + bufferTime)) {
        console.log("Token próximo a expirar o expirado. Expiración:", new Date(tokenData.exp * 1000), "Actual:", new Date(currentTime * 1000));
        logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      return false;
    }
  };

  const getAuthToken = () => {
    return token;
  };

  const getCurrentUser = () => {
    return user;
  };

  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem("userData", JSON.stringify(newUserData));
      console.log("Datos de usuario actualizados");
    } catch (error) {
      console.error("Error al actualizar datos de usuario:", error);
      throw error;
    }
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || user?.role === role;
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
    getAuthToken,
    getCurrentUser,
    updateUser,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportar como named exports para compatibilidad con HMR
export { useAuth, AuthProvider };
export default AuthProvider;

