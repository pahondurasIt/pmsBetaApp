import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Grid, MenuItem, Autocomplete, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Toast } from 'primereact/toast';
import { apipms } from '../../../../service/apipms';
import '../../../css/permission.css';

// Nombre clave para guardar/leer el estado de los permisos en localStorage
const PERMISSION_RECORDS_KEY = 'permissionRecords';

const PermissionForm = () => {
  // Estado del formulario actualizado para incluir los nuevos campos de hora
  const [formData, setFormData] = useState({
    employeeID: '',
    permissionType: '',
    // Nuevos campos para capturar las horas de salida y entrada
    exitTimePermission: '',
    entryTimePermission: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [permissionRecords, setPermissionRecords] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    // Cargar empleados y tipos de permiso
    apipms.get('/permission')
      .then((response) => {
        setEmployeesList(response.data.employees || []);
        setPermissionsList(response.data.permissions || []);
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

    // Cargar permisos desde localStorage al iniciar
    const storedRecords = localStorage.getItem(PERMISSION_RECORDS_KEY);
    if (storedRecords) {
      setPermissionRecords(JSON.parse(storedRecords));
    }
  }, []);

  // Sincronizar localStorage cada vez que permissionRecords cambie
  useEffect(() => {
    localStorage.setItem(PERMISSION_RECORDS_KEY, JSON.stringify(permissionRecords));
  }, [permissionRecords]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (event, newValue) => {
    setSelectedEmployee(newValue);
    setFormData((prev) => ({ 
      ...prev, 
      employeeID: newValue ? newValue.employeeID : '' 
    }));
  };

  // La función handleInactivate ya no es necesaria ya que se eliminó el botón de inactivar
  // Los permisos se inactivarán automáticamente cuando el empleado registre su entrada de regreso

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación actualizada para incluir los nuevos campos obligatorios
    if (!formData.employeeID || !formData.permissionType || !formData.exitTimePermission || !formData.entryTimePermission) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son requeridos', life: 3000 });
      return;
    }

    // Verificar si el empleado ya tiene un permiso activo
    const employeeHasActivePermission = permissionRecords.some(
      record => record.employeeID === formData.employeeID && record.status === 'ACTIVO'
    );
    if (employeeHasActivePermission) {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'El empleado ya tiene un permiso activo. No se puede autorizar otro hasta que esté inactivo.', 
        life: 3000 
      });
      return;
    }

    try {
      // Actualizado para enviar los nuevos campos de hora al backend
      const response = await apipms.post('/permission/authorize', {
        employeeID: formData.employeeID,
        permissionType: formData.permissionType,
        exitTimePermission: formData.exitTimePermission,
        entryTimePermission: formData.entryTimePermission
      });

      if (response.data.success) {
        const permissionData = {
          permissionID: response.data.permissionId,
          employeeID: formData.employeeID,
          employeeName: selectedEmployee?.fullName || 'Desconocido',
          status: 'ACTIVO',
          timestamp: new Date().toISOString(),
          // Agregamos los nuevos campos al objeto de datos del permiso
          exitTimePermission: formData.exitTimePermission,
          entryTimePermission: formData.entryTimePermission
        };

        // Actualizar la tabla con el nuevo permiso
        const updatedRecords = [...permissionRecords, permissionData];
        setPermissionRecords(updatedRecords);

        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: `Permiso autorizado para ${permissionData.employeeName}. Notificación ACTIVA.`, 
          life: 4000 
        });

        // Resetear el formulario incluyendo los nuevos campos
        setFormData({ 
          employeeID: '', 
          permissionType: '',
          exitTimePermission: '',
          entryTimePermission: ''
        });
        setSelectedEmployee(null);
      } else {
        throw new Error(response.data.message || 'Error al autorizar el permiso');
      }
    } catch (error) {
      console.error('Error al autorizar permiso:', error);
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'No se pudo autorizar el permiso.', 
        life: 3000 
      });
    }
  };

  return (
    <div className="permission-container" id="permission-container-custom">
      <Toast ref={toast} />
      <Grid container spacing={2} className="permission-grid" id="permission-grid-custom">
        <Grid item xs={12} md={6} className="form-section" id="form-section-custom">
          <div className="form-container-permission" id="form-container-permission-custom">
            <Typography variant="h6" className="section-title" id="form-title-custom">
              Autorizar Permiso
            </Typography>
            <form onSubmit={handleSubmit} className="permission-form" id="permission-form-custom">
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    id="employee-autocomplete-custom"
                    className="employee-autocomplete-custom"
                    options={employeesList.filter(emp => 
                      !permissionRecords.some(record => record.employeeID === emp.employeeID && record.status === 'ACTIVO')
                    )}
                    getOptionLabel={(option) => `${option.employeeID} - ${option.fullName}`}
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    filterOptions={(options, { inputValue }) => {
                      const filterValue = inputValue.toLowerCase();
                      return options.filter(option => 
                        option.fullName.toLowerCase().includes(filterValue) ||
                        option.employeeID.toString().includes(filterValue)
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Buscar Empleado"
                        variant="outlined"
                        required
                        placeholder="Código o Nombre"
                        className="form-input employee-input-custom"
                        id="employee-input-custom"
                        size="small"
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.employeeID}>
                        <div className="autocomplete-option">
                          <span className="employee-id">
                            {option.employeeID}
                          </span>
                          <span className="employee-name">
                            {option.fullName}
                          </span>
                        </div>
                      </li>
                    )}
                    noOptionsText="No hay empleados disponibles"
                    isOptionEqualToValue={(option, value) => option.employeeID === value?.employeeID}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo de Permiso"
                    name="permissionType"
                    value={formData.permissionType}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    className="form-input permission-type-input-custom"
                    id="permission-type-input-custom"
                    size="small"
                  >
                    {permissionsList.length > 0 ? (
                      permissionsList.map((permission) => (
                        <MenuItem key={permission.permissionTypeID} value={permission.permissionTypeID}>
                          {permission.permissionTypeName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Cargando...</MenuItem>
                    )}
                  </TextField>
                </Grid>
                
                {/* Campo para Tiempo de Salida */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiempo de Salida"
                    name="exitTimePermission"
                    type="time"
                    value={formData.exitTimePermission}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    className="form-input exit-time-input-custom"
                    id="exit-time-input-custom"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 minutos
                    }}
                  />
                </Grid>
                
                {/* Campo para Tiempo de Entrada de Regreso */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiempo de Entrada de Regreso"
                    name="entryTimePermission"
                    type="time"
                    value={formData.entryTimePermission}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    className="form-input entry-time-input-custom"
                    id="entry-time-input-custom"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 minutos
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} className="form-button-container" id="form-button-container-custom">
                  <Button 
                    type="submit" 
                    variant="contained" 
                    className="submit-button"
                    id="submit-button-custom"
                    size="medium"
                  >
                    Autorizar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>

        <Grid item xs={12} md={6} className="table-section" id="table-section-custom">
          <div className="table-container" id="table-container-custom">
            <Typography variant="h6" className="section-title" id="table-title-custom">
              Permisos Registrados
            </Typography>
            <TableContainer component={Paper} className="permission-table" id="permission-table-custom">
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className="table-header" id="header-code-custom">Código</TableCell>
                    <TableCell align="center" className="table-header" id="header-employee-custom">Empleado</TableCell>
                    <TableCell align="center" className="table-header" id="header-status-custom">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionRecords.length > 0 ? (
                    permissionRecords.map((record) => (
                      <TableRow key={record.permissionID} className="table-row">
                        <TableCell align="center">{record.employeeID}</TableCell>
                        <TableCell align="center">{record.employeeName}</TableCell>
                        <TableCell align="center">
                          <span className={`status ${record.status === 'ACTIVO' ? 'status-active' : 'status-inactive'}`}>
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" className="table-empty">
                        Sin permisos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default PermissionForm;
