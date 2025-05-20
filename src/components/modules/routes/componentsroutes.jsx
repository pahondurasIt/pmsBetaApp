
/* ARCHIVO componentsroutes se usa para reutilizar subrutas sobre la ruta padre para meter componentes de archivos dentro de la ruta padre esquide */
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Employees from '../Employees/Employees';


const ComponentsRoutes = () => {
    return (
        <>
        <Routes>
          {/* Ruta para empleados (relativa a /app) */}
          <Route path="employees" element={<Employees />} />

          {/* Comodín para redirigir al panel de empleados dentro de /app */}
          <Route path="/*" element={<Employees />} />
        </Routes>
      </>
    )
}

export default ComponentsRoutes
