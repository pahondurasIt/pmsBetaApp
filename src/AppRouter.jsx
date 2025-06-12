// AppRouter_updated.jsx - Versión actualizada con middleware de autenticación
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import ProtectedRoute from "../src/components/modules/routes/ProtectedRoute";
import LoginPage from "./auth/LoginPage";
import NavBar from "./components/layout/NavBar";
import ComponentsRoutes from "./components/modules/routes/componentsroutes";
import MainAttandance from "./components/modules/HumanResourcesManagment/Attendance/MainAttandance";
import MenuPage from './components/layout/MenuPage';
import Attendance from "./components/modules/HumanResourcesManagment/Attendance/Attendance";

const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas - No requieren autenticación */}
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mainAttendance" element={<MainAttandance />} />
          <Route path="/attendance" element={<Attendance />} />

          {/* Rutas protegidas - Requieren autenticación */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <NavBar />
              </ProtectedRoute>
            }
          >
            {/* Todas las subrutas bajo /app también estarán protegidas */}
            <Route path="*" element={<ComponentsRoutes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRouter;

