import React, { useEffect, useState } from 'react'
import { Dialog, Accordion, AccordionTab, DataTable, Column } from 'primereact';
import { Autocomplete, Button, Checkbox, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { InputNumber, FloatLabel } from 'primereact';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GroupIcon from '@mui/icons-material/Group';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../../../css/DialogEmployeeStyle.css'
import { apipms } from '../../../../service/apipms';
import dayjs from '../../../../helpers/dayjsConfig';

const DialogEmployee = ({ visible, setVisible }) => {
    const [employeeData, setEmployeeData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        secondLastName: '',
        phoneNumber: '',
        genderID: 1,
        docID: 1,
        docNumber: null,
        photoUrl: null,
        birthDate: null,
        bloodTypeID: 1,
        stateID: null,
        cityID: null,
        sectorID: null,
        suburbID: null,
        supervisorID: null,
        address: null,
        gabachSize: null,
        shirtSize: null,
        divisionID: null,
        areaID: null,
        departmentID: null,
        jobID: null,
        hireDate: dayjs(),
        endDate: dayjs(),
        isActive: true,
        partnerName: null,
        partnerAge: null,
        companyID: null,
        contractStatusID: null,
        payroll: null,
        educationLevelID: 1,
        educationGrade: '',
        transportTypeID: 1,
        maritalStatusID: 1,
        nationality: 1,
        requisition: null,
        replacementRequition: null,
        evaluationStep: false,
        line: null,
        incapacitated: false,
        salary: 0,
    });
    const [childrenData, setChildrenData] = useState({
        firstName: null,
        middleName: null,
        lastName: null,
        secondLastName: null,
        birthDate: dayjs(),
        birthCert: null,
        genderID: 1,
        employeeID: null
    })
    const [childrenList, setChildrenList] = useState([]);
    const [familyData, setFamilyData] = useState({
        relativesTypeID: 1,
        firstName: null,
        middleName: null,
        lastName: null,
        secondLastName: null,
        age: ''
    });
    const [familyList, setFamilyList] = useState([]);
    const [emergencyData, setEmergencyData] = useState({
        firstName: null,
        middleName: null,
        lastName: null,
        secondLastName: null,
        stateID: null,
        cityID: null,
        sectorID: null,
        suburbID: null,
        relativesTypeID: 1,
        phoneNumber: null,
    });
    const [emergencyList, setEmergencyList] = useState([]);
    const [familyPAH, setFamilyPAH] = useState(false);
    const [familyPAHList, setFamilyPAHList] = useState([]);
    const [beneficiariesData, setBeneficiariesData] = useState({
        firstName: null,
        middleName: null,
        lastName: null,
        secondLastName: null,
        relativesTypeID: 1,
        percentage: 0,
        phoneNumber: null,

    });
    const [beneficiariesList, setBeneficiariesList] = useState([]);

    const [employeesList, setEmployeesList] = useState([]);
    const [gender, setGender] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [transportTypes, setTransportTypes] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [suburbs, setSuburbs] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);
    const [relativesType, setRelativesType] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [areas, setAreas] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [visiblePartner, setvisiblePartner] = useState(false)

    useEffect(() => {
        apipms.get('/dataForm')
            .then((response) => {
                setGender(response.data.gender);
                setBloodTypes(response.data.bloodTypes);
                setMaritalStatus(response.data.maritalStatus);
                setTransportTypes(response.data.transportTypes);
                setDocumentTypes(response.data.documentTypes);
                setStates(response.data.states);
                setCities(response.data.cities);
                setSectors(response.data.sectors);
                setSuburbs(response.data.suburbs);
                setSizes(response.data.sizes);
                setEducationLevels(response.data.educationLevels);
                setRelativesType(response.data.relativesType);
                setDivisions(response.data.divisions);
                setAreas(response.data.areas);
                setDepartments(response.data.departments);
                setJobs(response.data.jobs);
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const defaultPropsState = {
        options: states,
        getOptionLabel: (option) => option.stateName,
    };
    const defaultPropsCity = {
        options: cities,
        getOptionLabel: (option) => option.cityName,
    };
    const defaultPropsSectors = {
        options: sectors,
        getOptionLabel: (option) => option.sectorName,
    };
    const defaultPropsSuburbs = {
        options: suburbs,
        getOptionLabel: (option) => option.suburbName,
    };
    const defaultPropsSizes = {
        options: sizes,
        getOptionLabel: (option) => option.sizeName,
    };
    const defaultPropsDivision = {
        options: divisions,
        getOptionLabel: (option) => option.divisionName,
    };
    const defaultPropsArea = {
        options: areas,
        getOptionLabel: (option) => option.areaName,
    };
    const defaultPropsDepartment = {
        options: departments,
        getOptionLabel: (option) => option.departmentName,
    };
    const defaultPropsJobs = {
        options: jobs,
        getOptionLabel: (option) => option.jobsName,
    };

    const handleChangeEmployeeData = (event) => {
        const { name, value } = event.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }


    const handleChangeChildrenData = (event) => {
        const { name, value } = event.target;
        setChildrenData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleChangeFamilyData = (event) => {
        const { name, value } = event.target;
        setFamilyData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleChangeEmergencyData = (event) => {
        const { name, value } = event.target;
        setEmergencyData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const adddFamilyPahData = (event) => {
        setFamilyPAHList((prevData) => ({
            ...prevData,

        }));
    }

    const handleBeneficiariesData = (event) => {
        const { name, value } = event.target;
        setBeneficiariesData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    return (
        <>
            <Dialog
                header={
                    <div>
                        <h2>Datos del empleado</h2>
                    </div>
                }
                visible={visible}
                style={{ width: '65vw' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button size='small' variant="outlined" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                        <Button size='small' variant="contained" onClick={() => {
                            // setVisible(false)
                            console.log(employeeData);
                            console.log(childrenList);
                            console.log(familyPAH);
                            console.log(familyList);
                            console.log(emergencyList);
                            console.log(familyPAHList);
                            console.log(beneficiariesList);

                            apipms.post('/employee', {
                                employeeData,
                                childrenList,
                                familyPAH,
                                familyList,
                                emergencyList,
                                familyPAHList,
                                beneficiariesList
                            })
                                .then((res) => {

                                })
                                .catch((error) => {
                                    console.log(error);

                                })


                        }}
                        >
                            Guardar
                        </Button>
                    </div>
                }
            >
                <div className="card">
                    <Accordion activeIndex={0}>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <PersonIcon />
                                    <span>Datos Personales</span>
                                </div>
                            </div>
                        }>
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <TextField fullWidth name="firstName" value={employeeData.firstName} onChange={(e) => handleChangeEmployeeData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                    <TextField fullWidth name="middleName" value={employeeData.middleName} onChange={(e) => { handleChangeEmployeeData(e) }} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                    <TextField fullWidth name="lastName" value={employeeData.lastName} onChange={(e) => { handleChangeEmployeeData(e) }} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                    <TextField fullWidth name="secondLastName" value={employeeData.secondLastName} onChange={(e) => { handleChangeEmployeeData(e) }} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                                </div>
                                <br />
                                <div className="flex align-items-center gap-2">
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 120 }} size='small'>
                                        <InputLabel id="tipoDocumento">Tipo de documento</InputLabel>
                                        <Select
                                            labelId="tipoDocumento"
                                            id="docID"
                                            name='docID'
                                            value={employeeData.docID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Tipo de documento"
                                        >
                                            {
                                                documentTypes.map((item) => (
                                                    <MenuItem key={item.docID} value={item.docID}>{item.docTypeName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField fullWidth value={employeeData.docNumber} onChange={(e) => handleChangeEmployeeData(e)} name='docNumber' id="docNumber" label="Numero de documento" size='small' variant="standard" />
                                    <TextField fullWidth value={employeeData.phoneNumber} onChange={(e) => handleChangeEmployeeData(e)} name='phoneNumber' id="phoneNumber" label="Telefono" size='small' variant="standard" />
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 150 }} size='small'>
                                        <InputLabel id="tipoSangre">Tipo de sangre</InputLabel>
                                        <Select
                                            labelId="tipoSangre"
                                            id="tipoSangre"
                                            name='bloodTypeID'
                                            value={employeeData.bloodTypeID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Tipo de sangre"
                                        >
                                            {
                                                bloodTypes.map((item) => (
                                                    <MenuItem key={item.bloodTypeID} value={item.bloodTypeID}>{item.bloodTypeName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, width: '40%' }} size='small'>
                                        <InputLabel id="genero">Genero</InputLabel>
                                        <Select
                                            labelId="genero"
                                            id="genero"
                                            name='genderID'
                                            value={employeeData.genderID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Genero"
                                        >
                                            {
                                                gender.map((item) => (
                                                    <MenuItem key={item.genderID} value={item.genderID}>{item.genderName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <div>
                                    <p>Información del domicilio</p>
                                    <div className="flex align-items-center gap-2">
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsState}
                                            options={states}
                                            name='stateID'
                                            value={employeeData.stateID}
                                            onChange={(event, newValue) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    stateID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Departamento" variant="standard" />}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsCity}
                                            options={cities.filter(c => c.stateID === employeeData.stateID?.stateID)}
                                            value={employeeData.cityID}
                                            onChange={(event, newValue) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    cityID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Municipio" variant="standard" />}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSectors}
                                            options={sectors.filter(s => s.cityID === employeeData.cityID?.cityID)}
                                            value={employeeData.sectorID}
                                            onChange={(event, newValue) => {
                                                console.log(newValue);

                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    sectorID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Sectores" variant="standard" />}
                                        />
                                        <IconButton aria-label="addSector" color="primary">
                                            <AddCircleIcon />
                                        </IconButton>
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSuburbs}
                                            options={suburbs.filter(s => s.sectorID === employeeData.sectorID?.sectorID)}
                                            value={employeeData.suburbID}
                                            onChange={(event, newValue) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    suburbID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Suburbio" variant="standard" />}
                                        />
                                        <IconButton aria-label="addSuburbio" color="primary">
                                            <AddCircleIcon />
                                        </IconButton>
                                    </div>
                                    <br />
                                    <div className="flex align-items-center gap-2">
                                        <TextField fullWidth name='address' value={employeeData.address} onChange={(e) => handleChangeEmployeeData(e)} id="address" label="Dirección" size='small' variant="standard" />
                                        <Autocomplete
                                            sx={{ width: '40%' }}
                                            {...defaultPropsSizes}
                                            options={sizes}
                                            value={employeeData.gabachSize}
                                            onChange={(event, newValue) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    gabachSize: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Talla de Gabacha" variant="standard" />}
                                        />
                                        <Autocomplete
                                            sx={{ width: '40%' }}
                                            {...defaultPropsSizes}
                                            options={sizes}
                                            value={employeeData.shirtSize}
                                            onChange={(event, newValue) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    shirtSize: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Talla de Camiseta" variant="standard" />}
                                        />
                                        {/* <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                            <InputLabel id="supervisor">Supervisor</InputLabel>
                                            <Select
                                                labelId="supervisor"
                                                id="supervisor"
                                                value={employeeData.supervisorID}
                                                onChange={(e) => handleChangeEmployeeData(e)}
                                                label="Supervisor"
                                            >
                                                <MenuItem value={10}>Juan</MenuItem>
                                                <MenuItem value={20}>Maria</MenuItem>
                                                <MenuItem value={30}>Luis</MenuItem>
                                            </Select>
                                        </FormControl> */}
                                    </div>
                                </div>
                                <br />
                                <p>Información del area de trabajo</p>
                                <div className="flex align-items-center gap-2">
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsDivision}
                                        options={divisions}
                                        value={employeeData.divisionID}
                                        onChange={(event, newValue) => {
                                            setEmployeeData((prevData) => ({
                                                ...prevData,
                                                divisionID: newValue,
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} label="División" variant="standard" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsArea}
                                        options={areas.filter(a => a.divisionID === employeeData.divisionID?.divisionID)}
                                        value={employeeData.areaID}
                                        onChange={(event, newValue) => {
                                            setEmployeeData((prevData) => ({
                                                ...prevData,
                                                areaID: newValue,
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Area" variant="standard" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsDepartment}
                                        options={departments.filter(d => d.areaID === employeeData.areaID?.areaID)}
                                        value={employeeData.departmentID}
                                        onChange={(event, newValue) => {
                                            setEmployeeData((prevData) => ({
                                                ...prevData,
                                                departmentID: newValue,
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Departamento" variant="standard" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsJobs}
                                        options={jobs.filter(j => j.departmentID === employeeData.departmentID?.departmentID)}
                                        value={employeeData.jobID}
                                        onChange={(event, newValue) => {
                                            setEmployeeData((prevData) => ({
                                                ...prevData,
                                                jobID: newValue,
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Job" variant="standard" />}
                                    />
                                </div>
                                <br />
                                <div className="flex align-items-center gap-2">
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="nivelEducativo">Nivel Educativo</InputLabel>
                                        <Select
                                            labelId="nivelEducativo"
                                            id="educationLevelID"
                                            name='educationLevelID'
                                            value={employeeData.educationLevelID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Nivel Educativo"
                                        >
                                            {
                                                educationLevels.map((item) => (
                                                    <MenuItem key={item.educationLevelID} value={item.educationLevelID}>{item.educationLevelName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField fullWidth name='educationGrade' value={employeeData.educationGrade} onChange={(e) => handleChangeEmployeeData(e)} id="educationGrade" label="Grado obtenido" size='small' variant="standard" />
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="medioTransporte">Medio de transporte</InputLabel>
                                        <Select
                                            labelId="medioTransporte"
                                            id="transportTypeID"
                                            name='transportTypeID'
                                            value={employeeData.transportTypeID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Medio de transporte"
                                        >
                                            {
                                                transportTypes.map((item) => (
                                                    <MenuItem key={item.transportTypeID} value={item.transportTypeID}>{item.transportTypeName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 200, width: '40%' }} size='small'>
                                        <InputLabel id="estadoCivil">Estado Civil</InputLabel>
                                        <Select
                                            labelId="estadoCivil"
                                            id="estadoCivil"
                                            name='maritalStatusID'
                                            value={employeeData.maritalStatusID}
                                            onChange={(e) => {
                                                console.log(e);
                                                (e.target.value === 2 || e.target.value === 3) ? setvisiblePartner(true) : setvisiblePartner(false)
                                                handleChangeEmployeeData(e)
                                            }}
                                            label="Estado Civil"
                                        >
                                            {
                                                maritalStatus.map((item) => (
                                                    <MenuItem key={item.maritalStatusID} value={item.maritalStatusID}>{item.maritalStatusName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <br />
                                {
                                    visiblePartner &&
                                    <div className="flex align-items-center gap-2">
                                        <TextField sx={{ width: '40%' }} name='partnerName' value={employeeData.partnerName} onChange={(e) => handleChangeEmployeeData(e)} id="partnerName" label="Nombre cónyuge" size='small' variant="standard" />
                                        <TextField sx={{ width: '20%' }} name='partnerAge' value={employeeData.partnerAge} onChange={(e) => handleChangeEmployeeData(e)} id="partnerAge" type='number' label="Edad cónyuge" size='small' variant="standard" />
                                    </div>
                                }
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <EscalatorWarningIcon />
                                    <span>Hijos</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-2">
                                <TextField fullWidth value={childrenData.firstName} name='firstName' onChange={(e) => handleChangeChildrenData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth value={childrenData.middleName} name='middleName' onChange={(e) => handleChangeChildrenData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth value={childrenData.lastName} name='lastName' onChange={(e) => handleChangeChildrenData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth value={childrenData.secondLastName} name='secondLastName' onChange={(e) => handleChangeChildrenData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-2">
                                <div>
                                    <InputLabel id="fechaNacimiento" sx={{ margin: 0 }}>Fecha de nacimiento</InputLabel>
                                    <TextField fullWidth id="birthDate" name='birthDate' value={childrenData.birthDate} onChange={(e) => handleChangeChildrenData(e)} type='date' format='yyyy-MM-dd' size='small' variant="standard" />
                                </div>
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="genero">Genero</InputLabel>
                                    <Select
                                        labelId="genero"
                                        id="genero"
                                        name='genderID'
                                        value={childrenData.genderID}
                                        onChange={(e) => handleChangeChildrenData(e)}
                                        label="Genero"
                                    >
                                        {
                                            gender.map((item) => (
                                                <MenuItem key={item.genderID} value={item.genderID}>{item.genderName}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <TextField sx={{ width: '30%' }} name='birthCert' value={childrenData.birthCert} onChange={(e) => handleChangeChildrenData(e)} id="partidaNacimiento" label="Partida de nacimiento" size='small' variant="standard" />
                                <div className="flex align-items-center gap-2">
                                    <Button
                                        variant="contained"
                                        size='small'
                                        color="primary"
                                        onClick={() => {
                                            console.log(childrenData);
                                            setChildrenList([
                                                ...childrenList,
                                                childrenData
                                            ])
                                        }}
                                        endIcon={<AddCircleIcon />}
                                    >
                                        Agregar hijo
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de hijos</p>
                                <DataTable value={childrenList} size="small" showGridlines>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primero apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="birthDate" header="Fecha Nac."></Column>
                                    <Column field="birthCert" header="Partida Nac."></Column>
                                    <Column field="genderID" header="Genero"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <FamilyRestroomIcon />
                                    <span>Datos Familiares</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-2">
                                <TextField fullWidth name='firstName' value={familyData.firstName} onChange={(e) => handleChangeFamilyData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth name='middleName' value={familyData.middleName} onChange={(e) => handleChangeFamilyData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth name='lastName' value={familyData.lastName} onChange={(e) => handleChangeFamilyData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth name='secondLastName' value={familyData.secondLastName} onChange={(e) => handleChangeFamilyData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-2">
                                <TextField sx={{ width: '10%' }} name='age' value={familyData.age} onChange={(e) => handleChangeFamilyData(e)} id="age" type='number' label="Edad" size='small' variant="standard" />
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        id="parentesco"
                                        name='relativesTypeID'
                                        value={familyData.relativesTypeID}
                                        onChange={(e) => handleChangeFamilyData(e)}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID} value={item.relativesTypeID}>{item.relativesTypeDesc}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <div className="flex align-items-center gap-2">
                                    <Button variant="contained" size='small' color="primary"
                                        onClick={() => {
                                            console.log(familyData);

                                            setFamilyList([
                                                ...familyList,
                                                familyData
                                            ])
                                        }}
                                        endIcon={<AddCircleIcon />}>
                                        Agregar
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de familiares</p>
                                <DataTable value={familyList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primero apellido"></Column>
                                    <Column field="secondLastName" header="Segundo nombre"></Column>
                                    <Column field="relativesTypeID" header="Parentesco"></Column>
                                    <Column field="age" header="Edad"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <ContactEmergencyIcon />
                                    <span>Contactos de Emergencia</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-2">
                                <TextField fullWidth name='firstName' value={emergencyData.firstName} onChange={(e) => handleChangeEmergencyData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth name='middleName' value={emergencyData.middleName} onChange={(e) => handleChangeEmergencyData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth name='lastName' value={emergencyData.lastName} onChange={(e) => handleChangeEmergencyData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth name='secondLastName' value={emergencyData.secondLastName} onChange={(e) => handleChangeEmergencyData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <div>
                                <div>
                                    <p>Información del domicilio</p>
                                    <div className="flex align-items-center gap-2">
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsState}
                                            options={states}
                                            name='stateID'
                                            value={emergencyData.stateID}
                                            onChange={(event, newValue) => {
                                                setEmergencyData((prevData) => ({
                                                    ...prevData,
                                                    stateID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Departamento" variant="standard" />}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsCity}
                                            options={cities.filter(c => c.stateID === emergencyData.stateID?.stateID)}
                                            value={emergencyData.cityID}
                                            onChange={(event, newValue) => {
                                                setEmergencyData((prevData) => ({
                                                    ...prevData,
                                                    cityID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Municipio" variant="standard" />}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSectors}
                                            options={sectors.filter(s => s.cityID === emergencyData.cityID?.cityID)}
                                            value={emergencyData.sectorID}
                                            onChange={(event, newValue) => {
                                                setEmergencyData((prevData) => ({
                                                    ...prevData,
                                                    sectorID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Sectores" variant="standard" />}
                                        />
                                        <IconButton aria-label="addSector" color="primary">
                                            <AddCircleIcon />
                                        </IconButton>
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSuburbs}
                                            options={suburbs.filter(s => s.sectorID === emergencyData.sectorID?.sectorID)}
                                            value={emergencyData.suburbID}
                                            onChange={(event, newValue) => {
                                                setEmergencyData((prevData) => ({
                                                    ...prevData,
                                                    suburbID: newValue,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Suburbio" variant="standard" />}
                                        />
                                        <IconButton aria-label="addSuburbio" color="primary">
                                            <AddCircleIcon />
                                        </IconButton>
                                    </div>
                                    <br />
                                </div>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <TextField sx={{ width: '15%' }} name='phoneNumber' value={emergencyData.phoneNumber} onChange={(e) => handleChangeEmergencyData(e)} id="phone" label="Telefono" size='small' variant="standard" />
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        id="parentesco"
                                        name='relativesTypeID'
                                        value={emergencyData.relativesTypeID}
                                        onChange={(e) => handleChangeEmergencyData(e)}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID} value={item.relativesTypeID}>{item.relativesTypeDesc}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Button variant="contained" size='small' color="primary"
                                    onClick={() => {
                                        console.log(emergencyData);

                                        setEmergencyList([
                                            ...emergencyList,
                                            emergencyData
                                        ])
                                    }}
                                    endIcon={<AddCircleIcon />}
                                >
                                    Agregar
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de contactos</p>
                                <DataTable value={emergencyList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primer apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="phoneNumber" header="Telefono"></Column>
                                    <Column field="relativesTypeID" header="Parentesco"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <GroupIcon />
                                    <span>Familiares PAH</span>
                                </div>
                            </div>
                        }>
                            <div className="flex">
                                <div className='familiares-pah'>
                                    <h4>Tiene familiares que laboran en la empresa?</h4>
                                    <Checkbox value={familyPAH} onChange={() => setFamilyPAH(!familyPAH)} />
                                </div>
                                {
                                    familyPAH &&
                                    <Autocomplete
                                        fullWidth
                                        // {...defaultProps}
                                        // optionsk={genderList}
                                        // value={formExpedientes.recetaOjoDerecho.esfera}
                                        // onChange={(event, newValue) => {

                                        // }}
                                        renderInput={(params) => <TextField {...params} label="Empleado" variant="standard" />}
                                    />
                                }

                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <PaidIcon />
                                    <span>Beneficiarios</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-2">
                                <TextField fullWidth name='firstName' value={beneficiariesData.firstName} onChange={(e) => handleBeneficiariesData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth name='middleName' value={beneficiariesData.middleName} onChange={(e) => handleBeneficiariesData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth name='lastName' value={beneficiariesData.lastName} onChange={(e) => handleBeneficiariesData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth name='secondLastName' value={beneficiariesData.secondLastName} onChange={(e) => handleBeneficiariesData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-2">
                                <FloatLabel>
                                    <InputNumber id="percentage" name="percentage" min={0} max={100} value={beneficiariesData.percentage} onValueChange={(e) => handleBeneficiariesData(e)} />
                                    <label htmlFor="percentage">Porcentage %</label>
                                </FloatLabel>
                                <TextField name='phoneNumber' value={beneficiariesData.phoneNumber} onChange={(e) => handleBeneficiariesData(e)} sx={{ width: '15%' }} id="phone" label="Telefono" variant="standard" />
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        id="parentesco"
                                        name='relativesTypeID'
                                        value={beneficiariesData.relativesTypeID}
                                        onChange={(e) => handleBeneficiariesData(e)}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID} value={item.relativesTypeID}>{item.relativesTypeDesc}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Button variant="contained" size='small' color="primary" endIcon={<AddCircleIcon />}
                                    onClick={() => {
                                        console.log(beneficiariesData);

                                        setBeneficiariesList([
                                            ...beneficiariesList,
                                            beneficiariesData
                                        ])
                                    }}
                                >
                                    Agregar
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de beneficiarios</p>
                                <DataTable value={beneficiariesList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primer apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="percentage" header="Porcentaje"></Column>
                                    <Column field="phoneNumber" header="Telefono"></Column>
                                    <Column field="relativesTypeID" header="Parentesco"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>

                    </Accordion>
                </div>
            </Dialog>
        </>
    )
}

export default DialogEmployee
