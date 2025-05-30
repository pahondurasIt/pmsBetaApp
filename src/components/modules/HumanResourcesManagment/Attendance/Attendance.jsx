import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/Attendance.css';
import logo from '../../../../assets/logwhite.png';
import { apipms } from '../../../../service/apipms';

const ACTIVE_PERMISSION_KEY = 'activePermission';

const Attendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const operationMode = location.state?.op || 'REGISTRO';

  const [identificador, setIdentificador] = useState('');
  const [horaActual, setHoraActual] = useState(dayjs().format('hh:mm:ss'));
  const [periodoActual, setPeriodoActual] = useState(dayjs().format('A'));
  const [mensaje, setMensaje] = useState({
    linea1: operationMode === 'DESPACHO' ? 'REGISTRA:' : 'REGISTRATE',
    linea2: operationMode === 'DESPACHO' ? 'DESPACHO' : 'ENTRADA - SALIDA',
  });
  const [employeePhoto, setEmployeePhoto] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [registroStatus, setRegistroStatus] = useState(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
  const toast = useRef(null);
  const inputRef = useRef(null);

  const fechaActual = dayjs().format('dddd, DD [de] MMMM [de] YYYY').toString();

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(dayjs().format('hh:mm:ss'));
      setPeriodoActual(dayjs().format('A'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    focusInput();
  }, [identificador]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRegister = async () => {
    if (operationMode === 'DESPACHO') {
      toast.current.show({
        severity: 'info',
        summary: 'Información',
        detail: 'Funcionalidad de registro de despacho pendiente.',
        life: 3000,
      });
      setIdentificador('');
      focusInput();
      return;
    }

    if (!identificador) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor ingresa tu carnet',
        life: 3000,
      });
      return;
    }

    try {
      const response = await apipms.post('/attendance/register', { employeeID: identificador });
      console.log('Registro procesado:', response.data);

      const empName = response.data.employeeName;
      const isPermissionExit = response.data.isPermissionExit;
      const isPermissionEntry = response.data.isPermissionEntry;
      let messageDetail = '';
      let statusClass = '';
      let toastSeverity = 'success';
      let toastSummary = 'Éxito';

      if (response.data.type === 'entry') {
        if (isPermissionEntry) {
          messageDetail = `Reingreso registrado para ${empName} a las ${response.data.time}`;
          setMensaje({ linea1: '¡Bienvenido de Nuevo!', linea2: 'Reingreso Registrado' });
          statusClass = 'entrada-registrada';
          toastSeverity = 'success';
          toastSummary = 'Reingreso';

          localStorage.removeItem(ACTIVE_PERMISSION_KEY);
          window.dispatchEvent(new Event('customStorageChange'));
          console.log("Indicador de permiso activo eliminado de localStorage tras reingreso.");
        } else {
          messageDetail = `Entrada registrada para ${empName} a las ${response.data.time}`;
          setMensaje({ linea1: '¡Bienvenido!', linea2: 'Entrada Registrada' });
          statusClass = 'entrada-registrada';
          toastSeverity = 'success';
          toastSummary = 'Éxito';
        }
      } else {
        if (isPermissionExit) {
          messageDetail = `Salida por Permiso registrada para ${empName} a las ${response.data.time}`;
          setMensaje({ linea1: '¡Hasta Pronto!', linea2: 'Salida por Permiso' });
          statusClass = 'salida-registrada';
          toastSeverity = 'info';
          toastSummary = 'Salida por Permiso';

          console.log("Permiso activo mantenido en localStorage para posible reingreso.");
        } else {
          messageDetail = `Salida registrada para ${empName} a las ${response.data.time}`;
          setMensaje({ linea1: '¡Hasta Luego!', linea2: 'Salida Registrada' });
          statusClass = 'salida-registrada';
          toastSeverity = 'success';
          toastSummary = 'Éxito';

          localStorage.removeItem(ACTIVE_PERMISSION_KEY);
          window.dispatchEvent(new Event('customStorageChange'));
        }
      }

      toast.current.show({
        severity: toastSeverity,
        summary: toastSummary,
        detail: messageDetail,
        life: 4000,
      });

      setEmployeePhoto(response.data.photoUrl || '');
      setEmployeeName(empName);
      setIdentificador('');
      setRegistroStatus(statusClass);

      setTimeout(() => {
        setEmployeePhoto('');
        setEmployeeName('');
        setMensaje({
          linea1: operationMode === 'DESPACHO' ? 'REGISTRA:' : 'REGISTRATE',
          linea2: operationMode === 'DESPACHO' ? 'DESPACHO' : 'ENTRADA - SALIDA',
        });
        setRegistroStatus(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
      }, 5000);
    } catch (error) {
      console.error('Error al registrar:', error.response ? error.response.data : error.message);
      const detailMessage = error.response?.data?.message || 'No se pudo procesar el registro. Verifica el ID o intenta de nuevo.';
      let toastSeverity = 'error';
      let toastSummary = 'Error';

      if (error.response?.status === 403) {
        toastSeverity = 'warn';
        toastSummary = 'Advertencia';
      }

      toast.current.show({
        severity: toastSeverity,
        summary: toastSummary,
        detail: detailMessage,
        life: 3000,
      });
      setIdentificador('');
      setEmployeePhoto('');
      setEmployeeName('');
      setRegistroStatus(operationMode === 'DESPACHO' ? 'despacho-activo' : 'default');
    }
    focusInput();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className="background-container-attendance" onClick={focusInput}>
      <Toast ref={toast} />

      <div className='btn-volver'>
        <Button onClick={handleGoBack}>Volver</Button>
      </div>

      <div className="form-container-attendance">
        <div className="header-attendance">
          <img src={logo} alt="Logo" className="logo-attendance" />
          <span className="nombre-empresa-attendance">Powers Athletic Honduras</span>
        </div>

        <div className="main-content-attendance">
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

            <div className="mensaje-tipo-attendance">
              <h3>{mensaje.linea1}</h3>
              <h3>{mensaje.linea2}</h3>
            </div>
          </div>

          <div className="empleado-info-container">
            <div className="empleado-foto-placeholder">
              {employeePhoto ? (
                <img src={employeePhoto} alt="Foto Empleado" className="empleado-foto" />
              ) : (
                <div className="empleado-foto-empty"></div>
              )}
            </div>
            <p className={employeeName ? "nombre-empleado-grande" : "nombre-empleado-placeholder"}>
              {employeeName || 'Nombre Empleado'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formulario-attendance">
          <input
            type="text"
            id="identificador"
            maxLength="25"
            autoFocus
            required
            ref={inputRef}
            autoComplete="off"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Attendance;