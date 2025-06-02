import React, { useEffect, useState, useRef } from 'react'

import { DataTable, Column, FilterMatchMode, Tag, Dropdown, Button as ButtonPrime } from 'primereact';
import AddIcon from '@mui/icons-material/Add';
import { apipms } from '../../../../service/apipms'
import { Button } from '@mui/material';
import DialogEmployee from './DialogEmployee';
import PersonIcon from '@mui/icons-material/Person';
import EmployeeCard from './EmployeeCard';
import dayjs from 'dayjs';

const Employees = () => {
    const [employeesList, setEmployeesList] = useState([]);
    const [visibleDialogForm, setVisibleDialogForm] = useState(false);
    const [visibleDialogCard, setVisibleDialogCard] = useState(false);
    const [statuses] = useState(['Activo', 'Inactivo']);
    const [employeeSelected, setEmployeeSelected] = useState(null);
    const dt = useRef(null);

    useEffect(() => {
        apipms.get('/employee')
            .then((response) => {
                setEmployeesList(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const [filters] = useState({
        nombreCompleto: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codeEmployee: { value: null, matchMode: FilterMatchMode.CONTAINS },
        departmentName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        jobName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        shiftName: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

    const renderShowCard = (data) => {
        return <PersonIcon color='primary' fontSize='medium' />
    };

    const onCellSelect = (event) => {
        if (event.cellIndex === 0) {
            apipms.get(`/employee/employeeByID/${event.rowData.employeeID}`)
                .then((response) => {
                    setEmployeeSelected(response.data);
                    setVisibleDialogCard(true);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error)
                })
        }
    };

    const header = () => {
        return <div className="flex align-items-center justify-content-end gap-2">
            <ButtonPrime type="button" icon="pi pi-file-excel" severity="success" rounded
                onClick={() => {
                    dt.current.exportCSV({ selectionOnly: false, __filename: `Empleados ${dayjs().format('YYYY-MM-DD')}` })
                }
                }
                data-pr-tooltip="XLS"
            />
        </div>
    }

    return (
        <>
            <h2 style={{ textAlign: 'center' }}>Informacion sobre Empleados</h2>
            <Button variant="contained" startIcon={<AddIcon />} size='small' onClick={() => setVisibleDialogForm(true)}>
                Agregar Empleado
            </Button>
            <br />
            <div className="card">
                <DataTable
                    ref={dt}
                    value={employeesList}
                    header={() => header()}
                    size="small"
                    filters={filters}
                    filterDisplay="row"
                    showGridlines
                    paginator
                    rows={15}
                    rowsPerPageOptions={[15, 30, 50]}
                    cellSelection
                    onCellSelect={onCellSelect}
                    selectionMode="single"
                    globalFilterFields={['nombre', 'departamento', 'puesto']}

                >
                    <Column body={renderShowCard} style={{ textAlign: 'center' }}></Column>
                    <Column field="codeEmployee" header="Código" filter style={{ width: '10rem', textAlign: 'center' }}></Column>
                    <Column field="nombreCompleto" header="Nombre Completo" filter></Column>
                    <Column field="departmentName" header="Departamento" filter></Column>
                    <Column field="jobName" header="Puesto" filter></Column>
                    <Column field="shiftName" header="Turno" filter></Column>
                    <Column field="isActive" header="Estado" body={statusBodyTemplate} />
                </DataTable>
            </div>
            <DialogEmployee
                visible={visibleDialogForm}
                setVisible={setVisibleDialogForm}
                employeesList={employeesList}
                setEmployeesList={setEmployeesList}
            />
            <EmployeeCard
                visible={visibleDialogCard}
                setVisible={setVisibleDialogCard}
                employeeData={employeeSelected}
            />
        </>
    )
}

export default Employees
