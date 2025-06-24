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
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Grow from '@mui/material/Grow';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import logo from '../../assets/logpms.png';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { useAuth } from '../../context/AuthContext';
import GridLoader from '../common/GridLoader'; // Importar el loader personalizado
import '../css/NavBar.css';

const drawerWidth = 240;
const collapsedWidth = 60;

const NavBar = (props) => {
  const { window } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, getCurrentUser } = useAuth();

  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);
  const [appBarTitle, setAppBarTitle] = React.useState('Powers Athletic Honduras');
  const [openSubMenu, setOpenSubMenu] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showSubModulesPopover, setShowSubModulesPopover] = React.useState(false);
  const [isPopoverAnimating, setIsPopoverAnimating] = React.useState(false);
  const [arrowRotated, setArrowRotated] = React.useState(false);

  const [showLogoutLoader, setShowLogoutLoader] = React.useState(false);
  const [logoutText, setLogoutText] = React.useState('');

  const currentUser = getCurrentUser();

  React.useEffect(() => {
    const routeTitleMap = {
      'recordattendance': 'Records Attendance',
      'employees': 'Información sobre Empleados',
      'permission': 'Alta de Permiso'
    };

    const currentRoute = Object.keys(routeTitleMap).find(route =>
      location.pathname.includes(route)
    );

    if (currentRoute) {
      setAppBarTitle(routeTitleMap[currentRoute]);
    } else {
      setAppBarTitle('Powers Athletic Honduras');
    }
  }, [location]);

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
      if (mobileOpen) {
        setOpenSubMenu(false);
        handleClosePopover();
      }
    }
  };

  const handleTitleChange = (newTitle) => {
    setAppBarTitle(newTitle);
  };

  const handleSubMenuToggle = (event) => {
    if (showSubModulesPopover) {
      handleClosePopover();
    } else {
      setAnchorEl(event.currentTarget);
      setIsPopoverAnimating(true);
      setArrowRotated(true);
      setShowSubModulesPopover(true);

      setTimeout(() => {
        setIsPopoverAnimating(false);
      }, 300);
    }
  };

  const handleClosePopover = () => {
    setIsPopoverAnimating(true);
    setArrowRotated(false);

    setTimeout(() => {
      setShowSubModulesPopover(false);
      setAnchorEl(null);
      setIsPopoverAnimating(false);
    }, 200);
  };

  const handlePopoverNavigation = (path, title) => {
    handleTitleChange(title);
    navigate(path);
    handleClosePopover();
  };

  const handleLogoutClick = async () => {
    setShowLogoutLoader(true);
    setLogoutText(`Cerrando sesión de ${currentUser?.username || 'Usuario'}...`);

    try {
      setTimeout(async () => {
        try {
          await logout();
          setLogoutText('¡Sesión cerrada! Redirigiendo...');

          setTimeout(() => {
            setShowLogoutLoader(false);
            navigate('/login', { replace: true });
          }, 300);
        } catch (error) {
          console.error('Error durante el logout:', error);
          setLogoutText('Finalizando...');
          setTimeout(() => {
            setShowLogoutLoader(false);
            navigate('/login', { replace: true });
          }, 300);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error al iniciar logout:', error);
      setShowLogoutLoader(false);
      navigate('/login', { replace: true });
    }
  };

  const drawer = (
    <div>
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
            Usuario: {currentUser?.username || currentUser?.email || 'Usuario'}
            <br />
            {currentUser?.selectedCompany && (
              <>Compañía: {currentUser.selectedCompany.companyName}</>
            )}
          </Typography>
        </div>
      </div>

      <Divider />

      <List>
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
            {mobileOpen && (
              <KeyboardArrowDown
                className="arrow-icon"
                sx={{
                  color: arrowRotated ? '#ffffff' : '#ffffff',
                  transform: arrowRotated ? 'rotate(-90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem key="logout" disablePadding sx={{ color: 'error.main' }}>
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
          <List sx={{ p: 0 }}>
            {mobileOpen ? (
              <ListItem disablePadding>
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
              </ListItem>
            ) : (
              <ListItem disablePadding>
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
              </ListItem>
            )}

            {mobileOpen && <Divider sx={{ backgroundColor: '#555' }} />}

            {mobileOpen ? (
              <ListItem disablePadding>
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
              </ListItem>
            ) : (
              <ListItem disablePadding>
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
              </ListItem>
            )}

            {mobileOpen && <Divider sx={{ backgroundColor: '#555' }} />}

            {mobileOpen ? (
              <ListItem disablePadding>
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
              </ListItem>
            ) : (
              <ListItem disablePadding>
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
              </ListItem>
            )}
          </List>
        </Paper>
      </Grow>
    </Popover>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <GridLoader
        isVisible={showLogoutLoader}
        text={logoutText}
        type="logout"
      />

      {subModulesPopover}

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${mobileOpen ? drawerWidth : collapsedWidth}px)` },
            ml: { sm: `${mobileOpen ? drawerWidth : collapsedWidth}px` },
            transition: 'width 0.3s ease-in-out, margin-left 0.3s ease-in-out',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
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

        <Box
          component="nav"
          sx={{ width: { sm: mobileOpen ? drawerWidth : collapsedWidth }, flexShrink: { sm: 0 } }}
          aria-label="navigation menu"
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

        <Box
          sx={{
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              px: 2,
              pb: 4,
              overflowY: 'auto', // Enable vertical scrolling
              maxHeight: 'calc(100vh - 64px - 30px)', // Adjust based on AppBar height and desired top margin
            }}
            className="scrollable-content" // Add this class
          >
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                height: 'auto', // Allow content to dictate height
                padding: '18px',
                marginTop: '15px',
                backgroundColor: '#fff',
                borderRadius: 2,
              }}
            >
              <Outlet />
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

NavBar.propTypes = {
  window: PropTypes.func,
};

export default NavBar;