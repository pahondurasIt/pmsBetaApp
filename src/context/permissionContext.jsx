import React, { createContext, useContext, useState } from 'react';

// 1. Crear el contexto
const PermissionContext = createContext();

// 2. Crear el provider
export const PermissionProvider = ({ children }) => {
    const [permissionByRole, setPermissionByRole] = useState(null);
    const [screenByRole, setScreenByRole] = useState(null);

    return (
        <PermissionContext.Provider value={{ permissionByRole, setPermissionByRole, screenByRole, setScreenByRole }}>
            {children}
        </PermissionContext.Provider>
    );
};

// 3. Custom hook para usar el contexto fácilmente
export const usePermissionContext = () => {
    return useContext(PermissionContext);
};
