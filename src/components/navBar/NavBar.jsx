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
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logpms.png'; // Placeholder para la imagen del logo, reemplaza con la ruta real

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'animate.css';

const drawerWidth = 240;

const NavBar = (props) => {
  const { window } = props;
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(true); // Inicia abierto por defecto
  const [isClosing, setIsClosing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleModuleSelect = () => {
    if (searchQuery.toLowerCase() === 'empleados') {
      navigate('/employees');
      setSearchQuery('');
    }
  };

  const drawer = (
    <div>
      {/* Bloque del Toolbar con logo centrado, información del empleado y motor de búsqueda */}
      <Toolbar sx={{ backgroundColor: '#424242', color: '#ffffff', p: 1, flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo centrado */}
        <Box sx={{ mb: 1 }}>
          <img src={logo} alt="Company Logo" style={{ height: '150px' }} />
        </Box>
        {/* Título y sección de gestión */}
        <Typography variant="h6" sx={{ color: '#ffffff', mb: 1, textAlign: 'center' }}>
          Human Resources Management
        </Typography>
        {/* Información del empleado */}
        <Typography variant="body2" sx={{ color: '#ffffff', mb: 1, textAlign: 'center' }}>
          Notificaciones de Conexión<br />Usuario: [Nombre del Empleado]
        </Typography>
        {/* Motor de búsqueda funcional */}
        <InputBase
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleModuleSelect()}
          placeholder="Buscar módulos..."
          inputProps={{ 'aria-label': 'search' }}
          sx={{ color: '#ffffff', backgroundColor: '#333333', borderRadius: '4px', p: '2px 8px', width: '100%', mb: 1 }}
          startAdornment={<SearchIcon sx={{ color: '#ffffff', mr: 1 }} />}
        />
      </Toolbar>
      <Divider />
      <List>
        {/* Módulo de Empleados */}
        <ListItem key="employee" disablePadding>
          <ListItemButton component={NavLink} to="/employees">
            <ListItemIcon sx={{ color: '#ffffff' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary="Empleados"
              sx={{ 
                opacity: mobileOpen ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                color: '#ffffff' 
              }}
            />
          </ListItemButton>
        </ListItem>
        {/* Módulo placeholder Process 1 */}
        <ListItem key="process1" disablePadding>
          <ListItemButton disabled>
            <ListItemIcon sx={{ color: '#ffffff' }}>
              <PersonIcon /> {/* Ícono placeholder */}
            </ListItemIcon>
            <ListItemText
              primary="Process (En desarrollo)"
              sx={{ 
                opacity: mobileOpen ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                color: '#ffffff' 
              }}
            />
          </ListItemButton>
        </ListItem>
        {/* Módulo placeholder Process 2 */}
        <ListItem key="process2" disablePadding>
          <ListItemButton disabled>
            <ListItemIcon sx={{ color: '#ffffff' }}>
              <PersonIcon /> {/* Ícono placeholder */}
            </ListItemIcon>
            <ListItemText
              primary="Process (En desarrollo)"
              sx={{ 
                opacity: mobileOpen ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                color: '#ffffff' 
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key="logout" disablePadding sx={{ color: 'error.main' }}>
          <ListItemButton component={NavLink} to="/login" onClick={handleDrawerClose}>
            <ListItemIcon sx={{ color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar sesión"
              sx={{
                opacity: mobileOpen ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                color: '#ffffff' 
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${mobileOpen ? drawerWidth : 60}px)` },
          ml: { sm: `${mobileOpen ? drawerWidth : 60}px` },
          transition: 'width 0.3s ease-in-out, margin-left 0.3s ease-in-out',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Powers Athletic Honduras
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: mobileOpen ? drawerWidth : 60 }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'left' }}
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
              keepMounted: true,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: mobileOpen ? drawerWidth : 60,
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', sm: `calc(100% - ${mobileOpen ? drawerWidth : 60}px)` },
          minHeight: '100vh',
          overflowX: 'auto',
          boxSizing: 'border-box',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Toolbar />
        <main>
          <Outlet />
        </main>
      </Box>
    </Box>
  );
};

export default NavBar;