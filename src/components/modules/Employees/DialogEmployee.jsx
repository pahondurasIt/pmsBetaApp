import React, { useEffect, useState } from 'react'
import { Dialog, Accordion, AccordionTab, DataTable, Column } from 'primereact';
import { Autocomplete, Button, Checkbox, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GroupIcon from '@mui/icons-material/Group';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../../css/DialogEmployeeStyle.css'
import { apipms } from '../../../service/apipms';
import dayjs from '../../../helpers/dayjsConfig';

const DialogEmployee = ({ visible, setVisible }) => {
    const [employeeData, setEmployeeData] = useState({
        firstName: null,
        middleName: null,
        lastName: null,
        secondLastName: null,
        phoneNumber: null,
        genderID: null,
        docID: null,
        docIDNumber: null,
        relativesTypeID: null,
        photo: null,
        birthDate: null,
        bloodTypeID: null,
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
        companyID: 1,
        contractStatusID: null,
        payroll: null,
        educationLevelID: null,
        educationGrade: null,
        transportTypeID: null,
        maritalStatusID: null,
        nationality: null,
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
        genderID: null,
        employeeID: ''
    })
    const [childrenList, setChildrenList] = useState([]);
    const [familyData, setFamilyData] = useState({
        relativesTypeID: null,
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
        relativesTypeID: null,
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
        relativesTypeID: null,
        porcentage: 0,
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
                console.log(response.data)
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
        getOptionLabel: (option) => option.surburbName,
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
                            setVisible(false)
                            console.log(employeeData);

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
                                    <TextField fullWidth value={employeeData.documentNumber} onChange={(e) => handleChangeEmployeeData(e)} name='documentNumber' id="documentNumber" label="Numero de documento" size='small' variant="standard" />
                                    <TextField fullWidth value={employeeData.phoneNumber} onChange={(e) => handleChangeEmployeeData(e)} name='phoneNumber' id="phoneNumber" label="Telefono" size='small' variant="standard" />
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 150 }} size='small'>
                                        <InputLabel id="tipoSangre">Tipo de sangre</InputLabel>
                                        <Select
                                            labelId="tipoSangre"
                                            id="tipoSangre"
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
                                        <TextField fullWidth name='address' onChange={(e) => handleChangeEmployeeData(e)} id="address" label="Dirección" size='small' variant="standard" />
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
                                    <TextField fullWidth name='educationGrade' value={employeeData.educationGrade} id="educationGrade" label="Grado obtenido" size='small' variant="standard" />
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
                                        <TextField sx={{ width: '40%' }} name='partnerName' value={employeeData.partnerName} id="partnerName" label="Nombre conyugue" size='small' variant="standard" />
                                        <TextField sx={{ width: '20%' }} name='partnerAge' value={employeeData.partnerAge} id="partnerAge" type='number' label="Edad conyugue" size='small' variant="standard" />
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

                                        }}
                                        endIcon={<AddCircleIcon />}
                                    >
                                        Agregar hijo
                                    </Button>
                                    <Button variant="outlined" size='small' color="primary">
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de hijos</p>
                                <DataTable value={childrenList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="" header="Primer nombre"></Column>
                                    <Column field="" header="Segundo nombre"></Column>
                                    <Column field="" header="Primero apellido"></Column>
                                    <Column field="" header="Segundo apellido"></Column>
                                    <Column field="" header="Fecha Nac."></Column>
                                    <Column field="" header="Partida Nac."></Column>
                                    <Column field="" header="Genero"></Column>
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
                                <TextField fullWidth size='small' id="firstName" label="Primer nombre" variant="standard" />
                                <TextField fullWidth size='small' id="middleName" label="Segundo nombre" variant="standard" />
                                <TextField fullWidth size='small' id="lastName" label="Primer apellido" variant="standard" />
                                <TextField fullWidth size='small' id="secondLastName" label="Segundo apellido" variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-2">
                                <TextField size='small' sx={{ width: '10%' }} id="age" type='number' label="Edad" variant="standard" />
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        id="parentesco"
                                        // value={age}
                                        // onChange={handleChange}
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
                                    <Button variant="contained" size='small' color="primary" endIcon={<AddCircleIcon />}>
                                        Agregar
                                    </Button>
                                    <Button variant="outlined" size='small' color="primary">
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de familiares</p>
                                <DataTable value={familyList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="" header="Primer nombre"></Column>
                                    <Column field="" header="Segundo nombre"></Column>
                                    <Column field="" header="Primero apellido"></Column>
                                    <Column field="" header="Segundo nombre"></Column>
                                    <Column field="" header="Parentesco"></Column>
                                    <Column field="" header="Edad"></Column>
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
                                <TextField fullWidth size='small' id="firstName" label="Primer nombre" variant="standard" />
                                <TextField fullWidth size='small' id="middleName" label="Segundo nombre" variant="standard" />
                                <TextField fullWidth size='small' id="lastName" label="Primer apellido" variant="standard" />
                                <TextField fullWidth size='small' id="secondLastName" label="Segundo apellido" variant="standard" />
                            </div>
                            <div>
                                <div>
                                    <p>Información del domicilio</p>
                                    <div className="flex align-items-center gap-2">
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsState}
                                            options={states}
                                            // value={formExpedientes.recetaOjoDerecho.esfera}
                                            onChange={(event, newValue) => {
                                                console.log(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Departamento" variant="standard" />}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsCity}
                                            options={cities}
                                            // value={formExpedientes.recetaOjoDerecho.esfera}
                                            onChange={(event, newValue) => {
                                                console.log(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Municipio" variant="standard" />}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSectors}
                                            options={sectors}
                                            // value={formExpedientes.recetaOjoDerecho.esfera}
                                            onChange={(event, newValue) => {
                                                console.log(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Sectores" variant="standard" />}
                                        />
                                        <IconButton aria-label="addSector" color="primary">
                                            <AddCircleIcon />
                                        </IconButton>
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSuburbs}
                                            options={suburbs}
                                            // value={formExpedientes.recetaOjoDerecho.esfera}
                                            onChange={(event, newValue) => {
                                                console.log(newValue);
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
                                <TextField size='small' sx={{ width: '10%' }} id="phone" label="Telefono" variant="standard" />
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        id="parentesco"
                                        // value={age}
                                        // onChange={handleChange}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID} value={item.relativesTypeID}>{item.relativesTypeDesc}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Button variant="contained" size='small' color="primary" endIcon={<AddCircleIcon />}>
                                    Agregar
                                </Button>
                                <Button variant="outlined" size='small' color="primary">
                                    Cancelar
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de contactos</p>
                                <DataTable value={emergencyList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="" header="Primer nombre"></Column>
                                    <Column field="" header="Segundo nombre"></Column>
                                    <Column field="" header="Primer apellido"></Column>
                                    <Column field="" header="Segundo apellido"></Column>
                                    <Column field="" header="Telefono"></Column>
                                    <Column field="" header="Parentesco"></Column>
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
                                    <Checkbox />
                                </div>
                                <Autocomplete
                                    fullWidth
                                    // {...defaultProps}
                                    // optionsk={genderList}
                                    // value={formExpedientes.recetaOjoDerecho.esfera}
                                    // onChange={(event, newValue) => {

                                    // }}
                                    renderInput={(params) => <TextField {...params} label="Empleado" variant="standard" />}
                                />
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
                                <TextField fullWidth size='small' id="firstName" label="Primer nombre" variant="standard" />
                                <TextField fullWidth size='small' id="middleName" label="Segundo nombre" variant="standard" />
                                <TextField fullWidth size='small' id="lastName" label="Primer apellido" variant="standard" />
                                <TextField fullWidth size='small' id="secondLastName" label="Segundo apellido" variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-2">
                                <TextField size='small' sx={{ width: '10%' }} id="porcentage" label="Porcentaje %" variant="standard" />
                                <TextField size='small' sx={{ width: '10%' }} id="phone" label="Telefono" variant="standard" />
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        id="parentesco"
                                        // value={age}
                                        // onChange={handleChange}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID} value={item.relativesTypeID}>{item.relativesTypeDesc}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Button variant="contained" size='small' color="primary" endIcon={<AddCircleIcon />}>
                                    Agregar
                                </Button>
                                <Button variant="outlined" size='small' color="primary">
                                    Cancelar
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <p>Lista de beneficiarios</p>
                                <DataTable value={beneficiariesList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="" header="Primer nombre"></Column>
                                    <Column field="" header="Segundo nombre"></Column>
                                    <Column field="" header="Primer apellido"></Column>
                                    <Column field="" header="Segundo apellido"></Column>
                                    <Column field="" header="Porcentaje"></Column>
                                    <Column field="" header="Telefono"></Column>
                                    <Column field="" header="Parentesco"></Column>
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
