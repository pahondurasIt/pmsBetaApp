import { useState, useEffect, useRef } from 'react';
import {
  Checkbox,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import { DataTable, Column } from 'primereact';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Toast } from 'primereact/toast';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import GetAppIcon from '@mui/icons-material/GetApp';

import { apipms } from '../../../../service/apipms';
import '../../../css/permission.css';
import { useToast } from "../../../../context/ToastContext";
import { formatearFecha, formatearHora } from '../../../../helpers/formatDate';
import { isValidText } from '../../../../helpers/validator';

const Permission = () => {
  const [permissionRecords, setPermissionRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [visible, setVisible] = useState(false);
  const [itemFilter, setItemFilter] = useState('');
  const { showToast } = useToast();
  const toastBC = useRef(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const [permissionsResponse] = await Promise.all([
        apipms.get(`/permission/allPermissions`)
      ]);
      setPermissionRecords(permissionsResponse.data || []);
      setFilteredRecords(permissionsResponse.data || []);
      setTotalPermissions(permissionsResponse.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Efecto para aplicar filtros
  useEffect(() => {
    let filtered = permissionRecords;

    // Filtro por Item (número de fila)
    if (itemFilter) {
      const itemNumber = parseInt(itemFilter);
      if (!isNaN(itemNumber) && itemNumber > 0) {
        filtered = filtered.filter((_, index) => index + 1 === itemNumber);
      }
    }

    // Filtro por Tipo de Permiso
    if (tipoPermisoFilter) {
      filtered = filtered.filter(record => {
        const tipoPermiso = record.request ? 'Solicitado' : 'Diferido';
        return tipoPermiso === tipoPermisoFilter;
      });
    }

    setFilteredRecords(filtered);
  }, [permissionRecords, itemFilter, tipoPermisoFilter]);

  const onCellSelect = (event) => {
   if (event.cellIndex === 0 && !event.rowData.isApproved) {
         apipms.delete(`/permission/${event.rowData.permissionID}`)
           .then((res) => {
             showToast("success", res.data.message);
             fetchPermissions();
           })
           .catch((error) => {
             console.error('Error al eliminar el permiso:', error);
             showToast("error", error.response?.data?.message);
           });
       }
    if (event.cellIndex === 1 && !event.rowData.isApproved) {
      apipms.put(`/permission/approvedPermission/${event.rowData.permissionID}`, { isApproved: true })
        .then((res) => {
          showToast("success", res.data.message);
          fetchPermissions();
        })
        .catch((error) => {
          console.error('Error al aprobar el permiso:', error);
          showToast("error", error.response?.data?.message);
        });
    }
  }

  const renderActions = (data) => {
    return <Checkbox checked={data.isPaid} onChange={(e) => {
      const isChecked = e.target.checked;
      apipms.put(`/permission/paidPermission/${data.permissionID}`, { isPaid: isChecked })
        .then((response) => {
          showToast("success", `El Permiso es ${isChecked ? 'pagado' : 'no pagado'}`);
          setPermissionRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.permissionID === data.permissionID ? { ...record, isPaid: isChecked } : record
            )
          );
        })
        .catch((error) => {
          console.error('Error al actualizar el estado de pago:', error);
          showToast("error", error.response?.data?.message);
        });
    }} />
  }

  const renderStatus = (data) => {
    const isActive = data.status === 1;
    return (
      <span style={{
        color: isActive ? '#28a745' : '#dc3545',
        fontWeight: 'bold'
      }}>
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    );
  }

  // En la función renderApproved
  const renderApproved = (data) => {
    if (data.isApproved) {
      return <span style={{ color: '#28a745', fontWeight: 'bold' }}>Aprobado</span>;
    } else {
      return (
        <span
          className='btnAprobar'
          style={{
            cursor: 'pointer',
            color: '#007bff', // Color de texto azul
            border: '1px solid #007bff', // Borde azul
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
          }}
        >
          Aprobar
        </span>
      );
    }
  }
  const renderDelete = (data) => {
    if (!data.isApproved) {
      return <DeleteOutlinedIcon sx={{ color: '#a10000', cursor: 'pointer' }} fontSize='medium' />
    }
  }

  const clear = () => {
    toastBC.current.clear();
    setVisible(false);
  };

  const showDetailPermission = (data) => {
    if (!visible) {
      setVisible(true);
      toastBC.current.clear();
      toastBC.current.show({
        severity: 'success',
        summary: 'Can you send me the report?',
        sticky: true,
        content: (props) => (
          <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
            <strong>Programado para:</strong>
            <p>
              <strong>{formatearFecha(data.date)}</strong>  {isValidText(data.exitTimePermission) ? formatearHora(data.exitTimePermission) : '-'} a {isValidText(data.entryTimePermission) ? formatearHora(data.entryTimePermission) : '-'}</p>
            <br />
            <strong>Comentario:</strong>
            <p>{data.comment}</p>
          </div>
        )
      });
    }
  };


  return (
    <>
      <Toast ref={toastBC} position="bottom-center" onRemove={clear} />
      <div className="container">
        <h2 className="section-title-centered">Información sobre los permisos</h2>

     
        <div className="table-section">
          <DataTable
            value={filteredRecords}
            emptyMessage="No hay registros aún"
            size="small"
            showGridlines
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 15]}
            cellSelection
            onCellSelect={onCellSelect}
            selectionMode="single"
            scrollable
            scrollHeight="flex"
          >
            <Column header="Item" body={(rowData, rowState) => {
              // Si hay filtro de item, mostrar el número filtrado, sino el índice normal
              if (itemFilter) {
                return <p>{itemFilter}</p>;
              }
              return <p>{rowState.rowIndex + 1}</p>;
            }} style={{ textAlign: 'center', minWidth: '10px' }}></Column>

            <Column style={{ textAlign: 'center' }}
              body={(data) => renderDelete(data)}></Column>

            <Column header="Aprobado" style={{ textAlign: 'center' }}
              body={(data) => renderApproved(data)}></Column>

            <Column field="fullName" header="Nombre completo" style={{ minWidth: '150px', fontWeight: '600' }}></Column>

            <Column field="jobName" header="Puesto" body={(data) => <p>{data.jobName || '-'}</p>} ></Column>

            <Column field="date" header="Fecha" style={{ textAlign: 'center', minWidth: '110px' }}
              body={(data) => <p>{isValidText(data.date) ? formatearFecha(data.date) : '-'}</p>} />

            <Column header="Entrada Inicial" body={(data) => <p>{isValidText(data.attendanceEntry) ? formatearHora(data.attendanceEntry) : '-'}</p>}></Column>

             <Column field="exitPermission" header="Permiso Salida"
              body={(data) => <p>{isValidText(data.exitPermission) ? formatearHora(data.exitPermission) : '-'}</p>} />

            <Column field="entryPermission" header="Permiso Entrada"
              body={(data) => <p>{isValidText(data.entryPermission) ? formatearHora(data.entryPermission) : '-'}</p>} />

            <Column
              field="approvedByFullName" // Cambia "approvedByUsername" por "approvedByFullName"
              header="Aprobador por"
              body={(data) => <p>{data.approvedByFullName || '-'}</p>}>
            </Column>

             <Column field="createdBy" header="Creado por" body={(data) => <p>{data.createdBy || '-'}</p>}></Column>
          
            <Column
              header="Tipo de Permiso"
              body={(data) => <p>{data.request ? 'Solicitado' : 'Diferido'}</p>}
              style={{ minWidth: '150px' }}
            />

            <Column field="permissionTypeName" header="Permiso" style={{ minWidth: '150px' }}></Column>

            <Column header="Detalle" style={{ textAlign: 'center' }} body={(data) => (
              <IconButton onClick={() => showDetailPermission(data)} title="Ver Detalle">
                <AccessTimeIcon fontSize="inherit" />
              </IconButton>
            )}></Column>
            <Column field="status" header="Estado" body={renderStatus} style={{ textAlign: 'center' }}></Column>
            <Column field="isPaid" header="Pagado" body={renderActions} style={{ textAlign: 'center' }}></Column>
          </DataTable>
        </div>
      </div >

    </>
  );
};

export default Permission;
