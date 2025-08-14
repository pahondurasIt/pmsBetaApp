import { useEffect, useState } from 'react'
import { Autocomplete, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { apipms } from '../../../../service/apipms';
import { isValidText } from '../../../../helpers/validator';

import '../../../css/permission.css';
import dayjs from 'dayjs';
import { formatearFechaHora, formatearHora } from '../../../../helpers/formatDate';

export const FormPermisson = ({ showToast, employeesList, formData, setFormData, savePermission, visibleDiferidos }) => {
    const [permissionsList, setPermissionsList] = useState([]);
    const maxDate = visibleDiferidos ? new Date() : null;
    const minDate = visibleDiferidos ? null : new Date();
    const [shift, setShift] = useState(null);

    useEffect(() => {

        // Cargar empleados y tipos de permiso
        apipms.get('/permission')
            .then((response) => {
                setPermissionsList(response.data.permissions || []);
                console.log(response.data.shift);

                setShift(response.data.shift || null);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                showToast("error", "Error al cargar datos iniciales");
            });

        setFormData((prevData) => ({
            ...prevData,
            employeeID: null,
            permissionTypeID: '',
            date: new Date(),
            exitTime: dayjs(),
            comment: '',
        }));

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        // Validación actualizada para incluir los nuevos campos obligatorios
        if (!isValidText(formData.employeeID) || !isValidText(formData.permissionTypeID)
            || !isValidText(formData.exitTime)) {
            showToast("error", "Todos los campos son requeridos");
            return;
        }

        if (dayjs(formatearFechaHora(formData.exitTime))
            .isBefore(`${dayjs().format('YYYY-MM-DD')} ${(shift.startTime)}`) ||
            dayjs(formatearFechaHora(formData.exitTime))
                .isAfter(`${dayjs().format('YYYY-MM-DD')} ${(shift.endTime)}`)) {
            showToast("error", `La hora de salida debe estar entre ${formatearHora(shift.startTime)} y ${formatearHora(shift.endTime)}`);
            return;
        }

        if (formData.permissionTypeID == 10 && formData.comment.trim() === '') {
            showToast("error", "El comentario es obligatorio para permisos de tipo 'Otro'");
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
                <h2 className="section-title-centered">Información del permiso</h2>
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
                            id="permissionTypeID"
                            name='permissionTypeID'
                            value={formData.permissionTypeID}
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
                                maxDate={maxDate}
                                minDate={minDate}
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
                                shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
                            />
                        </LocalizationProvider>
                        {!visibleDiferidos &&
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimeField
                                    label="Hora de salida"
                                    defaultValue={dayjs()}
                                    value={formData.exitTime}
                                    onChange={(newValue) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            exitTime: newValue
                                        }));
                                    }}
                                    format="hh:mm a"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            size: 'small',
                                            variant: 'standard'
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        }

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
