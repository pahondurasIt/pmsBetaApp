/* 
ARCHIVO componentsroutes.jsx - Rutas de componentes corregido
VERSIÓN FINAL: Asegura que las rutas funcionen correctamente con el wildcard
*/
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Employees from '../HumanResourcesManagment/Employees/Employees';
import RecordAttendance from '../HumanResourcesManagment/Attendance/RecordAttendance';
import Permission from '../HumanResourcesManagment/Attendance/Permission';

const ComponentsRoutes = () => {
  return (
    <Routes>
      
      
      {/* Rutas específicas de los módulos */}
      <Route path="employees" element={<Employees />} />
      <Route path="recordattendance" element={<RecordAttendance />} />
      <Route path="permission" element={<Permission />} />
      
      {/* Ruta catch-all para manejar rutas no encontradas dentro de /app */}
      <Route path="*" element={<Navigate to="/app/employees" replace />} />
    </Routes>
  );
};

export default ComponentsRoutes

