import ProtectedRoute from "./components/modules/routes/ProtectedRoute";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import NavBar from "./components/layout/NavBar";
import ComponentsRoutes from "./components/modules/routes/componentsroutes";
import Asistencia from "./components/modules/Attendance/asistencia";
import MenuPage from './components/layout/MenuPage';


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
        <Route path="asistencia" element={<Asistencia />} />
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
