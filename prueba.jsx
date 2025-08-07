import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el contexto
const PermissionContext = createContext();

// 2. Crear el provider
export const PermissionProvider = ({ children }) => {
    // Inicializar con datos del sessionStorage si existen
    const [userPermissions, setUserPermissions] = useState(() => {
        try {
            const saved = sessionStorage.getItem('userPermissions');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading permissions from sessionStorage:', error);
            return null;
        }
    });

    const [userScreens, setUserScreens] = useState(() => {
        try {
            const saved = sessionStorage.getItem('userScreens');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading screens from sessionStorage:', error);
            return null;
        }
    });

    const [userModules, setUserModules] = useState(() => {
        try {
            const saved = sessionStorage.getItem('userModules');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading modules from sessionStorage:', error);
            return null;
        }
    });

    // Función para actualizar permisos y sincronizar con sessionStorage
    const updatePermissions = (permissions) => {
        setUserPermissions(permissions);
        if (permissions) {
            sessionStorage.setItem('userPermissions', JSON.stringify(permissions));
        } else {
            sessionStorage.removeItem('userPermissions');
        }
    };

    // Función para actualizar pantallas y sincronizar con sessionStorage
    const updateScreens = (screens) => {
        setUserScreens(screens);
        if (screens) {
            sessionStorage.setItem('userScreens', JSON.stringify(screens));
        } else {
            sessionStorage.removeItem('userScreens');
        }
    };

    // Función para actualizar módulos y sincronizar con sessionStorage
    const updateModules = (modules) => {
        setUserModules(modules);
        if (modules) {
            sessionStorage.setItem('userModules', JSON.stringify(modules));
        } else {
            sessionStorage.removeItem('userModules');
        }
    };

    // Función para limpiar todos los datos (útil para logout)
    const clearPermissions = () => {
        setUserPermissions(null);
        setUserScreens(null);
        setUserModules(null);
        sessionStorage.clear()
    };

    return (
        <PermissionContext.Provider value={{
            userPermissions: userPermissions,
            setUserPermissions: updatePermissions,
            userScreens: userScreens,
            setUserScreens: updateScreens,
            userModules: userModules,
            setUserModules: updateModules,
            clearPermissions
        }}>
            {children}
        </PermissionContext.Provider>
    );
};

// 3. Custom hook para usar el contexto fácilmente
export const usePermissionContext = () => {
    return useContext(PermissionContext);
};

// // Initial Authentication State Setup
//   useEffect(() => {
//     const initializeAuth = async () => {
//       setIsLoading(true); // Start loading state
//       const storedToken = sessionStorage.getItem('authToken');
//       const storedUser = sessionStorage.getItem('userData');
//       const storedCountry = sessionStorage.getItem('selectedCountry');
//       const storedCompany = sessionStorage.getItem('selectedCompany');

//       if (storedToken && storedUser) {
//         try {
//           if (typeof storedToken !== 'string' || storedToken.split('.').length !== 3) {
//             logout();
//             return;
//           }

//           const base64Payload = storedToken.split('.')[1];
//           if (!base64Payload || !/^[A-Za-z0-9+/=]+$/.test(base64Payload)) {
//             logout();
//             return;
//           }

//           const tokenData = JSON.parse(atob(base64Payload));
//           const currentTime = Date.now() / 1000;

//           if (tokenData.exp > currentTime) {
//             try {
//               const userData = JSON.parse(storedUser);
//               // Parse storedCountry and storedCompany, handle null explicitly
//               const country = storedCountry ? JSON.parse(storedCountry) : null;
//               const company = storedCompany ? JSON.parse(storedCompany) : null;
//               setUser({ ...userData, selectedCountry: country, selectedCompany: company });
//               setToken(storedToken);
//               // console.log('AuthContext: Sesión restaurada con token existente.');
//             } catch (parseError) {
//               // console.error('AuthContext: Error al parsear userData o selected data:', parseError);
//               logout();
//             }
//           } else {
//             // console.log('AuthContext: Token expirado.');
//             logout();
//           }
//         } catch (error) {
//           // console.error('AuthContext: Error al verificar o decodificar token:', error);
//           logout();
//         }
//       } else {
//         // console.log('AuthContext: No hay token o datos de usuario almacenados.');
//         logout(); // Ensure consistent state if partial data exists
//       }
//       setIsLoading(false); // End loading state
//     };

//     initializeAuth();
//   }, [logout]); // logout is a dependency

//   // Getters for external components
//   const getAuthToken = useCallback(() => token, [token]);
//   const getCurrentUser = useCallback(() => user, [user]);

//   // Update user data
//   const updateUser = useCallback((updatedUserData) => {
//     try {
//       const newUserData = { ...user, ...updatedUserData };
//       setUser(newUserData);
//       sessionStorage.setItem('userData', JSON.stringify(newUserData));
//     } catch (error) {
//       console.error('AuthContext: Error al actualizar datos de usuario:', error);
//       throw error;
//     }
//   }, [user]);

//   // Role and Permission checks
//   const hasRole = useCallback((role) => {
//     return user?.roles?.includes(role) || user?.role === role;
//   }, [user]);

//   const hasPermission = useCallback((permission) => {
//     return user?.permissions?.includes(permission);
//   }, [user]);

//   // Memoize the entire context value
//   const contextValue = useMemo(() => ({
//     user,
//     token,
//     isLoading,
//     login,
//     logout,
//     isAuthenticated,
//     getAuthToken,
//     getCurrentUser,
//     updateUser,
//     hasRole,
//     hasPermission
//   }), [user, token, isLoading, login, logout, isAuthenticated, getAuthToken, getCurrentUser, updateUser, hasRole, hasPermission]);

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );