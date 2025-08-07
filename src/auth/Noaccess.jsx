// components/common/NoAccessPage.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';


const NoAccessPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="70vh"
      textAlign="center"
      sx={{ p: 4 }}
    >
      <LockIcon sx={{ fontSize: 80, color: "gray" }} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Acceso denegado
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No tienes permisos para acceder a ninguna funcionalidad. <br />
        Por favor, contacta con el administrador del sistema.
      </Typography>
      
    </Box>
  );
};

export default NoAccessPage;
