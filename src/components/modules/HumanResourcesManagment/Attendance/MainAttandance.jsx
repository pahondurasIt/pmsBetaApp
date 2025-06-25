import React, { useState } from 'react';
import { Button, Grid, Typography, Modal, TextField, Box, Alert } from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/mainAsistencia.css';
import logo from '../../../../assets/logwhite.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const MainAttendance = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler for the new 'Registrar' button
  const handleRegistrarClick = () => {
    navigate('/attendance'); // Navigates directly to the attendance page
  };

  // Handler for the 'Despacho' button with authentication check
  const handleDespachoClick = () => {
    if (!isAuthenticated('despacho')) {
      setOpenLogin(true);
      setError(''); // Limpiar errores previos
      setCredentials({ username: '', password: '' }); // Limpiar credenciales
    } else {
      navigate('/attendance', {
        state: { op: 'DESPACHO' }
      });
    }
  };

  // Handler for the 'Volver' button
  const handleGoBack = () => {
    navigate(-1); // Go back one step in history
  };

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setOpenLogin(false);
    setError('');
    setCredentials({ username: '', password: '' });
    setLoading(false);
  };

  // Handler para el login de despacho
  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/auth/login-despacho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        setOpenLogin(false);
        setCredentials({ username: '', password: '' });
        navigate('/attendance', {
          state: { op: 'DESPACHO' }
        });
      } else {
        setError(data.message || 'Error en el login');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para presionar Enter en los campos del formulario
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="background-container">
      {/* BOTON DE VOLVER */}
      <div className='btn-volver'>
        <Button
          onClick={handleGoBack}>
          Volver
        </Button>
      </div>

      <div className="form-container dia">
        {/* Encabezado */}
        <div className="header">
          <img src={logo} alt="Logo de la empresa" className="logo" />
          <div className="dia-titulo2">
            <Typography variant="h1" component="h1"></Typography>
          </div>
          <h2 className="nombre-empresa">POWERS ATHLETIC DE HONDURAS S.A DE C.V</h2>
        </div>

        {/* Día actual */}
        <div className="dia-actual">
          <div className="dia-titulo">
            <Typography variant="h1" component="h1">
              {dayjs().format('dddd').toString().toLocaleUpperCase()}
            </Typography>
          </div>
        </div>

        {/* Contenedor de botones modificado */}
        <div className="button-container">
          <Grid container spacing={3} justifyContent="center">
            {/* New 'Registrar' button */}
            <Grid item>
              <Button
                variant="contained"
                onClick={handleRegistrarClick}
                className="btn-registrar-unique"
              >
                REGISTRAR
              </Button>
            </Grid>
            {/* Existing 'Despacho' button */}
            <Grid item>
              <Button
                variant="contained"
                onClick={handleDespachoClick}
                className="btn-despacho-unique"
              >
                DESPACHO
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Modal de Login para Despacho - Mejorado */}
      <Modal 
        open={openLogin} 
        onClose={handleCloseModal}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="login-modal-title" variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
            Autenticación de Despacho
          </Typography>
          
          <Typography id="login-modal-description" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Ingresa tus credenciales para acceder al módulo de despacho
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Usuario"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            onKeyPress={handleKeyPress}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={loading}
            autoFocus
          />
          
          <TextField
            label="Contraseña"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            onKeyPress={handleKeyPress}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={loading}
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleLogin}
              disabled={loading || !credentials.username || !credentials.password}
              sx={{ minWidth: 100 }}
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default MainAttendance;

