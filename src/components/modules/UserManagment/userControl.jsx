import { useState, useEffect, useRef } from "react";
import {
    Tabs,
    Tab,
    Box,
    Button,
    TextField,
    Typography,
    Collapse,
    IconButton,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { apipms } from "../../../service/apipms";
import { Toast } from 'primereact/toast';
// import '../../css/usercontrol.css';
import { UserForm } from "./UserForm";
// Componente para el panel de Control de Usuarios
// const UserControlPanel = ({ }) => {
//   return (
//     <div className="usercontainer">
//       <h2 className="titlecontrol">Control de Usuarios</h2>
//       <p>Esta sección está vacía por el momento.</p>
//     </div>
//   );
// };


const CrearPantallasPanel = () => {
    const toast = useRef(null);
    const [showModuloInput, setShowModuloInput] = useState(false);
    const [moduloName, setModuloName] = useState(null);
    const [modulos, setModulos] = useState([]);
    // Modal para crear módulo
    const [openCreateModuleModal, setOpenCreateModuleModal] = useState(false);
    const [newModuleID, setNewModuleID] = useState('');
    const [newModuleName, setNewModuleName] = useState('');



    const [screen, setScreen] = useState([]);
    const [permisoInputValue, setPermisoInputValue] = useState('');
    const [permisosDePantalla, setPermisosDePantalla] = useState([]);
    const [pantallaExpanded, setPantallaExpanded] = useState(false);
    const [showPantallaInput, setShowPantallaInput] = useState(false);
    const [pantallaName, setPantallaName] = useState(null);
    const [showPermisosInput, setShowPermisosInput] = useState(false);
    const [permisoName, setPermisoName] = useState(null);

    // Nuevos estados para el modal de crear pantalla
    const [openCreateScreenModal, setOpenCreateScreenModal] = useState(false);
    const [newScreenName, setNewScreenName] = useState('');

    //Handlers 
    const handleCrearPermiso = async () => {
        try {
            if (!permisoName || !pantallaName || !moduloName) {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Debes llenar nombre del permiso, pantalla y módulo.',
                    life: 3000
                });
                return;
            }

            const selectedModule = modulos.find((mod) => mod.moduleName === moduloName);
            const selectedScreen = screen.find((scr) => scr.screenName === pantallaName);

            if (!selectedScreen) {
                toast.current?.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Debes seleccionar una pantalla válida.',
                    life: 3000
                });
                return;
            }

            const nuevoPermiso = {
                permissionName: permisoName,
                moduleID: selectedModule?.moduleID,
                screenID: selectedScreen?.screenID,
            };

            const response = await apipms.post('/usuarios/create-permission', nuevoPermiso);

            if (response.status === 201) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Permiso creado',
                    detail: 'Permiso creado correctamente',
                    life: 3000
                });
                setPermisoName('');
                setPermisoInputValue('');
            }
        } catch (error) {
            console.error('Error al crear el permiso:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear el permiso',
                life: 3000
            });
        }
    };

    const handleModuloClick = () => {
        setShowModuloInput(!showModuloInput);
        // Si se cierra, también cerrar las secciones internas
        if (showModuloInput) {
            setPantallaExpanded(false);
            setShowPantallaInput(false);
            setShowPermisosInput(false);
        }
    };

    const handlePantallaToggle = () => {
        setPantallaExpanded(!pantallaExpanded);
        if (!pantallaExpanded) {
            setShowPantallaInput(true);
        }
    };

    const handlePermisosClick = () => {
        setShowPermisosInput(true);
    };

    // Nuevo handler para abrir el modal de crear pantalla
    const handleOpenCreateScreenModal = () => {
        if (!moduloName) {
            toast.current?.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Primero debes seleccionar un módulo',
                life: 3000
            });
            return;
        }
        setOpenCreateScreenModal(true);
    };

    // Nuevo handler para crear pantalla desde el modal
    const handleCreateScreenFromModal = async () => {
        if (!newScreenName || !moduloName) {
            toast.current?.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Debes ingresar un nombre de pantalla y seleccionar un módulo',
                life: 3000
            });
            return;
        }

        const selectedModule = modulos.find(mod => mod.moduleName === moduloName);
        if (!selectedModule) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Módulo no encontrado',
                life: 3000
            });
            return;
        }

        try {
            const response = await apipms.post("/usuarios/create-screen", {
                screenName: newScreenName,
                moduleID: selectedModule.moduleID
            });

            if (response.status === 201) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Pantalla creada correctamente.',
                    life: 3000
                });

                // Recargar pantallas
                const pantallasResp = await apipms.get(`/usuarios/screens/${selectedModule.moduleID}`);
                setScreen(pantallasResp.data.modules || []);

                // Cerrar modal y limpiar
                setOpenCreateScreenModal(false);
                setNewScreenName('');
            }
        } catch (err) {
            console.error("Error al crear pantalla:", err);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear la pantalla',
                life: 3000
            });
        }
    };

    const handleCreateModuleFromModal = async () => {
        if (!newModuleName.trim()) {
            toast.current?.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Debes ingresar el nombre del módulo',
                life: 3000
            });
            return;
        }

        try {
            const response = await apipms.post("/usuarios/create-module", {
                moduleName: newModuleName.trim()
            });

            if (response.status === 201) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Módulo creado correctamente.',
                    life: 3000
                });

                // Recargar módulos
                const resp = await apipms.get("/usuarios/modules");
                setModulos(resp.data);

                setOpenCreateModuleModal(false);
                setNewModuleName('');
            }
        } catch (err) {
            console.error("Error al crear módulo:", err);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo crear el módulo',
                life: 3000
            });
        }
    };
    
    const fetchPermisosPorPantalla = async (screenName) => {
        const selectedScreen = screen.find(scr => scr.screenName === screenName);
        if (!selectedScreen) {
            setPermisosDePantalla([]);
            return;
        }

        try {
            const response = await apipms.get(`/usuarios/permissions-by-screen/${selectedScreen.screenID}`);
            setPermisosDePantalla(response.data || []);
        } catch (error) {
            console.error("Error al obtener permisos de la pantalla:", error);
            setPermisosDePantalla([]);
        }
    };


    //Use Effect para obtener los módulos y pantallas
    useEffect(() => {
        const fetchModulos = async () => {
            try {
                const response = await apipms.get("/usuarios/modules");
                setModulos(response.data);
            } catch (error) {
                console.error("Error al obtener módulos:", error);
            }
        };
        fetchModulos();
    }, []);

    useEffect(() => {
        const fetchScreens = async () => {
            if (!moduloName) return;

            try {
                // Busca el ID real del módulo
                const selectedModule = modulos.find((mod) => mod.moduleName === moduloName);
                if (!selectedModule) return;

                const response = await apipms.get(`/usuarios/screens/${selectedModule.moduleID}`);
                setScreen(response.data.modules || []);
            } catch (error) {
                console.error("Error al obtener pantallas:", error);
            }
        };

        fetchScreens();
    }, [moduloName, modulos]);

    return (
        <>
            <Toast ref={toast} />
            <Box sx={{ p: 3, maxWidth: 600 }}>
                {/* Botón Modulo */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleModuloClick}
                        sx={{
                            backgroundColor: '#e0e0e0',
                            color: '#000',
                            borderRadius: '20px',
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: 'normal',
                            '&:hover': {
                                backgroundColor: '#d0d0d0'
                            }
                        }}
                    >
                        Modulo
                    </Button>
                </Box>

                {/* Sección Modulos */}
                {showModuloInput && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Modulos:
                        </Typography>
                        
                        {/* MODIFICACIÓN: Contenedor flex para alinear el Autocomplete y el botón horizontalmente */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Autocomplete
                                options={modulos}
                                getOptionLabel={(option) => option.moduleName}
                                value={modulos.find((mod) => mod.moduleName === moduloName) || null}
                                onChange={(event, newValue) => {
                                    setModuloName(newValue ? newValue.moduleName : null);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        variant="standard"
                                        placeholder="Escribir nombre del módulo"
                                    />
                                )}
                                sx={{ flexGrow: 1 }}
                                isOptionEqualToValue={(option, value) => option.moduleID === value.moduleID}
                            />

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenCreateModuleModal(true)}
                                sx={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    fontWeight: 'normal',
                                    minWidth: '140px',
                                    '&:hover': {
                                        backgroundColor: '#45a049'
                                    }
                                }}
                            >
                                Nuevo Módulo
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Sección Pantalla expandible */}
                {showModuloInput && (
                    <Box sx={{ ml: 4, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconButton
                                onClick={handlePantallaToggle}
                                size="small"
                                sx={{ mr: 1, p: 0 }}
                            >
                                <AddIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                onClick={handlePantallaToggle}
                            >
                                Pantalla
                            </Typography>
                            <IconButton
                                onClick={handlePantallaToggle}
                                size="small"
                                sx={{ ml: 'auto' }}
                            >
                                {pantallaExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </Box>

                        <Collapse in={pantallaExpanded}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {showPantallaInput && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Autocomplete
                                            options={screen.map((scr) => scr.screenName)}
                                            value={pantallaName}
                                            onChange={(event, newValue) => {
                                                setPantallaName(newValue);
                                                if (newValue) fetchPermisosPorPantalla(newValue);
                                                else setPermisosDePantalla([]);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    variant="standard"
                                                    placeholder="Escribir nombre de la pantalla"
                                                />
                                            )}
                                            sx={{ flexGrow: 1 }}
                                            freeSolo
                                        />

                                        {/* Botón + mejorado y reubicado */}
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={handleOpenCreateScreenModal}
                                            sx={{
                                                backgroundColor: '#4caf50',
                                                color: 'white',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontSize: '14px',
                                                fontWeight: 'normal',
                                                minWidth: '140px',
                                                '&:hover': {
                                                    backgroundColor: '#45a049'
                                                }
                                            }}
                                        >
                                            Nueva Pantalla
                                        </Button>
                                    </Box>
                                )}

                                {/* Mostrar permisos de la pantalla seleccionada */}
                                {pantallaName && permisosDePantalla.length > 0 && (
                                    <Box sx={{ ml: 2, mb: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Permisos de la pantalla "{pantallaName}":
                                        </Typography>
                                        {permisosDePantalla.map((permiso, index) => (
                                            <Typography key={index} variant="body2" sx={{ ml: 2, color: '#666' }}>
                                                • {permiso.permissionName}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}

                                {/* Sección Permisos */}
                                <Box sx={{ ml: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <IconButton
                                            onClick={handlePermisosClick}
                                            size="small"
                                            sx={{ mr: 1, p: 0 }}
                                        >
                                            <AddIcon sx={{ fontSize: '20px' }} />
                                        </IconButton>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                            onClick={handlePermisosClick}
                                        >
                                            Permisos
                                        </Typography>
                                    </Box>

                                    {showPermisosInput && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <TextField
                                                size="small"
                                                variant="standard"
                                                placeholder="Escribir nombre del permiso"
                                                value={permisoInputValue}
                                                onChange={(e) => {
                                                    setPermisoInputValue(e.target.value);
                                                    setPermisoName(e.target.value);
                                                }}
                                                sx={{ flexGrow: 1 }}
                                            />

                                            <Button
                                                variant="contained"
                                                onClick={handleCrearPermiso}
                                                sx={{
                                                    backgroundColor: '#4caf50',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    minWidth: '120px',
                                                    '&:hover': {
                                                        backgroundColor: '#45a049'
                                                    }
                                                }}
                                            >
                                                Crear Permiso
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>
                )}

                {/* Modal para crear módulo */}
                <Dialog open={openCreateModuleModal} onClose={() => setOpenCreateModuleModal(false)}>
                    <DialogTitle>Crear Nuevo Módulo</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nombre del Módulo"
                            fullWidth
                            variant="outlined"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreateModuleModal(false)}>Cancelar</Button>
                        <Button onClick={handleCreateModuleFromModal} variant="contained">
                            Crear
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modal para crear pantalla */}
                <Dialog open={openCreateScreenModal} onClose={() => setOpenCreateScreenModal(false)}>
                    <DialogTitle>Crear Nueva Pantalla</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nombre de la Pantalla"
                            fullWidth
                            variant="outlined"
                            value={newScreenName}
                            onChange={(e) => setNewScreenName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreateScreenModal(false)}>Cancelar</Button>
                        <Button onClick={handleCreateScreenFromModal} variant="contained">
                            Crear
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

// Componente principal con Tabs
const UserControl = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      {/* Tabs de navegación */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="user control tabs"
        >
          <Tab
            icon={<PeopleAltIcon />}
            label="Usuarios"
            iconPosition="start"
            sx={{
              minHeight: 48
            }}
          />
          <Tab
            icon={<SettingsIcon />}
            label="Control de Usuarios"
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<DoDisturbIcon />}
            label="Control de permisos"
            iconPosition="start"
            sx={{ minHeight: 60 }}
          />
        </Tabs>
      </Box>
      {/* Contenido de los tabs */}

      {tabValue === 0 && (
        <h2>Control de Usuarios</h2>
        // <AssignmentPermissions />
      )}

      {tabValue === 1 && (
        <UserForm />
      )}

      {tabValue === 2 && (
        <CrearPantallasPanel />
      )}
    </>
  );
};

export default UserControl;

