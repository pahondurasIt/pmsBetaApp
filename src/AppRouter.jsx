// AppRouter.jsx - Router principal CORREGIDO
// VERSIÓN DEFINITIVA: Elimina la redirección automática a Employees
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import ProtectedRoute from "../src/components/modules/routes/ProtectedRoute";
import LoginPage from "./auth/LoginPage";
import NavBar from "./components/layout/NavBar";
import Employees from "./components/modules/HumanResourcesManagment/Employees/Employees";
import RecordAttendance from "./components/modules/HumanResourcesManagment/Attendance/RecordAttendance";
import Permission from "./components/modules/HumanResourcesManagment/Permisson/Permission";
import PermissionSupervisor from "./components/modules/HumanResourcesManagment/Permisson/PermissonSupervisor";
import MainAttandance from "./components/modules/HumanResourcesManagment/Attendance/MainAttandance";
import MenuPage from './components/layout/MenuPage';
import Attendance from "./components/modules/HumanResourcesManagment/Attendance/Attendance";
import Lines from './components/modules/HumanResourcesManagment/Lines/Lines';
import { PermissionProvider } from './context/permissionContext';

const AppLayout = React.memo(() => {
  return <NavBar />;
});

const AppRouter = () => {
  return (
    <AuthProvider>
      <PermissionProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas - No requieren autenticación */}
            <Route path="/" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mainAttendance" element={<MainAttandance />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/permissionsSupervisor" element={<PermissionSupervisor />} />

            {/* Rutas protegidas - Requieren autenticación */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* CAMBIO CRÍTICO: Solo redirigir a employees cuando se accede exactamente a /app */}
              <Route index element={<Navigate to="/app/employees" replace />} />

              {/* Rutas específicas - Cada una renderiza su componente correspondiente */}
              <Route path="employees" element={<Employees />} />
              <Route path="recordattendance" element={<RecordAttendance />} />
              <Route path="permission" element={<Permission />} />
              <Route path="lines" element={<Lines />} />

              {/* Ruta catch-all para URLs no encontradas dentro de /app */}
              <Route path="*" element={<Navigate to="/app/employees" replace />} />
            </Route>
            {/* Ruta catch-all global para URLs no encontradas */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </PermissionProvider>
    </AuthProvider>
  );
};



export default AppRouter;

