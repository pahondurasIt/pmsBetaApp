import React, { useState, useEffect } from 'react';
import '../../../css/RecordAttendance.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Button, Menu, MenuItem } from '@mui/material';

// Configurar el idioma español
dayjs.locale('es');

// Componente principal
const RecordAttendance = () => {
  // Estado para manejar las fechas y los menús desplegables
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Fecha actual (04:23 PM CST, 20 mayo 2025)
  const [anchorMonth, setAnchorMonth] = useState(null);
  const [anchorWeek, setAnchorWeek] = useState(null);
  const [anchorDay, setAnchorDay] = useState(null);

  // Efecto para actualizar la fecha al cargar el componente
  useEffect(() => {
    setSelectedDate(dayjs()); // Ajusta a la hora actual del sistema
  }, []);

  // Obtener mes y día actuales
  const currentMonth = selectedDate.format('MMMM');
  const currentDay = selectedDate.format('D'); // Día del mes (e.g., "20")
  const currentDayName = selectedDate.format('dddd'); // Nombre del día (e.g., "martes")

  // Calcular el número de semana del año manualmente
  const getWeekNumber = (date) => {
    const startOfYear = dayjs().startOf('year');
    const diff = date.diff(startOfYear, 'day');
    return Math.floor(diff / 7) + 1;
  };

  // Obtener las semanas del mes seleccionado
  const getWeeksInMonth = (month) => {
    const startOfMonth = selectedDate.month(month).startOf('month');
    const endOfMonth = selectedDate.month(month).endOf('month');
    const weeks = [];
    let current = startOfMonth.startOf('isoWeek');
    while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
      const weekNum = getWeekNumber(current);
      if (!weeks.includes(weekNum) && current.month() === month) {
        weeks.push(weekNum);
      }
      current = current.add(1, 'week');
    }
    return weeks;
  };

  // Obtener los días de la semana seleccionada
  const getDaysInWeek = () => {
    const startOfWeek = selectedDate.startOf('isoWeek');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day');
      if (day.month() === selectedDate.month()) {
        days.push(day.format('D'));
      }
    }
    return days;
  };

  // Manejar apertura y cierre del menú de meses
  const handleMonthClick = (event) => setAnchorMonth(event.currentTarget);
  const handleMonthClose = () => setAnchorMonth(null);

  // Manejar apertura y cierre del menú de semanas
  const handleWeekClick = (event) => setAnchorWeek(event.currentTarget);
  const handleWeekClose = () => setAnchorWeek(null);

  // Manejar apertura y cierre del menú de días
  const handleDayClick = (event) => setAnchorDay(event.currentTarget);
  const handleDayClose = () => setAnchorDay(null);

  // Lista de meses
  const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));

  // Renderizado del componente
  return (
    <div className="main-content">
      <div className="date-container">
        <div className="date-controls">
          <div className="date-item">
            Mes: 
            <Button
              variant="outlined"
              onClick={handleMonthClick}
              className="date-button"
            >
              {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
            </Button>
            <Menu
              anchorEl={anchorMonth}
              open={Boolean(anchorMonth)}
              onClose={handleMonthClose}
            >
              {months.map((month, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    const newDate = selectedDate.month(index).date(1);
                    setSelectedDate(newDate);
                    handleMonthClose();
                  }}
                >
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div className="date-item">
            Semana: 
            <Button
              variant="outlined"
              onClick={handleWeekClick}
              className="date-button"
            >
              {`Semana ${getWeekNumber(selectedDate)}`}
            </Button>
            <Menu
              anchorEl={anchorWeek}
              open={Boolean(anchorWeek)}
              onClose={handleWeekClose}
            >
              {getWeeksInMonth(selectedDate.month()).map((week) => (
                <MenuItem
                  key={week}
                  onClick={() => {
                    const weekStart = selectedDate.startOf('month').startOf('isoWeek');
                    const newDate = weekStart.add((week - getWeeksInMonth(selectedDate.month())[0]) * 7, 'day');
                    setSelectedDate(newDate);
                    handleWeekClose();
                  }}
                >
                  {`Semana ${week}`}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div className="date-item">
            Día de hoy: 
            <Button
              variant="outlined"
              onClick={handleDayClick}
              className="date-button"
            >
              {`${currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1)} - D${currentDay}`}
            </Button>
            <Menu
              anchorEl={anchorDay}
              open={Boolean(anchorDay)}
              onClose={handleDayClose}
            >
              {getDaysInWeek().map((day) => {
                const newDate = selectedDate.date(day);
                return (
                  <MenuItem
                    key={day}
                    onClick={() => {
                      setSelectedDate(newDate);
                      handleDayClose();
                    }}
                  >
                    {`${dayjs(newDate).format('dddd').charAt(0).toUpperCase() + dayjs(newDate).format('dddd').slice(1)} - D${day}`}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        </div>
      </div>

      {/* Contenedor para la búsqueda */}
      <div className="busqueda-container">
        <input type="text" id="busqueda" placeholder="Buscar empleado" />
        <Button variant="contained" id="buscarBtn">
          Buscar
        </Button>
      </div>

      {/* Contenedor para la cantidad de empleados registrados */}
      <div className="empleados-registrados-container">
        <span className="icon">👥</span>
        <span id="empleadosRegistradosLabel">Cargando...</span>
      </div>
    </div>
  );
};

export default RecordAttendance;