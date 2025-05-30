import ProtectedRoute from "./components/modules/routes/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import NavBar from "./components/layout/NavBar";
import ComponentsRoutes from "./components/modules/routes/componentsroutes";
import MainAttandance from "./components/modules/HumanResourcesManagment/Attendance/MainAttandance";
import MenuPage from './components/layout/MenuPage';
import Attendance from "./components/modules/HumanResourcesManagment/Attendance/Attendance";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mainAttendance" element={<MainAttandance />} />
        <Route path="/attendance" element={<Attendance />} />

        {/* Ruta protegida con NavBar y subrutas */}
        <Route path="/app" element={<NavBar />}>
          <Route path="*" element={<ComponentsRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
