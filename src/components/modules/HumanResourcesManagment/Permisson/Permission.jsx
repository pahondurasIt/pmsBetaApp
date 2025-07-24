import { useState, useEffect, useRef } from 'react';
import {
  Divider, Checkbox,
} from '@mui/material';
import { DataTable, Column } from 'primereact';

import { Toast } from 'primereact/toast';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { apipms } from '../../../../service/apipms';
import '../../../css/permission.css';
import TimePermission from '../Attendance/TimePermission';
import { FormPermisson } from './FormPermisson';

const PermissionForm = () => {
  const [permissionRecords, setPermissionRecords] = useState([]);
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    apipms.get('/permission/allPermissions')
      .then((response) => {
        setPermissionRecords(response.data || []);
        setTotalPermissions(response.data.length);
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
          <FormPermisson 
          toast={toast} 
          fetchPermissions={fetchPermissions}
          />
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