import { useState, useEffect, useDebugValue } from "react";
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
  Divider,
} from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import { apipms } from "../../../service/apipms";
import '../../css/usercontrol.css';
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

// Componente principal con Tabs
const UserControl = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      {/* Tabs de navegación */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
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
        </Tabs>
      </Box>
      {/* Contenido de los tabs */}
      {tabValue === 0 && (
        // <UserControlPanel />
        <AssignmentPermissions />
      )}

      {tabValue === 1 && (
        <CreateUserPanel />
      )}
    </>
  );
};

export default UserControl;

