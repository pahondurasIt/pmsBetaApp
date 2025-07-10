import React, { useState, useEffect, useRef } from 'react';
import {
  TextField, Button, MenuItem, Autocomplete,
  FormControl, InputLabel, Select,
  Divider,
  Checkbox,
} from '@mui/material';
import { DataTable, Column, FilterMatchMode } from 'primereact';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Toast } from 'primereact/toast';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
  const [detailShift, setDetailShift] = useState(null);
  const [checkBox, setCheckBox] = useState(false);
  const toast = useRef(null);

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

    apipms.get('/permission/allPermissions')
      .then((response) => {
        setPermissionRecords(response.data || []);
        console.log('response.data', response.data);

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
    if (event.cellIndex === 4) {
      verDetalle(event.rowData);
    }
  }

  const verDetalle = (permiso) => {
    setSelectedPermission(permiso);
    setVisible(true);
  };

  const renderActions = (data) => {
    return <Checkbox checked={data.isPaid} onChange={(e) => {
      const isChecked = e.target.checked;
      apipms.put(`/permission/paidPermission/${data.permissionID}`, { isPaid: isChecked })
        .then((response) => {
          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: `El Permiso es ${isChecked ? 'pagado' : 'no pagado'}`,
            life: 3000
          });
          setPermissionRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.permissionID === data.permissionID ? { ...record, isPaid: isChecked } : record
            )
          );
        })
        .catch((error) => {
          console.error('Error al actualizar el estado de pago:', error);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el estado de pago',
            life: 3000
          });
        });
    }} />
  }

  return (
    <>
      <Toast ref={toast} />
      <div className="container">
        <div className="left-panel">
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
              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
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
        </div>

        <Divider orientation="vertical" flexItem className="vertical-divider" />

        <div className="right-panel">
          <h2 className="section-title-centered">Información sobre los permisos</h2>
          <div className="metrics-section">
            <div className="metric-box">
              <div className="metric-header">
                <AssignmentIcon sx={{ color: '#28a745', fontSize: 24 }} />
                <p className='metric-label'>Permisos solicitados</p>
              </div>
              <p className='metric-value metric-blue'>{totalPermissions}</p>
            </div>
          </div>

          <div className="table-section">
            <DataTable
              value={permissionRecords}
              emptyMessage="No hay registros aún"
              size="small"
              showGridlines
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 15]}
              cellSelection
              onCellSelect={onCellSelect}
              selectionMode="single"
              className="custom-table"
            >
              <Column field="fullName" header="Nombre completo" style={{ minWidth: '180px' }}></Column>
              <Column field="jobName" header="Puesto" style={{ minWidth: '150px' }}></Column>
              <Column field="permissionTypeName" header="Permiso" style={{ minWidth: '150px' }}></Column>
              <Column field="exitPermission" header="Salida" />
              <Column field="entryPermission" header="Entrada" />
              <Column field="exitTimePermission" header="S. programada" />
              <Column field="entryTimePermission" header="E. programada" />
              <Column field="isPaid" header="Pagado" body={renderActions} style={{ textAlign: 'center' }}></Column>
            </DataTable>
          </div>
        </div>
      </div>

      <TimePermission
        visible={visible}
        onHide={() => setVisible(false)}
        permiso={selectedPermission}
      />
    </>
  );
};

export default PermissionForm;