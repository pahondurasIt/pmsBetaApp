import dayjs from '../../helpers/dayjsConfig';

export const EmployeeModel = {
    employeeID: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    phoneNumber: '',
    genderID: '',
    docID: '',
    docNumber: '',
    photoUrl: null,
    birthDate: new Date(),
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
    supervisor: null,
    hireDate: new Date(),
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
    childrenID: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    birthDate: new Date(),
    birthCert: '',
    genderID: '',
    genderName: ''
}

export const FamilyInformationModel = {
    familyInfoID: '',
    relativesTypeID: '',
    relativesTypeDesc: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    age: ''
}

export const EcontactsModel = {
    econtactID: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    stateID: null,
    cityID: null,
    sectorID: null,
    suburbID: null,
    relativesTypeID: '',
    relativesTypeDesc: '',
    phoneNumber: '',
}

export const BeneficiariesModel = {
    benediciaryID: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    relativesTypeID: '',
    relativesTypeDesc: '',
    percentage: 0,
    phoneNumber: '',
}

export const auxrelative = {
    auxRelativeID: '',
    relativesTypeID: '',
    relativesTypeDesc: '',
    employeeID: '',
}