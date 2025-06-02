import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/Attendance.css';
import logo from '../../../../assets/logpms.png';
import photo from '../../../../assets/EmpPht/900.jpg';


import { apipms } from '../../../../service/apipms';

// Constante para almacenar la clave del permiso activo en localStorage
const ACTIVE_PERMISSION_KEY = 'activePermission';
// Constante para almacenar todos los permisos
const PERMISSION_RECORDS_KEY = 'permissionRecords';
// Constante para almacenar el estado de espera para entrada de regreso
const WAITING_PERMISSION_RETURN_KEY = 'waitingPermissionReturn';

// Componente principal de Attendance
const Attendance = () => {
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
  // Estado para el estado de registro (controla el estilo CSS)
  const [registroStatus, setRegistroStatus] = useState(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
  
  // Estado para controlar el tiempo de espera para entrada de regreso
  const [waitingForReturn, setWaitingForReturn] = useState(false);
  const [waitTimeRemaining, setWaitTimeRemaining] = useState(0);
  const [lastEmployeeID, setLastEmployeeID] = useState('');
  
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
            // Mostrar notificación de que ya puede registrar la entrada de regreso
            toast.current.show({
              severity: 'info',
              summary: 'Información',
              detail: 'Ya puede registrar su entrada de regreso con permiso.',
              life: 5000,
            });
            // Actualizar mensaje para indicar que puede registrar la entrada de regreso
            setMensaje({
              linea1: '¡Bienvenido de Regreso!',
              linea2: 'Registre su Entrada de Regreso',
            });
            setRegistroStatus('permiso-activo'); // Usar la clase permiso-activo para fondo azul
          }
          return newTime;
        });
        
        // Actualizar el mensaje con el tiempo restante en tiempo real
        setMensaje({
          linea1: 'Espere por favor',
          linea2: `${waitTimeRemaining} segundos para registrar regreso`,
        });
      }
    }, 1000);
    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [waitingForReturn, waitTimeRemaining]);

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
        setWaitTimeRemaining(60 - elapsedTime);
        setLastEmployeeID(parsedData.employeeID);
        
        // Actualizar mensaje para indicar que debe esperar
        setMensaje({
          linea1: 'Espere por favor',
          linea2: `${60 - elapsedTime} segundos para registrar regreso`,
        });
        setRegistroStatus('permiso-activo'); // Usar la clase permiso-activo para fondo azul
      } else {
        // Si ya pasó el minuto, limpiar el estado de espera
        localStorage.removeItem(WAITING_PERMISSION_RETURN_KEY);
      }
    }
  }, []);

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

  // Función para navegar de vuelta a la página anterior
  const handleGoBack = () => {
    navigate(-1); // Navega a la ruta anterior
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

  // Función para manejar el registro de asistencia
  const handleRegister = async () => {
    // Verificar si está en modo DESPACHO (aún no implementado)
    if (operationMode === 'DESPACHO') {
      toast.current.show({
        severity: 'info',
        summary: 'Información',
        detail: 'Funcionalidad de registro de despacho pendiente.',
        life: 3000,
      });
      setIdentificador(''); // Limpiar entrada
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
      setIdentificador(''); // Limpiar entrada
      focusInput(); // Volver a enfocar entrada
      return;
    }

    try {
      // Llamada a la API para registrar asistencia
      const response = await apipms.post('/attendance/register', { employeeID: identificador });
      console.log('Registro procesado:', response.data); // Registrar respuesta para depuración

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
        // Manejar salida para casos de permiso
        messageDetail = `Salida por Permiso registrada para ${empName} a las ${response.data.time}`;
        setMensaje({ linea1: 'Espere por favor', linea2: '60 segundos para registrar regreso' });
        statusClass = 'permiso-activo'; // Usar la clase permiso-activo para fondo azul
        toastSeverity = 'info';
        toastSummary = 'Salida por Permiso';

        // Guardar estado de espera para entrada de regreso
        saveWaitingState(identificador, 60); // 60 segundos de espera
      }
      // Manejar entrada de regreso con permiso
      else if (response.data.type === 'permission_entry') {
        // Manejar entrada de regreso con permiso
        messageDetail = `Entrada de Regreso registrada para ${empName} a las ${response.data.time}`;
        setMensaje({ linea1: '¡Bienvenido de Regreso!', linea2: 'Entrada de Regreso Registrada' });
        statusClass = 'permiso-activo'; // Usar la clase permiso-activo para fondo azul
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
      setEmployeePhoto(response.data.photoUrl || '');
      setEmployeeName(empName);
      setIdentificador(''); // Limpiar entrada
      setRegistroStatus(statusClass); // Actualizar estado CSS

      // Restablecer UI después de 5 segundos solo si no es una salida con permiso
      if (response.data.type !== 'permission_exit') {
        setTimeout(() => {
          setEmployeePhoto('');
          setEmployeeName('');
          setMensaje({
            linea1: operationMode === 'DESPACHO' ? 'REGISTRA:' : 'REGISTRATE',
            linea2: operationMode === 'DESPACHO' ? 'DESPACHO' : 'ENTRADA - SALIDA',
          });
          setRegistroStatus(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
        }, 5000);
      }
    } catch (error) {
      // Manejar errores (por ejemplo, restricciones de tiempo, ID no válido)
      console.error('Error al registrar:', error.response ? error.response.data : error.message);
      
      // Verificar si el error es por tiempo de espera para entrada de regreso
      if (error.response?.data?.isWaitingForPermissionReturn) {
        const waitTime = error.response.data.waitTimeRemaining || 60;
        saveWaitingState(identificador, waitTime);
        
        // Actualizar mensaje para indicar que debe esperar
        setMensaje({
          linea1: 'Espere por favor',
          linea2: `${waitTime} segundos para registrar regreso`,
        });
        setRegistroStatus('permiso-activo'); // Usar la clase permiso-activo para fondo azul
      }
      
      const detailMessage = error.response?.data?.message || 'No se pudo procesar el registro. Verifica el ID o intenta de nuevo.';
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: detailMessage,
        life: 4000, // Duración extendida para mensajes de error
      });
      
      // Restablecer UI en caso de error, excepto si es por tiempo de espera
      if (!error.response?.data?.isWaitingForPermissionReturn) {
        setIdentificador('');
        setEmployeePhoto('');
        setEmployeeName('');
        setRegistroStatus(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
      } else {
        setIdentificador(''); // Solo limpiar el identificador
      }
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
      <div className='btn-volver'>
        <Button onClick={handleGoBack}>Volver</Button>
      </div>

      {/* Contenedor principal del formulario */}
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
  );
};

export default Attendance;
