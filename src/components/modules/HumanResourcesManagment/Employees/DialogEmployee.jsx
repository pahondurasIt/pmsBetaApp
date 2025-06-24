import React, { useEffect, useState, useRef } from 'react'
import { Dialog, Accordion, AccordionTab, DataTable, Column, InputNumber, FloatLabel } from 'primereact';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { Toast } from 'primereact/toast';
import {
    Autocomplete, Avatar, Button, Checkbox, Divider,
    FormControl, InputLabel, MenuItem, Select, TextField
}
    from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GroupIcon from '@mui/icons-material/Group';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import { apipms } from '../../../../service/apipms';
import { AuxRelativeModel, BeneficiariesModel, ChildrenModel, EcontactsModel, EmployeeModel, EmployeeRequiredFields, FamilyInformationModel } from '../../../Models/Employee';
import { isValidText } from '../../../../helpers/validator';
import NewAddress from './NewAddress';
import dayjs from '../../../../helpers/dayjsConfig';
import useEmployeePhoto from '../../../../hooks/usePhotoUrl';
import DialogNewEmployee from './DialogNewEmployee';

const DialogEmployee = ({ visible, setVisible, setEmployeesList, dataEmployeeSelected, handleCloseDialog, onShowToast }) => {
    const [employeeID, setemployeeID] = useState('');
    const [photoURL, setphotoURL] = useState('');
    const [employeeData, setEmployeeData] = useState(EmployeeModel);
    const [childrenData, setChildrenData] = useState(ChildrenModel)
    const [childrenList, setChildrenList] = useState([]);
    const [familyData, setFamilyData] = useState(FamilyInformationModel);
    const [familyList, setFamilyList] = useState([]);
    const [emergencyData, setEmergencyData] = useState(EcontactsModel);
    const [emergencyList, setEmergencyList] = useState([]);
    const [isfamilyPAH, setIsFamilyPAH] = useState(false);
    const [familyPAHList, setFamilyPAHList] = useState([]);
    const [familyPAHData, setFamilyPAHData] = useState(AuxRelativeModel);
    const [beneficiariesData, setBeneficiariesData] = useState(BeneficiariesModel);
    const [beneficiariesList, setBeneficiariesList] = useState([]);
    const [empSupervisorID, setEmpSupervisorID] = useState(null);
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
    const [codeEmployee, setcodeEmployee] = useState('');
    const [errors, setErrors] = useState({});
    const [visibleDialogNewEmployee, setvisibleDialogNewEmployee] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        employeeID: '',
        fullName: '',
        shiftID: '',
        jobName: '',
        codeEmployee: ''
    });

    useEffect(() => {
        if (dataEmployeeSelected?.employee[0]) {
            setphotoURL(dataEmployeeSelected?.employee[0].photoUrl || '');
            setemployeeID(dataEmployeeSelected?.employee[0].employeeID);
            setcodeEmployee(dataEmployeeSelected?.employee[0].codeEmployee || '');
            setEmployeeData({
                firstName: dataEmployeeSelected?.employee[0].firstName || '',
                middleName: dataEmployeeSelected?.employee[0].middleName || '',
                lastName: dataEmployeeSelected?.employee[0].lastName || '',
                secondLastName: dataEmployeeSelected?.employee[0].secondLastName || '',
                phoneNumber: dataEmployeeSelected?.employee[0].phoneNumber || '',
                genderID: dataEmployeeSelected?.employee[0].genderID || '',
                docID: dataEmployeeSelected?.employee[0].docID || '',
                docNumber: dataEmployeeSelected?.employee[0].docNumber || '',
                birthDate: new Date(dataEmployeeSelected?.employee[0].birthDate) || new Date(),
                bloodTypeID: dataEmployeeSelected?.employee[0].bloodTypeID || '',
                stateID: {
                    stateID: dataEmployeeSelected?.employee[0].stateID,
                    stateName: dataEmployeeSelected?.employee[0].stateName
                } || null,
                cityID: {
                    cityID: dataEmployeeSelected?.employee[0].cityID,
                    cityName: dataEmployeeSelected?.employee[0].cityName,
                    stateID: dataEmployeeSelected?.employee[0].stateID
                } || null,
                sectorID: {
                    sectorID: dataEmployeeSelected?.employee[0].sectorID,
                    sectorName: dataEmployeeSelected?.employee[0].sectorName,
                    cityID: dataEmployeeSelected?.employee[0].cityID
                } || null,
                suburbID: {
                    suburbID: dataEmployeeSelected?.employee[0].suburbID,
                    suburbName: dataEmployeeSelected?.employee[0].suburbName,
                    sectorID: dataEmployeeSelected?.employee[0].sectorID
                } || null,
                address: dataEmployeeSelected?.employee[0].address || '',
                gabachSize: {
                    sizeID: dataEmployeeSelected?.employee[0].gabachSize,
                    sizeName: dataEmployeeSelected?.employee[0].gabacha
                } || '',
                shirtSize: {
                    sizeID: dataEmployeeSelected?.employee[0].shirtSize,
                    sizeName: dataEmployeeSelected?.employee[0].shirt
                } || '',
                divisionID: {
                    divisionID: dataEmployeeSelected?.employee[0].divisionID,
                    divisionName: dataEmployeeSelected?.employee[0].divisionName
                } || null,
                areaID: {
                    areaID: dataEmployeeSelected?.employee[0].areaID,
                    areaName: dataEmployeeSelected?.employee[0].areaName,
                    divisionID: dataEmployeeSelected?.employee[0].divisionID
                } || null,
                departmentID: {
                    departmentID: dataEmployeeSelected?.employee[0].departmentID,
                    departmentName: dataEmployeeSelected?.employee[0].departmentName,
                    areaID: dataEmployeeSelected?.employee[0].areaID
                } || null,
                jobID: {
                    jobID: dataEmployeeSelected?.employee[0].jobID,
                    jobName: dataEmployeeSelected?.employee[0].jobName,
                    departmentID: dataEmployeeSelected?.employee[0].departmentID
                } || null,
                supervisor: {
                    supervisorID: dataEmployeeSelected?.employee[0].supervisorID,
                    supervisorName: dataEmployeeSelected?.employee[0].supervisorName
                } || null,
                hireDate: isValidText(dataEmployeeSelected?.employee[0].hireDate) ? new Date(dataEmployeeSelected?.employee[0].hireDate) : new Date(),
                endDate: isValidText(dataEmployeeSelected?.employee[0].endDate) ? new Date(dataEmployeeSelected?.employee[0].endDate) : new Date(),
                isActive: dataEmployeeSelected?.employee[0].isActive || true,
                partnerName: dataEmployeeSelected?.employee[0].partnerName || '',
                partnerage: dataEmployeeSelected?.employee[0].partnerage || 0,
                companyID: dataEmployeeSelected?.employee[0].companyID || 1,
                contractTypeID: dataEmployeeSelected?.employee[0].contractTypeID || '',
                payrollTypeID: dataEmployeeSelected?.employee[0].payrollTypeID || '',
                shiftID: dataEmployeeSelected?.employee[0].shiftID || '',
                educationLevelID: dataEmployeeSelected?.employee[0].educationLevelID || '',
                educationGrade: dataEmployeeSelected?.employee[0].educationGrade || '',
                transportTypeID: dataEmployeeSelected?.employee[0].transportTypeID || '',
                maritalStatusID: dataEmployeeSelected?.employee[0].maritalStatusID || '',
                nationality: dataEmployeeSelected?.employee[0].nationality || '',
                evaluationStep: dataEmployeeSelected?.employee[0].evaluationStep || false,
                incapacitated: dataEmployeeSelected?.employee[0].incapacitated || false,
                salary: dataEmployeeSelected?.employee[0].salary || 0,
                relatives: dataEmployeeSelected?.employee[0].relatives || false
            })
            setChildrenList(dataEmployeeSelected?.children || []);
            setFamilyList(dataEmployeeSelected?.familyInformation || []);
            setEmergencyList(dataEmployeeSelected?.econtact || []);
            setFamilyPAHList(dataEmployeeSelected?.auxrelative || []);
            setBeneficiariesList(dataEmployeeSelected?.beneficiaries || []);
            setEmpSupervisorID(dataEmployeeSelected?.employee[0].empSupervisorID || {});
            setIsFamilyPAH(dataEmployeeSelected?.auxrelative.length > 0 ? true : false);
        }

        apipms.get('/dataForm')
            .then((response) => {
                setGender(response.data.gender || []);
                setBloodTypes(response.data.bloodTypes || []);
                setMaritalStatus(response.data.maritalStatus || []);
                setTransportTypes(response.data.transportTypes || []);
                setDocumentTypes(response.data.documentTypes || []);
                setStates(response.data.states || []);
                setCities(response.data.cities || []);
                setSectors(response.data.sectors || []);
                setSuburbs(response.data.suburbs || []);
                setSizes(response.data.sizes || []);
                setEducationLevels(response.data.educationLevels || []);
                setRelativesType(response.data.relativesType || []);
                setDivisions(response.data.divisions || []);
                setAreas(response.data.areas || []);
                setDepartments(response.data.departments || []);
                setJobs(response.data.jobs || []);
                setContractType(response.data.contractType || []);
                setPayrollType(response.data.payrollType || []);
                setShifts(response.data.shifts || []);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                createToast(
                    'error',
                    'Error',
                    'Ha ocurrido un error al intentar cargar los datos del formulario'
                );
            })
    }, [dataEmployeeSelected]);
    const { getEmployeePhoto } = useEmployeePhoto();

    const toast = useRef(null);
    const createToast = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 6000 });
    };

    const defaultPropsState = {
        options: states,
        getOptionLabel: (option) => option.stateName || '',
    };
    const defaultPropsCity = {
        options: cities,
        getOptionLabel: (option) => option.cityName || '',
    };
    const defaultPropsSectors = {
        options: sectors,
        getOptionLabel: (option) => option.sectorName || '',
    };
    const defaultPropsSuburbs = {
        options: suburbs,
        getOptionLabel: (option) => option.suburbName || '',
    };
    const defaultPropsSizes = {
        options: sizes,
        getOptionLabel: (option) => option.sizeName || '',
    };
    const defaultPropsDivision = {
        options: divisions,
        getOptionLabel: (option) => option.divisionName || '',
    };
    const defaultPropsArea = {
        options: areas,
        getOptionLabel: (option) => option.areaName || '',
    };
    const defaultPropsDepartment = {
        options: departments,
        getOptionLabel: (option) => option.departmentName || '',
    };
    const defaultPropsJobs = {
        options: jobs,
        getOptionLabel: (option) => option.jobName || '',
    };
    const defaultPropsSupervisor = {
        options: supervisors,
        getOptionLabel: (option) => option.supervisorName || '',
    };

    const handleChangeEmployeeData = (event) => {
        const { name, value } = event.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
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
        let { rowData, newValue, field, originalEvent: event, newRowData } = e;

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
                if (isValidText(employeeID)) {
                    apipms.put(`/employee/updateBeneficiaryInfo/${rowData.beneficiaryID}`, {
                        ...newRowData
                    })
                        .then((response) => {
                            setBeneficiariesList((prevList) => {
                                const updatedList = [...prevList];
                                updatedList[index] = { ...updatedList[index], percentage: newValue };
                                return updatedList;
                            });
                            createToast(
                                'success',
                                'Confirmado',
                                'El registro a sido actualizado'
                            );
                        })
                        .catch((error) => {
                            console.error('Error updating data:', error);
                            createToast(
                                'error',
                                'Error',
                                'Ha ocurrido un error al intentar actualizar el registro'
                            );
                        })
                        .catch((error) => {
                            console.error('Error updating data:', error);
                            createToast(
                                'error',
                                'Error',
                                'Ha ocurrido un error al intentar actualizar el registro'
                            );
                        });
                } else {
                    // Si no hay ID de beneficiario, actualiza directamente la lista
                    let updatedBeneficiariesList = [...beneficiariesList];
                    updatedBeneficiariesList[index] = { ...updatedBeneficiariesList[index], percentage: newValue };
                    setBeneficiariesList(updatedBeneficiariesList);
                }
                //rowData[field] = newValue;
            } else {
                event.preventDefault();
                createToast(
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

    const renderEditButton = () => {
        if (isValidText(employeeID)) {
            return <EditIcon fontSize='medium' sx={{ color: '#1976d2' }} />
        }
    };
    const renderDeleteButton = () => {
        return <DeleteOutlineIcon fontSize='medium' color='error' />;
    };

    const cleanForm = () => {
        setVisible(false);
        setEmployeeData(EmployeeModel);
        setChildrenData(ChildrenModel);
        setFamilyData(FamilyInformationModel);
        setEmergencyData(EcontactsModel);
        setFamilyPAHData(AuxRelativeModel);
        setBeneficiariesData(BeneficiariesModel);
        setChildrenList([]);
        setFamilyList([]);
        setEmergencyList([]);
        setFamilyPAHList([]);
        setBeneficiariesList([]);
        setEmpSupervisorID('');
        setIsFamilyPAH(false);
        setVisibleSideBar(false);
        setInputValue('');
        setdataAddress({
            stateID: null,
            cityID: null,
            sectorID: null,
            suburbID: null
        });
        setemployeeID('');
    }

    // Select children data when clicking on the cell
    const onCellSelectChildren = (event) => {
        if (event.cellIndex === 0) {
            if (isValidText(event.rowData.childrenID)) {
                setChildrenData({
                    childrenID: event.rowData.childrenID,
                    firstName: event.rowData.firstName,
                    middleName: event.rowData.middleName,
                    lastName: event.rowData.lastName,
                    secondLastName: event.rowData.secondLastName,
                    birthDate: new Date(event.rowData.birthDate),
                    birthCert: event.rowData.birthCert,
                    genderID: `${event.rowData.genderID} ${event.rowData.genderName}`,
                    genderName: event.rowData.genderName
                });
            }
        } else if (event.cellIndex === 1) {
            if (isValidText(employeeID)) {
                apipms.delete(`/employee/deleteChild/${event.rowData.childrenID}`)
                    .then((response) => {
                        setChildrenList((prevList) => {
                            const index = prevList.findIndex(child => child.childrenID === event.rowData.childrenID);
                            if (index !== -1) {
                                const updatedList = [...prevList];
                                updatedList.splice(index, 1);
                                return updatedList;
                            }
                            return prevList;
                        });
                        createToast(
                            'success',
                            'Confirmado',
                            'El registro a sido eliminado'
                        );
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                        createToast(
                            'error',
                            'Error',
                            'Ha ocurrido un error al intentar eliminar el registro'
                        );
                    })
            } else {
                let updatedChildrenList = [...childrenList];
                updatedChildrenList.splice(event.rowIndex, 1);
                setChildrenList(updatedChildrenList);
            }

        }
    };

    // Select family data when clicking on the cell
    const onCellSelectFamilyInfo = (event) => {
        if (event.cellIndex === 0) {
            if (isValidText(event.rowData.familyInfoID)) {
                setFamilyData({
                    familyInfoID: event.rowData.familyInfoID,
                    relativesTypeID: `${event.rowData.relativesTypeID} ${event.rowData.relativesTypeDesc}`,
                    relativesTypeDesc: event.rowData.relativesTypeDesc,
                    firstName: event.rowData.firstName,
                    middleName: event.rowData.middleName,
                    lastName: event.rowData.lastName,
                    secondLastName: event.rowData.secondLastName,
                    age: event.rowData.age
                });
            }
        } else if (event.cellIndex === 1) {
            if (isValidText(employeeID)) {
                apipms.delete(`/employee/deleteFamilyInfo/${event.rowData.familyInfoID}`)
                    .then((response) => {
                        setFamilyList((prevList) => {
                            const index = prevList.findIndex(family => family.familyInfoID === event.rowData.familyInfoID);
                            if (index !== -1) {
                                const updatedList = [...prevList];
                                updatedList.splice(index, 1);
                                return updatedList;
                            }
                            return prevList;
                        });
                        createToast(
                            'success',
                            'Confirmado',
                            'El registro a sido eliminado'
                        );
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                        createToast(
                            'error',
                            'Error',
                            'Ha ocurrido un error al intentar eliminar el registro'
                        );
                    })
            } else {
                let updatedFamilyList = [...familyList];
                updatedFamilyList.splice(event.rowIndex, 1);
                setFamilyList(updatedFamilyList);
            }
        }
    };

    // Select emergency contact data when clicking on the cell
    const onCellSelectEmergencyContact = (event) => {
        if (event.cellIndex === 0) {
            if (isValidText(event.rowData.econtactID)) {
                setEmergencyData({
                    econtactID: event.rowData.econtactID,
                    firstName: event.rowData.firstName,
                    middleName: event.rowData.middleName,
                    lastName: event.rowData.lastName,
                    secondLastName: event.rowData.secondLastName,
                    stateID: {
                        stateID: event.rowData.stateID,
                        stateName: event.rowData.stateName
                    },
                    cityID: {
                        cityID: event.rowData.cityID,
                        cityName: event.rowData.cityName
                    },
                    sectorID: {
                        sectorID: event.rowData.sectorID,
                        sectorName: event.rowData.sectorName
                    },
                    suburbID: {
                        suburbID: event.rowData.suburbID,
                        suburbName: event.rowData.suburbName
                    },
                    relativesTypeID: `${event.rowData.relativesTypeID} ${event.rowData.relativesTypeDesc}`,
                    relativesTypeDesc: event.rowData.relativesTypeDesc,
                    phoneNumber: event.rowData.phoneNumber
                });
            }
        } else if (event.cellIndex === 1) {
            if (isValidText(employeeID)) {
                apipms.delete(`/employee/deleteEContact/${event.rowData.econtactID}`)
                    .then((response) => {
                        setEmergencyList((prevList) => {
                            const index = prevList.findIndex(econtact => econtact.econtactID === event.rowData.econtactID);
                            if (index !== -1) {
                                const updatedList = [...prevList];
                                updatedList.splice(index, 1);
                                return updatedList;
                            }
                            return prevList;
                        });
                        createToast(
                            'success',
                            'Confirmado',
                            'El registro a sido eliminado'
                        );
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                        createToast(
                            'error',
                            'Error',
                            'Ha ocurrido un error al intentar eliminar el registro'
                        );
                    })
            } else {
                let updatedEmergencyList = [...emergencyList];
                updatedEmergencyList.splice(event.rowIndex, 1);
                setEmergencyList(updatedEmergencyList);
            }
        }
    };

    // Select family PAH data when clicking on the cell
    const onCellSelectFamilyPAH = (event) => {
        if (event.cellIndex === 0) {
            if (isValidText(event.rowData.auxRelativeID)) {
                setFamilyPAHData({
                    auxRelativeID: event.rowData.auxRelativeID,
                    relativesTypeID: `${event.rowData.relativesTypeID} ${event.rowData.relativesTypeDesc}`,
                    newEmployee: event.rowData.newEmployee,
                    relativesTypeDesc: event.rowData.relativesTypeDesc,
                    employeeID: {
                        employeeID: event.rowData.employeeID,
                        completeName: event.rowData.completeName
                    },
                    completeName: event.rowData.completeName
                });
            }
        } else if (event.cellIndex === 1) {
            if (isValidText(employeeID)) {
                apipms.delete(`/employee/deleteAuxRelative/${event.rowData.auxRelativeID}`)
                    .then((response) => {
                        setFamilyPAHList((prevList) => {
                            const index = prevList.findIndex(familyPAH => familyPAH.auxRelativeID === event.rowData.auxRelativeID);
                            if (index !== -1) {
                                const updatedList = [...prevList];
                                updatedList.splice(index, 1);
                                return updatedList;
                            }
                            return prevList;
                        });
                        createToast(
                            'success',
                            'Confirmado',
                            'El registro a sido eliminado'
                        );
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                        createToast(
                            'error',
                            'Error',
                            'Ha ocurrido un error al intentar eliminar el registro'
                        );
                    })
            } else {
                let updatedFamilyPAHList = [...familyPAHList];
                updatedFamilyPAHList.splice(event.rowIndex, 1);
                setFamilyPAHList(updatedFamilyPAHList);
            }
        }
    };

    // Select beneficiaries data when clicking on the cell
    const onCellSelectBeneficiaries = (event) => {
        if (event.cellIndex === 0) {
            if (isValidText(event.rowData.beneficiaryID)) {
                setBeneficiariesData({
                    beneficiaryID: event.rowData.beneficiaryID,
                    firstName: event.rowData.firstName,
                    middleName: event.rowData.middleName,
                    lastName: event.rowData.lastName,
                    secondLastName: event.rowData.secondLastName,
                    relativesTypeID: `${event.rowData.relativesTypeID} ${event.rowData.relativesTypeDesc}`,
                    relativesTypeDesc: event.rowData.relativesTypeDesc,
                    percentage: parseInt(event.rowData.percentage),
                    phoneNumber: event.rowData.phoneNumber
                });
            }
        } else if (event.cellIndex === 1) {
            if (isValidText(employeeID)) {
                apipms.delete(`/employee/deleteBeneficiaryInfo/${event.rowData.beneficiaryID}`)
                    .then((response) => {
                        setBeneficiariesList((prevList) => {
                            const index = prevList.findIndex(beneficiary => beneficiary.beneficiaryID === event.rowData.beneficiaryID);
                            if (index !== -1) {
                                const updatedList = [...prevList];
                                updatedList.splice(index, 1);
                                return updatedList;
                            }
                            return prevList;
                        });
                        createToast(
                            'success',
                            'Confirmado',
                            'El registro a sido eliminado'
                        );
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error)
                        createToast(
                            'error',
                            'Error',
                            'Ha ocurrido un error al intentar eliminar el registro'
                        );
                    })
            } else {
                let updatedBeneficiariesList = [...beneficiariesList];
                updatedBeneficiariesList.splice(event.rowIndex, 1);
                setBeneficiariesList(updatedBeneficiariesList);
            }
        }
    };

    const closeForm = () => {
        confirmDialog({
            message: 'Esta seguro de cerrar el formulario sin guardar los cambios?',
            header: 'Confirmación',
            icon: 'pi pi-info-circle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            accept
        });
    };

    const accept = () => {
        // Lógica a ejecutar al aceptar el diálogo
        cleanForm();  // Limpia los estados internos
        handleCloseDialog();    // Cierra el Dialog en el padre
    };



    const validDataForm = () => {
        const newErrors = {};
        for (const key in EmployeeRequiredFields) {
            if (!isValidText(employeeData[key])) {
                newErrors[key] = `El campo "${EmployeeRequiredFields[key]}" es obligatorio.`;
            }
        }

        if (beneficiariesList.length < 1) {
            newErrors.beneficiariesList = 'Debe agregar al menos un beneficiario.';
        }

        if (emergencyList.length < 1) {
            newErrors.emergencyList = 'Debe agregar al menos un contacto de emergencia.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            document.getElementById(firstErrorKey)?.focus();
            return false;
        }

        return true;
    };

    const openDialogNewEmployee = () => {
        setvisibleDialogNewEmployee(true);
        //setnewEmployee({
    }

    return (
        <>
            <Toast ref={toast} />
            {visibleDialogNewEmployee &&
                <DialogNewEmployee
                    visible={visibleDialogNewEmployee}
                    setVisible={setvisibleDialogNewEmployee}
                    handleCloseDialog={handleCloseDialog}
                    newEmployee={newEmployee}
                />
            }
            <Dialog
                header={
                    <div>
                        {employeeID ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '40px',
                                marginLeft: '40px',
                                alignItems: 'center'
                            }}>
                                <Avatar
                                    alt={dataEmployeeSelected?.employee[0].nombreCompleto || ''}
                                    src={getEmployeePhoto(dataEmployeeSelected?.employee[0].photoUrl || '')}
                                    sx={{ width: 120, height: 120 }}
                                />
                                <Divider orientation="vertical" variant="middle" flexItem />
                                <div>
                                    <h3 style={{ fontSize: '27px', fontWeight: 'bold', color: '#005aa9' }}>Code: {codeEmployee}</h3>
                                    <h3 style={{ fontSize: '27px', fontWeight: '300', color: '#005aa9' }}>{dataEmployeeSelected?.employee[0].nombreCompleto || ''}</h3>
                                </div>
                            </div>
                        ) : (
                            <h2>Datos del empleado</h2>
                        )}
                    </div>
                }
                visible={visible}
                style={{ width: '65vw' }}
                onHide={() => {
                    closeForm(); // Muestra el diálogo de confirmación
                }} footer={
                    <div className="flex justify-content-end gap-3">
                        <Button size='small' variant="outlined" onClick={() => closeForm() // Muestra el diálogo de confirmación
                        }>
                            Cancelar
                        </Button>
                        <Button size='small' variant="contained" onClick={() => {
                            console.log(employeeData);
                            console.log(childrenList);
                            console.log(isfamilyPAH);
                            console.log(familyList);
                            console.log(emergencyList);
                            console.log(familyPAHList);
                            console.log(beneficiariesList);
                            console.log(empSupervisorID);


                            let result = validDataForm();
                            console.log(result);

                            if (!result) {
                                createToast(
                                    'warn',
                                    'Validación requerida',
                                    'Campos requeridos'
                                )
                                return;
                            }

                            if (employeeData.maritalStatusID === 2 || employeeData.maritalStatusID === 3) {
                                if (employeeData.partnerName === '' || employeeData.partnerage === 0) {
                                    createToast(
                                        'warn',
                                        'Acción requerida',
                                        'Debe ingresar el nombre y la edad del cónyuge'
                                    )
                                    return;
                                }
                            }

                            if (employeeData.jobID?.jobID === 73 && !isValidText(employeeData.line)) {
                                createToast(
                                    'warn',
                                    'Acción requerida',
                                    'Debe ingresar el numero de línea para el puesto de Operador'
                                )
                                return;
                            }

                            let total = beneficiariesList.reduce((total, b) => total + b.percentage, 0);
                            if (total < 100) {
                                createToast(
                                    'warn',
                                    'Acción requerida',
                                    'La suma de los porcentajes de los beneficiarios debe ser igual a 100'
                                )
                                return
                            } else if (total > 100) {
                                createToast(
                                    'warn',
                                    'Acción requerida',
                                    'La suma de los porcentajes de los beneficiarios no debe ser mayor a 100'
                                )
                                return
                            }
                            if (isValidText(employeeID)) {
                                apipms.put(`/employee/${employeeID}`, {
                                    employeeData,
                                    empSupervisorID
                                })
                                    .then((res) => {
                                        console.log(res);
                                        // setVisible(false);
                                        // cleanForm();
                                        // onShowToast?.('success', 'Empleado guardado', 'Los datos se han guardado correctamente');
                                        createToast(
                                            'success',
                                            'Empleado actualizado',
                                            'Los datos se han actualizado correctamente'
                                        );
                                        openDialogNewEmployee();

                                        setEmployeesList((prevList) => {
                                            const index = prevList.findIndex(emp => emp.employeeID === employeeID);
                                            if (index !== -1) {
                                                const updatedList = [...prevList];
                                                updatedList[index] = res.data;
                                                return updatedList;
                                            }
                                            return [...prevList, res.data];
                                        });
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        cleanForm();
                                        onShowToast?.('error', 'Error', 'Ha ocurrido un error al intentar actualizar el registro');
                                    });
                            }
                            else {
                                apipms.post('/employee', {
                                    employeeData,
                                    childrenList,
                                    isfamilyPAH,
                                    familyList,
                                    emergencyList,
                                    familyPAHList,
                                    beneficiariesList
                                })
                                    .then((res) => {
                                        setEmployeesList((prevList) => [...prevList, res.data]);
                                        console.log(res);

                                        setNewEmployee({
                                            employeeID: res.data.employeeID,
                                            fullName: res.data.nombreCompleto,
                                            codeEmployee: res.data.codeEmployee,
                                            jobName: res.data.jobName
                                        })

                                        // setVisible(false);
                                        //cleanForm();
                                        onShowToast?.('success', 'Empleado guardado', 'Los datos se han guardado correctamente');
                                        openDialogNewEmployee();
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        onShowToast?.('error', 'Error', 'Ha ocurrido un error al intentar guardar el registro');
                                    })
                            }
                        }}
                        >
                            Guardar
                        </Button>
                    </div>
                }
            >
                <ConfirmDialog />
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
                                <br />
                                <strong>Información de personal</strong>
                                <div className="flex align-items-center gap-3">
                                    <TextField required name="firstName" value={employeeData.firstName}
                                        onChange={(e) => handleChangeEmployeeData(e)}
                                        id="firstName"
                                        label="Primer nombre"
                                        size='small'
                                        variant="standard"
                                        error={Boolean(errors.firstName)}
                                        helperText={errors.firstName}
                                    />
                                    <TextField name="middleName" value={employeeData.middleName}
                                        onChange={(e) => { handleChangeEmployeeData(e) }}
                                        id="middleName"
                                        label="Segundo nombre"
                                        size='small'
                                        variant="standard"
                                    />
                                    <TextField required name="lastName" value={employeeData.lastName}
                                        onChange={(e) => { handleChangeEmployeeData(e) }}
                                        id="lastName"
                                        label="Primer apellido"
                                        size='small'
                                        variant="standard"
                                        error={Boolean(errors.lastName)}
                                        helperText={errors.lastName}
                                    />
                                    <TextField name="secondLastName" value={employeeData.secondLastName}
                                        onChange={(e) => { handleChangeEmployeeData(e) }}
                                        id="secondLastName"
                                        label="Segundo apellido"
                                        size='small'
                                        variant="standard"
                                    />
                                    <TextField required value={employeeData.nationality}
                                        onChange={(e) => handleChangeEmployeeData(e)}
                                        name='nationality'
                                        id="nationality"
                                        label="Nacionalidad"
                                        size='small'
                                        variant="standard"
                                        error={Boolean(errors.nationality)}
                                        helperText={errors.nationality}
                                    />
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            sx={{ width: '50%' }}
                                            required
                                            id="birthDate"
                                            name='birthDate'
                                            label="Fecha de ingreso"
                                            format='MM/dd/yyyy'
                                            value={employeeData.hireDate}
                                            onChange={(e) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    hireDate: e
                                                }));
                                                if (errors.hireDate) {
                                                    setErrors((prev) => ({ ...prev, hireDate: undefined }));
                                                }
                                            }}
                                            maxDate={new Date()}
                                            error={Boolean(errors.hireDate)}
                                            helperText={errors.hireDate}
                                            enableAccessibleFieldDOMStructure={false}
                                            slots={{
                                                textField: TextField
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    required: true,
                                                    size: 'small',
                                                    variant: 'standard'
                                                }
                                            }}
                                            views={['year', 'month', 'day']}
                                        />
                                    </LocalizationProvider>
                                    <FormControl required variant="standard" sx={{ margin: 0, width: '50%' }} size='small'>
                                        <InputLabel id="tipoDocumento">Tipo de documento</InputLabel>
                                        <Select
                                            labelId="tipoDocumento"
                                            required
                                            id="docID"
                                            name='docID'
                                            value={employeeData.docID || ''}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="Tipo de documento"
                                            error={Boolean(errors.docID)}
                                            helperText={errors.docID}
                                        >
                                            {
                                                documentTypes.map((item) => (
                                                    <MenuItem key={item.docID} value={item.docID}>{item.docTypeName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField required value={employeeData.docNumber}
                                        onChange={(e) => handleChangeEmployeeData(e)}
                                        error={Boolean(errors.docNumber)}
                                        helperText={errors.docNumber}
                                        sx={{ width: '50%' }}
                                        name='docNumber'
                                        id="docNumber"
                                        label="Numero de documento"
                                        size='small'
                                        variant="standard"
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            sx={{ width: '40%' }}
                                            required
                                            id="birthDate"
                                            name='birthDate'
                                            label="Fecha de nacimiento"
                                            format='MM/dd/yyyy'
                                            value={employeeData.birthDate}
                                            onChange={(e) => {
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    birthDate: e
                                                }));
                                                if (errors.birthDate) {
                                                    setErrors((prev) => ({ ...prev, birthDate: undefined }));
                                                }
                                            }}
                                            error={Boolean(errors.birthDate)}
                                            helperText={errors.birthDate}
                                            maxDate={new Date()}
                                            enableAccessibleFieldDOMStructure={false}
                                            slots={{
                                                textField: TextField
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    required: true,
                                                    size: 'small',
                                                    variant: 'standard'
                                                }
                                            }}
                                            views={['year', 'month', 'day']}
                                        />
                                    </LocalizationProvider>
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
                                            error={Boolean(errors.genderID)}
                                            helperText={errors.genderID}
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
                                            error={Boolean(errors.payrollTypeID)}
                                            helperText={errors.payrollTypeID}
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
                                            error={Boolean(errors.contractTypeID)}
                                            helperText={errors.contractTypeID}
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
                                            error={Boolean(errors.shiftID)}
                                            helperText={errors.shiftID}
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
                                <br />
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
                                            if (errors.divisionID) {
                                                setErrors((prev) => ({ ...prev, divisionID: undefined }));
                                            }
                                        }}

                                        renderInput={(params) => <TextField {...params} required label="División"
                                            error={Boolean(errors.divisionID)}
                                            helperText={errors.divisionID} variant="standard" />}
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
                                            if (errors.areaID) {
                                                setErrors((prev) => ({ ...prev, areaID: undefined }));
                                            }
                                        }}

                                        renderInput={(params) => <TextField {...params} required label="Area" variant="standard" error={Boolean(errors.areaID)}
                                            helperText={errors.areaID} />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        {...defaultPropsDepartment}
                                        options={departments.filter(d => d.areaID === employeeData.areaID?.areaID)}
                                        value={employeeData.departmentID}
                                        onChange={(event, newValue) => {
                                            console.log(newValue);
                                            apipms.get(`/employee/supervisoresDepto/${newValue?.departmentID}`)
                                                .then((response) => {
                                                    console.log(response);
                                                    setSupervisors(response.data);
                                                })
                                                .catch((error) => {
                                                    console.error('Error fetching data:', error)
                                                })
                                            setEmployeeData((prevData) => ({
                                                ...prevData,
                                                departmentID: newValue,
                                                jobID: null
                                            }));
                                            if (errors.departmentID) {
                                                setErrors((prev) => ({ ...prev, departmentID: undefined }));
                                            }
                                        }}

                                        renderInput={(params) => <TextField {...params} required label="Departamento" variant="standard" error={Boolean(errors.departmentID)}
                                            helperText={errors.departmentID} />}
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
                                            if (errors.jobID) {
                                                setErrors((prev) => ({ ...prev, jobID: undefined }));
                                            }
                                        }}

                                        renderInput={(params) => <TextField {...params} required label="Job" error={Boolean(errors.jobID)}
                                            helperText={errors.jobID} variant="standard" />}
                                    />
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">
                                    {employeeData.jobID?.jobID === 73 &&
                                        < TextField
                                            required
                                            sx={{ width: '50%' }}
                                            value={employeeData.line}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            name='line'
                                            id="line"
                                            label="Linea"
                                            size='small'
                                            variant="standard"
                                        />
                                    }
                                    <Autocomplete
                                        {...defaultPropsSupervisor}
                                        fullWidth
                                        options={supervisors}
                                        value={employeeData.supervisor}
                                        onChange={(event, newValue) => {
                                            setEmployeeData((prevData) => ({
                                                ...prevData,
                                                supervisor: newValue
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Supervisor" variant="standard" />}
                                    />
                                    <TextField sx={{ width: "35%" }} value={employeeData.salary} onChange={(e) => handleChangeEmployeeData(e)} type='number' name='salary' id="salary" label="Salario" size='small' variant="standard" />
                                    <TextField
                                        required
                                        sx={{ width: '50%' }}
                                        value={employeeData.phoneNumber}
                                        onChange={(e) => handleChangeEmployeeData(e)}
                                        name='phoneNumber'
                                        error={Boolean(errors.phoneNumber)}
                                        helperText={errors.phoneNumber}
                                        id="phoneNumber"
                                        label="Telefono"
                                        size='small'
                                        variant="standard"
                                    />
                                </div>
                                <br />
                                <div className="flex align-items-center gap-3">

                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 150 }} size='small'>
                                        <InputLabel id="tipoSangre">T. Sangre</InputLabel>
                                        <Select
                                            labelId="tipoSangre"
                                            id="tipoSangre"
                                            name='bloodTypeID'
                                            value={employeeData.bloodTypeID || ''}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            label="T. sangre"
                                            error={Boolean(errors.bloodTypeID)}
                                            helperText={errors.bloodTypeID}
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
                                            error={Boolean(errors.transportTypeID)}
                                            helperText={errors.transportTypeID}
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
                                            if (errors.gabachSize) {
                                                setErrors((prev) => ({ ...prev, gabachSize: undefined }));
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} required label="Talla de Gabacha" error={Boolean(errors.gabachSize)}
                                            helperText={errors.gabachSize} variant="standard" />}
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
                                            if (errors.shirtSize) {
                                                setErrors((prev) => ({ ...prev, shirtSize: undefined }));
                                            }
                                        }}

                                        renderInput={(params) => <TextField {...params} required label="Talla de Camiseta" variant="standard" error={Boolean(errors.shirtSize)}
                                            helperText={errors.shirtSize} />}
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
                                            value={employeeData.maritalStatusID || ''}
                                            onChange={(e) => {
                                                handleChangeEmployeeData(e)
                                            }}
                                            label="Estado Civil"
                                            error={Boolean(errors.firstName)}
                                            helperText={errors.firstName}
                                        >
                                            {
                                                maritalStatus.map((item) => (
                                                    <MenuItem key={item.maritalStatusID} value={item.maritalStatusID}>{item.maritalStatusName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    {
                                        (employeeData.maritalStatusID === 2 || employeeData.maritalStatusID === 3) &&
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
                                            error={Boolean(errors.educationLevelID)}
                                            helperText={errors.educationLevelID}
                                        >
                                            {
                                                educationLevels.map((item) => (
                                                    <MenuItem key={item.educationLevelID} value={item.educationLevelID}>{item.educationLevelName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <TextField fullWidth
                                        name='educationGrade'
                                        value={employeeData.educationGrade}
                                        onChange={(e) => handleChangeEmployeeData(e)}
                                        error={Boolean(errors.educationGrade)}
                                        helperText={errors.educationGrade}
                                        id="educationGrade"
                                        label="Grado obtenido" size='small' variant="standard" />
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
                                                if (errors.stateID) {
                                                    setErrors((prev) => ({ ...prev, stateID: undefined }));
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} required label="Departamento" variant="standard" error={Boolean(errors.stateID)}
                                                helperText={errors.stateID} />}
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
                                                if (errors.cityID) {
                                                    setErrors((prev) => ({ ...prev, cityID: undefined }));
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} required label="Municipio" variant="standard" error={Boolean(errors.cityID)}
                                                helperText={errors.cityID} />}
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
                                                if (errors.sectorID) {
                                                    setErrors((prev) => ({ ...prev, sectorID: undefined }));
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} required label="Sectores" variant="standard" error={Boolean(errors.sectorID)}
                                                helperText={errors.sectorID} />}
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
                                                if (errors.suburbID) {
                                                    setErrors((prev) => ({ ...prev, suburbID: undefined }));
                                                }
                                            }}
                                            renderInput={(params) => <TextField {...params} required label="Suburbio" variant="standard" error={Boolean(errors.suburbID)}
                                                helperText={errors.suburbID} />}
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
                                        <TextField fullWidth name='address' value={employeeData.address}
                                            onChange={(e) => handleChangeEmployeeData(e)}
                                            error={Boolean(errors.address)}
                                            helperText={errors.address}
                                            id="address"
                                            label="Dirección"
                                            size='small'
                                            variant="standard"
                                        />
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
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        sx={{ width: '20%' }}
                                        required
                                        id="birthDate"
                                        name='birthDate'
                                        label="Fecha de nacimiento"
                                        format='MM/dd/yyyy'
                                        value={childrenData.birthDate}
                                        onChange={(e) => {
                                            setChildrenData((prevData) => ({
                                                ...prevData,
                                                birthDate: e
                                            }));
                                        }}
                                        maxDate={new Date()}
                                        enableAccessibleFieldDOMStructure={false}
                                        slots={{
                                            textField: TextField
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                size: 'small',
                                                variant: 'standard'
                                            }
                                        }}
                                        views={['year', 'month', 'day']}
                                    />
                                </LocalizationProvider>
                                <FormControl fullWidth variant="standard" sx={{ margin: 0, width: '20%' }} size='small'>
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
                                <TextField fullWidth sx={{ width: '30%' }} required name='birthCert' value={childrenData.birthCert} onChange={(e) => handleChangeChildrenData(e)} id="partidaNacimiento" label="Partida de nacimiento" size='small' variant="standard" />
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
                                                createToast(
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
                                                genderName: description,
                                                birthDate: childrenData.birthDate
                                            }
                                            if (isValidText(childrenData.childrenID)) {
                                                apipms.put(`/employee/updateChild/${childrenData.childrenID}`, child)
                                                    .then((response) => {
                                                        setChildrenList((prevList) => {
                                                            const index = prevList.findIndex(child => child.childrenID === childrenData.childrenID);
                                                            if (index !== -1) {
                                                                const updatedList = [...prevList];
                                                                updatedList[index] = { ...updatedList[index], ...child };
                                                                return updatedList;
                                                            }
                                                        });
                                                        createToast(
                                                            'success',
                                                            'Acción exitosa',
                                                            'Los datos del hijo se han actualizado correctamente'
                                                        )
                                                        setChildrenData(ChildrenModel)
                                                    })
                                                    .catch((error) => {
                                                        console.error('Error fetching data:', error);
                                                        setChildrenData(ChildrenModel)
                                                        createToast(
                                                            'error',
                                                            'Error',
                                                            'Ha ocurrido un error al intentar actualizar los datos del hijo'
                                                        );
                                                    })
                                            } else if (isValidText(employeeID)) {
                                                apipms.post(`/employee/addChild/${employeeID}`, child)
                                                    .then((response) => {
                                                        setChildrenList((prevList) => {
                                                            return [...prevList, { ...child, childrenID: response.data.childrenID }];
                                                        });
                                                        createToast(
                                                            'success',
                                                            'Acción exitosa',
                                                            'El hijo se ha agregado correctamente'
                                                        )
                                                        setChildrenData(ChildrenModel)
                                                    })
                                                    .catch((error) => {
                                                        console.error('Error fetching data:', error);
                                                        createToast(
                                                            'error',
                                                            'Error',
                                                            'Ha ocurrido un error al intentar agregar el hijo'
                                                        );
                                                    })
                                            } else if (!isValidText(employeeID)) {
                                                setChildrenList((prevList) => {
                                                    return [...prevList, child];
                                                });
                                                setChildrenData(ChildrenModel);
                                            }
                                        }}
                                        endIcon={<AddCircleIcon />}
                                    >
                                        {isValidText(childrenData.childrenID) ? 'Guardar' : 'Agregar'}
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de hijos</strong>
                                <DataTable
                                    value={childrenList}
                                    size="small"
                                    showGridlines
                                    cellSelection
                                    onCellSelect={onCellSelectChildren}
                                    selectionMode="single"
                                >
                                    <Column body={renderEditButton} style={{ textAlign: 'center' }}></Column>
                                    <Column body={renderDeleteButton} style={{ textAlign: 'center' }}></Column>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primero apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="birthDate" header="Fecha Nac." body={(data) => dayjs(data.birthDate).format('MM/DD/YYYY')}></Column>
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
                                <FormControl fullWidth variant="standard" required sx={{ margin: 0 }} size='small'>
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
                                <TextField fullWidth required name='firstName' value={familyData.firstName} onChange={(e) => handleChangeFamilyData(e)} id="firstName" label="Primer nombre" size='small' variant="standard" />
                                <TextField fullWidth name='middleName' value={familyData.middleName} onChange={(e) => handleChangeFamilyData(e)} id="middleName" label="Segundo nombre" size='small' variant="standard" />
                                <TextField fullWidth required name='lastName' value={familyData.lastName} onChange={(e) => handleChangeFamilyData(e)} id="lastName" label="Primer apellido" size='small' variant="standard" />
                                <TextField fullWidth name='secondLastName' value={familyData.secondLastName} onChange={(e) => handleChangeFamilyData(e)} id="secondLastName" label="Segundo apellido" size='small' variant="standard" />
                            </div>
                            <br />
                            <div className="flex align-items-center gap-3">
                                <TextField sx={{ width: '10%' }} name='age' value={familyData.age} onChange={(e) => handleChangeFamilyData(e)} id="age" type='number' label="Edad" size='small' variant="standard" />

                                <div className="flex align-items-center gap-3">
                                    <Button variant="contained" size='small' color="primary"
                                        onClick={() => {
                                            if (!isValidText(familyData.firstName) || !isValidText(familyData.lastName)
                                                || !isValidText(familyData.relativesTypeID)
                                            ) {
                                                createToast(
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
                                                relativesTypeDesc: description
                                            }

                                            if (isValidText(familyData.familyInfoID)) {
                                                apipms.put(`/employee/updateFamilyInfo/${familyData.familyInfoID}`, member)
                                                    .then((response) => {
                                                        setFamilyList((prevList) => {
                                                            const index = prevList.findIndex(member => member.familyInfoID === familyData.familyInfoID);
                                                            if (index !== -1) {
                                                                const updatedList = [...prevList];
                                                                updatedList[index] = { ...updatedList[index], ...member };
                                                                return updatedList;
                                                            }
                                                        });
                                                        createToast(
                                                            'success',
                                                            'Acción exitosa',
                                                            'Los datos del familiar se han actualizado correctamente'
                                                        )
                                                        setFamilyData(FamilyInformationModel)
                                                    })
                                                    .catch((error) => {
                                                        console.error('Error fetching data:', error);
                                                        setFamilyData(FamilyInformationModel)
                                                        createToast(
                                                            'error',
                                                            'Error',
                                                            'Ha ocurrido un error al intentar actualizar los datos del familiar'
                                                        );
                                                    })
                                            } else if (isValidText(employeeID)) {
                                                apipms.post(`/employee/addFamilyInfo/${employeeID}`, member)
                                                    .then((response) => {
                                                        setFamilyList((prevList) => {
                                                            return [...prevList, { ...member, familyInfoID: response.data.familyInfoID }];
                                                        });
                                                        createToast(
                                                            'success',
                                                            'Acción exitosa',
                                                            'El familiar se ha agregado correctamente'
                                                        )
                                                        setFamilyData(FamilyInformationModel)
                                                    })
                                                    .catch((error) => {
                                                        console.error('Error fetching data:', error);
                                                        createToast(
                                                            'error',
                                                            'Error',
                                                            'Ha ocurrido un error al intentar agregar el familiar'
                                                        );
                                                    })
                                            } else if (!isValidText(employeeID)) {
                                                setFamilyList((prevList) => {
                                                    return [...prevList, member];
                                                });
                                                setFamilyData(FamilyInformationModel);
                                            }
                                        }}
                                        endIcon={<AddCircleIcon />}
                                    >
                                        {isValidText(familyData.familyInfoID) ? 'Guardar' : 'Agregar'}
                                    </Button>
                                </div>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de familiares</strong>
                                <DataTable
                                    value={familyList}
                                    tableStyle={{ minWidth: '50rem' }}
                                    size="small"
                                    cellSelection
                                    onCellSelect={onCellSelectFamilyInfo}
                                    selectionMode="single"
                                >
                                    <Column body={renderEditButton} style={{ textAlign: 'center' }}></Column>
                                    <Column body={renderDeleteButton} style={{ textAlign: 'center' }}></Column>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primero apellido"></Column>
                                    <Column field="secondLastName" header="Segundo nombre"></Column>
                                    <Column field="relativesTypeDesc" header="Parentesco"></Column>
                                    <Column field="age" header="Edad"></Column>
                                </DataTable>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-3">
                                    <ContactEmergencyIcon />
                                    <span style={{
                                        color: errors.emergencyList ? '#b20202' : '#545454'  // Rojo si hay error, negro si no
                                    }}>Contactos de Emergencia</span>
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
                                            renderInput={(params) => <TextField {...params} required label="Departamento" variant="standard" />}
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
                                            renderInput={(params) => <TextField {...params} required label="Municipio" variant="standard" />}
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
                                            renderInput={(params) => <TextField {...params} required label="Sectores" variant="standard" />}
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
                                            renderInput={(params) => <TextField {...params} required label="Suburbio" variant="standard" />}
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
                                <TextField required sx={{ width: '15%' }} name='phoneNumber' value={emergencyData.phoneNumber} onChange={(e) => handleChangeEmergencyData(e)} id="phone" label="Telefono" size='small' variant="standard" />
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
                                            || !isValidText(emergencyData.phoneNumber)
                                        ) {
                                            createToast(
                                                'warn',
                                                'Acción requerida',
                                                'Por favor ingrese todos los campos requeridos'
                                            )
                                            return
                                        }
                                        const inputValue = emergencyData.relativesTypeID;
                                        const [id, ...descriptionParts] = inputValue.split(' ');
                                        const description = descriptionParts.join(' ');

                                        let econtact = {
                                            ...emergencyData,
                                            stateID: emergencyData.stateID?.stateID,
                                            stateName: emergencyData.stateID?.stateName,
                                            cityID: emergencyData.cityID?.cityID,
                                            cityName: emergencyData.cityID?.cityName,
                                            sectorID: emergencyData.sectorID?.sectorID,
                                            sectorName: emergencyData.sectorID?.sectorName,
                                            suburbID: emergencyData.suburbID?.suburbID,
                                            suburbName: emergencyData.suburbID?.suburbName,
                                            relativesTypeID: parseInt(id),
                                            relativesTypeDesc: description
                                        }

                                        if (isValidText(emergencyData.econtactID)) {
                                            apipms.put(`/employee/updateEContact/${emergencyData.econtactID}`, econtact)
                                                .then((response) => {
                                                    setEmergencyList((prevList) => {
                                                        const index = prevList.findIndex(contact => contact.econtactID === emergencyData.econtactID);
                                                        if (index !== -1) {
                                                            const updatedList = [...prevList];
                                                            updatedList[index] = { ...updatedList[index], ...econtact };
                                                            return updatedList;
                                                        }
                                                    });
                                                    createToast(
                                                        'success',
                                                        'Acción exitosa',
                                                        'Los datos del contacto se han actualizado correctamente'
                                                    )
                                                    setEmergencyData(EcontactsModel)
                                                    setErrors((prev) => ({ ...prev, emergencyList: undefined }));
                                                })
                                                .catch((error) => {
                                                    console.error('Error fetching data:', error);
                                                    setEmergencyData(EcontactsModel)
                                                    createToast(
                                                        'error',
                                                        'Error',
                                                        'Ha ocurrido un error al intentar actualizar los datos del contacto'
                                                    );
                                                })
                                        } else if (isValidText(employeeID)) {
                                            apipms.post(`/employee/addEContact/${employeeID}`, econtact)
                                                .then((response) => {
                                                    setEmergencyList((prevList) => {
                                                        return [...prevList, { ...econtact, econtactID: response.data.econtactID }];
                                                    });
                                                    createToast(
                                                        'success',
                                                        'Acción exitosa',
                                                        'El contacto se ha agregado correctamente'
                                                    )
                                                    setEmergencyData(EcontactsModel)
                                                    setErrors((prev) => ({ ...prev, emergencyList: undefined }));
                                                })
                                                .catch((error) => {
                                                    console.error('Error fetching data:', error);
                                                    createToast(
                                                        'error',
                                                        'Error',
                                                        'Ha ocurrido un error al intentar agregar el contacto'
                                                    );
                                                })
                                        } else if (!isValidText(employeeID)) {
                                            setEmergencyList((prevList) => {
                                                return [...prevList, econtact];
                                            });
                                            setEmergencyData(EcontactsModel);
                                            setErrors((prev) => ({ ...prev, emergencyList: undefined }));
                                        }
                                    }}
                                    endIcon={<AddCircleIcon />}
                                >
                                    {isValidText(emergencyData.econtactID) ? 'Guardar' : 'Agregar'}
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de contactos</strong>
                                <DataTable
                                    value={emergencyList}
                                    tableStyle={{ minWidth: '50rem' }}
                                    size="small"
                                    showGridlines
                                    cellSelection
                                    onCellSelect={onCellSelectEmergencyContact}
                                    selectionMode="single"
                                >
                                    <Column body={renderEditButton} style={{ textAlign: 'center' }}></Column>
                                    <Column body={renderDeleteButton} style={{ textAlign: 'center' }}></Column>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primer apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="phoneNumber" header="Telefono"></Column>
                                    <Column field="relativesTypeDesc" header="Parentesco"></Column>
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
                                    <div>
                                        <Checkbox
                                            checked={isfamilyPAH}
                                            onChange={(e, checked) => {
                                                setIsFamilyPAH(checked);

                                                if (isValidText(employeeID) && checked === false && familyPAHList.length > 0) {

                                                    confirmDialog({
                                                        message: 'Do you want to delete the records?',
                                                        header: 'Delete Confirmation',
                                                        icon: 'pi pi-info-circle',
                                                        defaultFocus: 'reject',
                                                        acceptClassName: 'p-button-danger',
                                                        accept: () => {
                                                            apipms.delete(`/employee/deleteAuxRelativeByEmployee/${employeeID}`)
                                                                .then((response) => {
                                                                    setFamilyPAHList([]);
                                                                    setFamilyPAHData(AuxRelativeModel);
                                                                    createToast(
                                                                        'success',
                                                                        'Acción exitosa',
                                                                        'Los familiares se han eliminado correctamente'
                                                                    );
                                                                })
                                                                .catch((error) => {
                                                                    console.error('Error fetching data:', error);
                                                                    createToast(
                                                                        'error',
                                                                        'Error',
                                                                        'Ha ocurrido un error al intentar eliminar los familiares'
                                                                    );
                                                                });
                                                        },
                                                        reject: () => {
                                                            console.log('Delete rejected');
                                                            createToast(
                                                                'warn',
                                                                'Acción cancelada',
                                                                'Los familiares no han sido eliminados'
                                                            );
                                                        }
                                                    });
                                                }
                                                setEmployeeData((prevData) => ({
                                                    ...prevData,
                                                    relatives: checked
                                                }));
                                            }} />
                                    </div>
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
                                            getOptionLabel={(option) => option?.completeName || ''}
                                            value={familyPAHData.employeeID}
                                            onInputChange={(event, value, reason) => {
                                                setInputValue(value);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    if (inputValue && inputValue.length > 0) {
                                                        apipms.get(`/employee/searchEmployee/${inputValue}`)
                                                            .then((response) => {
                                                                setEmployeeOptions(response.data);
                                                            })
                                                            .catch((error) => {
                                                                console.error('Error fetching data:', error);
                                                                createToast(
                                                                    'error',
                                                                    'Error',
                                                                    'Ha ocurrido un error al buscar empleados'
                                                                );
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
                                                    createToast(
                                                        'warn',
                                                        'Acción requerida',
                                                        'Por favor ingrese todos los campos requeridos'
                                                    )
                                                    return
                                                }
                                                const inputValue = familyPAHData.relativesTypeID;
                                                const [id, ...descriptionParts] = inputValue.split(' ');
                                                const description = descriptionParts.join(' ');

                                                let auxRelativeInfo = {
                                                    ...familyPAHData,
                                                    employeeID: familyPAHData.employeeID.employeeID,
                                                    completeName: familyPAHData.employeeID?.completeName,
                                                    newEmployee: familyPAHData.newEmployee,
                                                    relativesTypeID: parseInt(id),
                                                    relativesTypeDesc: description
                                                }

                                                if (isValidText(familyPAHData.auxRelativeID)) {
                                                    apipms.put(`/employee/updateAuxRelative/${familyPAHData.auxRelativeID}`, auxRelativeInfo)
                                                        .then((response) => {
                                                            setFamilyPAHList((prevList) => {
                                                                const index = prevList.findIndex(auxRelative => auxRelative.auxRelativeID === familyPAHData.auxRelativeID);
                                                                if (index !== -1) {
                                                                    const updatedList = [...prevList];
                                                                    updatedList[index] = { ...updatedList[index], ...auxRelativeInfo };
                                                                    return updatedList;
                                                                }
                                                            });
                                                            createToast(
                                                                'success',
                                                                'Acción exitosa',
                                                                'Los datos se han actualizado correctamente'
                                                            )
                                                            setFamilyPAHData(EcontactsModel)
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error fetching data:', error);
                                                            setFamilyPAHData(EcontactsModel)
                                                            createToast(
                                                                'error',
                                                                'Error',
                                                                'Ha ocurrido un error al intentar actualizar los datos del familiar'
                                                            );
                                                        })
                                                } else if (isValidText(employeeID)) {
                                                    apipms.post(`/employee/addAuxRelative/${employeeID}`, auxRelativeInfo)
                                                        .then((response) => {
                                                            setFamilyPAHList((prevList) => {
                                                                return [...prevList, { ...auxRelativeInfo, auxRelativeID: response.data.auxRelativeID }];
                                                            });
                                                            createToast(
                                                                'success',
                                                                'Acción exitosa',
                                                                'El familiar se ha agregado correctamente'
                                                            )
                                                            setFamilyPAHData(auxRelativeInfo)
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error fetching data:', error);
                                                            createToast(
                                                                'error',
                                                                'Error',
                                                                'Ha ocurrido un error al intentar agregar el contacto'
                                                            );
                                                        })
                                                } else if (!isValidText(employeeID)) {
                                                    setFamilyPAHList((prevList) => {
                                                        return [...prevList, auxRelativeInfo];
                                                    });
                                                    setFamilyPAHData(AuxRelativeModel);
                                                }
                                            }}
                                            endIcon={<AddCircleIcon />}
                                        >
                                            {isValidText(familyPAHData.auxRelativeID) ? 'Guardar' : 'Agregar'}
                                        </Button>
                                    </div>
                                }
                            </div>
                            {
                                familyPAHList.length > 0 &&
                                <div style={{ width: '60%' }}>
                                    <strong>Lista de familiares</strong>
                                    <DataTable
                                        value={familyPAHList}
                                        size="small"
                                        showGridlines
                                        editMode="cell"
                                        cellSelection
                                        onCellSelect={onCellSelectFamilyPAH}
                                        selectionMode="single"
                                    >
                                        <Column body={renderEditButton} style={{ textAlign: 'center' }}></Column>
                                        <Column body={renderDeleteButton} style={{ textAlign: 'center' }}></Column>
                                        <Column field="completeName" header="Nombre"></Column>
                                        <Column field="relativesTypeDesc" header="Parentesco"></Column>
                                    </DataTable>
                                </div>
                            }

                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-3">
                                    <PaidIcon />
                                    <span style={{
                                        color: errors.beneficiariesList ? '#b20202' : '#545454'  // Rojo si hay error, negro si no
                                    }}>Beneficiarios</span>
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
                                <TextField
                                    sx={{ width: '15%' }}
                                    required
                                    name='percentage'
                                    type="number"
                                    value={beneficiariesData.percentage}
                                    onChange={(e) => {
                                        if (e.target.value < 0 || e.target.value > 100) {
                                            createToast(
                                                'warn',
                                                'Acción requerida',
                                                'El porcentaje debe estar entre 0 y 100'
                                            )
                                        } else {
                                            handleBeneficiariesData(e);
                                        }
                                    }} id="percentage"
                                    label="Porcentaje (%)"
                                    size='small'
                                    variant="standard"
                                    inputProps={{
                                        min: 0,
                                        max: 100,
                                    }}
                                // error={error}
                                // helperText={error ? 'El valor no debe ser mayor a 100%' : ''}
                                />
                                <TextField required name='phoneNumber' value={beneficiariesData.phoneNumber} onChange={(e) => handleBeneficiariesData(e)} sx={{ width: '15%' }} id="phone" label="Telefono" variant="standard" />
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
                                        console.log('Beneficiaries Data:', beneficiariesData);
                                        if (!isValidText(beneficiariesData.firstName) || !isValidText(beneficiariesData.lastName)
                                            || !isValidText(beneficiariesData.relativesTypeID) || !isValidText(beneficiariesData.phoneNumber)
                                            || beneficiariesData.percentage === '' || beneficiariesData.percentage === null || beneficiariesData.percentage <= 0 || beneficiariesData.percentage > 100
                                        ) {
                                            createToast(
                                                'warn',
                                                'Acción requerida',
                                                'Por favor ingrese todos los campos requeridos'
                                            )
                                            return
                                        }
                                        if (beneficiariesList.length > 0) {
                                            let total = beneficiariesList.filter(p => p.beneficiaryID !== beneficiariesData.beneficiaryID)
                                                .reduce((total, b) => total + b.percentage, 0);
                                            if ((total + beneficiariesData.percentage) > 100) {
                                                createToast(
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
                                            relativesTypeDesc: description
                                        }
                                        if (isValidText(beneficiariesData.beneficiaryID)) {
                                            apipms.put(`/employee/updateBeneficiaryInfo/${beneficiariesData.beneficiaryID}`, beneficiary)
                                                .then((response) => {
                                                    setBeneficiariesList((prevList) => {
                                                        const index = prevList.findIndex(beneficiary => beneficiary.beneficiaryID === beneficiariesData.beneficiaryID);
                                                        if (index !== -1) {
                                                            const updatedList = [...prevList];
                                                            updatedList[index] = { ...updatedList[index], ...beneficiary };
                                                            return updatedList;
                                                        }
                                                    });
                                                    createToast(
                                                        'success',
                                                        'Acción exitosa',
                                                        'Los datos del beneficiario se han actualizado correctamente'
                                                    )
                                                    setBeneficiariesData(BeneficiariesModel);
                                                    setErrors((prev) => ({ ...prev, beneficiariesList: undefined }));
                                                })
                                                .catch((error) => {
                                                    console.error('Error fetching data:', error);
                                                    setBeneficiariesData(BeneficiariesModel)
                                                    createToast(
                                                        'error',
                                                        'Error',
                                                        'Ha ocurrido un error al intentar actualizar los datos del beneficiario'
                                                    );
                                                })
                                        } else if (isValidText(employeeID)) {
                                            apipms.post(`/employee/addBeneficiaryInfo/${employeeID}`, beneficiary)
                                                .then((response) => {
                                                    setBeneficiariesList((prevList) => {
                                                        return [...prevList, { ...beneficiary, beneficiaryID: response.data.beneficiaryID }];
                                                    });
                                                    createToast(
                                                        'success',
                                                        'Acción exitosa',
                                                        'El beneficiario se ha agregado correctamente'
                                                    )
                                                    setBeneficiariesData(BeneficiariesModel);
                                                    setErrors((prev) => ({ ...prev, beneficiariesList: undefined }));
                                                })
                                                .catch((error) => {
                                                    console.error('Error fetching data:', error);
                                                    createToast(
                                                        'error',
                                                        'Error',
                                                        'Ha ocurrido un error al intentar agregar el hijo'
                                                    );
                                                })
                                        } else if (!isValidText(employeeID)) {
                                            setBeneficiariesList((prevList) => {
                                                return [...prevList, beneficiary];
                                            });
                                            setBeneficiariesData(BeneficiariesModel);
                                            setErrors((prev) => ({ ...prev, beneficiariesList: undefined }));

                                        }

                                    }}
                                >
                                    {isValidText(beneficiariesData.beneficiaryID) ? 'Guardar' : 'Agregar'}
                                </Button>
                            </div>
                            <br />
                            <div className="card">
                                <strong>Lista de beneficiarios</strong>
                                <DataTable
                                    value={beneficiariesList}
                                    tableStyle={{ minWidth: '50rem' }}
                                    size="small"
                                    showGridlines
                                    editMode="cell"
                                    cellSelection
                                    onCellSelect={onCellSelectBeneficiaries}
                                    selectionMode="single"
                                >
                                    <Column body={renderEditButton} style={{ textAlign: 'center' }}></Column>
                                    <Column body={renderDeleteButton} style={{ textAlign: 'center' }}></Column>
                                    <Column field="firstName" header="Primer nombre"></Column>
                                    <Column field="middleName" header="Segundo nombre"></Column>
                                    <Column field="lastName" header="Primer apellido"></Column>
                                    <Column field="secondLastName" header="Segundo apellido"></Column>
                                    <Column field="percentage" header="Porcentaje" editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete}></Column>
                                    <Column field="phoneNumber" header="Telefono"></Column>
                                    <Column field="relativesTypeDesc" header="Parentesco"></Column>
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
