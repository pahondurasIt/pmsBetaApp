import React, { useEffect, useState, useRef } from 'react'

import { DataTable, Column, FilterMatchMode, Button as ButtonPrime, SplitButton } from 'primereact';

import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import AddIcon from '@mui/icons-material/Add';
import { apipms } from '../../../../service/apipms'
import { Button, Checkbox, Chip, Divider } from '@mui/material';
import DialogEmployee from './DialogEmployee';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import EmployeeCard from './EmployeeCard';
import dayjs from '../../../../helpers/dayjsConfig';
import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmployeePhotoUploader from './EmployeePhotoUploader';
import '../../../css/Employee.css'
import { DismissalEmployee } from './DismissalEmployee';

const Employees = () => {
    const [employeesList, setEmployeesList] = useState([]);
    const [visibleDialogForm, setVisibleDialogForm] = useState(false);
    const [visibleDialogCard, setVisibleDialogCard] = useState(false);
    const [visibleDisabledEmployee, setVisibleDisabledEmployee] = useState(false);
    const [employeeSelected, setEmployeeSelected] = useState(null);
    const [dataEmployeeSelected, setDataEmployeeSelected] = useState(null);
    const [visibleDialogPhotoUploader, setVisibleDialogPhotoUploader] = useState(false);
    const [checkBox, setCheckBox] = useState(false);
    const dt = useRef(null);
    const toast = useRef(null);

    const createToast = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 6000 });
    };
    useEffect(() => {
        apipms.get('/employee')
            .then((response) => {
                setEmployeesList(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const reject = () => {
        createToast('warn', 'Evaluación Rechazada', 'La evaluación del empleado ha sido rechazada.');
        setCheckBox(false);
    };

    const handleEvaluation = (event, data) => {
        confirmPopup({
            target: event.currentTarget,
            message: '¿Está seguro de que desea marcar al empleado?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => {
                handleEvaluationChange(data);
            },
            reject
        });
    };

    const [filters] = useState({
        nombreCompleto: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codeEmployee: { value: null, matchMode: FilterMatchMode.CONTAINS },
        departmentName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        jobName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        shiftName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        isActive: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });

    const statusBodyTemplate = (rowData) => {
        if (rowData.isActive === 'ACTIVO') {
            return <h4 style={{ color: '#4c8e00' }}>Activo</h4>;
        } else {
            return <h4 style={{ color: '#a10000' }}>Inactivo</h4>;
        }
    };

    const renderShowCard = (data) => {
        if (data.isActive === 'ACTIVO') {
            return <PersonIcon sx={{ color: '#b65901' }} fontSize='medium' />
        } else {
            return <PersonOffIcon sx={{ color: '#b65901' }} fontSize='medium' />
        }
    };

    const renderEditButton = (data) => {
        if (data.isActive === 'ACTIVO') return <EditIcon sx={{ color: '#1976d2' }} fontSize='medium' />
    };

    const renderAddPhotoEmployee = (data) => {
        if (data.isActive === 'ACTIVO') return <AddPhotoAlternateIcon color='success' fontSize='medium' />
    };

    const handleEvaluationChange = (data) => {
        console.log(data);
        apipms.put(`/employee/updateEvaluationStep/${data.employeeID}`, { evaluationStep: true })
            .then((response) => {
                console.log('Update Response:', response);
                if (response.status === 200) {
                    createToast('success', 'Evaluación Actualizada', 'La evaluación del empleado se ha actualizado correctamente.');
                    setEmployeesList((prev) => prev.map(emp => emp.employeeID === data.employeeID ? { ...emp, evaluationStep: true } : emp));
                }
            })
            .catch((error) => {
                console.error('Error updating evaluation step:', error);
                createToast('error', 'Error al Actualizar', error.data.message || 'Ha ocurrido un error al actualizar la evaluación del empleado.');
            });
    }

    const renderActions = (data) => {
        const days = dayjs().diff(dayjs(data.hireDate), 'days');

        if (data.isActive === 'ACTIVO' && !data.evaluationStep && days < 60) {
            return <Chip label="En Evaluación" color="info" variant="outlined" />
        } else if (data.isActive === 'ACTIVO' && data.evaluationStep) {
            return <Chip label="Pasó Evaluación" color="success" variant="outlined" />
        } else if (data.isActive === 'ACTIVO' && !data.evaluationStep && days >= 60) {
            return <Checkbox checked={checkBox} onChange={(e) => handleEvaluation(e, data)} />
        } else if (data.isActive === 'INACTIVO' && data.evaluationStep) {
            return <Chip label="Pasó Evaluación" color="warning" variant="outlined" />
        } else if (data.isActive === 'INACTIVO' && !data.evaluationStep) {
            return <Chip label="No Pasó Evaluación" color="warning" variant="outlined" />
        }
    }

    const onCellSelect = (event) => {
        if (event.cellIndex === 0) {
            apipms.get(`/employee/employeeByID/${event.rowData.employeeID}`)
                .then((response) => {
                    console.log('Selected Employee Data:', response);

                    setEmployeeSelected(response.data);
                    setVisibleDialogCard(true);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error)
                })
        }
        else if (event.cellIndex === 1) {
            if (event.rowData.isActive === 'ACTIVO') {
                apipms.get(`/employee/employeeByID/${event.rowData.employeeID}`)
                    .then((response) => {
                        const timer = setTimeout(() => {
                            setDataEmployeeSelected(response.data);
                            setVisibleDialogForm(true);
                            clearTimeout(timer);
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                    })
            }
        }
        else if (event.cellIndex === 2) {
            if (event.rowData.isActive === 'ACTIVO') {
                apipms.get(`/employee/employeeByID/${event.rowData.employeeID}`)
                    .then((response) => {
                        setEmployeeSelected(response.data.employee[0]);
                        setVisibleDialogPhotoUploader(true);
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                    })
            }
        }
    };

    const handleCloseDialog = () => {
        setVisibleDialogForm(false);
        setDataEmployeeSelected(null);
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
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className='buttons-container'>
                <Button variant="contained" startIcon={<AddIcon />} size='small'
                    onClick={() => setVisibleDialogForm(true)}
                    className="addButton"
                >
                    Agregar Empleado
                </Button>
                {/* <Divider orientation="vertical" flexItem /> */}
                {/* <Button variant="contained" startIcon={<AddIcon />} size='small'
                    onClick={() => {
                        setVisibleDisabledEmployee(true);
                        console.log('Inactivando empleado');

                    }}
                    className="deleteButton"
                >
                    Inactivar a Empleado
                </Button> */}
            </div>

            <br />
            <br />
            {employeesList.length > 0 &&
                <DataTable
                    className="animate__animated animate__fadeInRight"
                    ref={dt}
                    value={employeesList}
                    header={() => header()}
                    size="small"
                    filters={filters}
                    filterDisplay="row"
                    showGridlines
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 30, 50]}
                    cellSelection
                    onCellSelect={onCellSelect}
                    selectionMode="single"
                >
                    <Column body={renderShowCard} style={{ textAlign: 'center' }}></Column>
                    <Column body={renderEditButton} style={{ textAlign: 'center' }}></Column>
                    <Column body={renderAddPhotoEmployee} style={{ textAlign: 'center' }}></Column>
                    <Column field="codeEmployee" header="Código" filter style={{ width: '10rem', textAlign: 'center' }}></Column>
                    <Column field="nombreCompleto" header="Nombre Completo" filter></Column>
                    <Column field="departmentName" header="Departamento" filter></Column>
                    <Column field="jobName" header="Puesto" filter></Column>
                    <Column field="shiftName" header="Turno" filter style={{ width: '7rem', textAlign: 'center' }}></Column>
                    <Column field="evaluationStep" header="Evaluación" body={renderActions} style={{ textAlign: 'center' }}></Column>
                    <Column field="isActive" header="Estado" body={statusBodyTemplate} filter style={{ width: '8rem', textAlign: 'center' }} />
                </DataTable>
            }

            {visibleDialogForm &&
                <DialogEmployee
                    visible={visibleDialogForm}
                    setVisible={setVisibleDialogForm}
                    setEmployeesList={setEmployeesList}
                    dataEmployeeSelected={dataEmployeeSelected}
                    handleCloseDialog={handleCloseDialog}
                    onShowToast={createToast}
                />
            }
            {visibleDialogCard &&
                <EmployeeCard
                    visible={visibleDialogCard}
                    setVisible={setVisibleDialogCard}
                    employeeData={employeeSelected}
                />
            }
            {visibleDialogPhotoUploader &&
                <EmployeePhotoUploader
                    codeEmployee={employeeSelected?.codeEmployee}
                    completeName={employeeSelected?.nombreCompleto}
                    visible={visibleDialogPhotoUploader}
                    setVisible={setVisibleDialogPhotoUploader}
                    onShowToast={createToast}
                />
            }
            {visibleDisabledEmployee &&
                <DismissalEmployee
                    visible={visibleDisabledEmployee}
                    setVisible={setVisibleDisabledEmployee}
                    employeeList={employeesList}
                />
            }
        </>
    )
}

export default Employees
