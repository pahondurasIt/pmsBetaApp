// AuthContext.jsx - Contexto para manejar el estado de autenticación
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize logout function (moved up for use in other functions)
  const logout = useCallback(() => {
    sessionStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Memoize isAuthenticated function
  const isAuthenticated = useCallback((requiredModule = null) => {
    const storedToken = sessionStorage.getItem('authToken');
    const storedUser = sessionStorage.getItem('userData');

    if (!storedToken || !storedUser) {
      return false;
    }

    try {
      if (typeof storedToken !== 'string' || storedToken.split('.').length !== 3) {
        return false;
      }

      // Check for valid Base64 string before decoding
      const base64Payload = storedToken.split('.')[1];
      if (!base64Payload || !/^[A-Za-z0-9+/=]+$/.test(base64Payload)) {
        return false;
      }

      const tokenData = JSON.parse(atob(base64Payload));
      const currentTime = Date.now() / 1000;

      if (tokenData.exp < currentTime) {
        return false;
      }

      if (requiredModule && tokenData.module !== requiredModule) {
        return false;
      }

      return true;
    } catch (error) {
      // console.error('AuthContext: Error al verificar autenticación:', error);
      // If there's an error decoding or parsing, it's likely a corrupted token.
      logout(); // Invalidate session on error
      return false;
    }
  }, [logout]); // logout is a dependency now

  // Memoize login function
  const login = useCallback((userData, newToken, selectedCountry, selectedCompany) => {
    sessionStorage.setItem('authToken', newToken);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    // Ensure selectedCountry and selectedCompany are always stored as JSON strings
    sessionStorage.setItem('selectedCountry', JSON.stringify(selectedCountry || null));
    sessionStorage.setItem('selectedCompany', JSON.stringify(selectedCompany || null));
    setToken(newToken);
    setUser({ ...userData, selectedCountry, selectedCompany });
    setIsLoading(false);
  }, []);

  // Initial Authentication State Setup
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true); // Start loading state
      const storedToken = sessionStorage.getItem('authToken');
      const storedUser = sessionStorage.getItem('userData');
      const storedCountry = sessionStorage.getItem('selectedCountry');
      const storedCompany = sessionStorage.getItem('selectedCompany');

      if (storedToken && storedUser) {
        try {
          if (typeof storedToken !== 'string' || storedToken.split('.').length !== 3) {
            logout();
            return;
          }

          const base64Payload = storedToken.split('.')[1];
          if (!base64Payload || !/^[A-Za-z0-9+/=]+$/.test(base64Payload)) {
            logout();
            return;
          }

          const tokenData = JSON.parse(atob(base64Payload));
          const currentTime = Date.now() / 1000;

          if (tokenData.exp > currentTime) {
            try {
              const userData = JSON.parse(storedUser);
              // Parse storedCountry and storedCompany, handle null explicitly
              const country = storedCountry ? JSON.parse(storedCountry) : null;
              const company = storedCompany ? JSON.parse(storedCompany) : null;
              setUser({ ...userData, selectedCountry: country, selectedCompany: company });
              setToken(storedToken);
              // console.log('AuthContext: Sesión restaurada con token existente.');
            } catch (parseError) {
              // console.error('AuthContext: Error al parsear userData o selected data:', parseError);
              logout();
            }
          } else {
            // console.log('AuthContext: Token expirado.');
            logout();
          }
        } catch (error) {
          // console.error('AuthContext: Error al verificar o decodificar token:', error);
          logout();
        }
      } else {
        // console.log('AuthContext: No hay token o datos de usuario almacenados.');
        logout(); // Ensure consistent state if partial data exists
      }
      setIsLoading(false); // End loading state
    };

    initializeAuth();
  }, [logout]); // logout is a dependency

  // Getters for external components
  const getAuthToken = useCallback(() => token, [token]);
  const getCurrentUser = useCallback(() => user, [user]);

  // Update user data
  const updateUser = useCallback((updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      sessionStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (error) {
      console.error('AuthContext: Error al actualizar datos de usuario:', error);
      throw error;
    }
  }, [user]);

  // Role and Permission checks
  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) || user?.role === role;
  }, [user]);

  const hasPermission = useCallback((permission) => {
    return user?.permissions?.includes(permission);
  }, [user]);

  // Memoize the entire context value
  const contextValue = useMemo(() => ({
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
    hasPermission
  }), [user, token, isLoading, login, logout, isAuthenticated, getAuthToken, getCurrentUser, updateUser, hasRole, hasPermission]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};