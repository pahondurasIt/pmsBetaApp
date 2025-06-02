import React, { useEffect, useState } from 'react'
import { Dialog, ListBox } from 'primereact';
import { Alert, Box, Button, Chip, Divider } from '@mui/material';
import dayjs from 'dayjs';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

import '../../../css/EmployeeCard.css'
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
                        <p>Código: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].codeEmployee}</span> </p>
                        <p>Nombre: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].nombreCompleto}</span></p>
                        <p>Fecha Ingreso: <span style={{ fontWeight: '200' }}>{dayjs(employeeData?.employee[0].hireDate).format('YYYY-MM-DD')}</span></p>
                        <p>Tipo de documento: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].docTypeName}</span></p>
                        <p>Documento: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].docNumber}</span></p>
                        <p>Genero: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].genderName}</span></p>
                        <p>Tipo planilla: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].payrollName}</span></p>
                        <p>Tipo contrato: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].statusDesc}</span></p>
                        <p>Nacionalidad: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].nationality}</span></p>
                        <p>Salario: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].salary}</span></p>
                        {
                            employeeData?.employee[0].incapacitated > 0 &&
                            <Chip label="Incapacitado" color="error" />
                        }
                    </div>
                    <div>
                        <p>Telefono: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].phoneNumber}</span></p>
                        <p>Nivel Educativo: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].educationLevelName}</span> </p>
                        <p>Titulo obtenido: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].educationGrade}</span></p>
                        <p>Fecha nacimiento: <span style={{ fontWeight: '200' }}>{dayjs(employeeData?.employee[0].birthDate).format('YYYY-MM-DD')}</span></p>
                        <p>Talla de gabacha: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].gabacha}</span></p>
                        <p>Talla de camiseta: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].shirt}</span></p>
                        <p>Tipo de sangre: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].bloodTypeName}</span></p>
                        <p>Medio de transporte: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].
                            transportTypeName}</span></p>
                        <p>Estado civil: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].maritalStatusName}</span></p>
                        {
                            (employeeData?.employee[0].maritalStatusID === 2 || employeeData?.employee[0].maritalStatusID === 3) &&

                            <>
                                <p>Nombre conyugue: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].partnerName}</span></p>
                                <p>Edad conyugue: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].partnerage}</span></p>
                            </>
                        }
                    </div>
                </Box>
                <Alert icon={<CorporateFareIcon fontSize="inherit" />} severity="info">Información área de trabajo</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <div>
                        <p>Divisón: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].stateName}</span> </p>
                        <p>Area: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].areaName}</span></p>
                        <p>Departamento: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].departmentName}</span></p>
                        <p>Puesto: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].jobName}</span></p>
                    </div>
                    <div>

                        {
                            employeeData?.employee[0].supervisorName &&
                            <p>Supervisor: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].supervisorName}</span></p>
                        }
                        <p>Turno: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].suburbName}</span></p>
                        {
                            employeeData?.employee[0].evaluationStep ?
                                <p style={{ color: '#4c8e00' }}>Pasó la prueba</p>
                                :
                                <p style={{ color: '#ac0606' }}>No pasó la prueba</p>}
                    </div>
                </Box>
                <Alert icon={<HomeIcon fontSize="inherit" />} severity="info">Información de domicilio</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <div>
                        <p>Departamento: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].stateName}</span> </p>
                        <p>Municipio: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].cityName}</span></p>
                        <p>Dirección: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].adress}</span></p>

                    </div>
                    <div>
                        <p>Sector: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].sectorName}</span></p>
                        <p>Suburbio: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].suburbName}</span></p>
                    </div>
                </Box>
                <Alert icon={<EscalatorWarningIcon fontSize="inherit" />} severity="info">Hijos</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    {
                        employeeData?.children.map((c) => (
                            <p>
                                Nombre: <span style={{ fontWeight: '200' }}>{c.nombreCompleto} </span>
                                Fecha de nacimiento: <span style={{ fontWeight: '200' }}>{c.birthdate} </span>
                                Partida de nacimiento: <span style={{ fontWeight: '200' }}>{c.birthCert} </span>
                                Genero: <span style={{ fontWeight: '200' }}>{c.genderName} </span>
                            </p>
                        ))
                    }


                </Box>
                <Alert icon={<FamilyRestroomIcon fontSize="inherit" />} severity="info">Información Familiar</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    {
                        employeeData?.familyInformation.map((f) => (
                            <p>
                                Parentesco: <span style={{ fontWeight: '200' }}>{f.relativesTypeDesc} </span>
                                Nombre: <span style={{ fontWeight: '200' }}>{f.nombreCompleto} </span>
                                Edad: <span style={{ fontWeight: '200' }}>{f.age} </span>
                            </p>
                        ))
                    }
                </Box>
                <Alert icon={<ContactEmergencyIcon fontSize="inherit" />} severity="info">Contactos de emergencia</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    {
                        employeeData?.econtact.map((f) => (
                            <>
                                <p>
                                    Nombre: <span style={{ fontWeight: '200' }}>{f.nombreCompleto} </span>
                                    Parentesco: <span style={{ fontWeight: '200' }}>{f.relativesTypeDesc} </span>
                                    Telefono: <span style={{ fontWeight: '200' }}>{f.phoneNumber} </span>
                                </p>
                                <p>Dirección: <span style={{ fontWeight: '200' }}>{f.direccion} </span></p>
                            </>
                        ))
                    }
                </Box>
                <Alert icon={<LoyaltyIcon fontSize="inherit" />} severity="info">Benefiarios</Alert>
                <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    {
                        employeeData?.beneficiaries.map((f) => (
                            <>
                                <p>
                                    Nombre: <span style={{ fontWeight: '200' }}>{f.nombreCompleto} </span>
                                    Parentesco: <span style={{ fontWeight: '200' }}>{f.relativesTypeDesc} </span>
                                    Porcentage: <span style={{ fontWeight: '200' }}>{f.percentage} </span>
                                    Telefono: <span style={{ fontWeight: '200' }}>{f.phone} </span>
                                </p>
                                <Divider />
                            </>

                        ))
                    }
                </Box>

            </Dialog>
        </>
    )
}

export default EmployeeCard
