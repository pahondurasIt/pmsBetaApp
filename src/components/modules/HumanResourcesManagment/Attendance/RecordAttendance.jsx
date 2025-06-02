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
// Importar componentes necesarios para exportación Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

dayjs.locale('es');
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const RecordAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [anchorMonth, setAnchorMonth] = useState(null);
  const [anchorWeek, setAnchorWeek] = useState(null);
  const [anchorDay, setAnchorDay] = useState(null);

  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para rastrear el número máximo de permisos encontrados (hasta 5)
  const [maxPermissionCount, setMaxPermissionCount] = useState(0);
  
  // Estado para rastrear el modo de filtrado (día, semana, mes)
  const [filterMode, setFilterMode] = useState('day'); // Puede ser 'day', 'week', o 'month'
  
  // Referencia para el componente DataTable (necesario para exportación)
  const dt = useRef(null);

  useEffect(() => {
    fetchAttendanceData(selectedDate.format('YYYY-MM-DD'));
    setFilterMode('day'); // Por defecto, filtrar por día al cargar
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
        
        // Determinar el número máximo de permisos en los datos (hasta 5)
        let maxCount = 0;
        dataWithItem.forEach(row => {
          // Si el backend proporciona totalPermissions, usarlo
          if (row.totalPermissions) {
            maxCount = Math.max(maxCount, Math.min(row.totalPermissions, 5));
          } else {
            // De lo contrario, contar manualmente buscando permissionExitTime1, permissionExitTime2, etc.
            for (let i = 1; i <= 5; i++) {
              if (row[`permissionExitTime${i}`] || row[`permissionEntryTime${i}`]) {
                maxCount = Math.max(maxCount, i);
              }
            }
          }
        });
        
        setMaxPermissionCount(maxCount);
        setEmployeeAttendance(dataWithItem);
        applyFilters(dataWithItem); // Aplicar filtros después de obtener los datos
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Función para aplicar filtros según el modo y el término de búsqueda
  const applyFilters = (data) => {
    let filtered = [...data];

    // Filtrar por fecha según el modo
    if (filterMode === 'day') {
      const selectedDateStr = selectedDate.format('YYYY-MM-DD');
      filtered = filtered.filter((record) => record.date === selectedDateStr);
    } else if (filterMode === 'week') {
      const startOfWeek = selectedDate.startOf('isoWeek').format('YYYY-MM-DD');
      const endOfWeek = selectedDate.endOf('isoWeek').format('YYYY-MM-DD');
      filtered = filtered.filter((record) => record.date >= startOfWeek && record.date <= endOfWeek);
    } else if (filterMode === 'month') {
      const startOfMonth = selectedDate.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = selectedDate.endOf('month').format('YYYY-MM-DD');
      filtered = filtered.filter((record) => record.date >= startOfMonth && record.date <= endOfMonth);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((employee) =>
        employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeID.toString().includes(searchTerm)
      );
    }
    
    // Recalcular el número máximo de permisos en los datos filtrados
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

  // Actualizar filtros cuando cambie el término de búsqueda
  useEffect(() => {
    applyFilters(employeeAttendance);
  }, [searchTerm, employeeAttendance, filterMode, selectedDate]);

  const currentMonth = selectedDate.format('MMMM');
  const currentWeek = selectedDate.isoWeek();
  const currentDay = selectedDate.format('D');
  const currentDayName = selectedDate.format('dddd');

  const getWeeksInMonth = (month) => {
    const startOfMonth = selectedDate.month(month).startOf('month');
    const endOfMonth = selectedDate.month(month).endOf('month');
    const weeks = new Set();
    let current = startOfMonth;
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
      const weekNum = current.isoWeek();
      if (current.month() === month) {
        weeks.add(weekNum);
      }
      current = current.add(1, 'day');
    }
    return Array.from(weeks).sort((a, b) => a - b);
  };

  const getDaysInWeek = (week) => {
    const startOfYear = selectedDate.startOf('year');
    const startOfWeek = startOfYear.isoWeek(week).startOf('isoWeek');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day');
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
    fetchAttendanceData(null, startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));
    setSelectedDate(startOfWeek);
    setFilterMode('week'); // Cambiar el modo de filtrado a semana
    handleWeekClose();
  };

  const handleMonthSelect = (monthIndex) => {
    const startOfMonth = selectedDate.month(monthIndex).startOf('month');
    const endOfMonth = selectedDate.month(monthIndex).endOf('month');
    fetchAttendanceData(null, startOfMonth.format('YYYY-MM-DD'), endOfMonth.format('YYYY-MM-DD'));
    setSelectedDate(startOfMonth);
    setFilterMode('month'); // Cambiar el modo de filtrado a mes
    handleMonthClose();
  };

  const handleDaySelect = (day) => {
    setSelectedDate(day);
    fetchAttendanceData(day.format('YYYY-MM-DD'));
    setFilterMode('day'); // Cambiar el modo de filtrado a día
    handleDayClose();
  };

  // Template para la columna de salida
  const exitTimeBodyTemplate = (rowData) => {
    if (rowData.exitTime) {
      return rowData.exitTime;
    }
    return null;
  };

  // Función para crear un template para la columna SP (Salida de Permiso) con índice específico
  const createPermissionExitTimeTemplate = (index) => {
    return (rowData) => {
      const fieldName = `permissionExitTime${index}`;
      if (rowData[fieldName]) {
        // Aplicar estilo de fondo azul a toda la celda
        return (
          <div className="permission-exit-cell">
            {rowData[fieldName]}
          </div>
        );
      }
      return null;
    };
  };

  // Función para crear un template para la columna RP (Regreso de Permiso) con índice específico
  const createPermissionEntryTimeTemplate = (index) => {
    return (rowData) => {
      const fieldName = `permissionEntryTime${index}`;
      if (rowData[fieldName]) {
        // Aplicar estilo de fondo verde a toda la celda
        return (
          <div className="permission-entry-cell">
            {rowData[fieldName]}
          </div>
        );
      }
      return null;
    };
  };

  // Función para exportar a Excel
  const exportExcel = () => {
    // Preparar los datos para exportación
    const exportData = filteredAttendance.map(record => {
      // Crear un objeto base con las columnas estándar
      const baseData = {
        Item: record.item,
        Código: record.employeeID,
        Fecha: record.date,
        Nombre: record.employeeName,
        Entrada: record.entryTime || '',
        Salida: record.exitTime || ''
      };
      
      // Agregar columnas de permisos dinámicamente
      for (let i = 1; i <= maxPermissionCount; i++) {
        baseData[`SP${i}`] = record[`permissionExitTime${i}`] || '';
        baseData[`RP${i}`] = record[`permissionEntryTime${i}`] || '';
      }
      
      return baseData;
    });
    
    // Crear una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');
    
    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Guardar el archivo
    const fileName = `Asistencia_${selectedDate.format('YYYY-MM-DD')}.xlsx`;
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  // Generar las columnas dinámicamente, incluyendo múltiples columnas SP/RP según maxPermissionCount
  const generateColumns = () => {
    const columns = [
      <Column key="item" field="item" header="Item" style={{ width: '5%' }} />,
      <Column key="employeeID" field="employeeID" header="Código" style={{ width: '8%' }} />,
      <Column key="date" field="date" header="Fecha" style={{ width: '12%' }} />,
      <Column key="employeeName" field="employeeName" header="Nombre" style={{ width: '25%' }} />,
      <Column key="entryTime" field="entryTime" header="Entrada" style={{ width: '15%' }} />,
      <Column 
        key="exitTime"
        header="Salida" 
        body={exitTimeBodyTemplate}
        style={{ width: '15%' }}
      />
    ];

    // Agregar columnas SP1, RP1, SP2, RP2, etc. según maxPermissionCount (hasta 5)
    for (let i = 1; i <= maxPermissionCount; i++) {
      // Agregar columna SPx
      columns.push(
        <Column 
          key={`permissionExitTime${i}`}
          header={`SP${i}`} 
          body={createPermissionExitTimeTemplate(i)}
          style={{ width: '8%', textAlign: 'center' }}
          headerStyle={{ textAlign: 'center', fontWeight: 'bold' }}
        />
      );
      
      // Agregar columna RPx
      columns.push(
        <Column 
          key={`permissionEntryTime${i}`}
          header={`RP${i}`} 
          body={createPermissionEntryTimeTemplate(i)}
          style={{ width: '8%', textAlign: 'center' }}
          headerStyle={{ textAlign: 'center', fontWeight: 'bold' }}
        />
      );
    }

    return columns;
  };

  // Componente para el encabezado de la tabla con botón de exportación
  const tableHeader = (
    <div className="table-header">
      <PrimeButton 
        label="Exportar a Excel" 
        icon="pi pi-file-excel" 
        className="p-button-success" 
        onClick={exportExcel} 
      />
    </div>
  );

  return (
    <div className="main-content">
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

      <div className="busqueda-container">
        <input
          type="text"
          id="busqueda"
          placeholder="Buscar empleado por nombre o código..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
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
          header={tableHeader}
        >
          {/* Renderizar columnas dinámicamente */}
          {generateColumns()}
        </DataTable>
      </div>
    </div>
  );
};

export default RecordAttendance;
