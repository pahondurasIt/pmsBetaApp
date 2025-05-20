import ProtectedRoute from "./routes/ProtectedRoute";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import NavBar from "./components/navBar/NavBar";
import ComponentsRoutes from "./routes/componentsroutes";
import Employees from '../src/components/pages/Employees';
import Asistencia from "./components/modules/asistencia";
import MenuPage from './components/pages/MenuPage';


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
