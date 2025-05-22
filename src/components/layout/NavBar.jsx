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
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Tooltip from '@mui/material/Tooltip';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import logo from '../../assets/logpms.png'; // Placeholder para la imagen del logo
import '../css/NavBar.css';

const drawerWidth = 240;

const NavBar = (props) => {
  const { window } = props;
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(true); // Inicia abierto por defecto
  const [isClosing, setIsClosing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [appBarTitle, setAppBarTitle] = React.useState('Powers Athletic Honduras'); // Estado para el título dinámico

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

  // Función para cambiar el título del AppBar según el submódulo seleccionado
  const handleTitleChange = (newTitle) => {
    setAppBarTitle(newTitle);
  };



  const drawer = (
    <div>
      <div className="toolbar-container">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" />
        </div>
        <div className="title-container">
          <Typography variant="h6">
            Human Resources Management
          </Typography>
        </div>
        <div className="info-container">
          <Typography variant="body2">
            Notificaciones de Conexión<br />Usuario: [Nombre del Empleado]
          </Typography>
        </div>
        <div className="search-container">
          <InputBase
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleModuleSelect()}
            placeholder="Buscar módulos..."
            inputProps={{ 'aria-label': 'search' }}
            startAdornment={<SearchIcon />}
          />
        </div>
      </div>
      <Divider />
      <List>
        <ListItem key="human-resources" disablePadding>
          <Tooltip
            title={
              <List sx={{ display: 'flex', flexDirection: 'column', padding: '8px' }}> {/* Change: Changed flexDirection to 'column' for vertical layout */}
                <ListItem key="recordattendance" disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="../human-resources/recordattendance"
                    onClick={() => handleTitleChange('Records Attendance')}
                  >
                    <ListItemIcon sx={{ color: '#ffff' }}>
                      <AccessTimeFilledIcon />
                    </ListItemIcon>
                    <ListItemText primary="Records Attendance" />
                  </ListItemButton>
                </ListItem>
                <ListItem key="employees" disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to="../human-resources/employees"
                    onClick={() => handleTitleChange('Employees')}
                  >
                    <ListItemIcon sx={{ color: '#ffff' }}>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Employees" />
                  </ListItemButton>
                </ListItem>
              </List>
            }
            placement="right"
            arrow
          >
            <ListItemButton>
              <ListItemIcon sx={{ color: '#ffff' }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText
                primary="Human Resources Management"
                sx={{
                  opacity: mobileOpen ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  color: '#ffffff',
                }}
              />
            </ListItemButton>
          </Tooltip>
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
                color: '#ffffff',
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

      {/* Header del NavBar de Power Athletic */}
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
            {appBarTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      {/*Contenedor de box del layout de */}
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

      {/*Contendero de Box del Main de los modulos de submodulos */}
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