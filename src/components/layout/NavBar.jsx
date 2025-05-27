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
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import logo from '../../assets/logpms.png';
import '../css/NavBar.css';

const drawerWidth = 240;
const collapsedWidth = 60;

const NavBar = (props) => {
  const { window } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = React.useState(true); // Starts open by default
  const [isClosing, setIsClosing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [appBarTitle, setAppBarTitle] = React.useState('Powers Athletic Honduras');
  const [openSubMenu, setOpenSubMenu] = React.useState(false);

  // Update title based on current route
  React.useEffect(() => {
    if (location.pathname.includes('recordattendance')) {
      setAppBarTitle('Records Attendance');
    } else if (location.pathname.includes('employees')) {
      setAppBarTitle('Información sobre Empleados');
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
      // Close submenu when collapsing drawer
      if (mobileOpen) {
        setOpenSubMenu(false);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleModuleSelect = () => {
    if (searchQuery.toLowerCase() === 'empleados') {
      navigate('/human-resources/employees');
      setSearchQuery('');
    }
  };

  const handleTitleChange = (newTitle) => {
    setAppBarTitle(newTitle);
  };

  const handleSubMenuToggle = () => {
    // Only allow submenu toggle if drawer is open
    if (mobileOpen) {
      setOpenSubMenu(!openSubMenu);
    } else {
      // If drawer is collapsed, open it first
      setMobileOpen(true);
      setOpenSubMenu(true);
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
            Notificaciones de Conexión<br />Usuario: [Nombre del Empleado]
          </Typography>
        </div>
        <div className={`search-container ${!mobileOpen ? 'hidden' : ''}`}>
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
          <ListItemButton onClick={handleSubMenuToggle}>
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
            {mobileOpen && (openSubMenu ? <ExpandLess sx={{ color: '#ffffff' }} /> : <ExpandMore sx={{ color: '#ffffff' }} />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={openSubMenu && mobileOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="sub-drawer">
            <ListItem key="recordattendance" disablePadding>
              <ListItemButton
                component={NavLink}
                to="/human-resources/recordattendance"
                onClick={() => handleTitleChange('Records Attendance')}
                sx={{ pl: 4 }}
              >
                <ListItemIcon sx={{ color: '#ffff', minWidth: 56 }}>
                  <AccessTimeFilledIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Records Attendance"
                  sx={{
                    opacity: mobileOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    color: '#ffffff',
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="employees" disablePadding>
              <ListItemButton
                component={NavLink}
                to="/human-resources/employees"
                onClick={() => handleTitleChange('Información sobre Empleados')}
                sx={{ pl: 4 }}
              >
                <ListItemIcon sx={{ color: '#ffff', minWidth: 56 }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Employees"
                  sx={{
                    opacity: mobileOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    color: '#ffffff',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem key="logout" disablePadding sx={{ color: 'error.main' }}>
          <ListItemButton component={NavLink} to="/login" onClick={handleDrawerClose}>
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

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
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
        {/* Mobile Drawer */}
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

        {/* Desktop Drawer */}
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
        <Outlet />
      </Box>
    </Box>
  );
};

NavBar.propTypes = {
  window: PropTypes.func,
};

export default NavBar;