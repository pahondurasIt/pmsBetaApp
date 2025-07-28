import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/modules/routes/ProtectedRoute";
import LoginPage from "./auth/LoginPage";
import NavBar from "./components/layout/NavBar";
import MenuPage from './components/layout/MenuPage';
import MainAttandance from "./components/modules/HumanResourcesManagment/Attendance/MainAttandance";
import Attendance from "./components/modules/HumanResourcesManagment/Attendance/Attendance";
import PermissionSupervisor from "./components/modules/HumanResourcesManagment/Permisson/PermissonSupervisor";
import { PermissionProvider, usePermissionContext } from './context/permissionContext';

// Mapeo de nombres de componentes a sus importaciones dinámicas
const componentMap = {
  Employees: lazy(() => import("./components/modules/HumanResourcesManagment/Employees/Employees")),
  RecordAttendance: lazy(() => import("./components/modules/HumanResourcesManagment/Attendance/RecordAttendance")),
  Permission: lazy(() => import("./components/modules/HumanResourcesManagment/Permisson/Permission")),
  Lines: lazy(() => import("./components/modules/HumanResourcesManagment/Lines/Lines")),
};

const AppLayout = React.memo(() => {
  return <NavBar />;
});

const AppRouter = () => {
  return (
    <AuthProvider>
      <PermissionProvider>
        <BrowserRouter>
          <AppRouterContent />
        </BrowserRouter>
      </PermissionProvider>
    </AuthProvider>
  );
};

const AppRouterContent = () => {
  const { screenByRole } = usePermissionContext();

  return (
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
        {/* Redirección por defecto a la primera ruta disponible */}
        <Route
          index
          element={
            screenByRole && screenByRole.length > 0
              ? <Navigate to={`/app/${screenByRole[0].path}`} replace />
              : <div>Cargando permisos...</div>
          }
        />

        {/* Rutas dinámicas basadas en permisos */}
        {screenByRole && screenByRole.map((screen) => {
          const Component = componentMap[screen.component];
          return (
            Component && (
              <Route
                key={screen.screenID}
                path={screen.path}
                element={
                  <Suspense fallback={<div>Cargando componente...</div>}>
                    <Component />
                  </Suspense>
                }
              />
            )
          );
        })}

        {/* Ruta catch-all para URLs no encontradas dentro de /app */}
        <Route
          path="*"
          element={
            screenByRole && screenByRole.length > 0
              ? <Navigate to={`/app/${screenByRole[0].path}`} replace />
              : <Navigate to="/login" replace />
          }
        />
      </Route>

      {/* Ruta catch-all global para URLs no encontradas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
