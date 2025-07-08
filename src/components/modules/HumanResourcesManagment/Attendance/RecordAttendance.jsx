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
import { saveAs } from 'file-saver';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
// NUEVO: Importar socket.io-client
import io from 'socket.io-client';
import { NavLink, useLocation, useNavigate } from "react-router";
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormURIE from '../Attendance/FormURIE';
import { createPortal } from 'react-dom'; // ✅ 1. IMPORTACIÓN AÑADIDA
import { InputText } from 'primereact/inputtext'; // Añadido para el editor de celdas

dayjs.locale('es');
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

// NUEVO: Definir la URL del servidor Socket.IO
const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL_SOCKET; // Ajusta según tu configuración

const RecordAttendance = () => {
  // NUEVO: Hooks para manejar la navegación
  const location = useLocation();
  const navigate = useNavigate();
  
  // NUEVO: Estado para controlar qué vista mostrar basado en la ruta
  const [activeView, setActiveView] = useState('recordattendance');

  // Estados originales
  const [selectedDate, setSelectedDate] = useState(dayjs);
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

  // NUEVO: Referencia para el socket
  const socketRef = useRef(null);

  const dt = useRef(null);
  const toast = useRef(null);
  const commentInput = useRef(null);
  const op = useRef(null);

  const months = Array.from({ length: 12 }, (_, i) => ({
    name: dayjs().month(i).format('MMMM'),
    value: i,
  }));

  // NUEVO: Efecto para detectar cambios de ruta y actualizar la vista
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('/app/recordattendance')) {
      setActiveView('recordattendance');
    } else if (currentPath.includes('/app/FormURIE')) {
      setActiveView('formurie');
    }
  }, [location.pathname]);

  // NUEVO: Función para manejar clics en NavLink
  const handleNavLinkClick = (event, path) => {
    event.preventDefault(); // Prevenir la navegación por defecto
    
    // Actualizar la URL sin recargar la página
    // navigate(path, { replace: true });
    
    // Actualizar el estado basado en la ruta
    if (path.includes('/app/recordattendance')) {
      setActiveView('recordattendance');
    } else if (path.includes('/app/FormURIE')) {
      setActiveView('formurie');
    }
  };

  // NUEVO: Configurar la conexión de Socket.IO
  useEffect(() => {
    // Conectar al servidor Socket.IO
    socketRef.current = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Manejar conexión exitosa
    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor Socket.IO');
    });

    // Escuchar nuevos registros de asistencia
    socketRef.current.on('newAttendanceRecord', (data) => {
      console.log('Nuevo marcaje recibido:', data);
      const { record, type } = data;

      // Verificar si el registro corresponde a la fecha seleccionada según el modo de filtro
      let shouldUpdate = false;
      const recordDate = dayjs(record.date);
      if (filterMode === 'day' && recordDate.isSame(selectedDate, 'day')) {
        shouldUpdate = true;
      } else if (filterMode === 'week' && recordDate.isSame(selectedDate, 'week')) {
        shouldUpdate = true;
      } else if (filterMode === 'month' && recordDate.isSame(selectedDate, 'month')) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setEmployeeAttendance((prevAttendance) => {
          // Buscar si el empleado ya existe en la lista
          const existingIndex = prevAttendance.findIndex(
            (item) => item.employeeID === record.employeeID && item.date === record.date
          );

          if (existingIndex !== -1) {
            // Actualizar el registro existente
            const updatedAttendance = [...prevAttendance];
            updatedAttendance[existingIndex] = {
              ...updatedAttendance[existingIndex],
              ...record,
              item: updatedAttendance[existingIndex].item, // Mantener el número de item
            };
            return updatedAttendance;
          } else {
            // Agregar nuevo registro y reordenar
            const updatedAttendance = [
              ...prevAttendance,
              {
                ...record,
                item: 0, // Placeholder, se reasignará después de ordenar
              },
            ];

            // Ordenar por employeeID y luego por entryTime
            updatedAttendance.sort((a, b) => {
              if (a.employeeID !== b.employeeID) {
                return a.employeeID - b.employeeID;
              }
              // Convertir entryTime a objetos Date para una comparación precisa
              const timeA = new Date(`2000/01/01 ${a.entryTime}`);
              const timeB = new Date(`2000/01/01 ${b.entryTime}`);
              return timeA.getTime() - timeB.getTime();
            });

            // Reasignar números de item
            return updatedAttendance.map((item, index) => ({
              ...item,
              item: index + 1,
            }));
          }
        });

        // Mostrar notificación
        toast.current.show({
          severity: 'info',
          summary: 'Nuevo Marcaje',
          detail: `Se registró un marcaje de tipo ${type} para ${record.employeeName}`,
          life: 3000,
        });
      }
    });

    // Manejar errores de conexión
    socketRef.current.on('connect_error', (error) => {
      console.error('Error de conexión con Socket.IO:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error de Conexión',
        detail: 'No se pudo conectar al servidor de marcajes en tiempo real. Intentando reconectar...',
        life: 5000,
      });
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      socketRef.current.disconnect();
      console.log('Desconectado del servidor Socket.IO');
    };
  }, [selectedDate, filterMode]); // Dependencias para manejar cambios en la fecha o modo de filtro

  // useEffect inicial - solo se ejecuta una vez
  useEffect(() => {
    fetchAttendanceData(selectedDate.format("YYYY-MM-DD"));
  }, []);

  // Función mejorada para obtener datos con indicador de actualización
  const fetchAttendanceData = async (specificDate = null, startDate = null, endDate = null) => {
    setLoading(true);

    const params = {};
    if (specificDate) params.specificDate = specificDate;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    console.log('Fetching data with params:', params);

    try {
      const response = await apipms.get('/attendance', { params });
      console.log('Raw response data:', response.data);

      const dataWithItem = response.data.map((row, index) => ({
        ...row,
        item: index + 1,
      }));

      const normalizedData = dataWithItem.map(row => ({
        ...row,
        date: row.date || '',
        employeeID: row.employeeID || '',
        employeeName: row.employeeName || '',
        entryTime: row.entryTime || '',
        exitTime: row.exitTime || '',
        dispatchingTime: row.dispatchingTime || '',
        dispatchingComment: row.dispatchingComment || '',
        totalPermissions: row.totalPermissions || 0,
        exitComment: row.exitComment || '',
        ...(Array.from({ length: 5 }, (_, i) => ({
          [`permissionExitTime${i + 1}`]: row[`permissionExitTime${i + 1}`] || '',
          [`permissionEntryTime${i + 1}`]: row[`permissionEntryTime${i + 1}`] || '',
          [`permissionExitComment${i + 1}`]: row[`permissionExitComment${i + 1}`] || '',
          [`permissionEntryComment${i + 1}`]: row[`permissionEntryComment${i + 1}`] || '',
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {})),
      }));

      setEmployeeAttendance(normalizedData);
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar la asistencia',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para aplicar filtros
  const applyFilters = (data, date, mode, term) => {
    let filtered = [...data];

    if (term) {
      filtered = filtered.filter(employee =>
        employee.employeeName.toLowerCase().includes(term.toLowerCase()) ||
        employee.employeeID.toString().includes(term)
      );
    }

    let maxCount = 0;
    filtered.forEach(row => {
      for (let i = 1; i <= 5; i++) {
        if (row[`permissionExitTime${i}`] || row[`permissionEntryTime${i}`]) {
          maxCount = Math.max(maxCount, i);
        }
      }
    });
    setMaxPermissionCount(maxCount);
    setFilteredAttendance(filtered);
  };

  // useEffect para aplicar filtros de búsqueda
  useEffect(() => {
    applyFilters(employeeAttendance, selectedDate, filterMode, searchTerm);
  }, [searchTerm, employeeAttendance]);

  // Función para refresh manual
  const handleManualRefresh = () => {
    switch (filterMode) {
      case 'day':
        fetchAttendanceData(selectedDate.format('YYYY-MM-DD'));
        break;
      case 'week':
        const weekStart = selectedDate.startOf('isoWeek').format('YYYY-MM-DD');
        const weekEnd = selectedDate.endOf('isoWeek').format('YYYY-MM-DD');
        fetchAttendanceData(null, weekStart, weekEnd);
        break;
      case 'month':
        const monthStart = selectedDate.startOf('month').format('YYYY-MM-DD');
        const monthEnd = selectedDate.endOf('month').format('YYYY-MM-DD');
        fetchAttendanceData(null, monthStart, monthEnd);
        break;
    }
  };

  const currentMonth = selectedDate.format('MMMM');
  const currentWeek = selectedDate.week();
  const currentDay = selectedDate.format('D');
  const currentDayName = selectedDate.format('dddd');

  const getWeeksInMonth = month => {
    const startOfMonth = selectedDate.month(month).startOf('month');
    const endOfMonth = selectedDate.month(month).endOf('month');
    const weeks = new Set();
    let current = startOfMonth;

    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
      const weekNum = current.week();
      weeks.add(weekNum);
      current = current.add(1, 'day');
    }
    return Array.from(weeks).sort((a, b) => a - b);
  };

  const getDaysInWeek = weekNum => {
    const startOfYear = dayjs('2025-01-01');
    const startOfWeek = startOfYear.startOf('isoWeek').add(weekNum - 1, 'week');
    const days = [];
    let mixedMonths = false;
    let monthCounts = {};

    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day');
      days.push(day);
      const monthName = day.format('MMMM');
      monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
    }

    if (Object.keys(monthCounts).length > 1) {
      mixedMonths = true;
    }

    const dominantMonth = Object.keys(monthCounts).reduce((a, b) =>
      monthCounts[a] > monthCounts[b] ? a : b
    );

    const dominantMonthIndex = months.findIndex(m => m.name === dominantMonth);

    return {
      days,
      mixedMonths,
      dominantMonthIndex: dominantMonthIndex >= 0 ? dominantMonthIndex : 0
    };
  };

  const handleMonthClick = event => setAnchorMonth(event.currentTarget);
  const handleMonthClose = () => setAnchorMonth(null);
  const handleWeekClick = event => setAnchorWeek(event.currentTarget);
  const handleWeekClose = () => setAnchorWeek(null);
  const handleDayClick = event => setAnchorDay(event.currentTarget);
  const handleDayClose = () => setAnchorDay(null);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  // Funciones mejoradas de selección
  const handleWeekSelect = weekNum => {
    const { days } = getDaysInWeek(weekNum);
    const startOfWeek = days[0];
    const endOfWeek = days[6];

    setFilterMode('week');
    setSelectedDate(startOfWeek);

    fetchAttendanceData(null, startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));
    handleWeekClose();
  };

  const handleMonthSelect = monthIndex => {
    const startOfMonth = selectedDate.month(monthIndex).startOf('month');
    const endOfMonth = selectedDate.month(monthIndex).endOf('month');

    setFilterMode('month');
    setSelectedDate(startOfMonth);

    fetchAttendanceData(null, startOfMonth.format('YYYY-MM-DD'), endOfMonth.format('YYYY-MM-DD'));
    handleMonthClose();
  };

  const handleDaySelect = day => {
    setFilterMode('day');
    setSelectedDate(day);

    fetchAttendanceData(day.format('YYYY-MM-DD'));
    handleDayClose();
  };

  // MODIFICADO: Función para manejar el menú contextual y posicionar el tooltip correctamente
  const handleContextMenu = (event, permissionID, comment, rowIndex, permissionIndex, type) => {
    event.preventDefault();
    event.stopPropagation();
    // Obtener la posición del elemento que se hizo clic
    const cellElement = event.currentTarget;
    const cellRect = cellElement.getBoundingClientRect();
    // Calcular la posición del tooltip relativa a la ventana
    const top = cellRect.top + (cellRect.height / 2);
    const left = cellRect.right + 10;
    setTooltipPosition({ top, left });
    setTooltipRowIndex(rowIndex);
    // Si es un permiso de entrada (RP), usar el ID del permiso de salida correspondiente
    if (type === 'entry' && permissionIndex) {
      const rowData = filteredAttendance[rowIndex];
      const exitPermissionID = rowData[`permissionExitID${permissionIndex}`];
      const exitComment = rowData[`permissionExitComment${permissionIndex}`];
      setCurrentPermissionID(exitPermissionID);
      setCurrentComment(exitComment || '');
      setSelectedPermission(exitPermissionID);
    } else {
      setCurrentPermissionID(permissionID);
      setCurrentComment(comment || '');
      setSelectedPermission(permissionID);
    }

    setIsCommentTooltipVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = event => {
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

  const handleCommentChange = e => {
    setCurrentComment(e.target.value);
  };

  const handleCommentKeyDown = e => {
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

  const saveComment = async () => {
    if (!currentPermissionID) {
      console.warn('Attempting to save comment without permissionID');
      return;
    }

    if (commentSaveTimeout) {
      clearTimeout(commentSaveTimeout);
      setCommentSaveTimeout(null);
    }

    setSavingComment(true);

    try {
      await apipms.post('/attendance/updatePermissionComment', {
        permissionID: currentPermissionID,
        comment: currentComment,
      });

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

      toast.current.show({
        severity: 'success',
        summary: 'Guardado',
        detail: 'Comentario guardado correctamente.',
        life: 2000,
      });
      op.current.hide();
      setSelectedPermission(null);
      setIsCommentTooltipVisible(false);
    } catch (error) {
      console.error('Error saving comment:', error.response?.data || error.message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar el comentario.',
        life: 3000,
      });
    } finally {
      setSavingComment(false);
    }
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

  // Editor para las celdas de tiempo
  const timeEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  // Plantilla para exitTime con edición
  const exitTimeBodyTemplate = (rowData, { rowIndex }) => {
    if (!rowData.exitTime) return null;
    const hasComment = (rowData.exitComment || '').trim() !== '';
    const permissionID = rowData.exitPermissionID || `exit_${rowData.item}`;
    return (
      <div className="exit-time-cell" style={{ ...commonCellStyle, backgroundColor: hasComment ? '#ff9800' : 'transparent', color: hasComment ? 'white' : 'black' }} onContextMenu={e => handleContextMenu(e, permissionID, rowData.exitComment, rowIndex)}>
        <span>{rowData.exitTime}</span>
        {hasComment && <div style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#ff5722', borderRadius: '50%' }} title="Tiene comentario" />}
      </div>
    );
  };

  // Plantilla para permissionExitTime con edición
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
            onContextMenu={e => handleContextMenu(e, permissionID, comment, rowIndex, index, 'exit')}
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
                  borderRadius: '50%',
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

  // Plantilla para permissionEntryTime con edición
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
              backgroundColor: isSelected ? '#1976d2' : '#2196f3',
              color: 'white',
              transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.3)' : 'none',
            }}
            onContextMenu={e => handleContextMenu(e, permissionID, comment, rowIndex)}
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
                  borderRadius: '50%',
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

  // Plantilla para entryTime con edición
  const entryTimeBodyTemplate = (rowData) => {
    return <span>{rowData.entryTime}</span>;
  };

  // Función para manejar la finalización de la edición de celdas
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, rowIndex } = e;

    // Actualizar el estado con el nuevo valor
    const updatedAttendance = [...employeeAttendance];
    updatedAttendance[rowIndex] = { ...rowData, [field]: newValue };
    setEmployeeAttendance(updatedAttendance);

    // Aquí podrías agregar una llamada API para guardar el cambio en el servidor si es necesario
    console.log(`Celda editada: ${field} = ${newValue} en fila ${rowIndex}`);
  };

  const dispatchingBodyTemplate = (rowData) => {
    if (rowData.dispatchingTime) {
      return (
        <div
          style={{
            ...commonCellStyle,
            backgroundColor: 'transparent',
            color: 'black',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '150px',
            cursor: 'default',
          }}
        >
          {rowData.dispatchingTime}
          {rowData.dispatchingComment && (
            <span
              style={{
                display: 'block',
                fontSize: '0.8em',
                color: '#ff9800',
                fontWeight: 'bold',
                marginTop: '2px',
              }}
            >
              ({rowData.dispatchingComment})
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  const exportExcel = async () => {
    try {
      setLoading(true);
      console.log('Exporting Excel with payload:', {
        filteredAttendance: JSON.stringify(filteredAttendance, null, 2),
        maxPermissionCount,
        filterMode,
        selectedDate: selectedDate.format('YYYY-MM-DD'),
      });
      const response = await apipms.post(
        '/exportattendance',
        {
          filteredAttendance,
          maxPermissionCount,
          filterMode,
          selectedDate: selectedDate.format('YYYY-MM-DD'),
        },
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const formattedDate = selectedDate.format('YYYYMMDD');
      saveAs(blob, `attendance_${filterMode}_${formattedDate}.xlsx`);

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Archivo Excel exportado correctamente.',
        life: 3000,
      });
    } catch (error) {
      console.error('Error exporting Excel:', error.response?.data?.message || error.message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'No se pudo exportar el archivo Excel.',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const exportWeeklyExcel = async () => {
    try {
      setLoading(true);

      const weekStart = selectedDate.startOf('isoWeek').format('YYYY-MM-DD');
      const weekEnd = selectedDate.endOf('isoWeek').format('YYYY-MM-DD');
      const currentMonthNum = selectedDate.format('M');
      const currentWeekNum = selectedDate.week();

      console.log('Fetching weekly data for export:', { startDate: weekStart, endDate: weekEnd });
      const response = await apipms.get('/attendance', {
        params: { startDate: weekStart, endDate: weekEnd },
      });
      const weeklyData = response.data;

      const uniqueEmployees = Array.from(
        new Set(weeklyData.map(record => record.employeeID))
      ).map(employeeID => {
        const record = weeklyData.find(r => r.employeeID === employeeID);
        return {
          employeeID: record.employeeID,
          employeeName: record.employeeName,
        };
      });

      let maxCount = 0;
      weeklyData.forEach(row => {
        for (let i = 1; i <= 5; i++) {
          if (row[`permissionExitTime${i}`] || row[`permissionEntryTime${i}`]) {
            maxCount = Math.max(maxCount, i);
          }
        }
      });

      console.log('Weekly export payload:', {
        weeklyAttendance: weeklyData.slice(0, 5),
        activeEmployees: uniqueEmployees,
        maxPermissionCount: maxCount,
        selectedMonth: currentMonthNum,
        selectedWeek: currentWeekNum.toString(),
      });

      const exportResponse = await apipms.post(
        '/exportattendance/exportweeklyattendance',
        {
          weeklyAttendance: weeklyData,
          activeEmployees: uniqueEmployees,
          maxPermissionCount: maxCount,
          selectedMonth: currentMonthNum,
          selectedWeek: currentWeekNum.toString(),
        },
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([exportResponse.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, `weekly_attendance_month_${currentMonthNum}_week_${currentWeekNum}.xlsx`);

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Reporte semanal exportado correctamente.',
        life: 3000,
      });
    } catch (error) {
      console.error('Error exporting weekly Excel:', error.response?.data?.message || error.message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'No se pudo exportar el reporte semanal.',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const permissionColumns = [];
  for (let i = 1; i <= maxPermissionCount; i++) {
    permissionColumns.push(
      <Column
        key={`sp${i}`}
        field={`permissionExitTime${i}`}
        header={`SP${i}`}
        body={createPermissionExitTimeTemplate(i)}
        editor={(options) => timeEditor(options)}
        style={{ minWidth: '120px', textAlign: 'center' }}
      />,
      <Column
        key={`rp${i}`}
        field={`permissionEntryTime${i}`}
        header={`RP${i}`}
        body={createPermissionEntryTimeTemplate(i)}
        editor={(options) => timeEditor(options)}
        style={{ minWidth: '120px', textAlign: 'center' }}
      />
    );
  }

  const showDispatchColumn = filteredAttendance.some(record => record.dispatchingTime);

  // NUEVO: Componente para renderizar el contenido de Record Attendance
  const renderRecordAttendanceContent = () => (
    <div className="main-content">
      <Toast ref={toast} />

      <OverlayPanel
        ref={op}
        showCloseIcon
        dismissable
        onHide={() => {
          if (commentSaveTimeout) clearTimeout(commentSaveTimeout);
          setCommentSaveTimeout(null);
          setCurrentPermissionID(null);
          setCurrentComment('');
          setSelectedPermission(null);
          setIsCommentTooltipVisible(false);
        }}
      >
        <div
          style={{
            minWidth: '250px',
            backgroundColor: '#ffffe0',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            padding: '10px',
          }}
        >
          <h5>{currentPermissionID ? `Comentario (Permiso ID: ${currentPermissionID})` : 'Editar Comentario'}</h5>
          <InputTextarea
            ref={commentInput}
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
              fontSize: '12px',
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

      
      {/* ✅ 3. TOOLTIP ENVUELTO EN UN PORTAL */}
      {isCommentTooltipVisible && createPortal(
        <div className="comment-tooltip" style={{ position: 'fixed', top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px`, transform: 'translateY(-50%)', zIndex: 9999 }}>
          <div className="comment-tooltip-content">
            <button className="comment-tooltip-button" onClick={e => { op.current.show(e); setTimeout(() => { if (commentInput.current) commentInput.current.element.focus(); }, 100); }}>
              <MapsUgcIcon style={{ fontSize: '24px', marginRight: '8px' }} />
              Comentar
            </button>
          </div>
        </div>,
        document.body
      )}

      <div className="date-container">
        <div className="date-controls">
          <div className="date-item">
            Mes:
            <Button variant="outlined" onClick={handleMonthClick} className="date-button">
              {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
            </Button>
            <Menu anchorEl={anchorMonth} open={Boolean(anchorMonth)} onClose={handleMonthClose}>
              {months.map(month => (
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
              {getWeeksInMonth(selectedDate.month()).map(week => {
                const { days, mixedMonths } = getDaysInWeek(week);
                return (
                  <MenuItem
                    key={week}
                    onClick={() => handleWeekSelect(week)}
                    style={{ backgroundColor: mixedMonths ? '#fff3e0' : 'inherit' }}
                  >
                    {`Semana ${week}`} {mixedMonths && '(Mezcla de meses)'}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
          <div className="date-item">
            Día:
            <Button variant="outlined" onClick={handleDayClick} className="date-button">
              {`${currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1)} - ${currentDay}`}
            </Button>
            <Menu anchorEl={anchorDay} open={Boolean(anchorDay)} onClose={handleDayClose}>
              {getDaysInWeek(currentWeek).days.map(day => (
                <MenuItem key={day.date()} onClick={() => handleDaySelect(day)}>
                  {`${day.format('dddd').charAt(0).toUpperCase() + day.format('dddd').slice(1)} - ${day.format('D')}`}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </div>

      <div className="empleados-registrados-container">
        <PeopleAltIcon ></PeopleAltIcon>
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
          rows={12}
          rowsPerPageOptions={[12, 30, 50]}
          tableStyle={{ minWidth: '70rem' }}
          loading={loading}
          emptyMessage="No se encontraron registros de asistencia."
          scrollable
          scrollHeight="flex"
          header={
            <div
              className="table-header"
              style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
            >
              <div>
                <label
                  htmlFor="busqueda"
                  style={{
                    marginRight: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                  }}
                >
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
                  onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <PrimeButton
                  icon="pi pi-file-excel"
                  className="p-button-success circular-button"
                  onClick={exportExcel}
                  tooltipOptions={{ position: 'top' }}
                  disabled={loading || filteredAttendance.length === 0}
                  style={{ marginRight: '10px' }}
                />
                <PrimeButton
                  icon="pi pi-calendar"
                  className="p-button-info circular-button"
                  onClick={exportWeeklyExcel}
                  tooltipOptions={{ position: 'top' }}
                  disabled={loading}
                />
              </div>
            </div>
          }
          autoLayout={true}
          editMode="cell"
          onCellEditComplete={onCellEditComplete}
        >
          <Column field="item" header="Item" sortable style={{ minWidth: '60px' }} />
          <Column field="employeeID" header="Código" sortable style={{ minWidth: '80px' }} />
          <Column field="date" header="Fecha" sortable style={{ minWidth: '120px' }} />
          <Column field="employeeName" header="Nombre" sortable style={{ minWidth: '250px' }} />
          <Column 
            field="entryTime" 
            header="Entrada" 
            body={entryTimeBodyTemplate} 
            editor={(options) => timeEditor(options)} 
            sortable 
            style={{ minWidth: '120px', textAlign: 'center' }} 
          />
          {permissionColumns}
          {showDispatchColumn && (
            <Column
              field="dispatchingTime"
              header="Despacho"
              body={dispatchingBodyTemplate}
              editor={(options) => timeEditor(options)}
              sortable
              style={{ minWidth: '150px', textAlign: 'center' }}
            />
          )}
          <Column 
            field="exitTime" 
            header="Salida" 
            body={exitTimeBodyTemplate} 
            editor={(options) => timeEditor(options)} 
            sortable 
            style={{ minWidth: '120px', textAlign: 'center' }} 
          />
        </DataTable>
      </div>
    </div>
  );

  return (
    <>
      {/* MODIFICADO: NavLink con interceptación de clics */}
      <div className="navigation-container">
        <NavLink
          to="/app/recordattendance"
          className={`navrecordattendance ${activeView === 'recordattendance' ? 'active' : ''}`}
          onClick={(e) => handleNavLinkClick(e, '/app/recordattendance')}
        >
          <PeopleAltIcon style={{ fontSize: '18px' }} />
          Record Attendance
        </NavLink>

        <NavLink
          to="/app/FormURIE"
          className={`navformurie ${activeView === 'formurie' ? 'active' : ''}`}
          onClick={(e) => handleNavLinkClick(e, '/app/FormURIE')}
        >
          <AddAlarmIcon style={{ fontSize: '18px' }} />
          Add Time
        </NavLink>
      </div>

      {/* NUEVO: Contenedor con animaciones para el contenido */}
      <div className="content-container">
        <div className={`content-view ${activeView === 'recordattendance' ? 'active' : ''}`}>
          {renderRecordAttendanceContent()}
        </div>
        <div className={`content-view ${activeView === 'formurie' ? 'active' : ''}`}>
          <FormURIE />
        </div>
      </div>
    </>
  );
};

export default RecordAttendance;