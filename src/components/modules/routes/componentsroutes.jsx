
/* ARCHIVO componentsroutes se usa para reutilizar subrutas sobre la ruta padre para meter componentes de archivos dentro de la ruta padre esquide */
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Employees from '../HumanResourcesManagment/Employees/Employees';
import RecordAttendance from '../HumanResourcesManagment/Attendance/RecordAttendance';


const ComponentsRoutes = () => {
  return (
    <>
      <Routes>

        {/* Ruta padre para Human Resources */}
        <Route path="human-resources">
    
          {/* Submódulo para Registros de Asistencia */}
          <Route path="recordattendance" element={<RecordAttendance />} />
          
          {/* Submódulo para Empleados */}
          <Route path="employees" element={<Employees />} />
          
        </Route>

        {/* Comodín para redirigir al panel de empleados dentro de /app */}
        <Route path="/*" element={<Employees />} />
      </Routes>
    </>
  )
}

export default ComponentsRoutes
