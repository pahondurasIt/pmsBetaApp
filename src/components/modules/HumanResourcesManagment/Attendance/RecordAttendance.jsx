import React, { useState, useEffect } from 'react';
import '../../../css/RecordAttendance.css';
import { apipms } from '../../../../service/apipms';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Button, Menu, MenuItem, Chip } from '@mui/material'; // Añadir Chip
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

/* Importar tablas */
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Configurar el idioma español y los plugins de dayjs
dayjs.locale('es');
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

// Componente principal
const RecordAttendance = () => {
  // Estado para manejar las fechas y los menús desplegables
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Usar fecha actual por defecto
  const [anchorMonth, setAnchorMonth] = useState(null);
  const [anchorWeek, setAnchorWeek] = useState(null);
  const [anchorDay, setAnchorDay] = useState(null);

  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Estado para indicar carga

  // Efecto para obtener los datos de asistencia según la fecha seleccionada
  useEffect(() => {
    fetchAttendanceData(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  // Función para obtener datos de asistencia
  const fetchAttendanceData = (specificDate = null, startDate = null, endDate = null) => {
    setLoading(true);
    const params = {};
    if (specificDate) params.specificDate = specificDate;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    apipms.get('/attendance', { params })
      .then((response) => {
        // Asegurarse de que hasPermissionExit sea booleano o 0/1
        const dataWithItem = response.data.map((row, index) => ({
          ...row,
          item: index + 1,
          // Convertir explícitamente a booleano si es necesario (depende de cómo lo devuelva la BD/backend)
          hasPermissionExit: !!row.hasPermissionExit 
        }));
        setEmployeeAttendance(dataWithItem);
        setFilteredAttendance(dataWithItem); // Inicialmente, los datos filtrados son los mismos
        console.log('Attendance data fetched:', dataWithItem);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Efecto para filtrar los datos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = employeeAttendance.filter((employee) =>
        employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeID.toString().includes(searchTerm) // Permitir buscar por código también
      );
      setFilteredAttendance(filtered);
    } else {
      setFilteredAttendance(employeeAttendance);
    }
  }, [searchTerm, employeeAttendance]);

  // Obtener mes, semana y día actuales
  const currentMonth = selectedDate.format('MMMM');
  const currentWeek = selectedDate.isoWeek();
  const currentDay = selectedDate.format('D');
  const currentDayName = selectedDate.format('dddd');

  // Obtener las semanas del mes seleccionado
  const getWeeksInMonth = (month) => {
    const startOfMonth = selectedDate.month(month).startOf('month');
    const endOfMonth = selectedDate.month(month).endOf('month');
    const weeks = new Set();
    let current = startOfMonth;
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
      const weekNum = current.isoWeek();
      // Asegurarse de que la semana pertenezca principalmente al mes actual
      if (current.month() === month) {
        weeks.add(weekNum);
      }
      current = current.add(1, 'day');
    }
    return Array.from(weeks).sort((a, b) => a - b);
  };

  // Obtener los días de la semana seleccionada
  const getDaysInWeek = (week) => {
    const startOfYear = selectedDate.startOf('year');
    const startOfWeek = startOfYear.isoWeek(week).startOf('isoWeek');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day');
      // Mostrar solo días del mes actual en el selector de días
      if (day.month() === selectedDate.month()) {
        days.push(day);
      }
    }
    return days;
  };

  // Manejar apertura y cierre de menús
  const handleMonthClick = (event) => setAnchorMonth(event.currentTarget);
  const handleMonthClose = () => setAnchorMonth(null);
  const handleWeekClick = (event) => setAnchorWeek(event.currentTarget);
  const handleWeekClose = () => setAnchorWeek(null);
  const handleDayClick = (event) => setAnchorDay(event.currentTarget);
  const handleDayClose = () => setAnchorDay(null);

  // Manejar el cambio en el input de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Lista de meses
  const months = Array.from({ length: 12 }, (_, i) => ({
    name: dayjs().month(i).format('MMMM'),
    value: i,
  }));

  // Manejar selección de semana
  const handleWeekSelect = (week) => {
    const startOfYear = selectedDate.startOf('year');
    const startOfWeek = startOfYear.isoWeek(week).startOf('isoWeek');
    const endOfWeek = startOfYear.isoWeek(week).endOf('isoWeek');
    fetchAttendanceData(null, startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));
    setSelectedDate(startOfWeek); // Actualizar la fecha seleccionada al inicio de la semana
    handleWeekClose();
  };

  // Manejar selección de mes
  const handleMonthSelect = (monthIndex) => {
    const startOfMonth = selectedDate.month(monthIndex).startOf('month');
    const endOfMonth = selectedDate.month(monthIndex).endOf('month');
    fetchAttendanceData(null, startOfMonth.format('YYYY-MM-DD'), endOfMonth.format('YYYY-MM-DD'));
    setSelectedDate(startOfMonth); // Actualizar la fecha seleccionada al inicio del mes
    handleMonthClose();
  };

  // Manejar selección de día
  const handleDaySelect = (day) => {
    setSelectedDate(day);
    fetchAttendanceData(day.format('YYYY-MM-DD')); // Llama a fetch con el día específico
    handleDayClose();
  };

  // --- Template para la columna de Salida --- 
  const exitTimeBodyTemplate = (rowData) => {
    if (rowData.exitTime) {
      if (rowData.hasPermissionExit) {
        // Si hasPermissionExit es true, mostrar hora y etiqueta de permiso
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {rowData.exitTime}
            <Chip label="Permiso" color="success" size="small" variant="outlined" />
          </span>
        );
      } else {
        // Si es una salida normal, solo mostrar la hora
        return rowData.exitTime;
      }
    }
    // Si no hay hora de salida, no mostrar nada
    return null;
  };

  // Renderizado del componente
  return (
    <div className="main-content">
      <div className="date-container">
        <div className="date-controls">
          {/* Control de Mes */}
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
          {/* Control de Semana */}
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
          {/* Control de Día */}
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

      {/* Search Input */}
      <div className="busqueda-container">
        <input
          type="text"
          id="busqueda"
          placeholder="Buscar empleado por nombre o código..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Display Number of Records */}
      <div className="empleados-registrados-container">
        <span className="icon">👥</span>
        <span id="empleadosRegistradosLabel">
          {loading ? 'Cargando...' : `${filteredAttendance.length} registros encontrados`}
        </span>
      </div>

      <br />

      {/* Tabla de Asistencia */}
      <div className="table-emp">
        <DataTable
          value={filteredAttendance}
          size="small"
          showGridlines
          paginator
          rows={15}
          rowsPerPageOptions={[15, 30, 50]}
          tableStyle={{ minWidth: '70rem' }}
          loading={loading}
          emptyMessage="No se encontraron registros de asistencia."
        >
          <Column field="item" header="Item" style={{ width: '5%' }}/>
          <Column field="employeeID" header="Código" style={{ width: '10%' }}/>
          <Column field="date" header="Fecha" style={{ width: '15%' }}/>
          <Column field="employeeName" header="Nombre" style={{ width: '30%' }}/>
          <Column field="entryTime" header="Entrada" style={{ width: '15%' }}/>
          {/* Columna de Salida Modificada */}
          <Column 
            header="Salida" 
            body={exitTimeBodyTemplate} // Usar el template definido arriba
            style={{ width: '25%' }} // Ajustar ancho si es necesario
          />
        </DataTable>
      </div>
    </div>
  );
};

export default RecordAttendance;

