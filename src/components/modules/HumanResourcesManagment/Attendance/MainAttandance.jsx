import React, { useEffect, useState} from 'react';
import { Button, Grid, Typography } from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/mainAsistencia.css';
import logo from '/logpms.png';
// import { useNavigate } from 'react-router-dom';
import { apipms } from '../../../../service/apipms';
import useCustomNavigate from '../../../../hooks/useCustomNavigate';
import SupervisorLoginModal from '../../../modules/HumanResourcesManagment/Attendance/accessmodal';


const MainAttendance = () => {
  const { goMenu, goAttendance, goTo } = useCustomNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const handleDespachoClick = () => setOpenLogin(true);

  // const [error, setError] = useState('');
  // const inputRef = useRef(null);
  // const [supervisorIDInput, setSupervisorIDInput] = useState(''); 
  // const [supervisors, setSupervisors] = useState(['11']); 

  // // useEffect(() => {
  // //   apipms.post('/logdispatching')
  // //     .then((res) => {
  // //       const supervisorIds = res.data.map((sup) => sup.supervisorID.toString());
  // //       //setSupervisors(supervisorIds);

  //     })
  //     .catch((err) => {
  //       console.error('Error al obtener los supervisores:', err);
  //       setError('No se pudieron cargar los datos de los supervisores.');
  //     });
  // }, []);

  const handleLoginSuccess = (supervisorID) => {
    goTo('/attendance', {
      state: { op: 'DESPACHO', supervisorID }
    });
  };

  // const handleRegistrarClick = () => {
  //   navigate('/attendance');
  // };

  // const handleDespachoClick = () => {
  //   setOpenLogin(true); // Abre el modal de login
  //   setError(''); // Limpia cualquier error anterior
  //   setSupervisorIDInput(''); // Limpia el input
  //   setTimeout(() => {
  //     if (inputRef.current) {
  //       inputRef.current.focus();
  //     }
  //   }, 0); // Un delay de 0ms coloca la función al final de la cola de ejecución
  // };

  // const handleGoBack = () => {
  //   navigate('/');
  // };

  // // 2. Función para manejar la lógica del Login
  // const handleLogin = () => {
  //   if (supervisors.includes(supervisorIDInput)) {
  //     console.log('¡Acceso concedido!');
  //     // Limpiar el input y el error al conceder acceso
  //     setSupervisorIDInput('');
  //     setError('');
  //     goTo('/attendance', {
  //       state: { op: 'DESPACHO', supervisorID: supervisorIDInput }
  //     });
  //   } else {
  //     setError('ID de supervisor no válido o no autorizado.');
  //     setSupervisorIDInput(''); 
  //   }
  // };
  // const handleCloseLogin = () => {
  //   setOpenLogin(false);
  //   setError(''); // Limpiar el error al cerrar el modal
  //   setSupervisorIDInput(''); // Limpiar el input al cerrar el modal
  // }

  // // Efecto para enfocar el input cuando el modal se abre y mantenerlo enfocado
  // useEffect(() => {
  //   if (openLogin && inputRef.current) {
  //     setTimeout(() => {
  //       inputRef.current.focus();
  //     }, 100);
  //   }
  // }, [openLogin]);

  // // Función para mantener el foco en el input si se hace clic en el modal
  // const handleModalClick = () => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // };

  return (
    <div className="background-container">
      <div className='btn-volver'>
        <Button onClick={goMenu}>Volver</Button>
      </div>

      <div className="form-container dia">
        <div className="header">
          <img src={logo} alt="Logo de la empresa" className="logo" />
          <div className="dia-titulo2">
            <Typography variant="h1" component="h1"></Typography>
          </div>
          <h2 className="nombre-empresa">POWERS ATHLETIC DE HONDURAS S.A DE C.V</h2>
        </div>

        <div className="dia-actual">
          <div className="dia-titulo">
            <Typography variant="h1" component="h1">
              {dayjs().format('dddd').toString().toLocaleUpperCase()}
            </Typography>
          </div>
        </div>

        <div className="button-container">
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button variant="contained" onClick={goAttendance} className="btn-registrar-unique">
                REGISTRAR
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleDespachoClick} className="btn-despacho-unique">
                DESPACHO
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>


      <SupervisorLoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onSuccess={handleLoginSuccess}
      />
      {/* <Modal open={openLogin} onClose={handleCloseLogin}>
        <Box className="despacho-login-container" onClick={handleModalClick}>
          <div className="despacho-card">

            <div className="despacho-avatar-circle">
            </div>

            <div className="despacho-title">Supervisor Access</div>

            <div className="despacho-barcode">
              <div className="barcode-lines">
                {Array.from({ length: 50 }, (_, i) => (
                  <div key={i} className="barcode-line"></div>
                ))}
              </div>
            </div>

            

            {error && <div className="despacho-error">{error}</div>}
          </div>

      
          <input
            ref={inputRef}
            className="despacho-hidden-input"
            type="text"
            value={supervisorIDInput}
            onChange={(e) => setSupervisorIDInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              width: '1px',
              height: '1px',
              opacity: 0,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              zIndex: 1000
            }}
          />
        </Box>
      </Modal> */}
    </div>
  );
};

export default MainAttendance;

