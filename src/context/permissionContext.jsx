import React, { createContext, useContext, useState } from 'react';

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
