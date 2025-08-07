import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, FormControl, FormControlLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { apipms } from '../../../../service/apipms';
import { isValidText } from '../../../../helpers/validator';
import { TimeRangePicker } from 'rsuite';
import '../../../css/permission.css';
import '../../../css/rsuite-scoped.css';

export const FormPermisson = ({ showToast, fetchPermissions, employeesList,
    formData, setFormData, permisoDiferido = false, savePermission }) => {
    const [permissionsList, setPermissionsList] = useState([]);

    useEffect(() => {
        // Importar estilos de RSuite solo cuando se monta este componente
        import('rsuite/dist/rsuite.min.css');
        
        // Cargar empleados y tipos de permiso
        apipms.get('/permission')
            .then((response) => {
                setPermissionsList(response.data.permissions || []);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                showToast("error", "Error al cargar datos iniciales");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form data before validation:", formData);

        // Validación actualizada para incluir los nuevos campos obligatorios
        if (!isValidText(formData.employeeID) || !isValidText(formData.permissionType)
            || !isValidText(formData.exitTime) || !isValidText(formData.entryTime)) {
            showToast("error", "Todos los campos son requeridos");
            return;
        }
        savePermission();
    };

    const defaultPropsEmpleados = {
        options: employeesList,
        getOptionLabel: (option) => `${option.codeEmployee} - ${option.fullName}` || '',
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="permission-form">
                <h2 className="section-title-centered">Solicitud de permiso</h2>
                {permisoDiferido && <FormControlLabel control={
                    <Switch
                        checked={formData.diferido}
                        onChange={(e) => setFormData((prevData) => ({ ...prevData, diferido: e.target.checked }))}
                    />
                } label="Permiso diferido" />}
                <div>
                    <label className="field-label">Empleado *</label>
                    <Autocomplete
                        {...defaultPropsEmpleados}
                        fullWidth
                        options={employeesList}
                        value={formData.employeeID}
                        onChange={(event, newValue) => {
                            setFormData((prevData) => ({
                                ...prevData,
                                employeeID: newValue
                            }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                placeholder="Seleccione..."
                                variant="standard"
                                size="small"
                                className="custom-input"
                            />
                        )}
                    />
                </div>
                <div>
                    <label className="field-label">Tipo de permiso *</label>
                    <FormControl required fullWidth variant="standard" size="small">
                        <Select
                            required
                            id="permissionType"
                            name='permissionType'
                            value={formData.permissionType}
                            onChange={handleChange}
                            displayEmpty
                            className="custom-select"
                        >
                            {permissionsList.map((permission) => (
                                <MenuItem key={permission.permissionTypeID} value={permission.permissionTypeID}>
                                    {permission.permissionTypeName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="field-label">Rango de tiempo *</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', justifyItems: 'center', alignItems: 'center', gap: '30px' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                required
                                id="date"
                                name='date'
                                label="Fecha"
                                format='MM/dd/yyyy'
                                value={formData.date}
                                onChange={(e) => {
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        date: e
                                    }));
                                }}
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
                        <div className="rsuite-time-picker-container">
                            <TimeRangePicker
                                placeholder="Select"
                                size='lg'
                                value={[formData.exitTime, formData.entryTime]}
                                onChange={(value) => {
                                    if (isValidText(value)) {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            exitTime: value[0],
                                            entryTime: value[1]
                                        }));
                                    }
                                }}
                                style={{ minWidth: '200px' }}
                            />
                        </div>
                    </div>
                </div>
                <TextField
                    id="comment"
                    label="Comentario"
                    multiline
                    fullWidth
                    value={formData.comment}
                    onChange={(e) => setFormData((prevData) => ({ ...prevData, comment: e.target.value }))}
                    maxRows={2}
                    variant="standard"
                />
                <br />
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<i className="pi pi-check" />}
                    fullWidth
                >
                    GUARDAR
                </Button>
            </form>
        </>
    )
}
