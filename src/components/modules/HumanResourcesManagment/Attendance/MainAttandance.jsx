import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/mainAsistencia.css';
import logo from '../../../../assets/logwhite.png';
import { useNavigate } from 'react-router-dom';


const MainAttandance = () => {
  const navigate = useNavigate();

  // Handler for the new 'Registrar' button
  const handleRegistrarClick = () => {
    navigate('/attendance'); // Navigates directly to the attendance page
  };

  // Handler for the 'Despacho' button (remains the same)
  const handleDespachoClick = () => {
    navigate('/attendance', {
      state: { op: 'DESPACHO' }
    });
  };

  // Handler for the 'Volver' button (remains the same)
  const handleGoBack = () => {
    navigate(-1); // Go back one step in history
  };


  return (
    <div className="background-container">
      {/* BOTON DE VOLVER  */}
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
                className="btn-registrar-unique" // New unique class for styling
              >
                REGISTRAR
              </Button>
            </Grid>
            {/* Existing 'Despacho' button */}
            <Grid item>
              <Button
                variant="contained"
                onClick={handleDespachoClick}
                className="btn-despacho-unique" // Keep existing class
              >
                DESPACHO
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default MainAttandance;
