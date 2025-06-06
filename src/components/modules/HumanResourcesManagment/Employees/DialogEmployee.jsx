import React, { useEffect, useState, useRef } from 'react'
import { Dialog, Accordion, AccordionTab, DataTable, Column, Button as ButtonPrime, InputNumber, FloatLabel } from 'primereact';
import { Toast } from 'primereact/toast';
import { Autocomplete, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GroupIcon from '@mui/icons-material/Group';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { apipms } from '../../../../service/apipms';
import { auxrelative, BeneficiariesModel, ChildrenModel, EcontactsModel, EmployeeModel, FamilyInformationModel } from '../../../Models/Employee';
import { isValidText } from '../../../../helpers/validator';
import NewAddress from './NewAddress';

const DialogEmployee = ({ visible, setVisible, employeesList, setEmployeesList }) => {
    const [employeeData, setEmployeeData] = useState(EmployeeModel);
    const [childrenData, setChildrenData] = useState(ChildrenModel)
    const [childrenList, setChildrenList] = useState([]);
    const [familyData, setFamilyData] = useState(FamilyInformationModel);
    const [familyList, setFamilyList] = useState([]);
    const [emergencyData, setEmergencyData] = useState(EcontactsModel);
    const [emergencyList, setEmergencyList] = useState([]);
    const [isfamilyPAH, setIsFamilyPAH] = useState(false);
    const [familyPAHList, setFamilyPAHList] = useState([]);
    const [familyPAHData, setFamilyPAHData] = useState(auxrelative);
    const [beneficiariesData, setBeneficiariesData] = useState(BeneficiariesModel);
    const [beneficiariesList, setBeneficiariesList] = useState([]);
    const [supervisorEmp, setSupervisorEmp] = useState('');
    const [opButton, setopButton] = useState('');
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
    const [visiblePartner, setvisiblePartner] = useState(false);
    const [contractType, setContractType] = useState([]);
    const [payrollType, setPayrollType] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [visibleSideBar, setVisibleSideBar] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [dataAddress, setdataAddress] = useState({
        stateID: null,
        cityID: null,
        sectorID: null,
    })

    const toast = useRef(null);
    const createToast = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 6000 });
    };
    const toastForm = useRef(null);
    const createToastForm = (severity, summary, detail) => {
        toastForm.current.show({ severity: severity, summary: summary, detail: detail, life: 6000 });
    };

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
                setContractType(response.data.contractType);
                setPayrollType(response.data.payrollType);
                setShifts(response.data.shifts);
                setSupervisors(response.data.supervisors);
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
        getOptionLabel: (option) => option.jobName,
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

    const handleFamilyPAHData = (event) => {
        const { name, value } = event.target;
        setFamilyPAHData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleBeneficiariesData = (event) => {
        const { name, value } = event.target;
        setBeneficiariesData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const isPositiveInteger = (val) => {
        let str = String(val);

        str = str.trim();
        if (str === '' || str === null || str === undefined) {
            return false;
        }

        str = str.replace(/^0+/, '') || '0';
        let n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        if (field === 'percentage') {
            const index = beneficiariesList.findIndex(b => b === rowData);
            const totalWithoutCurrent = beneficiariesList.reduce((total, b, i) => {
                return i !== index ? total + b.percentage : total;
            }, 0);

            if (
                isPositiveInteger(newValue) &&
                newValue >= 0 &&
                newValue <= 100 &&
                (totalWithoutCurrent + newValue) <= 100
            ) {
                rowData[field] = newValue;
            } else {
                event.preventDefault();
                createToastForm(
                    'warn',
                    'Acción requerida',
                    'La suma de los porcentajes no debe ser mayor a 100'
                );
                rowData[field] = 0; // Resetea el valor si no es válido
            }
        } else {
            if (isValidText(newValue)) {
                rowData[field] = newValue;
            } else {
                event.preventDefault();
            }
        }
    };

    const cellEditor = (options) => {
        return textEditor(options);
    };

    const textEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} onKeyDown={(e) => e.stopPropagation()} />;
    };

    return (
        <>
            <Toast ref={toast} />
            <Toast ref={toastForm} />
            <Dialog
                header={
                    <div>
                        <h2>Datos del empleado</h2>
                    </div>
                }
                visible={visible}
                style={{ width: '65vw' }}
                onHide={() => { if (!visible) return; setVisible(false); setVisibleSideBar(false); }}
                footer={
                    <div className="flex justify-content-end gap-3">
                        <Button size='small' variant="outlined" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                        <Button size='small' variant="contained" onClick={() => {
                            // setVisible(false)
                            console.log(employeeData);
                            console.log(childrenList);
                            console.log(isfamilyPAH);
                            console.log(familyList);
                            console.log(emergencyList);
                            console.log(familyPAHList);
                            console.log(beneficiariesList);

                            if (!isValidText(employeeData.firstName) || !isValidText(employeeData.lastName)
                                || !isValidText(employeeData.hireDate) || !isValidText(employeeData.docID)
                                || !isValidText(employeeData.docNumber) || !isValidText(employeeData.birthDate)
                                || !isValidText(employeeData.genderID) || !isValidText(employeeData.payrollTypeID)
                                || !isValidText(employeeData.contractTypeID) || !isValidText(employeeData.shiftID)
                                || !isValidText(employeeData.divisionID) || beneficiariesList.length < 1
                                || !isValidText(employeeData.areaID) || !isValidText(employeeData.departmentID)
                                || !isValidText(employeeData.jobID) || !isValidText(employeeData.bloodTypeID)
                                || !isValidText(employeeData.transportTypeID) || !isValidText(employeeData.gabachSize)
                                || !isValidText(employeeData.shiftID) || !isValidText(employeeData.maritalStatusID)
                                || !isValidText(employeeData.educationLevelID) || !isValidText(employeeData.stateID)
                                || !isValidText(employeeData.cityID) || !isValidText(employeeData.sectorID)
                                || !isValidText(employeeData.suburbID) || emergencyList.length < 1

                            ) {
                                createToastForm(
                                    'warn',
                                    'Acción requerida',
                                    'Por favor ingrese todos los campos requeridos'
                                )
                                return
                            }

                            let total = beneficiariesList.reduce((total, b) => total + b.percentage, 0);
                            if (total < 100) {
                                createToastForm(
                                    'warn',
                                    'Acción requerida',
                                    'La suma de los porcentajes de los beneficiarios debe ser igual a 100'
                                )
                                return
                            } else if (total > 100) {
                                createToastForm(
                                    'warn',
                                    'Acción requerida',
                                    'La suma de los porcentajes de los beneficiarios no debe ser mayor a 100'
                                )
                                return
                            }

                            apipms.post('/employee', {
                                employeeData,
                                supervisorEmp,
                                childrenList,
                                isfamilyPAH,
                                familyList,
                                emergencyList,
                                familyPAHList,
                                beneficiariesList
                            })
                                .then((res) => {
                                    console.log(res);
                                    setEmployeesList((prevList) => [...prevList, res.data]);
                                    setVisible(false);
                                    createToast(
                                        'success',
                                        'Confirmado',
                                        'El registro a sido creado'
                                    );
                                })
                                .catch((error) => {
                                    console.log(error);
                                    createToast(
                                        'error',
                                        'Error',
                                        'Ha ocurrido un error al intentar guardar el registro'
                                    );
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
                                <div className="flex align-items-center gap-3">
                                    <PersonIcon />
                                    <span>Datos Personales</span>
                                </div>
                            </div>
                        }>
                            <div>
                                <strong>Información del personal</strong>
                                <div className="flex align-items-center gap-3">
                                    <TextField fullWidth required name="firstName" value={employeeData.firstName} onChange={(e) => handleChangeEmployeeData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                    <TextField fullWidth name="middleName" value={employeeData.middleName} onChange={(e) => { handleChangeEmployeeData(e) }} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                    <TextField fullWidth required name="lastName" value={employeeData.lastName} onChange={(e) => { handleChangeEmployeeData(e) }} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                    <TextField fullWidth name="secondLastName" value={employeeData.secondLastName} onChange={(e) => { handleChangeEmployeeData(e) }} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">
                                    <div>
                                        <InputLabel id="hireDate" sx={{ margin: 0 }}>Fecha de ingreso</InputLabel>
                                        <TextField fullWidth required id="hireDate" name='hireDate' value={employeeData.hireDate} onChange={(e) => handleChangeEmployeeData(e)} type='date' format='yyyy-MM-dd' size='small' variant="standard" />
                                    </div>
                                    <FormControl required fullWidth variant="standard" sx={{ margin: 0 }} size='small'>
                                        <InputLabel id="tipoDocumento">Tipo de documento</InputLabel>
                                        <Select
                                            labelId="tipoDocumento"
                                            required
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
                                    <TextField fullWidth required value={employeeData.docNumber} onChange={(e) => handleChangeEmployeeData(e)} name='docNumber' id="docNumber" label="Numero de documento" size='small' variant="standard" />
                                    <div>
                                        <InputLabel id="fechaNacimiento" sx={{ margin: 0 }}>Fecha de nacimiento</InputLabel>
                                        <TextField fullWidth required id="birthDate" name='birthDate' value={employeeData.birthDate} onChange={(e) => handleChangeEmployeeData(e)} type='date' format='yyyy-MM-dd' size='small' variant="standard" />
                                    </div>
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">
                                    <FormControl fullWidth required variant="standard" sx={{ margin: 0 }} size='small'>
                                        <InputLabel id="genero">Genero</InputLabel>
                                        <Select
                                            labelId="genero"
                                            required
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
                                    <FormControl fullWidth required variant="standard" sx={{ margin: 0 }} size='small'>
                                        <InputLabel id="payrollTypeID">Tipo de Planilla</InputLabel>
                                        <Select
                                            labelId="payrollTypeID"
                                            required
                                            id="payrollTypeID"
                                            name='payrollTypeID'
                                            value={employeeData.payrollTypeID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Tipo de planilla"
                                        >
                                            {
                                                payrollType.map((item) => (
                                                    <MenuItem key={item.payrollTypeID} value={item.payrollTypeID}>{item.payrollName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth required variant="standard" sx={{ margin: 0 }} size='small'>
                                        <InputLabel id="contractTypeID">Contrato</InputLabel>
                                        <Select
                                            labelId="contractTypeID"
                                            required
                                            id="contractTypeID"
                                            name='contractTypeID'
                                            value={employeeData.contractTypeID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Contrato"
                                        >
                                            {
                                                contractType.map((item) => (
                                                    <MenuItem key={item.contractTypeID} value={item.contractTypeID}>{item.statusDesc}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth required variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="shiftID">Turno</InputLabel>
                                        <Select
                                            labelId="shiftID"
                                            required
                                            id="shiftID"
                                            name='shiftID'
                                            value={employeeData.shiftID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Turno"
                                        >
                                            {
                                                shifts.map((item) => (
                                                    <MenuItem key={item.shiftID} value={item.shiftID}>{item.shiftName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">
                                    <TextField sx={{ width: "30%" }} required value={employeeData.nationality} onChange={(e) => handleChangeEmployeeData(e)} name='nationality' id="nationality" label="Nacionalidad" size='small' variant="standard" />
                                    <TextField sx={{ width: "25%" }} value={employeeData.salary} onChange={(e) => handleChangeEmployeeData(e)} type='number' name='salary' id="salary" label="Salario" size='small' variant="standard" />
                                    <FormControl fullWidth variant="standard" sx={{ margin: 0 }} size='small'>
                                        <InputLabel id="supervisor">Supervisor</InputLabel>
                                        <Select
                                            labelId="supervisor"
                                            id="supervisorID"
                                            name='supervisorID'
                                            value={supervisorEmp}
                                            onChange={(e) => setSupervisorEmp(e.target.value)}
                                            label="Supervisor"
                                        >
                                            {
                                                supervisors.map((item) => (
                                                    <MenuItem key={item.employeeID} value={item.employeeID}>{item.nombreCompleto}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <strong>Información del area de trabajo</strong>
                                <div className="flex align-items-center gap-3">
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsDivision}
                                        options={divisions}
                                        value={employeeData.divisionID}
                                        onChange={(event, newValue) => {
                                            setEmployeeData((prevData) => ({
                                                ...prevData,
                                                divisionID: newValue,
                                                areaID: null,
                                                departmentID: null,
                                                jobID: null
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
                                                departmentID: null,
                                                jobID: null
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
                                                jobID: null
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
                                <div className="flex align-items-center gap-3">
                                    <TextField sx={{ width: '50%' }} value={employeeData.phoneNumber} onChange={(e) => handleChangeEmployeeData(e)} name='phoneNumber' id="phoneNumber" label="Telefono" size='small' variant="standard" />
                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 150 }} size='small'>
                                        <InputLabel id="tipoSangre">T. Sangre</InputLabel>
                                        <Select
                                            labelId="tipoSangre"
                                            id="tipoSangre"
                                            name='bloodTypeID'
                                            value={employeeData.bloodTypeID}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="T. sangre"
                                        >
                                            {
                                                bloodTypes.map((item) => (
                                                    <MenuItem key={item.bloodTypeID} value={item.bloodTypeID}>{item.bloodTypeName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth required variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="medioTransporte">Medio de transporte</InputLabel>
                                        <Select
                                            labelId="medioTransporte"
                                            required
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
                                    <Autocomplete
                                        sx={{ width: '50%' }}
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
                                        sx={{ width: '60%' }}
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
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">
                                    <FormControl fullWidth required variant="standard" sx={{ margin: 0, minWidth: 200, width: '10%' }} size='small'>
                                        <InputLabel id="estadoCivil">Estado Civil</InputLabel>
                                        <Select
                                            labelId="estadoCivil"
                                            required
                                            id="estadoCivil"
                                            name='maritalStatusID'
                                            value={employeeData.maritalStatusID}
                                            onChange={(e) => {
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
                                    {
                                        visiblePartner &&
                                        <>
                                            <TextField fullWidth name='partnerName' value={employeeData.partnerName} onChange={(e) => handleChangeEmployeeData(e)} id="partnerName" label="Nombre cónyuge" size='small' variant="standard" />
                                            <TextField name='partnerage' value={employeeData.partnerage} onChange={(e) => handleChangeEmployeeData(e)} id="partnerage" type='number' label="Edad cónyuge" size='small' variant="standard" />
                                        </>
                                    }
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">
                                    <FormControl fullWidth required variant="standard" sx={{ margin: 0, width: '40%' }} size='small'>
                                        <InputLabel id="nivelEducativo">Nivel Educativo</InputLabel>
                                        <Select
                                            labelId="nivelEducativo"
                                            required
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
                                </div>
                                <br />
                                <div>
                                    <strong>Información del domicilio</strong>
                                    <div className="flex align-items-center gap-3">
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
                                                    cityID: null,
                                                    sectorID: null,
                                                    suburbID: null,
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
                                                    sectorID: null,
                                                    suburbID: null,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Municipio" variant="standard" />}
                                        />
                                        <Button variant="contained" id='city'
                                            disabled={!employeeData.stateID}
                                            value='city' size="small"
                                            onClick={(e) => {
                                                setVisibleSideBar(true);
                                                setopButton(e.target.id);
                                                setdataAddress({
                                                    stateID: employeeData.stateID,
                                                    cityID: employeeData.cityID,
                                                    sectorID: employeeData.sectorID,
                                                })
                                            }}>
                                            +
                                        </Button>
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSectors}
                                            options={sectors.filter(s => s.cityID === employeeData.cityID?.cityID)}
                                            value={employeeData.sectorID}
                                            onChange={(event, newValue) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    sectorID: newValue,
                                                    suburbID: null,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Sectores" variant="standard" />}
                                        />
                                        <Button variant="contained" id='sector'
                                            disabled={!employeeData.cityID}
                                            value='sector' size="small"
                                            onClick={(e) => {
                                                setVisibleSideBar(true);
                                                setopButton(e.target.id);
                                                setdataAddress({
                                                    stateID: employeeData.stateID,
                                                    cityID: employeeData.cityID,
                                                    sectorID: employeeData.sectorID,
                                                })
                                            }}>
                                            +
                                        </Button>
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
                                        <Button variant="contained" id='suburb'
                                            disabled={!employeeData.sectorID}
                                            value='suburb'
                                            size="small"
                                            onClick={(e) => {
                                                setVisibleSideBar(true);
                                                setopButton(e.target.id);
                                                setdataAddress({
                                                    stateID: employeeData.stateID,
                                                    cityID: employeeData.cityID,
                                                    sectorID: employeeData.sectorID,
                                                })
                                            }}>
                                            +
                                        </Button>
                                    </div>
                                    <br />
                                    <div className="flex align-items-center gap-3">
                                        <TextField fullWidth name='address' value={employeeData.address} onChange={(e) => handleChangeEmployeeData(e)} id="address" label="Dirección" size='small' variant="standard" />
                                    </div>
                                </div>
                                <br />

                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-3">
                                    <EscalatorWarningIcon />
                                    <span>Hijos</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-3">
                                <TextField fullWidth required value={childrenData.firstName} name='firstName' onChange={(e) => handleChangeChildrenData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth value={childrenData.middleName} name='middleName' onChange={(e) => handleChangeChildrenData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth required value={childrenData.lastName} name='lastName' onChange={(e) => handleChangeChildrenData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth value={childrenData.secondLastName} name='secondLastName' onChange={(e) => handleChangeChildrenData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-3">
                                <div>
                                    <InputLabel id="fechaNacimiento" sx={{ margin: 0 }}>Fecha de nacimiento</InputLabel>
                                    <TextField fullWidth required id="birthDate" name='birthDate' value={childrenData.birthDate} onChange={(e) => handleChangeChildrenData(e)} type='date' format='yyyy-MM-dd' size='small' variant="standard" />
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
                                                <MenuItem key={item.genderName} value={`${item.genderID} ${item.genderName}`}>{item.genderName}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <TextField sx={{ width: '30%' }} required name='birthCert' value={childrenData.birthCert} onChange={(e) => handleChangeChildrenData(e)} id="partidaNacimiento" label="Partida de nacimiento" size='small' variant="standard" />
                                <div className="flex align-items-center gap-3">
                                    <Button
                                        variant="contained"
                                        size='small'
                                        color="primary"
                                        onClick={() => {
                                            if (!isValidText(childrenData.firstName) || !isValidText(childrenData.lastName)
                                                || !isValidText(childrenData.birthDate) || !isValidText(childrenData.birthCert)
                                                || !isValidText(childrenData.genderID)
                                            ) {
                                                createToastForm(
                                                    'warn',
                                                    'Acción requerida',
                                                    'Por favor ingrese todos los campos requeridos'
                                                )
                                                return
                                            }
                                            const inputValue = childrenData.genderID;
                                            const [id, ...descriptionParts] = inputValue.split(' ');
                                            const description = descriptionParts.join(' ');

                                            let child = {
                                                ...childrenData,
                                                genderID: parseInt(id),
                                                genderName: description
                                            }
                                            setChildrenList([
                                                ...childrenList,
                                                child])
                                            setChildrenData(ChildrenModel)
                                        }}
                                        endIcon={<AddCircleIcon />}
                                    >
                                        Agregar
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de hijos</strong>
                                <DataTable value={childrenList} size="small" showGridlines>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primero apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="birthDate" header="Fecha Nac."></Column>
                                    <Column field="birthCert" header="Partida Nac."></Column>
                                    <Column field="genderName" header="Genero"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-3">
                                    <FamilyRestroomIcon />
                                    <span>Datos Familiares</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-3">
                                <TextField fullWidth required name='firstName' value={familyData.firstName} onChange={(e) => handleChangeFamilyData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth name='middleName' value={familyData.middleName} onChange={(e) => handleChangeFamilyData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth required name='lastName' value={familyData.lastName} onChange={(e) => handleChangeFamilyData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth name='secondLastName' value={familyData.secondLastName} onChange={(e) => handleChangeFamilyData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-3">
                                <TextField sx={{ width: '10%' }} name='age' value={familyData.age} onChange={(e) => handleChangeFamilyData(e)} id="age" type='number' label="Edad" size='small' variant="standard" />
                                <FormControl variant="standard" required sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        required
                                        id="parentesco"
                                        name='relativesTypeID'
                                        value={familyData.relativesTypeID}
                                        onChange={(e) => handleChangeFamilyData(e)}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID}
                                                    value={`${item.relativesTypeID} ${item.relativesTypeDesc}`}>{item.relativesTypeDesc}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <div className="flex align-items-center gap-3">
                                    <Button variant="contained" size='small' color="primary"
                                        onClick={() => {
                                            if (!isValidText(familyData.firstName) || !isValidText(familyData.lastName)
                                                || !isValidText(familyData.relativesTypeID)
                                            ) {
                                                createToastForm(
                                                    'warn',
                                                    'Acción requerida',
                                                    'Por favor ingrese todos los campos requeridos'
                                                )
                                                return
                                            }
                                            const inputValue = familyData.relativesTypeID;
                                            const [id, ...descriptionParts] = inputValue.split(' ');
                                            const description = descriptionParts.join(' ');

                                            let member = {
                                                ...familyData,
                                                relativesTypeID: parseInt(id),
                                                relativesTypeName: description
                                            }
                                            setFamilyList([
                                                ...familyList,
                                                member
                                            ]);
                                            setFamilyData(FamilyInformationModel)
                                        }}
                                        endIcon={<AddCircleIcon />}>
                                        Agregar
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de familiares</strong>
                                <DataTable value={familyList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primero apellido"></Column>
                                    <Column field="secondLastName" header="Segundo nombre"></Column>
                                    <Column field="relativesTypeName" header="Parentesco"></Column>
                                    <Column field="age" header="Edad"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-3">
                                    <ContactEmergencyIcon />
                                    <span>Contactos de Emergencia</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-3">
                                <TextField fullWidth required name='firstName' value={emergencyData.firstName} onChange={(e) => handleChangeEmergencyData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth name='middleName' value={emergencyData.middleName} onChange={(e) => handleChangeEmergencyData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth required name='lastName' value={emergencyData.lastName} onChange={(e) => handleChangeEmergencyData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth name='secondLastName' value={emergencyData.secondLastName} onChange={(e) => handleChangeEmergencyData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <div>
                                <div>
                                    <strong>Información del domicilio</strong>
                                    <div className="flex align-items-center gap-3">
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
                                                    cityID: null,
                                                    sectorID: null,
                                                    suburbID: null,
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
                                                    sectorID: null,
                                                    suburbID: null,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Municipio" variant="standard" />}
                                        />
                                        <Button variant="contained" id='city'
                                            disabled={!emergencyData.stateID}
                                            value='city' size="small"
                                            onClick={(e) => {
                                                setVisibleSideBar(true);
                                                setopButton(e.target.id);
                                                setdataAddress({
                                                    stateID: emergencyData.stateID,
                                                    cityID: emergencyData.cityID,
                                                    sectorID: emergencyData.sectorID,
                                                })
                                            }}>
                                            +
                                        </Button>
                                        <Autocomplete
                                            fullWidth
                                            {...defaultPropsSectors}
                                            options={sectors.filter(s => s.cityID === emergencyData.cityID?.cityID)}
                                            value={emergencyData.sectorID}
                                            onChange={(event, newValue) => {
                                                setEmergencyData((prevData) => ({
                                                    ...prevData,
                                                    sectorID: newValue,
                                                    suburbID: null,
                                                }));
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Sectores" variant="standard" />}
                                        />
                                        <Button variant="contained" id='sector'
                                            disabled={!emergencyData.cityID}
                                            value='sector' size="small"
                                            onClick={(e) => {
                                                setVisibleSideBar(true);
                                                setopButton(e.target.id);
                                                setdataAddress({
                                                    stateID: emergencyData.stateID,
                                                    cityID: emergencyData.cityID,
                                                    sectorID: emergencyData.sectorID,
                                                })
                                            }}>
                                            +
                                        </Button>
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
                                        <Button variant="contained" id='suburb'
                                            disabled={!emergencyData.sectorID}
                                            value='suburb'
                                            size="small"
                                            onClick={(e) => {
                                                setVisibleSideBar(true);
                                                setopButton(e.target.id);
                                                setdataAddress({
                                                    stateID: emergencyData.stateID,
                                                    cityID: emergencyData.cityID,
                                                    sectorID: emergencyData.sectorID,
                                                })
                                            }}>
                                            +
                                        </Button>
                                    </div>
                                    <br />
                                </div>
                            </div>
                            <div className="flex align-items-center gap-3">
                                <TextField sx={{ width: '15%' }} name='phoneNumber' value={emergencyData.phoneNumber} onChange={(e) => handleChangeEmergencyData(e)} id="phone" label="Telefono" size='small' variant="standard" />
                                <FormControl variant="standard" required sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        required
                                        id="parentesco"
                                        name='relativesTypeID'
                                        value={emergencyData.relativesTypeID}
                                        onChange={(e) => handleChangeEmergencyData(e)}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID}
                                                    value={`${item.relativesTypeID} ${item.relativesTypeDesc}`}>{item.relativesTypeDesc}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Button variant="contained" size='small' color="primary"
                                    onClick={() => {
                                        if (!isValidText(emergencyData.firstName) || !isValidText(emergencyData.lastName)
                                            || !isValidText(emergencyData.relativesTypeID) || !isValidText(emergencyData.stateID)
                                            || !isValidText(emergencyData.cityID) || !isValidText(emergencyData.sectorID)
                                            || !isValidText(emergencyData.suburbID) || !isValidText(emergencyData.relativesTypeID)
                                        ) {
                                            createToastForm(
                                                'warn',
                                                'Acción requerida',
                                                'Por favor ingrese todos los campos requeridos'
                                            )
                                            return
                                        }
                                        const inputValue = emergencyData.relativesTypeID;
                                        const [id, ...descriptionParts] = inputValue.split(' ');
                                        const description = descriptionParts.join(' ');

                                        let contact = {
                                            ...emergencyData,
                                            relativesTypeID: parseInt(id),
                                            relativesTypeName: description
                                        }
                                        setEmergencyList([
                                            ...emergencyList,
                                            contact
                                        ]);
                                        setEmergencyData(EcontactsModel);
                                    }}
                                    endIcon={<AddCircleIcon />}
                                >
                                    Agregar
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de contactos</strong>
                                <DataTable value={emergencyList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primer apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="phoneNumber" header="Telefono"></Column>
                                    <Column field="relativesTypeName" header="Parentesco"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-3">
                                    <GroupIcon />
                                    <span>Familiares PAH</span>
                                </div>
                            </div>
                        }>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '1rem',

                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '50%'
                                }}>
                                    <h4>Tiene familiares que laboran en la empresa?</h4>
                                    <Checkbox value={isfamilyPAH} onChange={() => {
                                        setIsFamilyPAH(!isfamilyPAH);
                                        setEmployeeData((prevData) => ({
                                            ...prevData,
                                            relatives: !isfamilyPAH
                                        }));
                                        if (isfamilyPAH) {
                                            setFamilyPAHList([]);
                                            setFamilyPAHData(auxrelative);
                                        }
                                    }} />
                                </div>
                                {
                                    isfamilyPAH &&
                                    <div style={{ width: '50%' }}>
                                        <FormControl fullWidth variant="standard" required sx={{ margin: 0, width: '20%' }} size='small'>
                                            <InputLabel id="parentesco">Parentesco</InputLabel>
                                            <Select
                                                labelId="parentesco"
                                                required
                                                id="parentesco"
                                                name='relativesTypeID'
                                                value={familyPAHData.relativesTypeID}
                                                onChange={(e) => handleFamilyPAHData(e)}
                                                label="Parentesco"
                                            >
                                                {
                                                    relativesType.map((item) => (
                                                        <MenuItem key={item.relativesTypeID}
                                                            value={`${item.relativesTypeID} ${item.relativesTypeDesc}`}>
                                                            {item.relativesTypeDesc}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                        <Autocomplete
                                            fullWidth
                                            options={employeeOptions}
                                            getOptionLabel={(option) => option?.nombreCompleto || ''}
                                            value={familyPAHData.employeeID}
                                            onInputChange={(event, value, reason) => {
                                                setInputValue(value);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    if (inputValue && inputValue.length > 1) {
                                                        apipms.get(`/employee/searchEmployee/${inputValue}`)
                                                            .then((response) => {
                                                                setEmployeeOptions(response.data);
                                                            });
                                                    } else {
                                                        setEmployeeOptions([]);
                                                    }
                                                }
                                            }}
                                            onChange={(value, newValue) => {
                                                setFamilyPAHData((prevData) => ({
                                                    ...prevData,
                                                    employeeID: newValue
                                                }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Empleado"
                                                    variant="standard"
                                                    size="small"
                                                />
                                            )}
                                        />
                                        <br />
                                        <Button variant="contained" size='small'
                                            disabled={!isValidText(familyPAHData.employeeID) || !isValidText(familyPAHData.relativesTypeID)}
                                            color="primary"
                                            onClick={() => {
                                                if (!isValidText(familyPAHData.employeeID)
                                                    || !isValidText(familyPAHData.relativesTypeID)
                                                ) {
                                                    createToastForm(
                                                        'warn',
                                                        'Acción requerida',
                                                        'Por favor ingrese todos los campos requeridos'
                                                    )
                                                    return
                                                }
                                                const inputValue = familyPAHData.relativesTypeID;
                                                const [id, ...descriptionParts] = inputValue.split(' ');
                                                const description = descriptionParts.join(' ');

                                                let contact = {
                                                    ...familyPAHData,
                                                    relativesTypeID: parseInt(id),
                                                    relativesTypeName: description
                                                }
                                                setFamilyPAHList([
                                                    ...familyPAHList,
                                                    contact
                                                ]);
                                                setFamilyPAHData(auxrelative);
                                            }}
                                            endIcon={<AddCircleIcon />}
                                        >
                                            Agregar
                                        </Button>
                                    </div>
                                }
                            </div>
                            {
                                familyPAHList.length > 0 &&
                                <div style={{ width: '60%' }}>
                                    <strong>Lista de familiares</strong>
                                    <DataTable value={familyPAHList} size="small" showGridlines editMode="cell">
                                        <Column field="employeeID.nombreCompleto" header="Nombre"></Column>
                                        <Column field="relativesTypeName" header="Parentesco"></Column>
                                    </DataTable>
                                </div>
                            }

                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-3">
                                    <PaidIcon />
                                    <span>Beneficiarios</span>
                                </div>
                            </div>
                        }>
                            <div className="flex align-items-center gap-3">
                                <TextField fullWidth required name='firstName' value={beneficiariesData.firstName} onChange={(e) => handleBeneficiariesData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth name='middleName' value={beneficiariesData.middleName} onChange={(e) => handleBeneficiariesData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth required name='lastName' value={beneficiariesData.lastName} onChange={(e) => handleBeneficiariesData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth name='secondLastName' value={beneficiariesData.secondLastName} onChange={(e) => handleBeneficiariesData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-3">
                                <FloatLabel>
                                    <InputNumber id="percentage" name="percentage" min={0} max={100} value={beneficiariesData.percentage} onValueChange={(e) => handleBeneficiariesData(e)} />
                                    <label htmlFor="percentage">Porcentage %</label>
                                </FloatLabel>
                                <TextField name='phoneNumber' value={beneficiariesData.phoneNumber} onChange={(e) => handleBeneficiariesData(e)} sx={{ width: '15%' }} id="phone" label="Telefono" variant="standard" />
                                <FormControl variant="standard" required sx={{ margin: 0, width: '20%' }} size='small'>
                                    <InputLabel id="parentesco">Parentesco</InputLabel>
                                    <Select
                                        labelId="parentesco"
                                        required
                                        id="parentesco"
                                        name='relativesTypeID'
                                        value={beneficiariesData.relativesTypeID}
                                        onChange={(e) => handleBeneficiariesData(e)}
                                        label="Parentesco"
                                    >
                                        {
                                            relativesType.map((item) => (
                                                <MenuItem key={item.relativesTypeID}
                                                    value={`${item.relativesTypeID} ${item.relativesTypeDesc}`}>
                                                    {item.relativesTypeDesc}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <Button variant="contained" size='small' color="primary" endIcon={<AddCircleIcon />}
                                    onClick={() => {
                                        if (!isValidText(beneficiariesData.firstName) || !isValidText(beneficiariesData.lastName)
                                            || !isValidText(beneficiariesData.relativesTypeID)
                                        ) {
                                            createToastForm(
                                                'warn',
                                                'Acción requerida',
                                                'Por favor ingrese todos los campos requeridos'
                                            )
                                            return
                                        }
                                        if (beneficiariesList.length > 0) {
                                            let total = beneficiariesList.reduce((total, b) => total + b.percentage, 0);
                                            if ((total + beneficiariesData.percentage) > 100) {
                                                createToastForm(
                                                    'warn',
                                                    'Acción requerida',
                                                    'Los porcentajes no deben ser mayor a 100'
                                                )
                                                return
                                            }
                                        }

                                        const inputValue = beneficiariesData.relativesTypeID;
                                        const [id, ...descriptionParts] = inputValue.split(' ');
                                        const description = descriptionParts.join(' ');

                                        let beneficiary = {
                                            ...beneficiariesData,
                                            relativesTypeID: parseInt(id),
                                            relativesTypeName: description
                                        }

                                        setBeneficiariesList([
                                            ...beneficiariesList,
                                            beneficiary
                                        ]);
                                        setBeneficiariesData(BeneficiariesModel);
                                    }}
                                >
                                    Agregar
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de beneficiarios</strong>
                                <DataTable value={beneficiariesList} tableStyle={{ minWidth: '50rem' }} size="small" showGridlines editMode="cell">
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primer apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="percentage" header="Porcentaje" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}></Column>
                                    <Column field="phoneNumber" header="Telefono"></Column>
                                    <Column field="relativesTypeName" header="Parentesco"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                    </Accordion>
                    <NewAddress
                        visible={visibleSideBar}
                        setVisible={setVisibleSideBar}
                        opButton={opButton}
                        dataAddress={dataAddress}
                        setCities={setCities}
                        setSectors={setSectors}
                        setSuburbs={setSuburbs}
                    />
                </div>
            </Dialog >

        </>
    )
}

export default DialogEmployee
