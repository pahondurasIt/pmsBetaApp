import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Grid, MenuItem, Autocomplete, Typography } from '@mui/material';
import { Toast } from 'primereact/toast';
import { apipms } from '../../../../service/apipms';

// Nombre clave para guardar/leer el estado del permiso en localStorage
const ACTIVE_PERMISSION_KEY = 'activePermission';

const PermissionForm = () => {
  const [formData, setFormData] = useState({
    employeeID: '',
    permissionType: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
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

    // Comprobar si ya existe un permiso activo al cargar el componente
    const activePermission = localStorage.getItem(ACTIVE_PERMISSION_KEY);
    if (activePermission) {
      console.log("Permiso ya activo detectado:", JSON.parse(activePermission));
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeID || !formData.permissionType) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son requeridos', life: 3000 });
      return;
    }

    try {
      // Llamada al backend para autorizar el permiso
      const response = await apipms.post('/permission/authorize', {
        employeeID: formData.employeeID,
        permissionType: formData.permissionType
      });

      if (response.data.success) {
        // Guardar estado del permiso activo en localStorage (para la UI)
        const permissionData = {
          employeeID: formData.employeeID,
          employeeName: selectedEmployee?.fullName || 'Desconocido',
          status: 'ACTIVO',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(ACTIVE_PERMISSION_KEY, JSON.stringify(permissionData));
        console.log('Permiso ACTIVO guardado en localStorage:', permissionData);

        window.dispatchEvent(new Event('storage'));

        toast.current.show({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: `Permiso autorizado para ${permissionData.employeeName}. Notificación ACTIVA.`, 
          life: 4000 
        });

        // Limpiar formulario
        setFormData({ employeeID: '', permissionType: '' });
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
      localStorage.removeItem(ACTIVE_PERMISSION_KEY);
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Toast ref={toast} />
      
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '25px', boxShadow: '0 2px 5px rgba(190, 110, 110, 0.1)' }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Autorizar Permiso de Empleado
        </Typography>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              options={employeesList}
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
                  label="Buscar Empleado (Código o Nombre)"
                  variant="outlined"
                  required
                  placeholder="Escriba para buscar..."
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.employeeID}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: '#1976d2', 
                      marginRight: '1px',
                      minWidth: '55px'
                    }}>
                      {option.employeeID}
                    </span>
                    <span style={{ fontSize: '1em', color: '#333' }}>
                      {option.fullName}
                    </span>
                  </div>
                </li>
              )}
              noOptionsText="No se encontraron empleados"
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
            >
              {permissionsList.length > 0 ? (
                permissionsList.map((permission) => (
                  <MenuItem key={permission.permissionTypeID} value={permission.permissionTypeID}>
                    {permission.permissionTypeName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando tipos...</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center', marginTop: '15px' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                fontSize: '16px', 
                padding: '10px 30px',
                fontWeight: 'bold'
              }}
            >
              AUTORIZAR PERMISO
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PermissionForm;