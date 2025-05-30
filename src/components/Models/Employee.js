import dayjs from '../../helpers/dayjsConfig';

export const EmployeeModel = {
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    phoneNumber: '',
    genderID: '',
    docID: '',
    docNumber: '',
    photoUrl: null,
    birthDate: dayjs().format('YYYY-MM-DD'),
    bloodTypeID: '',
    stateID: null,
    cityID: null,
    sectorID: null,
    suburbID: null,
    address: '',
    gabachSize: null,
    shirtSize: null,
    divisionID: null,
    areaID: null,
    departmentID: null,
    jobID: null,
    supervisor: '',
    hireDate: dayjs().format('YYYY-MM-DD'),
    endDate: null,
    isActive: true,
    partnerName: '',
    partnerage: 0,
    companyID: 1,
    contractTypeID: '',
    payrollTypeID: '',
    shiftID: '',
    educationLevelID: '',
    educationGrade: '',
    transportTypeID: '',
    maritalStatusID: '',
    nationality: '',
    evaluationStep: false,
    incapacitated: false,
    salary: 0,
    relatives: false
}

export const ChildrenModel = {
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    birthDate: dayjs().format('YYYY-MM-DD'),
    birthCert: '',
    genderID: '',
}

export const FamilyInformationModel = {
    relativesTypeID: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    age: ''
}

export const EcontactsModel = {
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    stateID: null,
    cityID: null,
    sectorID: null,
    suburbID: null,
    relativesTypeID: '',
    phoneNumber: '',
}

export const BeneficiariesModel = {
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    relativesTypeID: '',
    percentage: 0,
    phoneNumber: '',
}