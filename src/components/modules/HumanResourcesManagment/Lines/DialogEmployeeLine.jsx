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
    const [empSewingWithOut, setEmpSewingWithOut] = useState([]);
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

            setCurrentEmployees(currentEmployeesResponse.data || []);
            setEmployeesSewing(employeesSewingResponse.data || []);
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
            .then((res) => {
                console.log('Employee added successfully:', res.data);

                onShowToast?.('success', 'Empleado agregado', 'El empleado ha sido agregado correctamente');
                if (res.data?.employeeAsignado.length > 0) {
                    onShowToast?.('info', 'Información', `El empleado fue movido de la línea ${res.data?.employeeAsignado[0].linesNumber} a la línea ${initialData?.linesNumber}`);
                }
                fetchingEmployees();
                setEmployeeSelected(null);
            })
            .catch((error) => {
                console.error('Error adding employee:', error);
                onShowToast?.('error', 'Error al agregar empleado', error.response?.data?.message || 'Ocurrió un error al agregar el empleado');
            });
    };

    const footerContent = (
        <div className="flex justify-content-end gap-3">
            <Button size='small' variant="outlined" onClick={() => onClose()}>
                Cancelar
            </Button>
        </div>
    );

    const deleteEmployee = (employeeLinesID) => {
        apipms.delete(`/lines/removeEmployee/${employeeLinesID}`)
            .then(() => {
                onShowToast?.('success', 'Empleado eliminado', 'El empleado ha sido eliminado correctamente');
                fetchingEmployees();
                setEmployeeSelected(null);
            })
            .catch((error) => {
                console.error('Error adding employee:', error);
                onShowToast?.('error', 'Error al agregar empleado', 'Ocurrió un error al agregar el empleado');
            });
    }

    const defaultPropsEmployees = {
        options: employeesSewing,
        getOptionLabel: (option) => option.employeeName || '',
    };

    const filteredEmployees = currentEmployees.filter((employee) =>
        employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog
            id="dialog-root"
            header={
                <div>
                    <h3>Lista de empleados</h3>
                </div>
            }
            visible={open} style={{ width: '50vw' }} onHide={() => onClose()} footer={footerContent} draggable={false} resizable={false}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', gap: '20px' }}>
                <div style={{ width: '45%' }}>
                    <Autocomplete
                        fullWidth
                        {...defaultPropsEmployees}
                        options={employeesSewing}
                        value={employeeSelected}
                        onChange={(event, newValue) => {
                            setEmployeeSelected(newValue);
                        }}
                        disablePortal={true}
                        popperprops={{
                            container: () => document.getElementById('dialog-root')
                        }}
                        renderInput={(params) => <TextField {...params} required label="Empleado" variant="standard" />}
                    />
                    <br />
                    <Button variant="contained" startIcon={<AddIcon />} size='small' onClick={() => handleSubmit()}>
                        Agregar empleado
                    </Button>
                </div>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div style={{ width: '55%' }}>
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
                                        <IconButton edge="end" aria-label="delete" onClick={(e) => {
                                            e.stopPropagation();
                                            deleteEmployee(employee.employeeLinesID);
                                        }}>
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
