import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/Attendance.css';
import logo from '../../../../assets/logpms.png';
import useEmployeePhoto from '../../../../hooks/usePhotoUrl';
import { apipms } from '../../../../service/apipms';

// Constante para almacenar la clave del permiso activo en localStorage
const ACTIVE_PERMISSION_KEY = 'activePermission';
// Constante para almacenar todos los permisos
const PERMISSION_RECORDS_KEY = 'permissionRecords';
// Constante para almacenar el estado de espera para entrada de regreso
const WAITING_PERMISSION_RETURN_KEY = 'waitingPermissionReturn';

// Componente principal de Attendance
const Attendance = () => {
  const { getEmployeePhoto } = useEmployeePhoto();

  // Hooks de navegación y ubicación para enrutamiento
  const navigate = useNavigate();
  const location = useLocation();
  // Determinar el modo de operación (REGISTRO o DESPACHO) desde el estado de ubicación
  const operationMode = location.state?.op || 'REGISTRO';

  // Estado para el campo de entrada (ID de empleado)
  const [identificador, setIdentificador] = useState('');
  // Estado para la hora actual y período AM/PM
  const [horaActual, setHoraActual] = useState(dayjs().format('hh:mm:ss'));
  const [periodoActual, setPeriodoActual] = useState(dayjs().format('A'));
  // Estado para mostrar mensajes dinámicos
  const [mensaje, setMensaje] = useState({
    linea1: operationMode === 'DESPACHO' ? 'REGISTRA:' : 'REGISTRATE',
    linea2: operationMode === 'DESPACHO' ? 'DESPACHO' : 'ENTRADA - SALIDA',
  });
  // Estado para foto y nombre del empleado
  const [employeePhoto, setEmployeePhoto] = useState('');
  const [employeeName, setEmployeeName] = useState('');

  // Estado de modal para poder volver atras rediseño:

  const [openmodal, setOpenModal] = useState(false);


  // Estado para el estado de registro (controla el estilo CSS)
  const [registroStatus, setRegistroStatus] = useState(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');

  // Estado para controlar el tiempo de espera para entrada de regreso
  const [waitingForReturn, setWaitingForReturn] = useState(false);
  const [waitTimeRemaining, setWaitTimeRemaining] = useState(0);
  const [lastEmployeeID, setLastEmployeeID] = useState('');

  // --- NUEVO: Estado para la lista de registros recientes ---
  const [recentEntries, setRecentEntries] = useState([]);

  // Referencia para notificaciones toast
  const toast = useRef(null);

  // Referencia para el campo de entrada para mantener el foco
  const inputRef = useRef(null);

  // Fecha actual formateada para mostrar
  const fechaActual = dayjs().format('dddd, DD [de] MMMM [de] YYYY').toString();



  // Efecto para actualizar la hora actual cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(dayjs().format('hh:mm:ss')); // Actualizar hora
      setPeriodoActual(dayjs().format('A')); // Actualizar AM/PM

      // Actualizar contador de tiempo de espera si está activo
      if (waitingForReturn && waitTimeRemaining > 0) {
        setWaitTimeRemaining(prevTime => {
          const newTime = prevTime - 1;
          // Si el tiempo llega a cero, permitir el registro de entrada de regreso
          if (newTime <= 0) {
            setWaitingForReturn(false);
            // Actualizar mensaje para indicar que puede registrar la entrada de regreso
            setMensaje({
              linea1: '¡Bienvenido de Regreso!',
              linea2: 'Registre su Entrada de Regreso',
            });
            setRegistroStatus('default'); // Volver al color normal cuando termina el temporizador
            setEmployeePhoto(''); // Clear photo when timer ends
            setEmployeeName(''); // Clear name when timer ends
          }
          return newTime;
        });

        // Actualizar el mensaje con el tiempo restante en tiempo real
        setMensaje({
          linea1: 'Permiso Temporal Activo',
          linea2: `${waitTimeRemaining} segundos para registrar regreso`,
        });
      }
    }, 1000);
    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [waitingForReturn, waitTimeRemaining]);

  const playErrorSound = () => {
    const audio = new Audio('/error.mp3'); // ruta relativa desde /public
    audio.play();
  };

  // Efecto para verificar si hay un estado de espera guardado al cargar el componente
  useEffect(() => {
    const waitingData = localStorage.getItem(WAITING_PERMISSION_RETURN_KEY);
    if (waitingData) {
      const parsedData = JSON.parse(waitingData);
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor((currentTime - parsedData.timestamp) / 1000);

      // Si han pasado menos de 60 segundos desde la salida con permiso
      if (elapsedTime < 60) {
        setWaitingForReturn(true);
        setWaitTimeRemaining(15 - elapsedTime);
        setLastEmployeeID(parsedData.employeeID);

        // Actualizar mensaje para indicar que debe esperar - con texto de permiso temporal
        setMensaje({
          linea1: 'Permiso Temporal Activo',
          linea2: `${15 - elapsedTime} segundos para registrar regreso`,
        });
        setRegistroStatus('permiso-activo'); // Usar la clase permiso-activo para fondo azul
      } else {
        // Si ya pasó el minuto, limpiar el estado de espera
        localStorage.removeItem(WAITING_PERMISSION_RETURN_KEY);
        setEmployeePhoto(''); // Clear photo if timer expired on load
        setEmployeeName(''); // Clear name if timer expired on load
      }
    }
  }, [])

  // Efecto para volver a enfocar el campo de entrada cuando cambia el identificador
  useEffect(() => {
    focusInput();
  }, [identificador]);

  // Función para enfocar el campo de entrada
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Asegura que el campo de entrada siempre esté enfocado
    }
  };

  const handleGoBack = () => {
    if (operationMode === 'DESPACHO') {
      setOpenModal(true); // Abre el modal de confirmación
    } else {
      navigate('/MainAttendance'); // Navega a la página principal de asistencia
      console.log('Volvio Cancelado');
    }
  }

  const confirmarSalida = () => {
    setOpenModal(false);
    navigate('/MainAttendance');
  }

  const cancelarSalida = () => {
    setOpenModal(false);
  }

  // --- NUEVO: Función para agregar un nuevo registro a la lista de recientes ---
  const addRecentEntry = (data) => {
    const entryTypeMap = {
      entry: 'ENTRADA',
      exit: 'SALIDA',
      permission_exit: 'SALIDA PERMISO',
      permission_entry: 'ENTRADA PERMISO',
      dispatching: 'DESPACHO'
    };

    const newEntry = {
      key: Date.now(), // Clave única para el renderizado en React
      id: data.employeeID,
      name: data.employeeName,
      time: data.time,
      type: entryTypeMap[data.type] || String(data.type).toUpperCase()
    };

    // Añade la nueva entrada al principio y mantiene solo las últimas 10
    setRecentEntries(prevEntries => [newEntry, ...prevEntries].slice(0, 10));
  };


  // Función para actualizar el estado del permiso a INACTIVO en localStorage
  const updatePermissionToInactive = (employeeID) => {
    // Obtener todos los permisos
    const storedRecords = localStorage.getItem(PERMISSION_RECORDS_KEY);
    if (storedRecords) {
      const permissionRecords = JSON.parse(storedRecords);

      // Actualizar el estado del permiso del empleado a INACTIVO
      const updatedRecords = permissionRecords.map(record => {
        if (record.employeeID === employeeID && record.status === 'ACTIVO') {
          return { ...record, status: 'INACTIVO' };
        }
        return record;
      });

      // Guardar los permisos actualizados
      localStorage.setItem(PERMISSION_RECORDS_KEY, JSON.stringify(updatedRecords));

      // Disparar evento personalizado para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('customStorageChange'));
    }
  };

  // Función para guardar el estado de espera para entrada de regreso
  const saveWaitingState = (employeeID, waitTime) => {
    const waitingData = {
      employeeID,
      timestamp: new Date().getTime(),
      waitTime
    };
    localStorage.setItem(WAITING_PERMISSION_RETURN_KEY, JSON.stringify(waitingData));

    // Actualizar estado local
    setWaitingForReturn(true);
    setWaitTimeRemaining(waitTime);
    setLastEmployeeID(employeeID);
  };

  // Función para manejar el registro de asistencia o despacho
  const handleRegister = async () => {
    if (operationMode === 'DESPACHO') {
      if (!identificador) {
        toast.current.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Por favor ingresa el ID del empleado',
          life: 3000,
        });
        playErrorSound(); // Reproducir sonido de error
        return;
      }

      try {
        const response = await apipms.post('/attendance/register', {
          employeeID: identificador,
          operationMode: 'DESPACHO',
          supervisorID: location.state?.supervisorID || null
        });
        const empName = response.data.employeeName;
        const messageDetail = `Despacho registrado para ${empName} a las ${response.data.time}`;

        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: messageDetail,
          life: 4000,
        });

        // --- NUEVO: Añadir a la lista de recientes ---
        addRecentEntry({ ...response.data, type: 'dispatching' });

        setEmployeePhoto(getEmployeePhoto(response.data.photoUrl) || '');
        setEmployeeName(empName);
        setIdentificador(''); // Limpiar entrada
        setRegistroStatus('despacho-activo'); // Mantener fondo amarillo después del registro

        // Restablecer UI después de 10 segundos
        setTimeout(() => {
          setEmployeePhoto('');
          setEmployeeName('');
          setMensaje({
            linea1: 'REGISTRA:',
            linea2: 'DESPACHO',
          });
          setRegistroStatus('despacho-activo'); // Mantener fondo amarillo
        }, 10000);
      } catch (error) {
        console.error('Error al registrar despacho:', error.response ? error.response.data : error.message);
        const detailMessage = error.response?.data?.message || 'No se pudo procesar el registro de despacho. Verifica el ID o intenta de nuevo.';
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: detailMessage,
          life: 4000,
        });
        playErrorSound(); // Reproducir sonido de error
        setIdentificador(''); // Limpiar entrada
        setEmployeePhoto('');
        setEmployeeName('');
        setRegistroStatus('despacho-activo'); // Mantener fondo amarillo en caso de error
      }
      focusInput(); // Volver a enfocar entrada
      return;
    }

    // Validar que se proporcione el ID de empleado
    if (!identificador) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor ingresa tu carnet',
        life: 3000,
      });
      playErrorSound(); // Reproducir sonido de error
      return;
    }

    // Verificar si el empleado está en período de espera para entrada de regreso
    if (waitingForReturn && identificador === lastEmployeeID && waitTimeRemaining > 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Espere por favor',
        detail: `Debe esperar ${waitTimeRemaining} segundos más antes de registrar su entrada de regreso.`,
        life: 3000,
      });
      playErrorSound(); // Reproducir sonido de error
      setIdentificador(''); // Limpiar entrada
      focusInput(); // Volver a enfocar entrada
      return;
    }

    try {
      // Llamada a la API para registrar asistencia
      const response = await apipms.post('/attendance/register', { employeeID: identificador });
      // --- NUEVO: Añadir a la lista de recientes ---
      addRecentEntry(response.data);

      // Extraer nombre de empleado y banderas de permiso de la respuesta
      const empName = response.data.employeeName;
      // Obtener las banderas de permiso de la respuesta
      const isPermissionExit = response.data.isPermissionExit || false;
      const isPermissionEntry = response.data.isPermissionEntry || false;

      let messageDetail = '';
      let statusClass = '';
      let toastSeverity = 'success';
      let toastSummary = 'Éxito';
      // Manejar registro de entrada
      if (response.data.type === 'entry') {
        // Manejar entrada estándar
        messageDetail = `Entrada registrada para ${empName} a las ${response.data.time}`;
        setMensaje({ linea1: '¡Bienvenido!', linea2: 'Entrada Registrada' });
        statusClass = 'entrada-registrada';
        toastSeverity = 'success';
        toastSummary = 'Éxito';
      }
      // Manejar salida con permiso (nuevo tipo 'permission_exit')
      else if (response.data.type === 'permission_exit') {
        apipms.post(`/thermalPrinter/printPermissionTicket`, { employeeID: parseInt(identificador) })
          .then((res) => {
            toast.current.show({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Permiso impreso correctamente.',
              life: 5000
            });
          })
          .catch((error) => {
            console.error('Error al imprimir el permiso:', error);
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al imprimir el permiso.',
              life: 5000
            });
            playErrorSound(); // Reproducir sonido de error
          });
        // Manejar salida para casos de permiso
        messageDetail = `Salida por Permiso registrada para ${empName} a las ${response.data.time}`;
        setMensaje({ linea1: 'Permiso Temporal Activo', linea2: '15 segundos para registrar regreso' });
        statusClass = 'permiso-activo'; // Usar la clase permiso-activo para fondo azul
        toastSeverity = 'info';
        toastSummary = 'Salida por Permiso';

        // Guardar estado de espera para entrada de regreso
        saveWaitingState(identificador, 15); // 15 segundos de espera
      }
      // Manejar entrada de regreso con permiso
      else if (response.data.type === 'permission_entry') {
        // Manejar entrada de regreso con permiso
        messageDetail = `Entrada de Regreso registrada para ${empName} a las ${response.data.time}`;
        setMensaje({ linea1: '¡Bienvenido de Regreso!', linea2: 'Entrada de Regreso Registrada' });
        statusClass = 'entrada-registrada'; // Usar la clase entrada-registrada para fondo verde
        toastSeverity = 'info';
        toastSummary = 'Entrada de Regreso';

        // Limpiar estado de espera
        localStorage.removeItem(WAITING_PERMISSION_RETURN_KEY);
        setWaitingForReturn(false);
        setWaitTimeRemaining(0);

        // Actualizar el permiso a INACTIVO en localStorage
        updatePermissionToInactive(identificador);
      }
      // Manejar salida normal
      else {
        // Manejar salida estándar
        messageDetail = `Salida registrada para ${empName} a las ${response.data.time}`;
        setMensaje({ linea1: '¡Hasta Luego!', linea2: 'Salida Registrada' });
        statusClass = 'salida-registrada';
        toastSeverity = 'success';
        toastSummary = 'Éxito';
      }

      // Mostrar notificación toast de éxito
      toast.current.show({
        severity: toastSeverity,
        summary: toastSummary,
        detail: messageDetail,
        life: 4000, // Duración extendida para visibilidad
      });

      // Actualizar UI con datos del empleado
      setEmployeePhoto(getEmployeePhoto(response.data.photoUrl) || '');
      setEmployeeName(empName);
      setIdentificador(''); // Limpiar entrada
      setRegistroStatus(statusClass); // Actualizar estado CSS

      // Restablecer UI después de 10 segundos solo si no es una salida con permiso
      // Aumentamos el tiempo de 5 a 10 segundos para que los colores duren más
      if (response.data.type !== 'permission_exit') {
        setTimeout(() => {
          setEmployeePhoto('');
          setEmployeeName('');
          setMensaje({
            linea1: operationMode === 'DESPACHO' ? 'REGISTRA:' : 'REGISTRATE',
            linea2: operationMode === 'DESPACHO' ? 'DESPACHO' : 'ENTRADA - SALIDA',
          });
          setRegistroStatus(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
        }, 10000);
      }
    } catch (error) {
      // Manejar errores (por ejemplo, restricciones de tiempo, ID no válido)
      console.error('Error al registrar:', error.response ? error.response.data : error.message);

      const detailMessage = error.response?.data?.message || 'No se pudo procesar el registro. Verifica el ID o intenta de nuevo.';
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: detailMessage,
        life: 4000, // Duración extendida para mensajes de error
      });
      playErrorSound(); // Reproducir sonido de error

      // Restablecer UI en caso de error
      setIdentificador('');
      setEmployeePhoto('');
      setEmployeeName('');
      setRegistroStatus(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
    }
    focusInput(); // Volver a enfocar entrada después del procesamiento
  };

  // Manejar envío de formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir envío de formulario predeterminado
    handleRegister(); // Llamar al manejador de registro
  };

  // Renderizar el componente
  return (
    <div className="background-container-attendance" onClick={focusInput}>
      {/* Componente Toast para notificaciones */}
      <Toast ref={toast} />

      {/* Botón de volver */}
      <div className='unicebtn'>
        <Button
          onClick={handleGoBack}
        >Volver</Button>
      </div>

      {/* --- MODIFICADO: Modal de confirmación para volver atrás --- */}
      {openmodal && (
        <div className="modal-confirmation">
          <div className="modal-content">
            <h2>Confirmar Salida</h2>
            <p>¿Estás seguro de que quieres volver?</p>
            <div className="modal-buttons">
              <Button className='btnSalida' onClick={confirmarSalida} color='white'>Aceptar</Button>
              <Button className='btnAceptar' onClick={cancelarSalida} color='white'>Cancelar</Button>
            </div>
          </div>
        </div>
      )};



      {/* --- NUEVO: Contenedor principal para alinear la lista y el formulario --- */}
      <div className="attendance-wrapper">

        {/* --- MODIFICADO: Ventana con la lista de empleados que marcan (siempre visible) --- */}
        <div className="employee-list-container">
          <div className="employee-list-header">Employee List</div>
          {recentEntries.map((entry) => (
            <div key={entry.key} className="employee-list-item">
              <span>{entry.id}</span><span> | </span><span>{entry.name}</span><span> | </span><span>{entry.time}</span>
            </div>
          ))}
        </div>

        {/* Contenedor principal del formulario (CÓDIGO ORIGINAL) */}
        <div className="form-container-attendance">
          {/* Encabezado con logo y nombre de empresa */}
          <div className="header-attendance">
            <img src={logo} alt="Logo" className="logo-attendance" />
            <span className="nombre-empresa-attendance">Powers Athletic Honduras</span>
          </div>

          {/* Área de contenido principal */}
          <div className="main-content-attendance">
            {/* Panel de información con fecha y hora */}
            <div className="info-panel-attendance">
              <div className="dia-actual-attendance">
                <div className={`dia-titulo-attendance ${registroStatus}`}>
                  <p className="fecha-texto-attendance">{fechaActual}</p>
                  <div className="hora-container-attendance">
                    <p className="hora-texto-attendance">{horaActual}</p>
                    <p className="hora-periodo-attendance">{periodoActual}</p>
                  </div>
                </div>
              </div>

              {/* Mostrar mensaje dinámico */}
              <div className="mensaje-tipo-attendance">
                <h3>{mensaje.linea1}</h3>
                <h3>{mensaje.linea2}</h3>
              </div>
            </div>

            {/* Mostrar información del empleado */}
            <div className="empleado-info-container">
              <div className="empleado-foto-placeholder">
                {employeePhoto ? (
                  <img src={employeePhoto} alt="Foto Empleado" className="empleado-foto" />
                ) : (
                  <div className="empleado-foto-empty"></div>
                )}
              </div>
              <h2 className={employeeName ? 'nombre-empleado-grande' : 'nombre-empleado-placeholder'}>
                {employeeName || 'Empleado'}
              </h2>
            </div>
          </div>

          {/* Formulario oculto para capturar entrada */}
          <form className="formulario-attendance" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Attendance;