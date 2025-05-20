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
import '../css/DialogEmployeeStyle.css'
import { apipms } from '../../service/apipms';

const DialogEmployee = ({ visible, setVisible }) => {
    const [employeesList, setEmployeesList] = useState([])
    const [gender, setGender] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [transportTypes, setTransportTypes] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [suburds, setSuburds] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);
    const [relativesType, setRelativesType] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [areas, setAreas] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jobs, setJobs] = useState([]);

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
                setSuburds(response.data.suburbs);
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
    const defaultPropsSuburds = {
        options: suburds,
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

    return (
        <>
            <Dialog
                header="Datos del empleado"
                visible={visible}
                style={{ width: '65vw' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button size='small' variant="outlined" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                        <Button size='small' variant="contained" onClick={() => setVisible(false)}>
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
                                <p>Codigo empleado: <span>{984}</span></p>
                                <div className="flex align-items-center gap-2">
                                    <TextField fullWidth size='small' id="firstName" label="Primer nombre" variant="standard" />
                                    <TextField fullWidth size='small' id="middleName" label="Segundo nombre" variant="standard" />
                                    <TextField fullWidth size='small' id="lastName" label="Primer apellido" variant="standard" />
                                    <TextField fullWidth size='small' id="secondLastName" label="Segundo apellido" variant="standard" />
                                </div>
                                <br />
                                <div className="flex align-items-center gap-2">
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 120 }} size='small'>
                                        <InputLabel id="tipoDocumento">Tipo de documento</InputLabel>
                                        <Select
                                            labelId="tipoDocumento"
                                            id="tipoDocumento"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Tipo de documento"
                                        >
                                            {
                                                documentTypes.map((item) => (
                                                    <MenuItem key={item.docID} value={item.docID}>{item.docTypeName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField fullWidth size='small' id="documentNumber" label="Numero de documento" variant="standard" />
                                    <TextField fullWidth size='small' id="phone" label="Telefono" variant="standard" />
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 150 }} size='small'>
                                        <InputLabel id="tipoSangre">Tipo de sangre</InputLabel>
                                        <Select
                                            labelId="tipoSangre"
                                            id="tipoSangre"
                                            // value={age}
                                            // onChange={handleChange}
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
                                            {...defaultPropsSuburds}
                                            options={suburds}
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
                                    <div className="flex align-items-center gap-2">
                                        <TextField fullWidth size='small' id="direccion" label="Dirección" variant="standard" />
                                        <Autocomplete
                                            sx={{ width: '40%' }}
                                            {...defaultPropsSizes}
                                            options={sizes}
                                            // value={formExpedientes.recetaOjoDerecho.esfera}
                                            onChange={(event, newValue) => {
                                                console.log(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Talla de Gabacha" variant="standard" />}
                                        />
                                        <Autocomplete
                                            sx={{ width: '40%' }}
                                            {...defaultPropsSizes}
                                            options={sizes}
                                            // value={formExpedientes.recetaOjoDerecho.esfera}
                                            onChange={(event, newValue) => {
                                                console.log(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Talla de Camiseta" variant="standard" />}
                                        />
                                        <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                            <InputLabel id="supervisor">Supervisor</InputLabel>
                                            <Select
                                                labelId="supervisor"
                                                id="supervisor"
                                                // value={age}
                                                // onChange={handleChange}
                                                label="Supervisor"
                                            >
                                                <MenuItem value={10}>Juan</MenuItem>
                                                <MenuItem value={20}>Maria</MenuItem>
                                                <MenuItem value={30}>Luis</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <br />
                                <p>Información del area de trabajo</p>
                                <div className="flex align-items-center gap-2">
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsDivision}
                                        options={divisions}
                                        // value={formExpedientes.recetaOjoDerecho.esfera}
                                        onChange={(event, newValue) => {
                                            console.log(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="División" variant="standard" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsArea}
                                        options={areas}
                                        // value={formExpedientes.recetaOjoDerecho.esfera}
                                        onChange={(event, newValue) => {
                                            console.log(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Area" variant="standard" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsDepartment}
                                        options={departments}
                                        // value={formExpedientes.recetaOjoDerecho.esfera}
                                        onChange={(event, newValue) => {
                                            console.log(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Departamento" variant="standard" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsJobs}
                                        options={jobs}
                                        // value={formExpedientes.recetaOjoDerecho.esfera}
                                        onChange={(event, newValue) => {
                                            console.log(newValue);
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
                                            id="nivelEducativo"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Nivel Educativo"
                                        >
                                            {
                                                educationLevels.map((item) => (
                                                    <MenuItem key={item.educationLevelID} value={item.educationLevelID}>{item.educationLevelName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField fullWidth size='small' id="gradoObtenido" label="Grado obtenido" variant="standard" />
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="medioTransporte">Medio de transporte</InputLabel>
                                        <Select
                                            labelId="medioTransporte"
                                            id="medioTransporte"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Medio de transporte"
                                        >
                                            {
                                                transportTypes.map((item) => (
                                                    <MenuItem key={item.transportTypeID} value={item.transportTypeID}>{item.transportTypeName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <br />
                                <div className="flex align-items-center gap-2">
                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 200, width: '40%' }} size='small'>
                                        <InputLabel id="estadoCivil">Estado Civil</InputLabel>
                                        <Select
                                            labelId="estadoCivil"
                                            id="estadoCivil"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Estado Civil"
                                        >
                                            {
                                                maritalStatus.map((item) => (
                                                    <MenuItem key={item.maritalStatusID} value={item.maritalStatusID}>{item.maritalStatusName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField fullWidth size='small' id="nombreConyugue" label="Nombre conyugue" variant="standard" />
                                    <TextField size='small' sx={{ width: '30%' }} id="edadConyugue" label="Edad conyugue" variant="standard" />
                                </div>
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
                                <TextField fullWidth size='small' id="firstName" label="Primer nombre" variant="standard" />
                                <TextField fullWidth size='small' id="middleName" label="Segundo nombre" variant="standard" />
                                <TextField fullWidth size='small' id="lastName" label="Primer apellido" variant="standard" />
                                <TextField fullWidth size='small' id="secondLastName" label="Segundo apellido" variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-2">
                                <div>
                                    <InputLabel id="fechaNacimiento" sx={{ margin: 0 }}>Fecha de nacimiento</InputLabel>
                                    <TextField fullWidth size='small' id="fechaNacimiento" type='date' format='yyyy-MM-dd' variant="standard" />
                                </div>
                                <FormControl variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="genero">Genero</InputLabel>
                                    <Select
                                        labelId="genero"
                                        id="genero"
                                        // value={age}
                                        // onChange={handleChange}
                                        label="Genero"
                                    >
                                        {
                                            gender.map((item) => (
                                                <MenuItem key={item.genderID} value={item.genderID}>{item.genderName}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <TextField sx={{ width: '30%' }} size='small' id="partidaNacimiento" label="Partida de nacimiento" variant="standard" />
                                <div className="flex align-items-center gap-2">
                                    <Button variant="contained" size='small' color="primary" endIcon={<AddCircleIcon />}>
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
                                <DataTable value={gender} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
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
                                <TextField size='small' sx={{ width: '10%' }} id="age" label="Edad" variant="standard" />
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
                                <DataTable value={gender} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
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
                                            {...defaultPropsSuburds}
                                            options={suburds}
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
                                <DataTable value={gender} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
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
                            <div>
                                Tiene familiares que laboran en la empresa?
                                <Checkbox />
                                <Autocomplete
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
                            <p className="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
                        </AccordionTab>

                    </Accordion>
                </div>
            </Dialog>
        </>
    )
}

export default DialogEmployee
