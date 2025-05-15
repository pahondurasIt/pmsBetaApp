import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./auth/LoginPage";

import NavBar from "./components/navBar/NavBar";
import ProtectedRoute from "./routes/ProtectedRoute";
import Employees from "./components/pages/Employees";
import ComponentsRoutes from "./routes/componentsroutes";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
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
