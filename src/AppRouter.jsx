import ProtectedRoute from "./components/modules/routes/ProtectedRoute";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import NavBar from "./components/layout/NavBar";
import ComponentsRoutes from "./components/modules/routes/componentsroutes";
import MainAttandance from "./components/modules/Attendance/MainAttandance";
import MenuPage from './components/layout/MenuPage';
import Attendance from "./components/modules/Attendance/Attendance";


const AppLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública para la página inicial (menú) */}
        <Route path="/" element={<MenuPage />} />

        {/* Ruta pública para el login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta pública para el módulo de asistencia */}
        <Route path="mainAttendance" element={<MainAttandance />} />
        <Route path="attendance" element={<Attendance />} />
        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <NavBar />
            // </ProtectedRoute>
          }
        >
          <Route path="/*" element={<ComponentsRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
