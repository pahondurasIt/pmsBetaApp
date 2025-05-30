import React from 'react'
import { Dialog } from 'primereact';
import { Alert, Box, Button, Chip } from '@mui/material';
import dayjs from 'dayjs';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
const EmployeeCard = ({ visible, setVisible, employeeData }) => {
    console.log(employeeData);

    return (
        <>
            <Dialog
                header={
                    <div>
                        <h3>Ficha del empleado</h3>
                    </div>
                }
                visible={visible}
                style={{ width: '65vw' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
                footer={
                    <div className="flex justify-content-end gap-3">
                        <Button size='small' variant="outlined" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <Alert icon={<PersonIcon fontSize="inherit" />} severity="info">Datos generales</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <div>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Código: <span style={{ fontWeight: '200' }}>{employeeData?.codeEmployee}</span> </p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Nombre: <span style={{ fontWeight: '200' }}>{employeeData?.nombreCompleto}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Fecha Ingreso: <span style={{ fontWeight: '200' }}>{dayjs(employeeData?.hireDate).format('YYYY-MM-DD')}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Tipo de documento: <span style={{ fontWeight: '200' }}>{employeeData?.docTypeName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Documento: <span style={{ fontWeight: '200' }}>{employeeData?.docNumber}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Genero: <span style={{ fontWeight: '200' }}>{employeeData?.genderName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Tipo planilla: <span style={{ fontWeight: '200' }}>{employeeData?.payrollName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Tipo contrato: <span style={{ fontWeight: '200' }}>{employeeData?.statusDesc}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Nacionalidad: <span style={{ fontWeight: '200' }}>{employeeData?.nationality}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Salario: <span style={{ fontWeight: '200' }}>{employeeData?.salary}</span></p>
                        {
                            employeeData?.incapacitated > 0 &&
                            <Chip label="Incapacitado" color="error" />
                        }

                    </div>
                    <div>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Telefono: <span style={{ fontWeight: '200' }}>{employeeData?.phoneNumber}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Nivel Educativo: <span style={{ fontWeight: '200' }}>{employeeData?.educationLevelName}</span> </p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Titulo obtenido: <span style={{ fontWeight: '200' }}>{employeeData?.educationGrade}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Fecha nacimiento: <span style={{ fontWeight: '200' }}>{dayjs(employeeData?.birthDate).format('YYYY-MM-DD')}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Talla de gabacha: <span style={{ fontWeight: '200' }}>{employeeData?.gabacha}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Talla de camiseta: <span style={{ fontWeight: '200' }}>{employeeData?.shirt}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Tipo de sangre: <span style={{ fontWeight: '200' }}>{employeeData?.bloodTypeName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Medio de transporte: <span style={{ fontWeight: '200' }}>{employeeData?.
                            transportTypeName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Estado civil: <span style={{ fontWeight: '200' }}>{employeeData?.maritalStatusName}</span></p>
                        {
                            (employeeData?.maritalStatusID === 2 || employeeData?.maritalStatusID === 3) &&

                            <>
                                <p style={{ fontWeight: '600', margin: '0px' }}>Nombre conyugue: <span style={{ fontWeight: '200' }}>{employeeData?.partnerName}</span></p>
                                <p style={{ fontWeight: '600', margin: '0px' }}>Edad conyugue: <span style={{ fontWeight: '200' }}>{employeeData?.partnerage}</span></p>
                            </>
                        }
                    </div>
                </Box>
                <Alert icon={<CorporateFareIcon fontSize="inherit" />} severity="info">Información área de trabajo</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <div>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Divisón: <span style={{ fontWeight: '200' }}>{employeeData?.stateName}</span> </p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Area: <span style={{ fontWeight: '200' }}>{employeeData?.areaName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Departamento: <span style={{ fontWeight: '200' }}>{employeeData?.departmentName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Puesto: <span style={{ fontWeight: '200' }}>{employeeData?.jobName}</span></p>
                    </div>
                    <div>

                        {
                            employeeData?.supervisorName &&
                            <p style={{ fontWeight: '600', margin: '0px' }}>Supervisor: <span style={{ fontWeight: '200' }}>{employeeData?.supervisorName}</span></p>
                        }
                        <p style={{ fontWeight: '600', margin: '0px' }}>Turno: <span style={{ fontWeight: '200' }}>{employeeData?.suburbName}</span></p>
                        {
                            employeeData?.evaluationStep ?
                                <Chip label="Paso prueba" color="success" />
                                :
                                <Chip label="No pasó prueba" color="error" />
                        }
                    </div>
                </Box>
                <Alert icon={<HomeIcon fontSize="inherit" />} severity="info">Información de domicilio</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <div>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Departamento: <span style={{ fontWeight: '200' }}>{employeeData?.stateName}</span> </p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Municipio: <span style={{ fontWeight: '200' }}>{employeeData?.cityName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Dirección: <span style={{ fontWeight: '200' }}>{employeeData?.adress}</span></p>

                    </div>
                    <div>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Sector: <span style={{ fontWeight: '200' }}>{employeeData?.sectorName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Suburbio: <span style={{ fontWeight: '200' }}>{employeeData?.suburbName}</span></p>
                    </div>
                </Box>
                <Alert icon={<HomeIcon fontSize="inherit" />} severity="info">Información Familiar</Alert>
                {/* <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>

                    <div>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Departamento: <span style={{ fontWeight: '200' }}>{employeeData?.stateName}</span> </p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Municipio: <span style={{ fontWeight: '200' }}>{employeeData?.cityName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Dirección: <span style={{ fontWeight: '200' }}>{employeeData?.adress}</span></p>

                    </div>
                    <div>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Sector: <span style={{ fontWeight: '200' }}>{employeeData?.sectorName}</span></p>
                        <p style={{ fontWeight: '600', margin: '0px' }}>Suburbio: <span style={{ fontWeight: '200' }}>{employeeData?.suburbName}</span></p>
                    </div>
                </Box> */}


                {/* Hijos
                {employee.children?.length > 0 && (
                    <section className="mb-4 p-3 bg-blue-50 rounded">
                        <h5 className="text-lg font-semibold text-blue-900 mb-2">Hijos</h5>
                        {employee.children.map((child, index) => (
                            <div key={index} className="mb-2">
                                <strong>Nombre:</strong> {child.fullName} – <strong>Fecha de nacimiento:</strong> {child.birthdate}
                            </div>
                        ))}
                    </section>
                )} */}

                {/* Contacto de emergencia
                <section className="mb-4 p-3 bg-blue-50 rounded">
                    <h5 className="text-lg font-semibold text-blue-900 mb-2">Contacto de emergencia</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>Nombre:</strong> {employee.emergencyContactName}</div>
                        <div><strong>Teléfono:</strong> {employee.emergencyContactPhone}</div>
                    </div>
                </section> */}

            </Dialog>
        </>
    )
}

export default EmployeeCard
