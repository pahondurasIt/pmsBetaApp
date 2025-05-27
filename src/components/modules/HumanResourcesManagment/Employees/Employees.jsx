import React, { useEffect, useState } from 'react'

import { DataTable, Column, FilterMatchMode, FilterOperator, Tag, Dropdown } from 'primereact';
import AddIcon from '@mui/icons-material/Add';
import { apipms } from '../../../../service/apipms'
import { Button } from '@mui/material';
import DialogEmployee from './DialogEmployee';

const Employees = () => {
    const [employeeList, setEmployeesList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [statuses] = useState(['Activo', 'Inactivo']);

    useEffect(() => {
        apipms.get('/employee')
            .then((response) => {
                console.log(response.data);

                setEmployeesList(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const [filters] = useState({
        nombreCompleto: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codeEmployee: { value: null, matchMode: FilterMatchMode.CONTAINS },
        isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const getSeverity = (status) => {
        switch (status) {
            case 'Activo':
                return 'success';
            case 'Inactivo':
                return 'danger';
            case '':
                return null;
        }
    };

    const statusBodyTemplate = (rowData) => {
        if (rowData.isActive) {
            return <Tag severity="success" value="Activo" />;
        } else {
            return <Tag severity="danger" value="Inactivo" />;
        }
    };

     const incapacitatedBodyTemplate = (rowData) => {
        if (rowData.incapacitated) {
            return <Tag severity="danger" value="Incapacitado" />;
        }
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const statusRowFilterTemplate = (options) => {
        console.log(options);
        let value = (options.value) ? true : false

        return (
            <Dropdown value={value} options={statuses} onChange={(e) => {
                console.log(value);
                options.filterApplyCallback(value)
            }} itemTemplate={statusItemTemplate} placeholder="Seleccione" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>Informacion sobre Empleados</h2>
            <Button variant="contained" startIcon={<AddIcon />} size='small' onClick={() => setVisible(true)}>
                Agregar Empleado
            </Button>
            <br />
            <div className="card">
                <DataTable
                    value={employeeList}
                    size="small"
                    filters={filters}
                    filterDisplay="row"
                    showGridlines
                    paginator rows={15}
                    rowsPerPageOptions={[15, 30, 50]}
                >
                    <Column field="codeEmployee" header="Código" filter style={{ width: '10rem', textAlign: 'center' }}></Column>
                    <Column field="nombreCompleto" header="Nombre Completo" filter></Column>
                    <Column field="departmentName" header="Departamento" filter></Column>
                    <Column field="jobsName" header="Puesto" filter></Column>
                    <Column field="shiftName" header="Turno" filter></Column>
                    <Column field="isActive" header="Estado" body={statusBodyTemplate} />
                    <Column field="incapacitated" header="Incapacitado" body={incapacitatedBodyTemplate}></Column>
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
