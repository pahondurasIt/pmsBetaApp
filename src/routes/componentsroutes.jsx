import React from 'react'
import { Route, Routes } from 'react-router-dom'
// import {
//     Employees
// } from "../components/pages/index";
import Employees from '../components/pages/Employees'

const ComponentsRoutes = () => {
    return (
        <>
            <Routes>
                {/* Componentes */}
                <Route path="/employees" element={<Employees />} />
                <Route path="/*" element={<Employees />} />
            </Routes>
        </>
    )
}

export default ComponentsRoutes
