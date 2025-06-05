import React, { useState, useEffect, useRef } from 'react';
import '../../../css/RecordAttendance.css';
import { apipms } from '../../../../service/apipms';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Button, Menu, MenuItem } from '@mui/material';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button as PrimeButton } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';

dayjs.locale('es');
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const RecordAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs('2025-06-04'));
  const [anchorMonth, setAnchorMonth] = useState(null);
  const [anchorWeek, setAnchorWeek] = useState(null);
  const [anchorDay, setAnchorDay] = useState(null);
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [maxPermissionCount, setMaxPermissionCount] = useState(0);
  const [filterMode, setFilterMode] = useState('day');
  const [currentPermissionID, setCurrentPermissionID] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [savingComment, setSavingComment] = useState(false);
  const [commentSaveTimeout, setCommentSaveTimeout] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [isCommentTooltipVisible, setIsCommentTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipRowIndex, setTooltipRowIndex] = useState(null);

  const dt = useRef(null);
  const toast = useRef(null);
  const commentInputRef = useRef(null);
  const op = useRef(null);

  useEffect(() => {
    fetchAttendanceData(selectedDate.format('YYYY-MM-DD'));
    setFilterMode('day');
  }, [selectedDate]);

  const fetchAttendanceData = (specificDate = null, startDate = null, endDate = null) => {
    setLoading(true);
    const params = {};
    if (specificDate) params.specificDate = specificDate;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    apipms.get('/attendance', { params })
      .then((response) => {
        const dataWithItem = response.data.map((row, index) => ({
          ...row,
          item: index + 1
        }));
        setEmployeeAttendance(dataWithItem);
        applyFilters(dataWithItem, selectedDate, filterMode, searchTerm);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la asistencia', life: 3000 });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const applyFilters = (data, date, mode, term) => {
    let filtered = [...data];

    if (mode === 'day') {
      const selectedDateStr = date.format('YYYY-MM-DD');
      filtered = filtered.filter((record) => record.date === selectedDateStr);
    } else if (mode === 'week') {
      const startOfWeek = date.startOf('isoWeek');
      const endOfWeek = date.endOf('isoWeek');
      // Aseguramos que los días de la semana pertenezcan al mes seleccionado
      const startOfMonth = date.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = date.endOf('month').format('YYYY-MM-DD');
      filtered = filtered.filter((record) => {
        const recordDate = dayjs(record.date);
        return (
          record.date >= startOfMonth &&
          record.date <= endOfMonth &&
          recordDate.isAfter(startOfWeek.subtract(1, 'day')) &&
          recordDate.isBefore(endOfWeek.add(1, 'day'))
        );
      });
    } else if (mode === 'month') {
      const startOfMonth = date.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = date.endOf('month').format('YYYY-MM-DD');
      filtered = filtered.filter((record) => record.date >= startOfMonth && record.date <= endOfMonth);
    }

    if (term) {
      filtered = filtered.filter((employee) =>
        employee.employeeName.toLowerCase().includes(term.toLowerCase()) ||
        employee.employeeID.toString().includes(term)
      );
    }

    let maxCount = 0;
    filtered.forEach(row => {
      if (row.totalPermissions) {
        maxCount = Math.max(maxCount, Math.min(row.totalPermissions, 5));
      } else {
        for (let i = 1; i <= 5; i++) {
          if (row[`permissionExitTime${i}`] || row[`permissionEntryTime${i}`]) {
            maxCount = Math.max(maxCount, i);
          }
        }
      }
    });

    setMaxPermissionCount(maxCount);
    setFilteredAttendance(filtered);
  };

  useEffect(() => {
    applyFilters(employeeAttendance, selectedDate, filterMode, searchTerm);
  }, [searchTerm, employeeAttendance, selectedDate, filterMode]);

  const currentMonth = selectedDate.format('MMMM');
  const currentWeek = selectedDate.isoWeek();
  const currentDay = selectedDate.format('D');
  const currentDayName = selectedDate.format('dddd');

  const getWeeksInMonth = (month) => {
    const startOfMonth = selectedDate.month(month).startOf('month');
    const endOfMonth = selectedDate.month(month).endOf('month');
    const weeks = new Set();
    let current = startOfMonth;

    // Cambio: Aseguramos que solo se incluyan semanas que tengan días dentro del mes seleccionado
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
      const weekNum = current.isoWeek();
      const startOfWeek = current.startOf('isoWeek');
      const endOfWeek = current.endOf('isoWeek');
      // Verificamos si la semana tiene al menos un día dentro del mes
      const hasDaysInMonth = startOfWeek.isBefore(endOfMonth.add(1, 'day')) && endOfWeek.isAfter(startOfMonth.subtract(1, 'day'));
      if (hasDaysInMonth) {
        weeks.add(weekNum);
      }
      current = current.add(1, 'day');
    }
    return Array.from(weeks).sort((a, b) => a - b);
  };

  const getDaysInWeek = (week) => {
    const startOfWeek = selectedDate.startOf('yearYAN').isoWeek(week).startOf('isoWeek');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day');
      // Cambio: Solo incluimos días que estén dentro del mes seleccionado
      if (day.month() === selectedDate.month()) {
        days.push(day);
      }
    }
    return days;
  };

  const handleMonthClick = (event) => setAnchorMonth(event.currentTarget);
  const handleMonthClose = () => setAnchorMonth(null);
  const handleWeekClick = (event) => setAnchorWeek(event.currentTarget);
  const handleWeekClose = () => setAnchorWeek(null);
  const handleDayClick = (event) => setAnchorDay(event.currentTarget);
  const handleDayClose = () => setAnchorDay(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    name: dayjs().month(i).format('MMMM'),
    value: i,
  }));

  const handleWeekSelect = (week) => {
    const startOfYear = selectedDate.startOf('year');
    const startOfWeek = startOfYear.isoWeek(week).startOf('isoWeek');
    const endOfWeek = startOfYear.isoWeek(week).endOf('isoWeek');
    // Cambio: Ajustamos la fecha seleccionada para que sea el primer día de la semana que esté dentro del mes
    let adjustedDate = startOfWeek;
    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');
    while (!adjustedDate.isAfter(endOfMonth) && adjustedDate.month() !== selectedDate.month()) {
      adjustedDate = adjustedDate.add(1, 'day');
    }
    if (adjustedDate.isAfter(endOfMonth)) {
      adjustedDate = startOfMonth; // Si no hay días válidos en el mes, usamos el inicio del mes
    }
    setSelectedDate(adjustedDate);
    setFilterMode('week');
    fetchAttendanceData(null, startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));
    handleWeekClose();
  };

  const handleMonthSelect = (monthIndex) => {
    const startOfMonth = selectedDate.month(monthIndex).startOf('month');
    const endOfMonth = selectedDate.month(monthIndex).endOf('month');
    setSelectedDate(startOfMonth);
    setFilterMode('month');
    fetchAttendanceData(null, startOfMonth.format('YYYY-MM-DD'), endOfMonth.format('YYYY-MM-DD'));
    handleMonthClose();
  };

  const handleDaySelect = (day) => {
    setSelectedDate(day);
    setFilterMode('day');
    fetchAttendanceData(day.format('YYYY-MM-DD'));
    handleDayClose();
  };

  const handleContextMenu = (event, permissionID, comment, rowIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const rowElement = event.currentTarget.closest('tr');
    const rect = rowElement.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollLeft = window.scrollX || window.pageXOffset;

    const cellRect = event.currentTarget.getBoundingClientRect();
    const top = cellRect.top + scrollTop + (cellRect.height / 2);
    const left = cellRect.right + scrollLeft + 10;

    setTooltipPosition({ top, left });
    setTooltipRowIndex(rowIndex);
    setCurrentPermissionID(permissionID);
    setCurrentComment(comment || '');
    setSelectedPermission(permissionID);
    setIsCommentTooltipVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCommentTooltipVisible && !event.target.closest('.comment-tooltip')) {
        setIsCommentTooltipVisible(false);
        setSelectedPermission(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCommentTooltipVisible]);

  const handleCommentChange = (e) => {
    setCurrentComment(e.target.value);
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveComment();
    }
    if (e.key === 'Escape') {
      op.current.hide();
      setSelectedPermission(null);
      setIsCommentTooltipVisible(false);
    }
  };

  const saveComment = () => {
    if (!currentPermissionID) {
      console.warn('Attempting to save comment without permissionID');
      return;
    }

    if (commentSaveTimeout) {
      clearTimeout(commentSaveTimeout);
      setCommentSaveTimeout(null);
    }

    setSavingComment(true);

    apipms.post('/attendance/updatePermissionComment', {
      permissionID: currentPermissionID,
      comment: currentComment
    })
      .then((response) => {
        const updatedAttendance = employeeAttendance.map(record => {
          const updatedRecord = { ...record };
          let commentUpdated = false;

          for (let i = 1; i <= 5; i++) {
            if (updatedRecord[`permissionExitID${i}`] === currentPermissionID) {
              updatedRecord[`permissionExitComment${i}`] = currentComment;
              commentUpdated = true;
            }
            if (updatedRecord[`permissionEntryID${i}`] === currentPermissionID) {
              updatedRecord[`permissionEntryComment${i}`] = currentComment;
              commentUpdated = true;
            }
          }

          if (updatedRecord.exitPermissionID === currentPermissionID) {
            updatedRecord.exitComment = currentComment;
            commentUpdated = true;
          }

          return updatedRecord;
        });

        setEmployeeAttendance(updatedAttendance);
        applyFilters(updatedAttendance, selectedDate, filterMode, searchTerm);

        toast.current.show({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Comentario guardado correctamente.',
          life: 2000
        });
        op.current.hide();
        setSelectedPermission(null);
        setIsCommentTooltipVisible(false);
      })
      .catch((error) => {
        console.error('Error saving comment:', error.response || error.message || error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el comentario.',
          life: 3000
        });
      })
      .finally(() => {
        setSavingComment(false);
      });
  };

  const commonCellStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    minWidth: '120px',
    height: '32px',
    position: 'relative',
    cursor: 'context-menu',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const exitTimeBodyTemplate = (rowData, { rowIndex }) => {
    const exitComment = rowData.exitComment || '';
    const hasComment = exitComment.trim() !== '';
    const permissionID = rowData.exitPermissionID || `exit_${rowData.item}`;

    if (rowData.exitTime) {
      return (
        <div
          className="exit-time-cell"
          style={{
            ...commonCellStyle,
            backgroundColor: hasComment ? '#ff9800' : 'transparent',
            color: hasComment ? 'white' : 'black',
          }}
          onContextMenu={(e) => handleContextMenu(e, permissionID, exitComment, rowIndex)}
        >
          <span>{rowData.exitTime}</span>
          {hasComment && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ff5722',
                borderRadius: '50%'
              }}
              title="Este permiso tiene un comentario"
            />
          )}
        </div>
      );
    }
    return null;
  };

  const createPermissionExitTimeTemplate = (index) => {
    return (rowData, { rowIndex }) => {
      const timeField = `permissionExitTime${index}`;
      const idField = `permissionExitID${index}`;
      const commentField = `permissionExitComment${index}`;

      if (rowData[timeField]) {
        const comment = rowData[commentField] || '';
        const hasComment = comment.trim() !== '';
        const permissionID = rowData[idField];
        const isSelected = selectedPermission === permissionID;

        return (
          <div
            className={`permission-exit-cell ${isSelected ? 'selected' : ''}`}
            style={{
              ...commonCellStyle,
              backgroundColor: isSelected ? '#d32f2f' : '#f44336',
              color: 'white',
              transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.3)' : 'none',
            }}
            onContextMenu={(e) => handleContextMenu(e, permissionID, comment, rowIndex)}
          >
            <span>{rowData[timeField]}</span>
            {hasComment && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ff5722',
                  borderRadius: '50%'
                }}
                title="Este permiso tiene un comentario"
              />
            )}
          </div>
        );
      }
      return null;
    };
  };

  const createPermissionEntryTimeTemplate = (index) => {
    return (rowData, { rowIndex }) => {
      const timeField = `permissionEntryTime${index}`;
      const idField = `permissionEntryID${index}`;
      const commentField = `permissionEntryComment${index}`;

      if (rowData[timeField]) {
        const comment = rowData[commentField] || '';
        const hasComment = comment.trim() !== '';
        const permissionID = rowData[idField];
        const isSelected = selectedPermission === permissionID;

        return (
          <div
            className={`permission-entry-cell ${isSelected ? 'selected' : ''}`}
            style={{
              ...commonCellStyle,
              backgroundColor: isSelected ? '#388e3c' : '#4caf50',
              color: 'white',
              transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isSelected ? '0 4px 8px rgba(0,0.ConcurrentModificationException0,0.3)' : 'none',
            }}
            onContextMenu={(e) => handleContextMenu(e, permissionID, comment, rowIndex)}
          >
            <span>{rowData[timeField]}</span>
          </div>
        );
      }
      return null;
    };
  };

  const dispatchingBodyTemplate = (rowData) => {
    if (rowData.dispatchingTime) {
      return (
        <div className="dispatching-cell" style={{
          ...commonCellStyle,
          backgroundColor: 'transparent',
          color: 'black',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: '150px',
          cursor: 'default'
        }}>
          {rowData.dispatchingTime}
          {rowData.dispatchingComment && (
            <span style={{
              display: 'block',
              fontSize: '0.8em',
              color: '#ff9800',
              fontWeight: 'bold',
              marginTop: '2px'
            }}>
              ({rowData.dispatchingComment})
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  const exportExcel = () => {
    const includeDispatchColumn = filteredAttendance.some(record => record.dispatchingTime);

    const exportData = filteredAttendance.map(record => {
      const baseData = {
        Item: record.item,
        Código: record.employeeID,
        Fecha: record.date,
        Nombre: record.employeeName,
        Entrada: record.entryTime || '',
      };

      for (let i = 1; i <= maxPermissionCount; i++) {
        baseData[`SP${i}`] = record[`permissionExitTime${i}`] || '';
        baseData[`RP${i}`] = record[`permissionEntryTime${i}`] || '';
        const comment = record[`permissionExitComment${i}`] || '';
        if (comment) {
            baseData[`Comentario SP${i}`] = comment;
        }
      }

      if (includeDispatchColumn) {
        baseData.Despacho = record.dispatchingTime || '';
        if (record.dispatchingComment) {
         baseData['Comentario Despacho'] = record.dispatchingComment;
        }
      }

      baseData.Salida = record.exitTime || '';
      if (record.exitComment) {
        baseData['Comentario Salida'] = record.exitComment;
      }

      return baseData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, `asistencia_${filterMode}_${selectedDate.format('YYYYMMDD')}.xlsx`);
  };

  const permissionColumns = [];
  for (let i = 1; i <= maxPermissionCount; i++) {
    permissionColumns.push(
      <Column
        key={`sp${i}`}
        field={`permissionExitTime${i}`}
        header={`SP${i}`}
        body={createPermissionExitTimeTemplate(i)}
        style={{ minWidth: '120px', textAlign: 'center' }}
      />,
      <Column
        key={`rp${i}`}
        field={`permissionEntryTime${i}`}
        header={`RP${i}`}
        body={createPermissionEntryTimeTemplate(i)}
        style={{ minWidth: '120px', textAlign: 'center' }}
      />
    );
  }

  const showDispatchColumn = filteredAttendance.some(record => record.dispatchingTime);

  return (
    <div className="main-content">
      <Toast ref={toast} />

      <OverlayPanel ref={op} showCloseIcon dismissable onHide={() => {
          if (commentSaveTimeout) clearTimeout(commentSaveTimeout);
          setCommentSaveTimeout(null);
          setCurrentPermissionID(null);
          setCurrentComment('');
          setSelectedPermission(null);
          setIsCommentTooltipVisible(false);
      }}>
        <div style={{
          minWidth: '250px',
          backgroundColor: '#ffffe0',
          border: '1px solid #ccc',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          padding: '10px'
        }}>
          <h5>{currentPermissionID ? `Comentario (Permiso ID: ${currentPermissionID})` : 'Editar Comentario'}</h5>
          <InputTextarea
            ref={commentInputRef}
            value={currentComment}
            onChange={handleCommentChange}
            onKeyDown={handleCommentKeyDown}
            rows={4}
            style={{
              width: '100%',
              marginBottom: '10px',
              border: 'none',
              background: 'transparent',
              resize: 'none',
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px'
            }}
            placeholder="Escribe tu comentario... Presiona Enter para guardar."
          />
          <div style={{ textAlign: 'right' }}>
            {savingComment && <i className="pi pi-spin pi-spinner" style={{ marginRight: '10px' }}></i>}
            <PrimeButton
              label="Guardar"
              icon="pi pi-check"
              onClick={saveComment}
              disabled={savingComment}
              style={{ fontSize: '12px' }}
            />
            <PrimeButton
              label="Cerrar"
              icon="pi pi-times"
              onClick={() => op.current.hide()}
              className="p-button-secondary"
              style={{ marginLeft: '5px', fontSize: '12px' }}
            />
          </div>
        </div>
      </OverlayPanel>

      {isCommentTooltipVisible && (
        <div
          className="comment-tooltip"
          style={{
            position: 'absolute',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            zIndex: 1000
          }}
        >
          <div className="comment-tooltip-content">
            <button
              className="comment-tooltip-button"
              onClick={(e) => {
                op.current.show(e);
                setTimeout(() => {
                  if (commentInputRef.current) {
                    commentInputRef.current.element.focus();
                  }
                }, 100);
              }}
            >
              <MapsUgcIcon style={{ fontSize: '24px', marginRight: '8px' }} />
              Comentar
            </button>
          </div>
        </div>
      )}

      <div className="date-container">
        <div className="date-controls">
          <div className="date-item">
            Mes:
            <Button variant="outlined" onClick={handleMonthClick} className="date-button">
              {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
            </Button>
            <Menu anchorEl={anchorMonth} open={Boolean(anchorMonth)} onClose={handleMonthClose}>
              {months.map((month) => (
                <MenuItem key={month.value} onClick={() => handleMonthSelect(month.value)}>
                  {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div className="date-item">
            Semana:
            <Button variant="outlined" onClick={handleWeekClick} className="date-button">
              {`Semana ${currentWeek}`}
            </Button>
            <Menu anchorEl={anchorWeek} open={Boolean(anchorWeek)} onClose={handleWeekClose}>
              {getWeeksInMonth(selectedDate.month()).map((week) => (
                <MenuItem key={week} onClick={() => handleWeekSelect(week)}>
                  {`Semana ${week}`}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div className="date-item">
            Día:
            <Button variant="outlined" onClick={handleDayClick} className="date-button">
              {`${currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1)} - ${currentDay}`}
            </Button>
            <Menu anchorEl={anchorDay} open={Boolean(anchorDay)} onClose={handleDayClose}>
              {getDaysInWeek(currentWeek).map((day) => (
                <MenuItem key={day.date()} onClick={() => handleDaySelect(day)}>
                  {`${day.format('dddd').charAt(0).toUpperCase() + day.format('dddd').slice(1)} - ${day.format('D')}`}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </div>

      <div className="empleados-registrados-container">
        <span className="icon">👥</span>
        <span id="empleadosRegistradosLabel">
          {loading ? 'Cargando...' : `${filteredAttendance.length} registros encontrados`}
        </span>
      </div>

      <br />

      <div className="table-emp">
        <DataTable
          ref={dt}
          value={filteredAttendance}
          size="small"
          showGridlines
          paginator
          rows={15}
          rowsPerPageOptions={[15, 30, 50]}
          tableStyle={{ minWidth: '70rem' }}
          loading={loading}
          emptyMessage="No se encontraron registros de asistencia."
          scrollable
          scrollHeight="flex"
          header={(
            <div className="table-header" style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <label htmlFor="busqueda" style={{
                  marginRight: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  Buscar Empleado:
                </label>
                <input
                  type="text"
                  id="busqueda"
                  placeholder="Nombre o código..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    width: '250px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    color: '#333',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              <div>
                <PrimeButton
                  icon="pi pi-file-excel"
                  className="p-button-success circular-button"
                  onClick={exportExcel}
                  tooltipOptions={{ position: 'top' }}
                  disabled={loading || filteredAttendance.length === 0}
                />
              </div>
            </div>
          )}
          autoLayout={true}
        >
          <Column field="item" header="Item" sortable style={{ minWidth: '60px' }} />
          <Column field="employeeID" header="Código" sortable style={{ minWidth: '80px' }} />
          <Column field="date" header="Fecha" sortable style={{ minWidth: '120px' }} />
          <Column field="employeeName" header="Nombre" sortable style={{ minWidth: '250px' }} />
          <Column field="entryTime" header="Entrada" sortable style={{ minWidth: '120px', textAlign: 'center' }} />
          {permissionColumns}
          {showDispatchColumn && (
            <Column
              field="dispatchingTime"
              header="Despacho"
              body={dispatchingBodyTemplate}
              sortable
              style={{ minWidth: '150px', textAlign: 'center' }}
            />
          )}
          <Column field="exitTime" header="Salida" body={exitTimeBodyTemplate} sortable style={{ minWidth: '120px', textAlign: 'center' }} />
        </DataTable>
      </div>
    </div>
  );
};

export default RecordAttendance;