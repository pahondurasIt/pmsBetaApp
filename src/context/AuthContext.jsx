// AuthContext.jsx - Contexto para manejar el estado de autenticación (COMPLETO Y CORREGIDO)
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
  const [isLoading, setIsLoading] = useState(true); // Siempre comienza como true para la carga inicial

  // Memoize isAuthenticated function for stability
  const isAuthenticated = useCallback(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');

    if (!storedToken || !storedUser) {
      // console.log('AuthContext: isAuthenticated - No token or user in localStorage.');
      return false;
    }

    try {
      // Añadir un chequeo para asegurar que el token tiene el formato esperado antes de usar split
      if (typeof storedToken !== 'string' || storedToken.split('.').length !== 3) {
        console.error('AuthContext: Token almacenado no tiene el formato JWT esperado.');
        return false;
      }

      const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
      const currentTime = Date.now() / 1000;

      if (tokenData.exp <= currentTime) {
        // console.log('AuthContext: isAuthenticated - Token expired.');
        return false;
      }
      // console.log('AuthContext: isAuthenticated - Token valid and user data present.');
      return true;
    } catch (error) {
      console.error('AuthContext: Error al verificar autenticación (isAuthenticated):', error);
      // Si hay un error al decodificar (ej. InvalidCharacterError), limpiar el token inválido
      if (error.name === 'InvalidCharacterError') {
        console.warn('AuthContext: Token inválido detectado, limpiando almacenamiento local.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('selectedCountry');
        localStorage.removeItem('selectedCompany');
      }
      return false;
    }
  }, []); // Dependencies are stable (no external state dependencies)

  // Memoize login function
  const login = useCallback((userData, newToken, selectedCountry, selectedCompany) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
    localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
    setToken(newToken);
    setUser({ ...userData, selectedCountry, selectedCompany });
    setIsLoading(false); // Login means loading is complete
    // console.log('AuthContext: User logged in, state updated.');
  }, []);

  // Memoize logout function
  const logout = useCallback(() => { 
    // console.log('AuthContext: Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedCountry');
    localStorage.removeItem('selectedCompany');
    setToken(null);
    setUser(null);
    setIsLoading(false); // Ensure loading is false after logout
    // console.log('AuthContext: User logged out, state updated.');
  }, []); // No external dependencies

  // --- Initial Authentication State Setup (Runs only ONCE on mount) ---
  useEffect(() => {
    // console.log('AuthContext: useEffect (initialization) running for the first time.');
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');
    const storedCountry = localStorage.getItem('selectedCountry');
    const storedCompany = localStorage.getItem('selectedCompany');

    let loadedUser = null;
    let loadedToken = null;
    let loadedCountry = null;
    let loadedCompany = null;

    if (storedToken && storedUser) {
      try {
        // Añadir un chequeo para asegurar que el token tiene el formato esperado antes de usar split
        if (typeof storedToken !== 'string' || storedToken.split('.').length !== 3) {
          console.error('AuthContext: Token almacenado no tiene el formato JWT esperado en el inicio.');
          logout(); // Limpiar almacenamiento si el formato es incorrecto
          setIsLoading(false);
          return;
        }

        const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (tokenData.exp > currentTime) {
          loadedUser = JSON.parse(storedUser);
          loadedToken = storedToken;
          loadedCountry = storedCountry ? JSON.parse(storedCountry) : null;
          loadedCompany = storedCompany ? JSON.parse(storedCompany) : null;
          isTokenValid = true;
          // console.log('AuthContext: Token valid on startup. User data loaded.');
        } else {
          // Token expired on startup, clear storage
          console.warn('AuthContext: Token expiró al iniciar, limpiando almacenamiento local.');
          logout(); // Use the memoized logout to clear state and local storage
        }
      } catch (error) {
        console.error('AuthContext: Error al parsear datos de token/usuario en el inicio:', error);
        // Si hay un error al decodificar (ej. InvalidCharacterError), limpiar el token inválido
        if (error.name === 'InvalidCharacterError') {
          console.warn('AuthContext: Token inválido detectado en el inicio, limpiando almacenamiento local.');
        }
        logout(); // Clear on any parsing error or invalid token
      }
    } else {
      // console.log('AuthContext: No token or user data found in localStorage on startup.');
      // Nothing to do if no token/user, state will remain null/null
    }

    // Set state based on the initial checks
    setUser(loadedUser);
    setToken(loadedToken);
    // Combine selected country/company into user object if they were loaded
    if (loadedUser && (loadedCountry || loadedCompany)) {
      setUser(prevUser => ({
        ...prevUser,
        selectedCountry: loadedCountry,
        selectedCompany: loadedCompany
      }));
    }
    
    setIsLoading(false); // IMPORTANT: Set isLoading to false ONLY after all initial checks are done
  }, [logout]); // logout is a dependency, but it's memoized, so it won't cause re-runs unless its own deps change.

  // Getters for external components
  const getAuthToken = useCallback(() => token, [token]);
  const getCurrentUser = useCallback(() => user, [user]);

  // Update user data, e.g., if roles/permissions change
  const updateUser = useCallback((updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem('userData', JSON.stringify(newUserData));
      console.log('AuthContext: Datos de usuario actualizados');
    } catch (error) {
      console.error('AuthContext: Error al actualizar datos de usuario:', error);
      throw error;
    }
  }, [user]);

  // Role and Permission checks (memoized)
  const hasRole = useCallback((role) => {
    // Assuming user.roles is an array, or user.role is a string
    return user?.roles?.includes(role) || user?.role === role;
  }, [user]);

  const hasPermission = useCallback((permission) => {
    return user?.permissions?.includes(permission);
  }, [user]);

  // Memoize the entire context value to prevent unnecessary re-renders for consumers
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
    hasPermission,
  }), [user, token, isLoading, login, logout, isAuthenticated, getAuthToken, getCurrentUser, updateUser, hasRole, hasPermission]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

