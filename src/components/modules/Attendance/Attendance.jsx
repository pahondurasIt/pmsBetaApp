import React from 'react'
import { useLocation } from "react-router-dom";


const Attendance = () => {
const location = useLocation();
const opcion = location.state.op
    console.log(location.state.op);

    return (
        <div>
            <h1>{opcion}</h1>
        </div>
    )
}

export default Attendance
