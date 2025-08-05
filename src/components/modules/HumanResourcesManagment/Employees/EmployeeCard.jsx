import { useEffect, useRef, useState } from 'react'
import { PuffLoader } from "react-spinners";
import { Avatar, Box, Button, Chip, Divider, IconButton, } from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import PersonIcon from '@mui/icons-material/Person';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PercentIcon from '@mui/icons-material/Percent';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CakeIcon from '@mui/icons-material/Cake';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import EmergencyIcon from '@mui/icons-material/Emergency';
import ArticleIcon from '@mui/icons-material/Article';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import '../../../css/EmployeeCard.css';
import useEmployeePhoto from '../../../../hooks/usePhotoUrl';
import { isValidText } from '../../../../helpers/validator';

const EmployeeCard = ({ visible, setVisible, employeeData }) => {
    const { getEmployeePhoto } = useEmployeePhoto();
    const fichaRef = useRef();
    const [cantDays, setCantDays] = useState(0);
    let [loading, setLoading] = useState(false);
    const exportPDF = () => {
        setLoading(true);

        const input = document.getElementById('ficha-empleado');
        if (!input) return;

        html2canvas(input, {
            scale: 3,
            useCORS: true,
            scrollY: -window.scrollY,
            scrollX: 0,
            windowWidth: input.scrollWidth
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgWidthPx = imgProps.width;
            const imgHeightPx = imgProps.height;

            // Convert px to mm (1 px ~ 0.264583 mm)
            const pxToMm = 0.264583;
            const imgWidthMm = imgWidthPx * pxToMm;
            const imgHeightMm = imgHeightPx * pxToMm;

            let renderWidth = pdfWidth;
            let renderHeight = (imgHeightMm * renderWidth) / imgWidthMm;

            if (renderHeight <= pdfHeight) {
                // Fits on single page, no stretching
                pdf.addImage(imgData, 'PNG', 0, 0, renderWidth, renderHeight);
            } else {
                // Needs paging
                let position = 0;
                let heightLeft = renderHeight;

                while (heightLeft > 0) {
                    pdf.addImage(imgData, 'PNG', 0, position, renderWidth, renderHeight);
                    heightLeft -= pdfHeight;
                    position -= pdfHeight;
                    if (heightLeft > 0) {
                        pdf.addPage();
                    }
                }
            }

            pdf.save(`ficha_empleado_${employeeData?.employee[0].codeEmployee}.pdf`);
            setLoading(false);
        }).catch((error) => {
            console.error('Error generating PDF:', error);
            setLoading(false);
        });
    };


    useEffect(() => {
        setCantDays(dayjs().diff(dayjs(employeeData?.employee[0].hireDate), 'days'));
    }, [employeeData])

    const renderEvaluacion = () => {
        if (employeeData?.employee[0].isActive && !employeeData?.employee[0].evaluationStep && cantDays < 60) {
            return <Chip label="Periodo de prueba" color="info" variant="outlined" />
        } else if (employeeData?.employee[0].isActive && employeeData?.employee[0].evaluationStep) {
            return (<Chip label="Pasó evaluación" color="success" variant="outlined" />);
        } else if (employeeData?.employee[0].isActive && !employeeData?.employee[0].evaluationStep && cantDays > 60) {
            return (<Chip label="Pendiente de Evaluación" color="warning" variant="outlined" />);
        } else if (!employeeData?.employee[0].isActive && employeeData?.employee[0].evaluationStep) {
            return (<Chip label="Pasó evaluación despido" color="success" variant="outlined" />);
        } else if (!employeeData?.employee[0].isActive && !employeeData?.employee[0].evaluationStep) {
            return (<Chip label="No pasó evaluación despido" color="error" variant="outlined" />);
        } else {
            return (<Chip label="Sin evaluación" color="default" variant="outlined" />);
        }
    };

    return (
        <>
            {!loading &&
                <div className='animate__animated animate__fadeInRight'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <IconButton aria-label="back" size="large" onClick={() => setVisible(false)}>
                            <ArrowBackIcon fontSize="inherit" />
                        </IconButton>
                        <Button variant="contained" color="error" onClick={exportPDF}>
                            Exportar PDF
                        </Button>
                    </div>
                    <div ref={fichaRef} id='ficha-empleado' className='ficha-empleado'>
                        <br />
                        <p className='label-section'> <PersonIcon fontSize="inherit" className='icon-section' /> Datos generales</p>
                        <Box component="section">
                            <div className='div-datos-generales'>
                                <div className='div-datos'>
                                    <div className='div-avatar'>
                                        <Avatar
                                            alt={employeeData?.employee[0].fullName}
                                            src={getEmployeePhoto(employeeData?.employee[0].photoUrl || '')}
                                            sx={{ width: 100, height: 100 }}
                                        />
                                        {employeeData?.employee[0].incapacitated > 0 && <h4 style={{ color: '#bea800' }}>Incapacitado</h4>}
                                        <p className='valor'>Código: <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].codeEmployee}</span> </p>
                                        <p className='valor'>{employeeData?.employee[0].fullName}</p>
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
                                    {!employeeData?.employee[0].isActive &&
                                        <>
                                            <Divider orientation="vertical" variant="middle" flexItem />
                                            <div>
                                                <h3 style={{ color: '#aa0000' }}>INACTIVO</h3>
                                                <p className='valor'>
                                                    <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].dismissalDesc}</span> |
                                                    <span style={{ fontWeight: '200' }}> {isValidText(employeeData?.employee[0].dateDismissal) ?
                                                        dayjs(employeeData?.employee[0].dateDismissal).format('DD MMMM YYYY') : '-'
                                                    }</span>
                                                </p>
                                                <strong>Comentario</strong>
                                                <p style={{ margin: '0' }}><span style={{ fontWeight: '200' }}>{employeeData?.employee[0].comment || '-'}</span></p>
                                            </div>
                                        </>
                                    }
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
                                        {employeeData?.employee[0].linesNumber &&
                                            <>
                                                <p>
                                                    <strong>Linea </strong>
                                                    <span style={{ fontWeight: '200' }}>{employeeData?.employee[0].linesNumber}</span>
                                                </p>
                                                <Divider orientation="vertical" variant="middle" flexItem />
                                            </>
                                        }
                                        {employeeData?.employee[0].supervisorName &&
                                            <>
                                                <p>
                                                    <strong>Supervisor </strong>
                                                    <span style={{ fontWeight: '200' }}>{isValidText(employeeData?.employee[0].supervisorName) ? employeeData?.employee[0].supervisorName : 'Sin supervisor'}</span>
                                                </p>
                                                <Divider orientation="vertical" variant="middle" flexItem />
                                            </>
                                        }
                                        {renderEvaluacion()}
                                    </div>
                                </div>
                            </div>
                        </Box>
                        {employeeData?.children.length > 0 &&
                            <>
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <p className='label-section'> <EscalatorWarningIcon fontSize="inherit" className='icon-section' /> Hijos</p>
                                <Box component="section" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                                    {
                                        <div className="card-container">
                                            {employeeData?.children.map((c, index) => (
                                                <>
                                                    <div className="div-card" key={index}>
                                                        <strong>{c.fullName}</strong>
                                                        <p> <CalendarMonthIcon fontSize="inherit" sx={{ color: '#720000', fontSize: '20px' }} /> {dayjs(c.birthDate).format('DD MMMM YYYY')}</p>
                                                        <p> <ArticleIcon fontSize="inherit" sx={{ color: '#720000', fontSize: '20px' }} />{c.birthCert}</p>
                                                        <p>{c.genderName}</p>
                                                        <p>{index} {employeeData?.children.length}</p>
                                                    </div>
                                                    {
                                                        index < employeeData?.children.length - 1 && (
                                                            <Divider orientation="vertical" variant="middle" flexItem />
                                                        )}
                                                </>
                                            ))
                                            }
                                        </div>
                                    }
                                </Box>
                            </>
                        }
                        {employeeData?.familyInformation.length > 0 &&
                            <>
                                <p className='label-section'><FamilyRestroomIcon fontSize="inherit" className='icon-section' /> Información Familiar</p>
                                <Box component="section" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                                    <div className="card-container">
                                        {employeeData?.familyInformation.map((f, index) => (
                                            <>
                                                <div className="div-card" key={index}>
                                                    <p>{f.relativesTypeDesc} | <strong>Edad </strong> {f.age}</p>
                                                    <strong>{f.fullName}</strong>
                                                </div>
                                                {index < employeeData?.familyInformation.length - 1 && (
                                                    <Divider orientation="vertical" variant="middle" flexItem />
                                                )}
                                            </>
                                        ))}
                                    </div>
                                </Box>
                            </>
                        }
                        {employeeData?.econtact.length > 0 &&
                            <>
                                <p className='label-section'><ContactEmergencyIcon fontSize="inherit" className='icon-section' /> Contactos de emergencia</p>
                                <Box component="section" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                                    {
                                        <div className="card-container">
                                            {employeeData?.econtact.map((f, index) => (
                                                <>
                                                    <div className="div-card" key={index}>
                                                        <p><EmergencyIcon fontSize="inherit" sx={{ color: '#720000', fontSize: '28px' }} /> <strong>{f.fullName}</strong></p>
                                                        <p>{f.relativesTypeDesc}</p>
                                                        <p><PhoneIcon fontSize="inherit" sx={{ color: '#000000', fontSize: '20px' }} /> {f.phoneNumber}</p>
                                                        <p>{f.direccion}</p>
                                                    </div>
                                                    {index < employeeData?.econtact.length - 1 && (
                                                        <Divider orientation="vertical" variant="middle" flexItem />
                                                    )}
                                                </>
                                            ))
                                            }
                                        </div>
                                    }
                                </Box>
                            </>
                        }
                        {
                            employeeData?.auxrelative.length > 0 &&
                            <>
                                <p className='label-section'><ApartmentIcon fontSize="inherit" className='icon-section' />Familiares dentro de la empresa</p>
                                <Box component="section" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                                    {
                                        <div className="card-container">
                                            {employeeData?.auxrelative.map((f, index) => (
                                                <>
                                                    <div className="div-card" key={index}>
                                                        <strong>{f.firstName} {f.middleName} {f.lastName} {f.secondLastName}</strong>
                                                        <p>{f.relativesTypeDesc}</p>
                                                    </div>
                                                    {index < employeeData?.auxrelative.length - 1 && (
                                                        <Divider orientation="vertical" variant="middle" flexItem />
                                                    )}
                                                </>
                                            ))}
                                        </div>
                                    }
                                </Box>
                            </>
                        }
                        {
                            employeeData?.beneficiaries.length > 0 &&
                            <>
                                <p className='label-section'><LoyaltyIcon fontSize="inherit" className='icon-section' /> Beneficiarios</p>
                                <Box component="section" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }} className='avoid-page-break'>
                                    {
                                        <div className="card-container">
                                            {employeeData?.beneficiaries.map((f, index) => (
                                                <>
                                                    <div className="div-card" key={index}>
                                                        <strong>{f.completeName}</strong>
                                                        <p>{f.relativesTypeDesc}</p>
                                                        <strong><PercentIcon fontSize="inherit" className='icon-section' /> {f.percentage}</strong>
                                                        <p> {f.phoneNumber && <PhoneIcon fontSize="inherit" sx={{ color: '#000000', fontSize: '20px' }} />} {f.phoneNumber}</p>
                                                    </div>
                                                    {index < employeeData?.beneficiaries.length - 1 && (
                                                        <Divider orientation="vertical" variant="middle" flexItem />
                                                    )}
                                                </>
                                            ))
                                            }
                                        </div>
                                    }
                                </Box>
                            </>
                        }
                    </div>
                </div>
            }
            {
                loading &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <h3>Generando PDF...</h3>
                    <br />
                    <PuffLoader loading={true} color="#838383" size={300} />
                </div>
            }
        </>
    )
}

export default EmployeeCard
