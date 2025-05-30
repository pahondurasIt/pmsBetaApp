
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
        <Route path="human-resources" children={
          <>
            <Route path="recordattendance" element={<RecordAttendance />} />
            <Route path="employees" element={<Employees />} />
          </>
        } />
      </Routes>
    </>
  )
}

export default ComponentsRoutes
