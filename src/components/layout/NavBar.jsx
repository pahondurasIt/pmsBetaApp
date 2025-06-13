// NavBar.jsx
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import logo from '../../assets/logpms.png';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { useAuth } from '../../context/AuthContext';
import GridLoader from '../common/GridLoader'; // Importar el loader personalizado
import '../css/NavBar.css';

// Constantes para el ancho del drawer
const drawerWidth = 240;
const collapsedWidth = 60;

const NavBar = (props) => {
  const { window } = props;
  const navigate = useNavigate();
  const location = useLocation();
  
  // Usar el contexto de autenticación para acceder a datos del usuario y función logout
  const { user, logout, getCurrentUser } = useAuth();

  // Estados para el manejo de la interfaz
  const [mobileOpen, setMobileOpen] = React.useState(true); // Drawer abierto por defecto
  const [isClosing, setIsClosing] = React.useState(false);
  const [appBarTitle, setAppBarTitle] = React.useState('Powers Athletic Honduras');
  const [openSubMenu, setOpenSubMenu] = React.useState(false);
  
  // **NUEVO**: Estados para el popover de submódulos con animaciones
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showSubModulesPopover, setShowSubModulesPopover] = React.useState(false);
  const [isPopoverAnimating, setIsPopoverAnimating] = React.useState(false);
  const [arrowRotated, setArrowRotated] = React.useState(false);
  
  // **NUEVO**: Estados para el loader de logout
  const [showLogoutLoader, setShowLogoutLoader] = React.useState(false);
  const [logoutText, setLogoutText] = React.useState('');

  // Obtener datos del usuario actual
  const currentUser = getCurrentUser();

  // Efecto para actualizar el título de la AppBar basado en la ruta actual
  React.useEffect(() => {
    // Mapeo de rutas a títulos
    const routeTitleMap = {
      'recordattendance': 'Records Attendance',
      'employees': 'Información sobre Empleados',
      'permission': 'Alta de Permiso'
    };

    // Buscar coincidencia en la ruta actual
    const currentRoute = Object.keys(routeTitleMap).find(route => 
      location.pathname.includes(route)
    );

    // Actualizar título o usar el por defecto
    if (currentRoute) {
      setAppBarTitle(routeTitleMap[currentRoute]);
    } else {
      setAppBarTitle('Powers Athletic Honduras');
    }
  }, [location]);

  // Función para cerrar el drawer
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  // Función que se ejecuta cuando termina la transición del drawer
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  // Función para alternar la visibilidad del drawer
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
      // Cerrar submenú y popover cuando se colapsa el drawer
      if (mobileOpen) {
        setOpenSubMenu(false);
        handleClosePopover();
      }
    }
  };

  // Función para cambiar el título de la AppBar
  const handleTitleChange = (newTitle) => {
    setAppBarTitle(newTitle);
  };

  // **MODIFICADO**: Función para manejar el click en Human Resources con animaciones
  const handleSubMenuToggle = (event) => {
    if (showSubModulesPopover) {
      // Si ya está abierto, cerrarlo
      handleClosePopover();
    } else {
      // Si está cerrado, abrirlo
      setAnchorEl(event.currentTarget);
      setIsPopoverAnimating(true);
      setArrowRotated(true);
      setShowSubModulesPopover(true);
      
      // Resetear la animación después de un tiempo
      setTimeout(() => {
        setIsPopoverAnimating(false);
      }, 300);
    }
  };

  // **MODIFICADO**: Función para cerrar el popover con animaciones
  const handleClosePopover = () => {
    setIsPopoverAnimating(true);
    setArrowRotated(false);
    
    // Delay para permitir la animación de cierre
    setTimeout(() => {
      setShowSubModulesPopover(false);
      setAnchorEl(null);
      setIsPopoverAnimating(false);
    }, 200);
  };

  // **NUEVO**: Función para manejar navegación desde popover
  const handlePopoverNavigation = (path, title) => {
    handleTitleChange(title);
    navigate(path);
    handleClosePopover();
  };

  // **NUEVA FUNCIONALIDAD**: Función para manejar logout con loader personalizado
  const handleLogoutClick = async () => {
    console.log('Iniciando proceso de logout...');
    
    // Mostrar el loader de logout inmediatamente
    setShowLogoutLoader(true);
    setLogoutText(`Cerrando sesión de ${currentUser?.username || 'Usuario'}...`);
    
    try {
      // Secuencia de mensajes durante el logout para mejor experiencia
      setTimeout(() => {
        setLogoutText('Limpiando datos de sesión...');
      }, 1000);
      
      setTimeout(() => {
        setLogoutText('Desconectando del servidor...');
      }, 2000);
      
      setTimeout(() => {
        setLogoutText('Finalizando sesión...');
      }, 3000);
      
      // Ejecutar el logout después de 4 segundos
      setTimeout(async () => {
        try {
          // Llamar a la función logout del contexto de autenticación
          await logout();
          
          console.log('Logout completado exitosamente');
          
          // Mensaje final antes de redirigir
          setLogoutText('¡Sesión cerrada! Redirigiendo...');
          
          // Redirigir al login después de un breve delay
          setTimeout(() => {
            setShowLogoutLoader(false);
            navigate('/login', { replace: true });
          }, 1500);
          
        } catch (error) {
          console.error('Error durante el logout:', error);
          
          // Incluso si hay error, redirigir al login por seguridad
          setLogoutText('Finalizando...');
          setTimeout(() => {
            setShowLogoutLoader(false);
            navigate('/login', { replace: true });
          }, 1000);
        }
      }, 4000);
      
    } catch (error) {
      console.error('Error al iniciar logout:', error);
      
      // En caso de error inmediato, ocultar loader y redirigir
      setShowLogoutLoader(false);
      navigate('/login', { replace: true });
    }
  };

  // Contenido del drawer (menú lateral)
  const drawer = (
    <div>
      {/* Sección superior del drawer con logo e información */}
      <div className={`toolbar-container ${!mobileOpen ? 'collapsed' : ''}`}>
        <div className={`logo-container ${!mobileOpen ? 'hidden' : ''}`}>
          <img src={logo} alt="Company Logo" />
        </div>
        <div className={`title-container ${!mobileOpen ? 'hidden' : ''}`}>
          <Typography variant="h6">
            Human Resources Management
          </Typography>
        </div>
        <div className={`info-container ${!mobileOpen ? 'hidden' : ''}`}>
          <Typography variant="body2">
            {/* Mostrar información del usuario autenticado */}
            Usuario: {currentUser?.username || currentUser?.email || 'Usuario'}
            <br />
            {/* Mostrar información de la compañía seleccionada si existe */}
            {currentUser?.selectedCompany && (
              <>Compañía: {currentUser.selectedCompany.companyName}</>
            )}
          </Typography>
        </div>
      </div>
      
      <Divider />
      
      {/* Lista principal de navegación */}
      <List>
        {/* Elemento principal: Human Resources Management */}
        <ListItem key="human-resources" disablePadding>
          <ListItemButton 
            onClick={handleSubMenuToggle}
            className={`human-resources-button ${showSubModulesPopover ? 'popover-open' : ''}`}
          >
            <ListItemIcon sx={{ color: '#ffff', minWidth: mobileOpen ? 56 : 'auto', justifyContent: 'center' }}>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText
              primary="Human Resources Management"
              sx={{
                opacity: mobileOpen ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                color: '#ffffff',
                display: mobileOpen ? 'block' : 'none',
              }}
            />
            {/* **MODIFICADO**: Icono de flecha que inicia hacia abajo y rota 90° hacia la izquierda, y color blanco */}
            {mobileOpen && (
              <KeyboardArrowDown 
                className="arrow-icon"
                sx={{ 
                  color: arrowRotated ? '#ffffff' : '#ffffff', // Set to white when rotated
                  transform: arrowRotated ? 'rotate(-90deg)' : 'rotate(0deg)', // Rotate -90deg
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }} 
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider />
      
      {/* Sección inferior con logout */}
      <List>
        <ListItem key="logout" disablePadding sx={{ color: 'error.main' }}>
          {/* **MODIFICADO**: Ahora llama a handleLogoutClick en lugar de navegar directamente */}
          <ListItemButton onClick={handleLogoutClick}>
            <ListItemIcon
              sx={{
                color: 'error.main',
                minWidth: mobileOpen ? 56 : 'auto',
                justifyContent: 'center'
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar sesión"
              sx={{
                opacity: mobileOpen ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                color: '#ffffff',
                display: mobileOpen ? 'block' : 'none',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  // **MODIFICADO**: Contenido del popover de submódulos con animaciones mejoradas
  const subModulesPopover = (
    <Popover
      open={showSubModulesPopover}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      TransitionComponent={Grow}
      transitionDuration={{
        enter: 300,
        exit: 200,
      }}
      sx={{
        '& .MuiPopover-paper': {
          backgroundColor: '#424242',
          border: '1px solid #555',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          minWidth: mobileOpen ? 280 : 'auto',
          width: mobileOpen ? 'auto' : 'fit-content',
          overflow: 'hidden',
        },
      }}
    >
      <Grow
        in={showSubModulesPopover}
        timeout={{
          enter: 300,
          exit: 200,
        }}
        style={{
          transformOrigin: 'center left',
        }}
      >
        <Paper
          sx={{
            backgroundColor: '#424242',
            color: '#ffffff',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* **ELIMINADO**: Header del popover - ya no se muestra el título */}
          
          {/* Contenido del popover */}
          <List sx={{ p: 0 }}>
            {/* Opción: Employees */}
            <ListItem disablePadding>
              {/* Conditional Tooltip */}
              {mobileOpen ? (
                <ListItemButton
                  onClick={() => handlePopoverNavigation('/app/employees', 'Información sobre Empleados')}
                  sx={{
                    '&:hover': { backgroundColor: '#555' },
                    py: 1.5,
                    px: 2,
                    justifyContent: 'flex-start',
                    minWidth: 'auto',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: '#ffffff', 
                    minWidth: 40,
                    justifyContent: 'center',
                    margin: '0 8px 0 0',
                  }}>
                    <PersonIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employees"
                    sx={{ color: '#ffffff' }}
                  />
                </ListItemButton>
              ) : (
                <Tooltip title="Employees" placement="right" arrow>
                  <ListItemButton
                    onClick={() => handlePopoverNavigation('/app/employees', 'Información sobre Empleados')}
                    sx={{
                      '&:hover': { backgroundColor: '#555' },
                      py: 1,
                      px: 1.5,
                      justifyContent: 'center',
                      minWidth: 48,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: '#ffffff', 
                      minWidth: 'auto',
                      justifyContent: 'center',
                      margin: 0,
                    }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              )}
            </ListItem>

            {mobileOpen && <Divider sx={{ backgroundColor: '#555' }} />}

            {/* Opción: Records Attendance */}
            <ListItem disablePadding>
              {/* Conditional Tooltip */}
              {mobileOpen ? (
                <ListItemButton
                  onClick={() => handlePopoverNavigation('/app/recordattendance', 'Records Attendance')}
                  sx={{
                    '&:hover': { backgroundColor: '#555' },
                    py: 1.5,
                    px: 2,
                    justifyContent: 'flex-start',
                    minWidth: 'auto',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: '#ffffff', 
                    minWidth: 40,
                    justifyContent: 'center',
                    margin: '0 8px 0 0',
                  }}>
                    <AccessTimeFilledIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Records Attendance"
                    sx={{ color: '#ffffff' }}
                  />
                </ListItemButton>
              ) : (
                <Tooltip title="Records Attendance" placement="right" arrow>
                  <ListItemButton
                    onClick={() => handlePopoverNavigation('/app/recordattendance', 'Records Attendance')}
                    sx={{
                      '&:hover': { backgroundColor: '#555' },
                      py: 1,
                      px: 1.5,
                      justifyContent: 'center',
                      minWidth: 48,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: '#ffffff', 
                      minWidth: 'auto',
                      justifyContent: 'center',
                      margin: 0,
                    }}>
                      <AccessTimeFilledIcon fontSize="small" />
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              )}
            </ListItem>

            {mobileOpen && <Divider sx={{ backgroundColor: '#555' }} />}

            {/* Opción: Permission */}
            <ListItem disablePadding>
              {/* Conditional Tooltip */}
              {mobileOpen ? (
                <ListItemButton
                  onClick={() => handlePopoverNavigation('/app/permission', 'Alta de Permiso')}
                  sx={{
                    '&:hover': { backgroundColor: '#555' },
                    py: 1.5,
                    px: 2,
                    justifyContent: 'flex-start',
                    minWidth: 'auto',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: '#ffffff', 
                    minWidth: 40,
                    justifyContent: 'center',
                    margin: '0 8px 0 0',
                  }}>
                    <AssignmentAddIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Permission"
                    sx={{ color: '#ffffff' }}
                  />
                </ListItemButton>
              ) : (
                <Tooltip title="Permission" placement="right" arrow>
                  <ListItemButton
                    onClick={() => handlePopoverNavigation('/app/permission', 'Alta de Permiso')}
                    sx={{
                      '&:hover': { backgroundColor: '#555' },
                      py: 1,
                      px: 1.5,
                      justifyContent: 'center',
                      minWidth: 48,
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: '#ffffff', 
                      minWidth: 'auto',
                      justifyContent: 'center',
                      margin: 0,
                    }}>
                      <AssignmentAddIcon fontSize="small" />
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              )}
            </ListItem>
          </List>
        </Paper>
      </Grow>
    </Popover>
  );

  // Obtener el contenedor para el drawer móvil
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      {/* **LOADER PERSONALIZADO**: Se muestra durante el proceso de logout */}
      <GridLoader 
        isVisible={showLogoutLoader}
        text={logoutText}
        type="logout"
      />

      {/* **NUEVO**: Popover para mostrar submódulos con animaciones */}
      {subModulesPopover}
      
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* AppBar superior */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${mobileOpen ? drawerWidth : collapsedWidth}px)` },
            ml: { sm: `${mobileOpen ? drawerWidth : collapsedWidth}px` },
            transition: 'width 0.3s ease-in-out, margin-left 0.3s ease-in-out',
          }}
        >
          <Toolbar>
            {/* Botón para toggle del drawer */}
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            {/* Título dinámico de la AppBar */}
            <Typography variant="h6" noWrap component="div">
              {appBarTitle}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Contenedor del drawer de navegación */}
        <Box
          component="nav"
          sx={{ width: { sm: mobileOpen ? drawerWidth : collapsedWidth }, flexShrink: { sm: 0 } }}
          aria-label="navigation menu"
        >
          {/* Drawer para móviles (temporal) */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            transitioncomponent={Slide}
            transitionprops={{ direction: 'left' }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: '#424242',
                transition: 'transform 0.3s ease-in-out',
              },
            }}
            slotProps={{
              root: {
                keepMounted: true, // Mejor rendimiento en móviles
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Drawer para escritorio (permanente) */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: mobileOpen ? drawerWidth : collapsedWidth,
                backgroundColor: '#424242',
                transition: 'width 0.3s ease-in-out',
                overflowX: 'hidden',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Área principal de contenido */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { xs: '100%', sm: `calc(100% - ${mobileOpen ? drawerWidth : collapsedWidth}px)` },
            minHeight: '100vh',
            overflowY: 'auto',
            maxHeight: '100vh',
            boxSizing: 'border-box',
            transition: 'width 0.3s ease-in-out',
          }}
        >
          <Toolbar />
          {/* Aquí se renderizan las rutas hijas */}
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

// Definir PropTypes para validación
NavBar.propTypes = {
  window: PropTypes.func,
};

export default NavBar;