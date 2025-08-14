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

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';

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

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
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

  useEffect(() => {
    filterRecords();
  }, [searchTerm, dateFrom, dateTo, permissionRecords]);

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
    const { newData } = e;
    const permissionID = newData.permissionID;

    // buscar el índice real en permissionRecords (no el de filteredRecords)
    const realIndex = permissionRecords.findIndex(r => r.permissionID === permissionID);
    if (realIndex === -1) return;

    // detectar qué campos cambiaron
    const changes = [];
    if (permissionRecords[realIndex].exitPermission !== newData.exitPermission) {
      changes.push({ field: 'exitPermission', newTime: newData.exitPermission });
    }
    if (permissionRecords[realIndex].entryPermission !== newData.entryPermission) {
      changes.push({ field: 'entryPermission', newTime: newData.entryPermission });
    }

    // si no cambió nada, salir
    if (changes.length === 0) {
      setCurrentEditingRowIndex(null);
      return;
    }

    try {
      // mandar todas las actualizaciones en paralelo
      const responses = await Promise.all(
        changes.map(ch =>
          apipms.post('/permission/getEditPermission', {
            permissionID,
            field: ch.field,
            newTime: ch.newTime
          })
        )
      );

      // si todas OK, actualiza el estado local
      const allOk = responses.every(r => r.data?.success);
      if (allOk) {
        const updated = [...permissionRecords];
        changes.forEach(ch => {
          updated[realIndex][ch.field] = ch.newTime;
        });
        setPermissionRecords(updated);

        // Mostrar solo el mensaje que vino del backend (primera respuesta)
        showToast("success", firstResponse?.data?.message );

      } else {
        // toma el primer error
        const firstErr = responses.find(r => !r.data?.success);
        showToast("error", firstErr?.data?.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error al actualizar el permiso");
    } finally {
      setCurrentEditingRowIndex(null);
    }
  };


  const timeEditor = (options) => {
    const rowData = options.rowData;

    // Si no está aprobado, mostramos solo texto (como ya tienes)
    if (!rowData.isApproved) {
      return <span>{formatTimeWithSeconds(options.value)}</span>;
    }

    // value del backend viene como 'HH:mm:ss' (string). Lo llevamos a dayjs.
    const valueAsDayjs = options.value
      ? dayjs(`1970-01-01T${options.value}`)
      : null;

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimeField
          value={valueAsDayjs}
          onChange={(newValue) => {
            // normalizamos a 'HH:mm:ss' para guardar
            const formatted = newValue?.isValid()
              ? newValue.format('HH:mm:ss')
              : '';
            options.editorCallback(formatted);
          }}
          // si prefieres editar en 12h: format="hh:mm:ss a"
          format="HH:mm:ss"
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              size: 'small',
              variant: 'standard',
              placeholder: 'HH:mm:ss',
              sx: { width: '86px' }
              
            }
          }}
        />
      </LocalizationProvider>
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
    if (!searchTerm.trim() && !dateFrom && !dateTo) {
      setFilteredRecords(permissionRecords);
      return;
    }

    const filtered = permissionRecords.filter(record => {
      const searchOk = (() => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          record.fullName?.toLowerCase().includes(q) ||
          record.jobName?.toLowerCase().includes(q) ||
          record.permissionTypeName?.toLowerCase().includes(q) ||
          record.createdBy?.toLowerCase().includes(q) ||
          record.approvedByFullName?.toLowerCase().includes(q) ||
          record.codeEmployee?.toLowerCase().includes(q)
        );
      })();
      const recDate = record.date ? record.date.slice(0, 10) : null;
      const fromOk = dateFrom ? (recDate && recDate >= dateFrom) : true;
      const toOk = dateTo ? (recDate && recDate <= dateTo) : true;
      return searchOk && fromOk && toOk;
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 500, color: '#495057', fontSize: 14 }}>
              Fecha:
            </span>

            <InputText
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ height: 35, border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }}
              placeholder="Desde"
            />

            <InputText
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ height: 35, border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }}
              placeholder="Hasta"
            />

            <PrimeButton
              label="Limpiar"
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="p-button-text"
              tooltipOptions={{ position: 'top' }}
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