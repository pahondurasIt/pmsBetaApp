import { useState, useEffect } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Box, TextField, Divider, Button
} from "@mui/material";
import { apipms } from "../../../service/apipms";
// import '../../css/usercontrol.css';
import { AssignmentPermissions } from './AssignmentPermissions';
import { isValidText } from "../../../helpers/validator";

export const UserForm = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [userUpdate, setUserUpdate] = useState(null);
    const [permissionSelected, setPermissionSelected] = useState([]);
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
        if (newUser.userClone) {
            loadUserPermissions();
        }
    }, [newUser.userClone]);

    const loadUserPermissions = async () => {
        if (!newUser.userClone) {
            return;
        }

        try {
            const response = await apipms.get(`/usuarios/permissionsByUser/${newUser.userClone}`);
            const userPerms = response.data || [];

            const checkedPermissions = userPerms
                .filter(perm => perm.checked === 1)
                .map(perm => perm.permissionScreenID);

            setPermissionSelected(checkedPermissions);
        } catch (error) {
            console.error('Error al cargar permisos del usuario:', error);
            setPermissionSelected([]);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apipms.get('/usuarios/user-list');

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

            // Crear el objeto con los datos del usuario y los permisos
            const userData = {
                ...newUser,
                permissions: permissionSelected // Incluir los permisos seleccionados
            };

            // const response = await apipms.post("/usuarios/userProfile", {
            //     userID: 2,
            //     permissions: permissionSelected
            // });
            const response = await apipms.post("/usuarios/createuser", userData);

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
                    userClone: "",
                });
                setPermissionSelected([]); // Limpiar permisos seleccionados
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
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '50px' }}>
            <div style={{ width: '25%' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
                    <FormControl fullWidth size='small' sx={{ width: '50%' }} variant="standard">
                        <InputLabel>Usuarios</InputLabel>
                        <Select
                            value={userUpdate || ""}
                            label="Usuarios"
                            onChange={(event) => {
                                setUserUpdate(event.target.value);
                            }}
                        >
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <MenuItem key={index} value={user.userID}>
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
                        onClick={() => {

                        }}
                        disabled={!isValidText(userUpdate)}
                    >
                        Editar usuario
                    </Button>
                </Box>
                <h2 className="titlecontrol">Datos sobre el Usuario</h2>
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
                        <InputLabel>Compañia</InputLabel>
                        <Select
                            value={newUser.companyID}
                            label="Compañia"
                            onChange={handleInputChange("companyID")}
                        >
                            {companies.length > 0 ? (
                                companies.map((company) => (
                                    <MenuItem key={company.companyID} value={company.companyID}>
                                        {company.companyName}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No hay compañias disponibles</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
                    <FormControl fullWidth size='small' sx={{ width: '50%' }} variant="standard">
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
                                    <MenuItem key={index} value={user.userID}>
                                        {user.username}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No hay usuarios disponibles</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

            </div>
            <Divider orientation="vertical" flexItem />
            <div style={{ width: '75%' }}>
                <AssignmentPermissions
                    userToClone={newUser.userClone}
                    permissionSelected={permissionSelected}
                    setPermissionSelected={setPermissionSelected}
                    saveUser={handleCreateUser}
                />
            </div>
        </div>
    );
}
