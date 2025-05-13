import React from 'react'
import { Route, Routes } from 'react-router-dom'
import home from '../page/Homepage'
import info from '../page/info'


const componentsroutes = () => {
    return (
        <>
            <Routes>
                {/* Componentes */}
                <Route path="/home" element={<home />} />
                <Route path="/info" element={<info />} />
                <Route path="/*" element={<Pacientes />} />
            </Routes>
        </>
    )
}

export default componentsroutes
