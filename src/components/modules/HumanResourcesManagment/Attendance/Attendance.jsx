import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/Attendance.css';
import logo from '../../../../assets/logwhite.png';

// Componente Attendance: Muestra un formulario para registrar la asistencia de empleados
const Attendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const opcion = location.state?.op || 'ENTRADA'; // Obtiene el tipo de registro (ENTRADA, SALIDA, DESPACHO)
  const [identificador, setIdentificador] = useState(''); // Estado para el código del empleado ingresado
  const [horaActual, setHoraActual] = useState(dayjs().format('hh:mm:ss a')); // Estado para la hora actual con segundos
  const [isInputVisible, setIsInputVisible] = useState(false); // Estado para controlar la visibilidad del input
  const [mensaje, setMensaje] = useState({ // Estado para manejar los mensajes dinámicos
    linea1: 'Welcome!',
    linea2: ''
  });

  // Formatea la fecha actual usando dayjs (ejemplo: "Martes, 20 de mayo de 2025")
  const fechaActual = dayjs().format('dddd, DD [de] MMMM [de] YYYY').toString();

  // useEffect para actualizar la hora en tiempo real cada segundo
  useEffect(() => {
    const actualizarHora = () => {
      setHoraActual(dayjs().format('hh:mm:ss a')); // Actualiza la hora con segundos
    };
    actualizarHora(); // Llama la función inmediatamente para evitar retraso inicial
    const interval = setInterval(actualizarHora, 1000); // Actualiza cada segundo
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  // Función para regresar a la página anterior
  const handleGoBack = () => {
    navigate(-1); // Retrocede una posición en el historial
  };

  // Funciones para manejar cada tipo de registro (log para depuración)
  const handleEntrada = () => {
    console.log('Registro de ENTRADA detectado'); // Registra en consola cuando se detecta ENTRADA
    // Aquí puedes agregar lógica específica para ENTRADA si es necesario
  };

  const handleSalida = () => {
    console.log('Registro de SALIDA detectado'); // Registra en consola cuando se detecta SALIDA
    // Aquí puedes agregar lógica específica para SALIDA si es necesario
  };

  const handleDespacho = () => {
    console.log('Registro de DESPACHO detectado'); // Registra en consola cuando se detecta DESPACHO
    // Aquí puedes agregar lógica específica para DESPACHO si es necesario
  };

  // Función para actualizar el mensaje según el tipo
  const actualizarMensajePorTipo = (tipo) => {
    console.log('Actualizando mensaje para tipo:', tipo); // Depuración para confirmar el tipo recibido
    switch (tipo) {
      case 'ENTRADA':
        setMensaje({ linea1: 'Welcome!!', linea2: 'Registra tu Entrada' }); // Actualiza el mensaje para ENTRADA
        break;
      case 'SALIDA':
        setMensaje({ linea1: 'Bye!!', linea2: 'Nos vemos Mañana' }); // Actualiza el mensaje para SALIDA
        break;
      case 'DESPACHO':
        setMensaje({ linea1: 'Hasta luego, Cuidate', linea2: '' }); // Actualiza el mensaje para DESPACHO
        break;
      default:
        setMensaje({ linea1: 'Welcome!', linea2: 'Registra tu Entrada' }); // Por defecto, mensaje de ENTRADA
    }
  };

  // Ejecutar funciones y actualizar mensaje al montar o cuando cambia el tipo
  useEffect(() => {
    console.log('Valor de opcion:', opcion); // Depuración para confirmar el valor de opcion
    switch (opcion) {
      case 'ENTRADA':
        handleEntrada();
        break;
      case 'SALIDA':
        handleSalida();
        break;
      case 'DESPACHO':
        handleDespacho();
        break;
      default:
        handleEntrada(); // Por defecto, si no se especifica
    }
    actualizarMensajePorTipo(opcion); // Actualiza el mensaje según el tipo
  }, [opcion]);

  return (
    // Contenedor principal que define el fondo de la página
    <div className="background-container-attendance">
      {/* Contenedor de la tarjeta que contiene todos los elementos del formulario */}
      <div
        className="form-container-attendance"
        onMouseEnter={() => setIsInputVisible(true)} // Muestra el input al pasar el ratón
        onMouseLeave={() => setIsInputVisible(false)} // Oculta el input al sacar el ratón
      >
        {/* Encabezado con el logo y el nombre de la empresa */}
        <div className="header-attendance">
          <img src={logo} alt="Logo" className="logo-attendance" />
          <span className="nombre-empresa-attendance">POWERS ATHLETIC DE HONDURAS S.A DE C.V</span>
        </div>

        {/* Sección para mostrar la fecha, hora y tipo de registro */}
        <div className="dia-actual-attendance">
          <div className={`dia-titulo-attendance ${opcion.toLowerCase()}`}>
            {/* Muestra la fecha formateada */}
            <p className="fecha-texto-attendance">{fechaActual}</p>
            {/* Muestra la hora formateada con segundos */}
            <p className="hora-texto-attendance">{horaActual}</p>
            {/* Muestra el tipo de registro (ENTRADA/SALIDA/DESPACHO) */}
            <p className="tipo-texto-attendance">{opcion}</p>
          </div>
        </div>

        {/* Mensaje dinámico según el tipo de registro */}
        <div className="mensaje-tipo-attendance">
          <Typography variant="h3" component="h3">{mensaje.linea1}</Typography>
          {mensaje.linea2 && <Typography variant="h3" component="h3">{mensaje.linea2}</Typography>}
        </div>

        {/* Foto del empleado */}
        <img
          id="fotoEmpleado"
          src=""
          alt="Foto del empleado"
          style={{
            width: '230px',
            height: '230px',
            display: 'none',
            borderRadius: '20%',
            marginTop: '15px',
          }}
        />

        {/* Contenedor para el nombre del empleado */}
        <div className="empleado-info-container">
          <p id="nombreEmpleado" className="nombre-empleado-grande"></p>
        </div>

        {/* Campo de entrada para el carnet, visible solo al pasar el ratón */}
        {isInputVisible && (
          <div className="formulario-attendance">
            <input
              type="text"
              id="identificador"
              maxLength="25"
              autoFocus
              required
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)} // Actualiza el estado con el valor ingresado
              placeholder="Ingresa tu carnet"
            />
          </div>
        )}
      </div>

      {/* Botón para regresar al menú anterior */}
      <div className='btn-volver'>
        <Button onClick={handleGoBack}>
          Volver
        </Button>
      </div>
    </div>
  );
};

export default Attendance;