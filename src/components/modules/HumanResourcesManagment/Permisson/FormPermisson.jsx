import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { apipms } from '../../../../service/apipms';
import { isValidRangeDate, isValidText } from '../../../../helpers/validator';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/permission.css';

export const FormPermisson = ({ toast, fetchPermissions }) => {
    const [formData, setFormData] = useState({
        employeeID: '',
        permissionType: '',
        exitTimePermission: new Date(),
        entryTimePermission: new Date()
    });
    const [employeesList, setEmployeesList] = useState([]);
    const [permissionsList, setPermissionsList] = useState([]);
    const [detailShift, setDetailShift] = useState(null);

    useEffect(() => {
        // Cargar empleados y tipos de permiso
        apipms.get('/permission')
            .then((response) => {
                setEmployeesList(response.data.employees || []);
                setPermissionsList(response.data.permissions || []);
                setDetailShift(response.data.shiftDetail[0] || null);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar datos iniciales',
                    life: 3000
                });
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validación actualizada para incluir los nuevos campos obligatorios
        if (!isValidText(formData.employeeID) || !isValidText(formData.permissionType)
            || !isValidText(formData.exitTimePermission) || !isValidText(formData.entryTimePermission)) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son requeridos', life: 3000 });
            return;
        }

        if (isValidRangeDate(formData.exitTimePermission, formData.entryTimePermission) === false) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Las horas deben ser válidas', life: 3000 });
            return;
        }

        // Actualizado para enviar los nuevos campos de hora al backend
        await apipms.post('/permission/authorize', {
            employeeID: formData.employeeID.employeeID,
            permissionType: formData.permissionType,
            exitTimePermission: formData.exitTimePermission,
            entryTimePermission: formData.entryTimePermission
        }).then(() => {
            if (fetchPermissions) fetchPermissions();
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `Permiso autorizado para ${formData.employeeID.fullName}`,
                life: 4000
            });

            // Resetear el formulario incluyendo los nuevos campos
            setFormData({
                employeeID: '',
                permissionType: '',
                exitTimePermission: new Date(),
                entryTimePermission: new Date()
            });
        }).catch(error => {
            console.error('Error al autorizar permiso:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Error al autorizar permiso',
                life: 3000
            });
        });
    };

    const defaultPropsEmpleados = {
        options: employeesList,
        getOptionLabel: (option) => option.fullName || '',
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="permission-form">
                <h2 className="section-title-centered">Solicitud de permiso</h2>
                <div className="form-field">
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
                                variant="outlined"
                                size="small"
                                className="custom-input"
                            />
                        )}
                    />
                </div>
                <div className="form-field">
                    <label className="field-label">Tipo de permiso *</label>
                    <FormControl required fullWidth variant="outlined" size="small">
                        <Select
                            fullWidth
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
                <div>
                    <label className="field-label">Rango de tiempo *</label>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '1rem' }}>
                        <div className="form-field">
                            <label className="field-label field-label-red">Salida programada</label>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    value={formData.exitTimePermission}
                                    enableAccessibleFieldDOMStructure={false}
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            exitTimePermission: value
                                        }));
                                    }}
                                    ampm={false}
                                    minTime={new Date()}
                                    maxTime={detailShift ? new Date(`${dayjs().format('YYYY-MM-DD')} ${detailShift.endTime}`) : null}
                                    slots={{ textField: TextField }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                            size: 'small',
                                            placeholder: '14:10',
                                            className: 'custom-input time-input'
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className="form-field">
                            <label className="field-label field-label-red">Entrada programada</label>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    value={formData.entryTimePermission}
                                    enableAccessibleFieldDOMStructure={false}
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            entryTimePermission: value
                                        }));
                                    }}
                                    ampm={false}
                                    minTime={new Date()}
                                    maxTime={detailShift ? new Date(`${dayjs().format('YYYY-MM-DD')} ${detailShift.endTime}`) : null}
                                    slots={{ textField: TextField }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                            size: 'small',
                                            placeholder: '14:10',
                                            className: 'custom-input time-input'
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<i className="pi pi-check" />}
                    fullWidth
                    className="save-button"
                >
                    GUARDAR
                </Button>
            </form>
        </>
    )
}
