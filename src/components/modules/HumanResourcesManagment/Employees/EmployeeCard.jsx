import { useRef } from 'react'
import { Dialog } from 'primereact';
import { Alert, Avatar, Box, Button, Chip, Divider, } from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CloseIcon from '@mui/icons-material/Close';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PercentIcon from '@mui/icons-material/Percent';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CakeIcon from '@mui/icons-material/Cake';
import DoneIcon from '@mui/icons-material/Done';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import EmergencyIcon from '@mui/icons-material/Emergency';
import ArticleIcon from '@mui/icons-material/Article';

import html2pdf from "html2pdf.js";

import '../../../css/EmployeeCard.css';
import useEmployeePhoto from '../../../../hooks/usePhotoUrl';

const EmployeeCard = ({ visible, setVisible, employeeData }) => {
    const { getEmployeePhoto } = useEmployeePhoto();
    const fichaRef = useRef();

    const handleExportPDF = () => {
        const element = fichaRef.current;
        const opt = {
            margin: 0.5,
            filename: `ficha_${employeeData?.employee[0].nombreCompleto}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

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
                <Button variant="contained" color="error" onClick={handleExportPDF}>
                    Exportar PDF
                </Button>
                <br />
                <br />
                <div ref={fichaRef}>
                    <Alert
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            color: '#ffffff',
                            background: 'linear-gradient(88deg, rgba(31, 31, 31, 1) 0%, rgba(128, 128, 128, 1) 52%, rgba(217, 217, 217, 1) 96%)',
                            fontSize: '17px',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0px 0px 0px 25px'
                        }}
                        className='alert-datos'
                        icon={<PersonIcon fontSize="inherit" sx={{ color: '#ffffff', fontSize: '28px' }} />} >
                        Datos generales
                    </Alert>
                    <Box component="section" sx={{ p: 2 }} >
                        <div className='div-datos-generales'>
                            <div>
                                {!employeeData?.employee[0].isActive &&
                                    <Chip label="INACTIVO" sx={{ letterSpacing: '10px', fontSize: '25px' }} color="error" />
                                }
                                {
                                    employeeData?.employee[0].incapacitated > 0 &&
                                    <>
                                        <Alert
                                            style={{
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                color: '#2d2d2d',
                                                fontSize: '15px'
                                            }}
                                            icon={<CloseIcon fontSize="inherit" sx={{ color: '#bea800' }} />}
                                            severity="warning"
                                        >
                                            Incapacitado
                                        </Alert>
                                    </>
                                }
                            </div>
                            <br />
                            <div className='div-datos'>

                                <div className='div-avatar'>
                                    <Avatar
                                        alt={employeeData?.employee[0].nombreCompleto}
                                        src={getEmployeePhoto(employeeData?.employee[0].photoUrl || '')}
                                        sx={{ width: 100, height: 100 }}
                                    />
                                    <p className='valor'>Código: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].codeEmployee}</span> </p>
                                    <p className='valor'>{employeeData?.employee[0].nombreCompleto}</p>
                                    <p className='valor'>Ingreso: <span style={{ fontWeight: '200' }}>{dayjs(employeeData?.employee[0].hireDate).format('DD MMMM  YYYY')}</span></p>
                                    <p className='valor'>{employeeData?.employee[0].jobName}</p>
                                </div>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <div>
                                    <p className='valor'>{employeeData?.employee[0].docTypeName}: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].docNumber}</span></p>
                                    <p className='valor'>Contrato: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].statusDesc} | {employeeData?.employee[0].payrollName}</span></p>
                                    <p className='valor'>Nacionalidad: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].nationality}</span></p>
                                    <p className='valor'><DirectionsCarIcon fontSize="inherit" sx={{ fontSize: '20px' }} />
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].transportTypeName}</span>
                                    </p>
                                    <p className='valor'><SchoolIcon fontSize="inherit" sx={{ fontSize: '20px' }} />
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].educationLevelName} | {employeeData?.employee[0].educationGrade}</span></p>

                                    <p className='valor'><CakeIcon fontSize="inherit" sx={{ fontSize: '20px' }} />
                                        <span style={{ fontWeight: '200' }}>{dayjs(employeeData?.employee[0].birthDate).format('DD MMMM YYYY')}</span>
                                    </p>
                                    <p className='valor'><AttachMoneyIcon fontSize="inherit" sx={{ fontSize: '20px' }} /> <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].salary || '-'}</span></p>
                                </div>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <div>
                                    <p className='valor'>Turno: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].shiftName}</span></p>
                                    <p className='valor'>Talla: <span style={{ fontWeight: '200' }}>Gabacha {employeeData?.employee[0].gabacha} | Camiseta {employeeData?.employee[0].shirt}</span></p>
                                    <p className='valor'>Estado civil: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].maritalStatusName}</span></p>
                                    {
                                        (employeeData?.employee[0].maritalStatusID === 2 || employeeData?.employee[0].maritalStatusID === 3) &&
                                        <>
                                            <p className='valor'>Conyugue:
                                                <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].partnerName} | {employeeData?.employee[0].partnerage} años</span>
                                            </p>
                                        </>
                                    }
                                    <p className='valor'>Género: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].genderName}</span></p>
                                    <p className='valor'><BloodtypeIcon fontSize="inherit" sx={{ fontSize: '20px' }} />
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].bloodTypeName}</span>
                                    </p>
                                    <p className='valor'><PhoneIcon fontSize="inherit" sx={{ fontSize: '20px' }} />
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].phoneNumber || '-'} </span>
                                    </p>

                                </div>
                            </div>
                            <br />
                            <Divider variant="middle" flexItem />
                            <br />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p className='valor'><PersonPinCircleIcon fontSize="inherit" sx={{ fontSize: '20px' }} />Información de domicilio</p>
                                <p className='valor'><span style={{ fontWeight: '200' }}>
                                    {employeeData?.employee[0].stateName}, {employeeData?.employee[0].cityName}, {employeeData?.employee[0].sectorName}, {employeeData?.employee[0].suburbName}, {employeeData?.employee[0].adress}</span>
                                </p>
                            </div>
                            <br />
                            <Divider variant="middle" flexItem />
                            <br />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p className='valor'><CorporateFareIcon fontSize="inherit" sx={{ fontSize: '20px' }} />Información del área de trabajo</p>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
                                    <p>
                                        <strong>División </strong>
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].divisionName}</span>
                                    </p>
                                    <Divider orientation="vertical" variant="middle" flexItem />
                                    <p>
                                        <strong>Área </strong>
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].areaName}</span>
                                    </p>
                                    <Divider orientation="vertical" variant="middle" flexItem />
                                    <p>
                                        <strong>Departamento </strong>
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].departmentName}</span>
                                    </p>
                                    <Divider orientation="vertical" variant="middle" flexItem />
                                    {employeeData?.employee[0].line &&
                                        <>
                                            <p>
                                                <strong>Linea </strong>
                                                <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].line}</span>
                                            </p>
                                            <Divider orientation="vertical" variant="middle" flexItem />
                                        </>
                                    }
                                    <p>
                                        <strong>Supervisor </strong>
                                        <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].supervisorName || 'Sin supervisor'}</span>
                                    </p>
                                    <Divider orientation="vertical" variant="middle" flexItem />
                                    {employeeData?.employee[0].evaluationStep ?
                                        <Alert
                                            style={{
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                color: '#2d2d2d',
                                                fontSize: '15px'
                                            }}
                                            icon={<DoneIcon fontSize="inherit" sx={{ color: '#3f750b' }} />}
                                            severity="success"
                                        >
                                            Pasó la prueba
                                        </Alert>
                                        :
                                        <Alert
                                            style={{
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                color: '#2d2d2d',
                                                fontSize: '15px'
                                            }}
                                            icon={<CloseIcon fontSize="inherit" sx={{ color: '#720000' }} />}
                                            severity="error"
                                        >
                                            No pasó la prueba
                                        </Alert>
                                    }
                                </div>


                            </div>
                        </div>
                    </Box>
                    {employeeData?.children.length > 0 &&
                        <>
                            <Alert
                                style={{
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    color: '#ffffff',
                                    background: 'linear-gradient(88deg, rgba(31, 31, 31, 1) 0%, rgba(128, 128, 128, 1) 52%, rgba(217, 217, 217, 1) 96%)',
                                    fontSize: '17px',
                                    letterSpacing: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0px 0px 0px 25px'
                                }}
                                icon={<EscalatorWarningIcon fontSize="inherit" sx={{ color: '#ffffff', fontSize: '28px' }} />}
                                className='avoid-page-break'
                            >
                                Hijos
                            </Alert>
                            <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                                {
                                    <div className="card-container">
                                        {employeeData?.children.map((c, index) => (
                                            <div className="div-card" key={index}>
                                                <strong>{c.nombreCompleto}</strong>
                                                <p> <CalendarMonthIcon fontSize="inherit" sx={{ color: '#720000', fontSize: '20px' }} /> {dayjs(c.birthDate).format('DD MMMM YYYY')}</p>
                                                <p> <ArticleIcon fontSize="inherit" sx={{ color: '#720000', fontSize: '20px' }} />{c.birthCert}</p>
                                                <p>{c.genderName}</p>
                                            </div>
                                        ))
                                        }
                                    </div>
                                }
                            </Box>
                        </>
                    }
                    <Alert
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            color: '#ffffff',
                            background: 'linear-gradient(88deg, rgba(31, 31, 31, 1) 0%, rgba(128, 128, 128, 1) 52%, rgba(217, 217, 217, 1) 96%)',
                            fontSize: '17px',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0px 0px 0px 25px'
                        }}
                        icon={<FamilyRestroomIcon fontSize="inherit" sx={{ color: '#ffffff', fontSize: '28px' }} />}
                        className='avoid-page-break'
                    >
                        Información Familiar
                    </Alert>
                    <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                        <div className="card-container">
                            {employeeData?.familyInformation.map((f, index) => (
                                <div className="div-card" key={index}>
                                    <p>{f.relativesTypeDesc} | <strong>Edad </strong> {f.age}</p>
                                    <strong>{f.nombreCompleto}</strong>
                                </div>
                            ))}
                        </div>
                    </Box>
                    <Alert
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            color: '#ffffff',
                            background: 'linear-gradient(88deg, rgba(31, 31, 31, 1) 0%, rgba(128, 128, 128, 1) 52%, rgba(217, 217, 217, 1) 96%)',
                            fontSize: '17px',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0px 0px 0px 25px'
                        }}
                        icon={<ContactEmergencyIcon fontSize="inherit" sx={{ color: '#ffffff', fontSize: '28px' }} />}
                        className='avoid-page-break'
                    >
                        Contactos de emergencia
                    </Alert>
                    <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                        {
                            <div className="card-container">
                                {employeeData?.econtact.map((f, index) => (
                                    <div className="div-card" key={index}>
                                        <EmergencyIcon fontSize="inherit" sx={{ color: '#720000', fontSize: '28px' }} /> <strong>{f.nombreCompleto}</strong>
                                        <p>{f.relativesTypeDesc}</p>
                                        <p><PhoneIcon fontSize="inherit" sx={{ color: '#000000', fontSize: '20px' }} /> {f.phoneNumber}</p>
                                        <p>{f.direccion}</p>
                                    </div>
                                ))
                                }
                            </div>
                        }
                    </Box>
                    <Alert
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            color: '#ffffff',
                            background: 'linear-gradient(88deg, rgba(31, 31, 31, 1) 0%, rgba(128, 128, 128, 1) 52%, rgba(217, 217, 217, 1) 96%)',
                            fontSize: '17px',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0px 0px 0px 25px'
                        }}
                        icon={<ApartmentIcon fontSize="inherit" sx={{ color: '#ffffff', fontSize: '28px' }} />}
                        className='avoid-page-break'
                    >
                        Familiares dentro de la empresa
                    </Alert>
                    <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                        {
                            <div className="card-container">
                                {employeeData?.auxrelative.map((f, index) => (
                                    <div className="div-card" key={index}>
                                        <strong>{f.firstName} {f.middleName} {f.lastName} {f.secondLastName}</strong>
                                        <p>{f.relativesTypeDesc}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    </Box>
                    <Alert
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            color: '#ffffff',
                            background: 'linear-gradient(88deg, rgba(31, 31, 31, 1) 0%, rgba(128, 128, 128, 1) 52%, rgba(217, 217, 217, 1) 96%)',
                            fontSize: '17px',
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0px 0px 0px 25px'
                        }}
                        icon={<LoyaltyIcon fontSize="inherit" sx={{ color: '#ffffff', fontSize: '28px' }} />}
                        className='avoid-page-break'
                    >
                        Beneficiarios
                    </Alert>
                    <Box component="section" sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                        {
                            <div className="card-container">
                                {employeeData?.beneficiaries.map((f, index) => (
                                    <div className="div-card" key={index}>
                                        <strong>{f.completeName}</strong>
                                        <p>{f.relativesTypeDesc}</p>
                                        <strong><PercentIcon fontSize="inherit" sx={{ color: '#004a72', fontSize: '20px' }} /> {f.percentage}</strong>
                                        <p> {f.phoneNumber && <PhoneIcon fontSize="inherit" sx={{ color: '#000000', fontSize: '20px' }} />} {f.phoneNumber}</p>
                                    </div>
                                ))
                                }
                            </div>
                        }
                    </Box>
                </div>
            </Dialog>
        </>
    )
}

export default EmployeeCard
