import React, { useState, useEffect } from 'react';
import '../../../css/RecordAttendance.css';
import { apipms } from '../../../../service/apipms';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Button, Menu, MenuItem, Chip } from '@mui/material';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Configure Spanish locale and Day.js plugins
dayjs.locale('es');
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

const RecordAttendance = () => {
  // State for date selection and dropdown menus
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [anchorMonth, setAnchorMonth] = useState(null);
  const [anchorWeek, setAnchorWeek] = useState(null);
  const [anchorDay, setAnchorDay] = useState(null);

  // State for attendance data and search
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch attendance data when the selected date changes
  useEffect(() => {
    fetchAttendanceData(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate]);

  // Function to fetch attendance data from the API
  const fetchAttendanceData = (specificDate = null, startDate = null, endDate = null) => {
    setLoading(true);
    const params = {};
    if (specificDate) params.specificDate = specificDate;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    apipms
      .get('/attendance', { params })
      .then((response) => {
        const dataWithItem = response.data.map((row, index) => ({
          ...row,
          item: index + 1,
          hasPermissionExit: !!row.exitPermission, // Convert to boolean based on presence of exitPermission
        }));
        setEmployeeAttendance(dataWithItem);
        setFilteredAttendance(dataWithItem);
        console.log('Attendance data fetched:', dataWithItem);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Filter attendance data based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = employeeAttendance.filter(
        (employee) =>
          employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeeID.toString().includes(searchTerm)
      );
      setFilteredAttendance(filtered);
    } else {
      setFilteredAttendance(employeeAttendance);
    }
  }, [searchTerm, employeeAttendance]);

  // Get current month, week, and day for display
  const currentMonth = selectedDate.format('MMMM');
  const currentWeek = selectedDate.isoWeek();
  const currentDay = selectedDate.format('D');
  const currentDayName = selectedDate.format('dddd');

  // Get all weeks in the selected month
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

  // Get all days in the selected week
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

  // Handle dropdown menu open/close
  const handleMonthClick = (event) => setAnchorMonth(event.currentTarget);
  const handleMonthClose = () => setAnchorMonth(null);
  const handleWeekClick = (event) => setAnchorWeek(event.currentTarget);
  const handleWeekClose = () => setAnchorWeek(null);
  const handleDayClick = (event) => setAnchorDay(event.currentTarget);
  const handleDayClose = () => setAnchorDay(null);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // List of months for the dropdown
  const months = Array.from({ length: 12 }, (_, i) => ({
    name: dayjs().month(i).format('MMMM'),
    value: i,
  }));

  // Handle week selection
  const handleWeekSelect = (week) => {
    const startOfYear = selectedDate.startOf('year');
    const startOfWeek = startOfYear.isoWeek(week).startOf('isoWeek');
    const endOfWeek = startOfYear.isoWeek(week).endOf('isoWeek');
    fetchAttendanceData(null, startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));
    setSelectedDate(startOfWeek);
    handleWeekClose();
  };

  // Handle month selection
  const handleMonthSelect = (monthIndex) => {
    const startOfMonth = selectedDate.month(monthIndex).startOf('month');
    const endOfMonth = selectedDate.month(monthIndex).endOf('month');
    fetchAttendanceData(null, startOfMonth.format('YYYY-MM-DD'), endOfMonth.format('YYYY-MM-DD'));
    setSelectedDate(startOfMonth);
    handleMonthClose();
  };

  // Handle day selection
  const handleDaySelect = (day) => {
    setSelectedDate(day);
    fetchAttendanceData(day.format('YYYY-MM-DD'));
    handleDayClose();
  };

  // Template for the Exit Time column
  const exitTimeBodyTemplate = (rowData) => {
    if (rowData.exitTime) {
      if (rowData.hasPermissionExit) {
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {rowData.exitTime}
            <Chip label="Permiso" color="success" size="small" variant="outlined" />
          </span>
        );
      }
      return rowData.exitTime;
    }
    return null;
  };

  // Template for the Permission Exit (SP) column
  const permissionExitBodyTemplate = (rowData) => {
    return rowData.hasPermissionExit && rowData.exitPermission ? rowData.exitPermission : 'N/A';
  };

  // Template for the Permission Entry (EP) column
  const permissionEntryBodyTemplate = (rowData) => {
    if (rowData.hasPermissionExit && rowData.entryTime && rowData.exitPermission) {
      return 'Esperando';
    }
    return 'N/A';
  };

  // Check if any record has a permission exit to conditionally show SP/EP columns
  const hasPermissionExit = filteredAttendance.some((row) => row.hasPermissionExit);

  return (
    <div className="main-content">
      <div className="date-container">
        <div className="date-controls">
          {/* Month Selector */}
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

          {/* Week Selector */}
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

          {/* Day Selector */}
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
      {/* Display Number of Records */}
      <div className="empleados-registrados-container">
        <span className="icon">👥</span>
        <span id="empleadosRegistradosLabel">
          {loading ? 'Cargando...' : `${filteredAttendance.length} registros encontrados`}
        </span>
      </div>

      <br />

      {/* Attendance Table */}
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
          <Column field="item" header="Item" style={{ width: '5%' }} />
          <Column field="employeeID" header="Código" style={{ width: '10%' }} />
          <Column field="date" header="Fecha" style={{ width: '15%' }} />
          <Column field="employeeName" header="Nombre" style={{ width: '30%' }} />
          <Column field="entryTime" header="Entrada" style={{ width: '15%' }} />
          <Column header="Salida" body={exitTimeBodyTemplate} style={{ width: '15%' }} />
          {hasPermissionExit && (
            <>
              <Column
                header="SP (Salida Permiso)"
                body={permissionExitBodyTemplate}
                style={{ width: '15%' }}
              />
              <Column
                header="EP (Entrada Permiso)"
                body={permissionEntryBodyTemplate}
                style={{ width: '15%' }}
              />
            </>
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default RecordAttendance;