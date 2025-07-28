import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Crear el contexto
const PermissionContext = createContext();

// 2. Crear el provider
export const PermissionProvider = ({ children }) => {
    // Inicializar con datos del localStorage si existen
    const [permissionByRole, setPermissionByRole] = useState(() => {
        try {
            const saved = localStorage.getItem('userPermissions');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading permissions from localStorage:', error);
            return null;
        }
    });

    const [screenByRole, setScreenByRole] = useState(() => {
        try {
            const saved = localStorage.getItem('userScreens');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading screens from localStorage:', error);
            return null;
        }
    });

    // Función para actualizar permisos y sincronizar con localStorage
    const updatePermissions = (permissions) => {
        setPermissionByRole(permissions);
        if (permissions) {
            localStorage.setItem('userPermissions', JSON.stringify(permissions));
        } else {
            localStorage.removeItem('userPermissions');
        }
    };

    // Función para actualizar pantallas y sincronizar con localStorage
    const updateScreens = (screens) => {
        setScreenByRole(screens);
        if (screens) {
            localStorage.setItem('userScreens', JSON.stringify(screens));
        } else {
            localStorage.removeItem('userScreens');
        }
    };

    // Función para limpiar todos los datos (útil para logout)
    const clearPermissions = () => {
        setPermissionByRole(null);
        setScreenByRole(null);
        localStorage.removeItem('userPermissions');
        localStorage.removeItem('userScreens');
    };

    return (
        <PermissionContext.Provider value={{
            permissionByRole,
            setPermissionByRole: updatePermissions,
            screenByRole,
            setScreenByRole: updateScreens,
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
