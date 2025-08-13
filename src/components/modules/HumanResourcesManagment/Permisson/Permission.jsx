import { useState, useEffect, useRef } from 'react';
import {
  Checkbox,
  IconButton,
} from '@mui/material';
import { DataTable, Column } from 'primereact';
import { InputText } from 'primereact/inputtext';
import { Button as PrimeButton } from 'primereact/button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import { Toast } from 'primereact/toast';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { apipms } from '../../../../service/apipms';
import '../../../css/permission.css';
import { useToast } from "../../../../context/ToastContext";
import { formatearFecha } from '../../../../helpers/formatDate'; // Se eliminó formatearHora
import { isValidText } from '../../../../helpers/validator';

const Permission = () => {
  const [permissionRecords, setPermissionRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [currentEditingRowIndex, setCurrentEditingRowIndex] = useState(null);
  const { showToast } = useToast();
  const toastBC = useRef(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [searchTerm, permissionRecords]);

  const onRowEditInit = (e) => {
    const row = filteredRecords[e.index];
    if (!row.isApproved) {
      showToast("warn", "No puedes editar hasta que el permiso sea aprobado.");
      return;
    }
    setCurrentEditingRowIndex(e.index);
  };

  const onRowEditCancel = () => {
    setCurrentEditingRowIndex(null);
  };

  //Api para llamar la funcion de editar en el Backend
  const onRowEditComplete = async (e) => {
    const { newData, index } = e;
    const permissionID = newData.permissionID;

    let field = null;
    let newTime = null;

    if (permissionRecords[index].exitPermission !== newData.exitPermission) {
      field = 'exitPermission';
      newTime = newData.exitPermission;
    } else if (permissionRecords[index].entryPermission !== newData.entryPermission) {
      field = 'entryPermission';
      newTime = newData.entryPermission;
    }

    if (!field || !newTime) {
      console.log('No se detectaron cambios en exitPermission o entryPermission');
      return;
    }

    try {
      const response = await apipms.post('/permission/getEditPermission', {
        permissionID,
        field,
        newTime
      });

      if (response.data.success) {
        const updated = [...permissionRecords];
        updated[index][field] = newTime;
        setPermissionRecords(updated);
        showToast("success", response.data.message);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error al actualizar el permiso");
    }

    setCurrentEditingRowIndex(null);
  };

  const timeEditor = (options) => {
    const rowData = options.rowData;

    if (!rowData.isApproved) {
      return <span>{formatTimeWithSeconds(options.value)}</span>; // Texto sin input
    }

    return (
      <InputText
        type="text"
        value={options.value || ''}
        onChange={(e) => options.editorCallback(e.target.value)}
        placeholder="hh:mm:ss"
      />
    );
  };


  const fetchPermissions = async () => {
    try {
      const [permissionsResponse] = await Promise.all([
        apipms.get(`/permission/allPermissions`)
      ]);
      setPermissionRecords(permissionsResponse.data || []);
      setFilteredRecords(permissionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filterRecords = () => {
    if (!searchTerm.trim()) {
      setFilteredRecords(permissionRecords);
      return;
    }

    const filtered = permissionRecords.filter(record => {
      const searchLower = searchTerm.toLowerCase();
      return (
        record.fullName?.toLowerCase().includes(searchLower) ||
        record.jobName?.toLowerCase().includes(searchLower) ||
        record.permissionTypeName?.toLowerCase().includes(searchLower) ||
        record.createdBy?.toLowerCase().includes(searchLower) ||
        record.approvedByFullName?.toLowerCase().includes(searchLower) ||
        record.codeEmployee?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredRecords(filtered);
  };

  // NUEVA FUNCIÓN PARA FORMATEAR LA HORA CON SEGUNDOS
  const formatTimeWithSeconds = (timeString) => {
    if (!timeString) return '-';

    try {
      // Se crea una fecha base para utilizar las funciones de formato de hora
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '-';
    }
  };

  const handleExportPermissions = async () => {
    try {
      setIsExporting(true);
      const response = await apipms.get('/permission/exportPermission', {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `permisos_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("success", "Archivo exportado exitosamente");
    } catch (error) {
      console.error('Error al exportar:', error);
      showToast("error", "Error al exportar el archivo");
    } finally {
      setIsExporting(false);
    }
  };

  //Contenido del encabezado del Datable
  const renderTableHeader = () => {
    return (
      <div
        className='table-header-container-class'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          borderBottom: 'none'
        }}>
        <div 
        className='search-container-class'
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontWeight: '500',
            color: '#495057',
            fontSize: '14px'
          }}>
            Buscar Empleado:
          </span>
          <div style={{ position: 'relative' }}>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre o código..."
              style={{
                paddingLeft: '35px',
                width: '250px',
                height: '35px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <SearchIcon
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '18px'
              }}
            />
          </div>
        </div>

        <PrimeButton
          icon="pi pi-file-export"
          tooltip='Permisos Exportados'
          tooltipOptions={{ position: 'top' }}
          onClick={handleExportPermissions}
          disabled={isExporting}
          loading={isExporting}
          className="p-button-success circular-button"
        />
      </div>
    );
  };


  const onCellSelect = (event) => {
    if (event.cellIndex === 1 && !event.rowData.isApproved) {
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
    if (event.cellIndex === 2 && !event.rowData.isApproved) {
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

  const renderApproved = (data) => {
    if (data.isApproved) {
      return <span style={{ color: '#28a745', fontWeight: 'bold' }}>Aprobado</span>;
    } else {
      return (
        <span
          className='btnAprobar'
          style={{
            cursor: 'pointer',
            color: '#007bff',
            border: '1px solid #007bff',
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
            {/* CAMBIO: Usar nueva función de formato de hora */}
            <p>
              <strong>{formatearFecha(data.date)}</strong>  {formatTimeWithSeconds(data.exitTimePermission)} a {formatTimeWithSeconds(data.entryTimePermission)}</p>
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
            header={renderTableHeader()}
            editMode="row"                     // Habilita edición por fila
            onRowEditInit={onRowEditInit}      // Inicia edición
            onRowEditCancel={onRowEditCancel}  // Cancela edición
            onRowEditComplete={onRowEditComplete} // Guarda cambios
          >
            <Column header="Item" body={(rowData, rowState) => (
              <p>{rowState.rowIndex + 1}</p>
            )} style={{ textAlign: 'center', minWidth: '10px' }}></Column>

            <Column style={{ textAlign: 'center' }}
              body={(data) => renderDelete(data)}></Column>

            <Column header="Aprobado" style={{ textAlign: 'center' }}
              body={(data) => renderApproved(data)}></Column>

            <Column field="fullName" header="Nombre completo" style={{ minWidth: '200px', fontWeight: '600' }}></Column>

            <Column field="jobName" header="Puesto" body={(data) => <p>{data.jobName || '-'}</p>} ></Column>

            <Column field="date" header="Fecha" style={{ textAlign: 'center', minWidth: '110px' }}
              body={(data) => <p>{isValidText(data.date) ? formatearFecha(data.date) : '-'}</p>} />

            <Column header="Entrada Inicial" style={{ textAlign: 'center', minWidth: '100px' }} body={(data) => <p>{formatTimeWithSeconds(data.attendanceEntry)}</p>}></Column>

            <Column
              field="exitPermission"
              header="Permiso Salida"
              body={(data) => <p>{formatTimeWithSeconds(data.exitPermission)}</p>}
              editor={(options) => timeEditor(options)}
              style={{ textAlign: 'center', minWidth: '100px' }}
            />

            <Column
              field="entryPermission"
              header="Permiso Entrada"
              body={(data) => <p>{formatTimeWithSeconds(data.entryPermission)}</p>}
              editor={(options) => timeEditor(options)}
              style={{ textAlign: 'center', minWidth: '100px' }}
            />

            <Column
              field="approvedByFullName"
              style={{ textAlign: 'center', minWidth: '120px' }}
              header="Aprobador por"
              body={(data) => <p>{data.approvedByFullName || '-'}</p>}>
            </Column>

            <Column field="createdBy" style={{ textAlign: 'center', minWidth: '120px' }} header="Creado por" body={(data) => <p>{data.createdBy || '-'}</p>}></Column>

            <Column
              header="Tipo de Permiso"
              body={(data) => <p>{data.request ? 'Solicitado' : 'Diferido'}</p>}
              style={{ minWidth: '100px' }}
            />

            <Column field="permissionTypeName" header="Permiso" style={{ minWidth: '100px' }}></Column>

            <Column header="Detalle" style={{ textAlign: 'center' }} body={(data) => (
              <IconButton onClick={() => showDetailPermission(data)} title="Ver Detalle">
                <AccessTimeIcon fontSize="inherit" />
              </IconButton>
            )}></Column>
            <Column field="status" header="Estado" body={renderStatus} style={{ textAlign: 'center' }}></Column>
            <Column field="isPaid" header="Pagado" body={renderActions} style={{ textAlign: 'center' }}></Column>

            <Column
              rowEditor
              headerStyle={{ width: '4rem' }}
              bodyStyle={{ textAlign: 'center' }}
            />

          </DataTable>
        </div>
      </div >

    </>
  );
};

export default Permission;