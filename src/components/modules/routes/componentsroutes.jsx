
/* ARCHIVO componentsroutes se usa para reutilizar subrutas sobre la ruta padre para meter componentes de archivos dentro de la ruta padre esquide */
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Employees from '../HumanResourcesManagment/Employees/Employees';
import RecordAttendance from '../HumanResourcesManagment/Attendance/RecordAttendance';
import Permission from '../HumanResourcesManagment/Attendance/Permission';



const ComponentsRoutes = () => {
  return (
   <Routes>
      <Route path="recordattendance" element={<RecordAttendance />} />
      <Route path="employees" element={<Employees />} />
      <Route path="permission" element={<Permission />} />
    </Routes>
  );
};

export default ComponentsRoutes
