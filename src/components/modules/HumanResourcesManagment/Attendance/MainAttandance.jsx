import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import '../../../css/mainAsistencia.css';
import logo from '../../../../assets/logwhite.png';
import { useNavigate } from 'react-router-dom';


const MainAttandance = () => {
  const handleEntradaClick = () => {
    navigate('/attendance', {
      state: { op: 'ENTRADA' }
    });
  };

  const handleSalidaClick = () => {
    navigate('/attendance', {
      state: { op: 'SALIDA' }
    });
  };

  const handleDespachoClick = () => {
    navigate('/attendance', {
      state: { op: 'DESPACHO' }
    });
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // o navigate.goBack()
    // navigate(-1) retrocede una posición en el historial, igual que navigate.goBack()
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

        {/* Contenedor de botones */}
        <div className="button-container">
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                onClick={handleEntradaClick}
                className="btn-entrada-unique"
              >
                ENTRADA
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleSalidaClick}
                className="btn-salida-unique"
              >
                SALIDA
              </Button>
            </Grid>
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
    </div>
  );
};

export default MainAttandance;