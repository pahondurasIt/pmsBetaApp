import { useState, useEffect, useRef } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Tabs,
    Tab,
    Box,
    Button,
    TextField,
    Typography,
    Collapse,
    IconButton,
    Autocomplete,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import { apipms } from "../../../service/apipms";
import { Toast } from 'primereact/toast';
// import '../../css/usercontrol.css';
import { AssignmentPermissions } from './AssignmentPermissions';
// Componente para el panel de Control de Usuarios
// const UserControlPanel = ({ }) => {
//   return (
//     <div className="usercontainer">
//       <h2 className="titlecontrol">Control de Usuarios</h2>
//       <p>Esta sección está vacía por el momento.</p>
//     </div>
//   );
// };

const CreateUserPanel = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        companyID: "",
        userClone: "",
    });

    const [companies, setCompanies] = useState([]); // Estado para almacenar las compañías

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await apipms.get("/auth/companies"); // Endpoint para obtener compañías
                setCompanies(response.data.companies || []);
            } catch (error) {
                console.error("Error al obtener compañías:", error);
            }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apipms.get('/usuarios/user-list');
                console.log("Usuarios obtenidos:", response.data.users);

                setUsers(response.data.users); // Asegúrate que el backend responde con `{ users: [...] }`
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
                setError("No se pudieron cargar los usuarios.");
            }
        };

        fetchUsers();
    }, []);


    const handleInputChange = (field) => (event) => {
        setNewUser((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    // const handleCreateUser = async () => {
    //   try {
    //     // Validar que todos los campos estén llenos
    //     if (!newUser.firstName || !newUser.lastName || !newUser.username || !newUser.email || !newUser.password || !newUser.companyID) {
    //       alert("Todos los campos son requeridos");
    //       return;
    //     }

    //     console.log("Creando usuario:", newUser);
    //     const response = await apipms.post("/usuarios/createuser", newUser);

    //     if (response.status === 201) {
    //       alert("Usuario creado exitosamente");
    //       // Limpiar el formulario después de crear el usuario
    //       setNewUser({
    //         firstName: "",
    //         lastName: "",
    //         username: "",
    //         email: "",
    //         password: "",
    //         companyID: "",
    //         userClone: "",
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Error al crear usuario:", error);
    //     if (error.response && error.response.data && error.response.data.message) {
    //       alert(error.response.data.message);
    //     } else {
    //       alert("Error al crear usuario");
    //     }
    //   }
    // };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '50px' }}>
            <div style={{ width: '25%' }}>
                <h2 className="titlecontrol">Crear Usuario</h2>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        size='small'
                        variant="standard"
                        label="Nombre"
                        value={newUser.firstName}
                        onChange={handleInputChange("firstName")}
                    />
                    <TextField
                        fullWidth
                        size='small'
                        variant="standard"
                        label="Apellido"
                        value={newUser.lastName}
                        onChange={handleInputChange("lastName")}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        size='small'
                        variant="standard"
                        label="Nombre de Usuario"
                        value={newUser.username}
                        onChange={handleInputChange("username")}
                    />
                    <TextField
                        fullWidth
                        size='small'
                        variant="standard"
                        label="Password"
                        type="password"
                        value={newUser.password}
                        onChange={handleInputChange("password")}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        size='small'
                        variant="standard"
                        label="Email"
                        type="email"
                        value={newUser.email}
                        onChange={handleInputChange("email")}
                    />
                    <FormControl fullWidth size='small' variant="standard">
                        <InputLabel>Compañía</InputLabel>
                        <Select
                            value={newUser.companyID}
                            label="Compañía"
                            onChange={handleInputChange("companyID")}
                        >
                            {companies.length > 0 ? (
                                companies.map((company) => (
                                    <MenuItem key={company.companyID} value={company.companyID}>
                                        {company.companyName}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No hay compañías disponibles</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl fullWidth size='small' variant="standard">
                        <InputLabel>Clonar</InputLabel>
                        <Select
                            value={newUser.userClone || ""}
                            label="Clonar"
                            onChange={(event) => {
                                setNewUser((prev) => ({
                                    ...prev,
                                    userClone: event.target.value,
                                }));
                            }}
                        >
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <MenuItem key={index} value={user.username}>
                                        {user.username}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No hay usuarios disponibles</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                    >
                        Clonar usuario
                    </Button>
                </Box>
            </div>
            <Divider orientation="vertical" flexItem />
            <div style={{ width: '75%' }}>
                <AssignmentPermissions userToClone={newUser.userClone} />
            </div>
        </div>
    );
};

const CrearPantallasPanel = () => {
    const [showModuloInput, setShowModuloInput] = useState(false);
    const [moduloName, setModuloName] = useState(null);
    const [modulos, setModulos] = useState([]);
    const [screen, setScreen] = useState([]);
    const [permisoInputValue, setPermisoInputValue] = useState('');
    const [permisosDePantalla, setPermisosDePantalla] = useState([]);

    const toast = useRef(null);

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
                            sx={{ maxWidth: 400 }}
                            isOptionEqualToValue={(option, value) => option.moduleID === value.moduleID}
                        />
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

                                {/* Sección Permisos */}
                                <Box sx={{ ml: 4, mb: 2 }}>
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
                                    {/* HOLABB */}

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {showPermisosInput && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Autocomplete
                                                    options={[]}
                                                    value={permisoName}
                                                    inputValue={permisoInputValue}
                                                    onInputChange={(event, newInputValue) => {
                                                        setPermisoInputValue(newInputValue);
                                                        setPermisoName(newInputValue);
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        setPermisoName(newValue || '');
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            variant="standard"
                                                            placeholder="Escribir nombre del permiso"
                                                        />
                                                    )}
                                                    sx={{ flexGrow: 1 }}
                                                    freeSolo
                                                />
                                                {/* Botón + mejorado y reubicado */}
                                                <Button

                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={handleCrearPermiso}
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
                                                    Nuevo Permiso
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>

                                    {permisosDePantalla.length > 0 && (
                                        <Box sx={{ mt: 1, mb: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                Permisos existentes:
                                            </Typography>
                                            <Box
                                                sx={{
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    padding: '8px',
                                                    maxHeight: 200,
                                                    overflowY: 'auto',
                                                    backgroundColor: 'white',
                                                }}
                                            >
                                                {permisosDePantalla.map((permiso) => (
                                                    <Typography
                                                        key={permiso.permissionScreenID}
                                                        variant="body2"
                                                        sx={{
                                                            padding: '4px 8px',
                                                            '&:hover': { backgroundColor: '#f0f0f0' },
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        {permiso.permissionName}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>
                )}
            </Box>

            {/* Modal para crear nueva pantalla */}
            <Dialog
                open={openCreateScreenModal}
                onClose={() => setOpenCreateScreenModal(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Crear Nueva Pantalla
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Módulo seleccionado: <strong>{moduloName}</strong>
                        </Typography>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Nombre de la pantalla"
                            variant="outlined"
                            value={newScreenName}
                            onChange={(e) => setNewScreenName(e.target.value)}
                            placeholder="Ingresa el nombre de la nueva pantalla"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenCreateScreenModal(false);
                            setNewScreenName('');
                        }}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreateScreenFromModal}
                        variant="contained"
                        color="primary"
                    >
                        Crear Pantalla
                    </Button>
                </DialogActions>
            </Dialog>
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
                        label="Control de Usuarios"
                        iconPosition="start"
                        sx={{
                            minHeight: 48
                        }}
                    />
                    <Tab
                        icon={<PersonAddIcon />}
                        label="Crear Usuario"
                        iconPosition="start"
                        sx={{ minHeight: 48 }}
                    />
                    <Tab
                        icon={<VideoSettingsIcon />}
                        label="Crear Pantallas"
                        iconPosition="start"
                        sx={{ minHeight: 60 }}
                    />
                </Tabs>
            </Box>
            {/* Contenido de los tabs */}

            {tabValue === 0 && (

                <AssignmentPermissions />
            )}

            {tabValue === 1 && (
                <CreateUserPanel />
            )}

            {tabValue === 2 && (
                <CrearPantallasPanel />
            )}
        </>
    );
};

export default UserControl;

