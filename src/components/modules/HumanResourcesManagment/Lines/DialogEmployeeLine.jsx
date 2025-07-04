import { Dialog } from 'primereact/dialog';
import { Button, IconButton, ListItem, ListItemText, ListItemAvatar, Avatar, List, Divider, Typography, Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { apipms } from '../../../../service/apipms';
import { isValidText } from '../../../../helpers/validator';
import useEmployeePhoto from '../../../../hooks/usePhotoUrl';

export const DialogEmployeeLine = ({ open, onClose, initialData, onShowToast }) => {
    const [currentEmployees, setCurrentEmployees] = useState([]);
    const [employeesSewing, setEmployeesSewing] = useState([]);
    const [employeeSelected, setEmployeeSelected] = useState(null);
    const { getEmployeePhoto } = useEmployeePhoto();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (initialData?.linesID) {
            fetchingEmployees();
        } else {
            setCurrentEmployees([]);
            setEmployeesSewing([]);
        }
    }, [initialData?.linesID]);

    const fetchingEmployees = async () => {
        try {
            const [currentEmployeesResponse, employeesSewingResponse] = await Promise.all([
                apipms.get(`/lines/employeeByLine/${initialData?.linesID}`),
                apipms.get(`/employee/employeesSewing`)
            ]);
            console.log('Current Employees:', currentEmployeesResponse.data);
            setCurrentEmployees(currentEmployeesResponse.data);
            setEmployeesSewing(employeesSewingResponse.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleSubmit = () => {
        if (!employeeSelected || !isValidText(employeeSelected.employeeName)) {
            onShowToast?.('warn', 'Campo requerido', 'Por favor, seleccione un empleado');
            return;
        }
        if (currentEmployees.some(emp => emp.employeeID === employeeSelected.employeeID)) {
            onShowToast?.('warn', 'Empleado existente', 'El empleado ya está asignado a esta línea');
            return;
        }

        const employeeData = {
            employeeLinesID: 0,
            linesID: initialData.linesID,
            employeeID: employeeSelected.employeeID,
        };

        apipms.post('/lines/addEmployee', employeeData)
            .then(() => {
                onShowToast?.('success', 'Empleado agregado', 'El empleado ha sido agregado correctamente');
                fetchingEmployees();
                setEmployeeSelected(null);
            })
            .catch((error) => {
                console.error('Error adding employee:', error);
                onShowToast?.('error', 'Error al agregar empleado', 'Ocurrió un error al agregar el empleado');
            });

    };

    const footerContent = (
        <div className="flex justify-content-end gap-3">
            <Button size='small' variant="outlined" onClick={() => onClose()}>
                Cancelar
            </Button>
        </div>
    );

    const defaultPropsEmployees = {
        options: employeesSewing,
        getOptionLabel: (option) => option.employeeName || '',
    };

    const filteredEmployees = currentEmployees.filter((employee) =>
        employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog header={
            <div>
                <h3>Lista de empleados</h3>
            </div>
        }
            visible={open} style={{ width: '45vw' }} onHide={() => onClose()} footer={footerContent} draggable={false} resizable={false}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <div style={{ width: '50%', padding: '20px' }}>
                    <Autocomplete
                        fullWidth
                        {...defaultPropsEmployees}
                        options={employeesSewing}
                        value={employeeSelected}
                        onChange={(event, newValue) => {
                            console.log('Selected Employee:', newValue);

                            setEmployeeSelected(newValue);
                        }}
                        MenuProps={{
                            disablePortal: true
                        }}
                        renderInput={(params) => <TextField {...params} required label="Empleado" variant="standard" />}
                    />
                    <br />
                    <Button variant="contained" startIcon={<AddIcon />} size='small' onClick={() => handleSubmit()}>
                        Agregar empleado
                    </Button>
                </div>
                <div style={{ width: '50%' }}>
                    <TextField
                        label="Buscar empleado"
                        size='small'
                        variant="standard"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <List dense={true} sx={{
                        width: '100%',
                        maxWidth: 360,
                        maxHeight: 300,
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        fontSize: '2rem',
                        color: '#000'
                    }}>
                        {filteredEmployees.map((employee) => (
                            <React.Fragment key={employee.employeeLinesID}>
                                <ListItem
                                    key={employee.employeeLinesID}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <DeleteIcon color='error' />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={employee.employeeName}
                                            src={getEmployeePhoto(employee.photoUrl || '')}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography component="span" variant="body1" sx={{ fontWeight: '300' }}>{employee.employeeName}</Typography>}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </div>
            </div>
        </Dialog>
    )
}
