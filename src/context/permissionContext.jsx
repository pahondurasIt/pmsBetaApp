import React, { createContext, useContext, useState, useEffect } from 'react';
import { apipms } from '../service/apipms';
import { useAuth } from '../context/AuthContext';

// Crear contexto
const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
    const { getCurrentUser, isAuthenticated, isLoading: authLoading } = useAuth();
    const currentUser = getCurrentUser();

    // Estados con sessionStorage
    const [userPermissions, setUserPermissions] = useState(() => {
        try {
            const saved = sessionStorage.getItem('userPermissions');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [userScreens, setUserScreens] = useState(() => {
        try {
            const saved = sessionStorage.getItem('userScreens');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [userModules, setUserModules] = useState(() => {
        try {
            const saved = sessionStorage.getItem('userModules');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [userMenuData, setUserMenuData] = useState([]);

    const updatePermissions = (permissions) => {
        setUserPermissions(permissions);
        if (permissions) {
            sessionStorage.setItem('userPermissions', JSON.stringify(permissions));
        } else {
            sessionStorage.removeItem('userPermissions');
        }
    };

    const updateScreens = (screens) => {
        setUserScreens(screens);
        if (screens) {
            sessionStorage.setItem('userScreens', JSON.stringify(screens));
        } else {
            sessionStorage.removeItem('userScreens');
        }
    };

    const updateModules = (modules) => {
        setUserModules(modules);
        if (modules) {
            sessionStorage.setItem('userModules', JSON.stringify(modules));
        } else {
            sessionStorage.removeItem('userModules');
        }
    };

    const clearPermissions = () => {
        setUserPermissions(null);
        setUserScreens(null);
        setUserModules(null);
        sessionStorage.removeItem('userPermissions');
        sessionStorage.removeItem('userScreens');
        sessionStorage.removeItem('userModules');
    };

    // Acceso a pantallas
    const hasScreenAccess = (screenKey, keyType = 'path') => {
        if (!userScreens || userScreens.length === 0) return false;
        return userScreens.some(screen => screen[keyType] === screenKey);
    };

useEffect(() => {
    const fetchUserPermissions = async () => {
        if (isAuthenticated && currentUser?.id) {
            try {
                // Pantallas y módulos
                const menuResponse = await apipms.get(`/usuarios/user_menu_permission/${currentUser.id}`);
                const menuData = menuResponse.data;

                const formattedMenu = menuData.reduce((acc, item) => {
                    let module = acc.find(m => m.moduleID === item.moduleID);
                    if (!module) {
                        module = { moduleID: item.moduleID, moduleName: item.moduleName, screens: [] };
                        acc.push(module);
                    }
                    module.screens.push({
                        screenID: item.screenID,
                        screenName: item.screenName,
                        path: item.path,
                        component: item.component,
                    });
                    return acc;
                }, []);

                setUserMenuData(formattedMenu);
                updateScreens(formattedMenu.flatMap(module => module.screens));

                // 🚨 Aquí traemos los permisos funcionales
                const permissionsResponse = await apipms.get(`/usuarios/user_permission_screen/${currentUser.id}`);
                const permissions = permissionsResponse.data.permissions || [];
                updatePermissions(permissions);

            } catch (error) {
                console.error('Error al obtener permisos:', error);
                setUserMenuData([]);
                updateScreens([]);
                updatePermissions([]); // limpiar permisos si hay error
            }
        } else if (!authLoading) {
            setUserMenuData([]);
            updateScreens([]);
            updatePermissions([]);
        }
    };

    fetchUserPermissions();
}, [isAuthenticated, currentUser, authLoading]);

    return (
        <PermissionContext.Provider value={{
            userPermissions,
            setUserPermissions: updatePermissions,
            userScreens,
            setUserScreens: updateScreens,
            userModules,
            setUserModules: updateModules,
            userMenuData,
            hasScreenAccess,
            clearPermissions
        }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissionContext = () => useContext(PermissionContext);


// Dato Viejo:

// // 2. Crear el provider
// export const PermissionProvider = ({ children }) => {
    
//     // Inicializar con datos del sessionStorage si existen
//     const [userPermissions, setUserPermissions] = useState(() => {
//         try {
//             const saved = sessionStorage.getItem('userPermissions');
//             return saved ? JSON.parse(saved) : null;
//         } catch (error) {
//             console.error('Error loading permissions from sessionStorage:', error);
//             return null;
//         }
//     });

//     const [userScreens, setUserScreens] = useState(() => {
//         try {
//             const saved = sessionStorage.getItem('userScreens');
//             return saved ? JSON.parse(saved) : null;
//         } catch (error) {
//             console.error('Error loading screens from sessionStorage:', error);
//             return null;
//         }
//     });

//     const [userModules, setUserModules] = useState(() => {
//         try {
//             const saved = sessionStorage.getItem('userModules');
//             return saved ? JSON.parse(saved) : null;
//         } catch (error) {
//             console.error('Error loading modules from sessionStorage:', error);
//             return null;
//         }
//     });

//     // Función para actualizar permisos y sincronizar con sessionStorage
//     const updatePermissions = (permissions) => {
//         setUserPermissions(permissions);
//         if (permissions) {
//             sessionStorage.setItem('userPermissions', JSON.stringify(permissions));
//         } else {
//             sessionStorage.removeItem('userPermissions');
//         }
//     };

//     // Función para actualizar pantallas y sincronizar con sessionStorage
//     const updateScreens = (screens) => {
//         setUserScreens(screens);
//         if (screens) {
//             sessionStorage.setItem('userScreens', JSON.stringify(screens));
//         } else {
//             sessionStorage.removeItem('userScreens');
//         }
//     };

//     // Función para actualizar módulos y sincronizar con sessionStorage
//     const updateModules = (modules) => {
//         setUserModules(modules);
//         if (modules) {
//             sessionStorage.setItem('userModules', JSON.stringify(modules));
//         } else {
//             sessionStorage.removeItem('userModules');
//         }
//     };

//     // Función para limpiar todos los datos (útil para logout)
//     const clearPermissions = () => {
//         setUserPermissions(null);
//         setUserScreens(null);
//         setUserModules(null);
//         sessionStorage.clear()
//     };

//     return (
//         <PermissionContext.Provider value={{
//             userPermissions: userPermissions,
//             setUserPermissions: updatePermissions,
//             userScreens: userScreens,
//             setUserScreens: updateScreens,
//             userModules: userModules,
//             setUserModules: updateModules,
//             clearPermissions
//         }}>
//             {children}
//         </PermissionContext.Provider>
//     );
// };

// // 3. Custom hook para usar el contexto fácilmente
// export const usePermissionContext = () => {
//     return useContext(PermissionContext);
// };
