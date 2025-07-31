import { useState, useEffect} from "react";
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
  Autocomplete
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import { apipms } from "../../../service/apipms";
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
        const response = await apipms.get('/auth/user-list');
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

  const handleCreateUser = async () => {
    try {
      // Validar que todos los campos estén llenos
      if (!newUser.firstName || !newUser.lastName || !newUser.username || !newUser.email || !newUser.password || !newUser.companyID) {
        alert("Todos los campos son requeridos");
        return;
      }

      console.log("Creando usuario:", newUser);
      const response = await apipms.post("/auth/createuser", newUser);

      if (response.status === 201) {
        alert("Usuario creado exitosamente");
        // Limpiar el formulario después de crear el usuario
        setNewUser({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          companyID: "",
          cloneFrom: "",
        });
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Error al crear usuario");
      }
    }
  };

  return (
    <div className="usercontainer">
      <h2 className="titlecontrol">Crear Usuario</h2>
      <Box sx={{ mt: 3, maxWidth: 500 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={newUser.firstName}
            onChange={handleInputChange("firstName")}
          />
          <TextField
            fullWidth
            label="Nombre de Usuario"
            value={newUser.username}
            onChange={handleInputChange("username")}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Apellido"
            value={newUser.lastName}
            onChange={handleInputChange("lastName")}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={handleInputChange("password")}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUser.email}
            onChange={handleInputChange("email")}
          />
          <FormControl fullWidth>
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
          <FormControl fullWidth>
            <InputLabel>Clonar</InputLabel>
            <Select
              value={newUser.cloneFrom || ""}
              label="Clonar"
              onChange={(event) => {
                setNewUser((prev) => ({
                  ...prev,
                  cloneFrom: event.target.value,
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
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUser}
            sx={{ mr: 2 }}
          >
            Crear Usuario
          </Button>
        </Box>
      </Box>
    </div>
  );
};

const CrearPantallasPanel = () => {
    const [showModuloInput, setShowModuloInput] = useState(false);
    const [moduloName, setModuloName] = useState(null);
    const [modulos, setModulos] = useState([]);
    const [screen, setScreen] = useState([]);

    const [pantallaExpanded, setPantallaExpanded] = useState(false);
    const [showPantallaInput, setShowPantallaInput] = useState(false);
    const [pantallaName, setPantallaName] = useState(null);
    const [showPermisosInput, setShowPermisosInput] = useState(false);
    const [permisoName, setPermisoName] = useState(null);



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
                        <Box sx={{ ml: 2, mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                                Pantalla:
                            </Typography>

                            {showPantallaInput && (
                                <Autocomplete
                                    options={screen.map((scr) => scr.screenName)}
                                    value={pantallaName}
                                    onChange={(event, newValue) => setPantallaName(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            variant="standard"
                                            placeholder="Escribir nombre de la pantalla"
                                        />
                                    )}
                                    sx={{ maxWidth: 350, mb: 2 }}
                                    freeSolo
                                />
                            )}

                            {/* Sección Permisos */}
                            <Box sx={{ ml: 2 }}>
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

                                <Typography variant="body2" sx={{ ml: 3, color: '#666', mb: 1 }}>
                                    Permisos:
                                </Typography>

                                {showPermisosInput && (
                                    <Box sx={{ ml: 3 }}>
                                        <Autocomplete
                                            value={permisoName}
                                            onChange={(event, newValue) => setPermisoName(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    variant="standard"
                                                    placeholder="Escribir nombre del permiso"
                                                />
                                            )}
                                            sx={{ maxWidth: 300 }}
                                            freeSolo
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
            )}
        </Box>
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

