import React, { useState, useEffect, useRef } from 'react';
import {
  TextField, Button, MenuItem, Autocomplete,
  FormControl, InputLabel, Select,
  Divider,
}
  from '@mui/material';
import { DataTable, Column, FilterMatchMode } from 'primereact';
import { Dialog } from 'primereact/dialog';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toast } from 'primereact/toast';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { apipms } from '../../../../service/apipms';
import '../../../css/permission.css';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from '../../../../helpers/dayjsConfig';
import { isValidRangeDate, isValidText } from '../../../../helpers/validator';
import TimePermission from './TimePermission';

const PermissionForm = () => {
  const [formData, setFormData] = useState({
    employeeID: '',
    permissionType: '',
    exitTimePermission: new Date(),
    entryTimePermission: new Date()
  });
  const [employeesList, setEmployeesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [permissionRecords, setPermissionRecords] = useState([]);
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [permissionTime, setPermissionTime] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
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

    apipms.get('/permission/allPermissions')
      .then((response) => {
        setPermissionRecords(response.data || []);
        setTotalPermissions(response.data.length);

        let permissionsTime = 0;
        let permissionsData = response.data;

        permissionsData.forEach((permission) => {
          if (isValidText(permission.exitTimePermission) && isValidText(permission.entryTimePermission)) {
            const exitTime = dayjs(`${dayjs().format('YYYY-MM-DD')} ${permission.exitTimePermission}`);
            const entryTime = dayjs(`${dayjs().format('YYYY-MM-DD')} ${permission.entryTimePermission}`);
            permissionsTime += entryTime.diff(exitTime, 'minute');
          }
        });
        setPermissionTime(permissionsTime);
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
    }).then((response) => {
      console.log('Permiso autorizado:', response.data);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `Permiso autorizado para `,
        life: 4000
      });

      setPermissionRecords((prevRecords) => [
        ...prevRecords,
        response.data?.savedData
      ]);
      setTotalPermissions((prevCount) => prevCount + 1);
      let newPermissionTime = permissionTime;
      if (isValidText(response.data?.savedData.exitTimePermission) && isValidText(response.data?.savedData.entryTimePermission)) {
        const exitTime = dayjs(`${dayjs().format('YYYY-MM-DD')} ${response.data?.savedData.exitTimePermission}`);
        const entryTime = dayjs(`${dayjs().format('YYYY-MM-DD')} ${response.data?.savedData.entryTimePermission}`);
        newPermissionTime += entryTime.diff(exitTime, 'minute');
      }
      setPermissionTime(newPermissionTime);

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

  const renderShowCard = () => {
    return <WatchLaterIcon color='success' fontSize='medium' />
  };

  const onCellSelect = (event) => {
    console.log('Cell selected:', event);

    if (event.cellIndex === 4) {
      console.log('Cell selected:', event.rowData);
      verDetalle(event.rowData);
    }
  }

  const verDetalle = (permiso) => {
    setSelectedPermission(permiso);
    setVisible(true);
  };

  return (
    <div >
      <Toast ref={toast} />
      <div className="container">
        <div className="left">
          <h2>
            Registrar Permiso
          </h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: '60%' }}>

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
              renderInput={(params) => <TextField {...params} required label="Empleado" variant="standard" />}
            />
            <FormControl required fullWidth variant="standard" size='small'>
              <InputLabel id="tipoDocumento">Tipo de permiso</InputLabel>
              <Select
                fullWidth
                labelId="permissionType"
                required
                id="permissionType"
                name='permissionType'
                value={formData.permissionType}
                onChange={handleChange}
                label="Tipo de permiso"
              >
                {permissionsList.map((permission) => (
                  <MenuItem key={permission.permissionTypeID} value={permission.permissionTypeID}>
                    {permission.permissionTypeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Campo para Tiempo de Salida */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Salida programada"
                value={formData.exitTimePermission}
                enableAccessibleFieldDOMStructure={false}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    exitTimePermission: value
                  }));
                }}
                ampm={false} // usa formato 24h, quítalo si quieres AM/PM
                minTime={new Date()} // opcional
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    variant: 'standard'
                  }
                }}
              />
            </LocalizationProvider>
            {/* Campo para Tiempo de Entrada de Regreso */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                label="Entrada programada"
                value={formData.entryTimePermission}
                enableAccessibleFieldDOMStructure={false}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    entryTimePermission: value
                  }));
                }}
                ampm={false} // usa formato 24h, quítalo si quieres AM/PM
                minTime={new Date()} // opcional
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    variant: 'standard'
                  }
                }}
              />
            </LocalizationProvider>
            <br />
            <br />
            <Button
              type="submit"
              variant="contained"
              color="success"
              startIcon={<i className="pi pi-check" />}
              fullWidth
              size="small"
            >
              Guardar
            </Button>
          </form>
        </div>
        <Divider orientation="vertical" flexItem style={{ margin: '0 20px' }} />
        <div className="right">
          <h2>
            Información sobre los permisos
          </h2>
          <div>
            <br />
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '50px'
            }}>
              <div>
                <p className='label-permission'>Permisos solicitados</p>
                <p className='value-permission'>{totalPermissions}</p>
              </div>
              <div>
                <p className='label-permission'>Tiempo en permisos</p>
                <p className='value-permission'>{permissionTime / 60} Hrs</p>
              </div>
            </div>
            <div>
              <br />
              <DataTable
                value={permissionRecords}
                emptyMessage="No se encontraron datos"
                size="small"
                showGridlines
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 15]}
                cellSelection
                onCellSelect={onCellSelect}
                selectionMode="single"
              >
                <Column field="fullName" header="Nombre completo" ></Column>
                <Column field="jobName" header="Puesto" ></Column>
                <Column field="permissionTypeName" header="Permiso" ></Column>
                <Column header="T. Estimado" style={{ textAlign: 'center' }} body={(data) => {
                  return (isValidText(data.exitTimePermission) && isValidText(data.entryTimePermission)) ?
                    `${(dayjs(dayjs(`${dayjs().format('YYYY-MM-DD')} ${data.entryTimePermission}`).format('YYYY-MM-DD HH:mm:ss'))
                      .diff(dayjs(dayjs(`${dayjs().format('YYYY-MM-DD')} ${data.exitTimePermission}`).format('YYYY-MM-DD HH:mm:ss')), 'minute') / 60).toFixed(2)} Hrs` : '--';
                }}></Column>
                <Column body={renderShowCard} style={{ textAlign: 'center' }}></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      <TimePermission
        visible={visible}
        onHide={() => setVisible(false)}
        permiso={selectedPermission}
      />

    </div>

  );
};

export default PermissionForm;
