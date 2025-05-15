import React, { useEffect, useState } from 'react'

import { DataTable, Column } from 'primereact';
import AddIcon from '@mui/icons-material/Add';
import { apipms } from '../../service/apipms'
import { Button } from '@mui/material';
import DialogEmployee from './DialogEmployee';

const Employees = () => {
    const [employeeList, setEmployeesList] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        apipms.get('/empleados')
            .then((response) => {
                setEmployeesList(response.data)
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>Informacion sobre Empleados</h2>
            <Button variant="contained" startIcon={<AddIcon />} size='small' onClick={() => setVisible(true)}>
                Agregar Empleado
            </Button>
            <div className="card">
                <DataTable
                    value={employeeList}
                    size="small"
                    showGridlines
                    paginator rows={15}
                    rowsPerPageOptions={[15, 30, 50]}
                    tableStyle={{ minWidth: '70rem' }}>
                    <Column field="codigo" header="Codigo" style={{ width: '25%' }}></Column>
                    <Column field="nombre" header="Nombre" style={{ width: '25%' }}></Column>
                    <Column field="cargo" header="Cargo" style={{ width: '25%' }}></Column>
                    <Column field="dni" header="DNI" style={{ width: '25%' }}></Column>
                </DataTable>
            </div>
            <DialogEmployee
                visible={visible}
                setVisible={setVisible}
            />
        </>
    )
}

export default Employees
