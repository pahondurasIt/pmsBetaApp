import React, { useEffect, useState } from 'react';
import {
    Button, Box, Autocomplete, TextField,
    Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Dialog } from 'primereact';
import { apipms } from '../../../../service/apipms';
import '../../../css/Employee.css'

const DisabledEmployee = ({ visible, setVisible, employeeActives, fetchEmployees, onShowToast }) => {
    const [dismissalTypes, setDismissalTypes] = useState([]);
    const [formData, setFormData] = useState({
        dateDismissal: new Date(),
        dismissalTypeID: '',
        employeeID: null,
        comment: '',
    });

    const defaultPropsEmployees = {
        options: employeeActives,
        getOptionLabel: (option) => `${option.codeEmployee} - ${option.nombreCompleto}` || '',
    };

    useEffect(() => {
        apipms.get('/dataForm/dismissalType')
            .then((response) => {
                setDismissalTypes(response.data);
            });
    }, [employeeActives]);

    return (
        <Dialog
            id="dialog-root"
            header="Inactivar Empleado"
            visible={visible}
            style={{ width: '30vw' }}
            onHide={() => { if (!visible) return; setVisible(false); }}
        >
            <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
                <Autocomplete
                    fullWidth
                    {...defaultPropsEmployees}
                    options={employeeActives}
                    value={formData.employeeID}
                    onChange={(event, newValue) => {
                        setFormData({
                            ...formData,
                            employeeID: newValue
                        });
                    }}
                    disablePortal={true}
                    popperprops={{
                        container: () => document.getElementById('dialog-root')
                    }}
                    renderInput={(params) => <TextField {...params} required label="Empleado" variant="standard" />}
                />
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControl variant="standard" sx={{ margin: 0, width: '50%' }} size='small'>
                        <InputLabel id="tipoEgreso">Tipo de Egreso</InputLabel>
                        <Select
                            labelId="tipoEgreso"
                            id="dismissalTypeID"
                            name='dismissalTypeID'
                            value={formData.dismissalTypeID}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    [e.target.name]: e.target.value
                                });
                            }}
                            label="Tipo de egreso"
                        >
                            {
                                dismissalTypes.map((item) => (
                                    <MenuItem key={item.dismissalTypeID} value={item.dismissalTypeID}>{item.dismissalDesc}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            sx={{ width: '40%' }}
                            required
                            id="dateDismissal"
                            name='dateDismissal'
                            label="Fecha de despido"
                            format='MM/dd/yyyy'
                            value={formData.dateDismissal}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    dateDismissal: e
                                });
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
                </div>
                <TextField
                    sx={{ width: '70%' }}
                    id="comment"
                    name='comment'
                    value={formData.comment}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            [e.target.name]: e.target.value
                        });
                    }}
                    label="Comentario"
                    multiline
                    maxRows={3}
                    variant="standard"
                />
                <br />
                <Button
                    className="deleteButton"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        let disabledForm = {
                            dateDismissal: formData.dateDismissal,
                            dismissalTypeID: formData.dismissalTypeID,
                            employeeID: formData.employeeID.employeeID,
                            comment: formData.comment
                        }
                        apipms.post('/employee/disabledEmployee', disabledForm)
                            .then((response) => {
                                onShowToast('success', 'Empleado inactivado correctamente');
                                //cambiar el estado inactivo para el empleado
                                fetchEmployees();
                                setVisible(false);
                            })
                            .catch((error) => {
                                console.error('Error al inactivar el empleado:', error);
                                onShowToast('error', 'Error al inactivar el empleado');
                            });
                    }}
                >
                    Inactivar
                </Button>
            </Box>

        </Dialog>
    );
};

export default DisabledEmployee;
