import { useState, useEffect } from "react";
import {
    FormControl, InputLabel, MenuItem, Select, Box, TextField, Divider, Button,
} from "@mui/material";
import { apipms } from "../../../service/apipms";
import { AssignmentPermissions } from './AssignmentPermissions';
import { isValidText, validResponse } from "../../../helpers/validator";
import { useToast } from "../../../context/ToastContext";
export const UserForm = () => {
    const [users, setUsers] = useState([]);
    const [userUpdate, setUserUpdate] = useState(null);
    const [permissionSelected, setPermissionSelected] = useState([]);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        user: "",
        email: "",
        pass: "",
        companyID: "",
        userClone: "",
    });

    const [companies, setCompanies] = useState([]); // Estado para almacenar las compañías

    const { showToast } = useToast();

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

            if (userPerms.length > 0) {
                const checkedPermissions = userPerms
                    .filter(perm => perm.checked === 1)
                    .map(perm => perm.permissionScreenID);
                setPermissionSelected(checkedPermissions);
            } else {
                setPermissionSelected([]);
                showToast("warn", "El usuario seleccionado no tiene permisos asignados.");
            }

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

    const handleSaveUser = async () => {
        try {
            // Validar que todos los campos estén llenos
            if (!newUser.firstName || !newUser.lastName || !newUser.user || !newUser.email || !newUser.companyID) {
                showToast("error", "Todos los campos son requeridos");
                return;
            }

            if (!isValidText(userUpdate) && !isValidText(newUser.pass)) {
                showToast("error", "La contraseña es requerida");
                return;
            }

            // Crear el objeto con los datos del usuario y los permisos
            const userData = {
                ...newUser,
                password: newUser.pass,
                username: newUser.user,
                permissions: permissionSelected // Incluir los permisos seleccionados
            };

            // const response = await apipms.post("/usuarios/userProfile", {
            //     userID: 2,
            //     permissions: permissionSelected
            // });
            let response = null;
            if (isValidText(userUpdate)) {
                response = await apipms.put(`/usuarios/updateuser/${userUpdate}`, userData);
            } else {
                response = await apipms.post("/usuarios/createuser", userData);
            }

            if (validResponse(response)) {
                showToast("success", "Usuario guardado exitosamente");
                // Limpiar el formulario después de crear el usuario
                setNewUser({
                    firstName: "",
                    lastName: "",
                    user: "",
                    email: "",
                    pass: "",
                    companyID: "",
                    userClone: "",
                });
                setPermissionSelected([]); // Limpiar permisos seleccionados
                setUserUpdate(null); // Limpiar el usuario seleccionado para editar
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
            showToast("error", error.response.data.message);
        }
    };

    const searchDataUpdate = () => {
        apipms.get(`/usuarios/userData/${userUpdate}`)
            .then(response => {
                const userData = response.data.user;
                setNewUser({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    user: userData.username,
                    email: userData.email,
                    companyID: userData.companyID,
                });

                const userPerms = response.data.permissions || [];

                const checkedPermissions = userPerms
                    .filter(perm => perm.checked === 1)
                    .map(perm => perm.permissionScreenID);
                if (checkedPermissions.length === 0) {
                    showToast("warn", "El usuario seleccionado no tiene permisos asignados.");
                }
                setPermissionSelected(checkedPermissions);
            })
            .catch(error => {
                console.error("Error al obtener datos del usuario:", error);
                showToast("error", "Error al obtener datos del usuario");
            });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '30px' }}>
            <div style={{ width: '25%' }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 3, justifyContent: 'center', alignItems: 'center' }}>
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
                        onClick={searchDataUpdate}
                        disabled={!isValidText(userUpdate)}
                        size="small"
                    >
                        Editar
                    </Button>
                </Box>
                <br />
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

                <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
                    <TextField
                        sx={{ width: '50%' }}
                        size='small'
                        variant="standard"
                        autoComplete={false}
                        label="Nombre de Usuario"
                        value={newUser.user}
                        onChange={handleInputChange("user")}
                    />
                    {!isValidText(userUpdate) && (
                        <TextField
                            sx={{ width: '50%' }}
                            size='small'
                            variant="standard"
                            autoComplete="new-password"
                            label="Password"
                            type="password"
                            value={newUser.pass}
                            onChange={handleInputChange("pass")}
                        />
                    )
                    }
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
                <br />
                <br />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                        setPermissionSelected([]);
                        setNewUser({
                            firstName: '',
                            lastName: '',
                            user: '',
                            email: '',
                            pass: '',
                            companyID: '',
                            userClone: ''
                        });
                    }}
                >
                    Cancelar
                </Button>
            </div>
            <Divider orientation="vertical" flexItem />
            <div style={{ width: '75%' }}>
                <AssignmentPermissions
                    userToClone={newUser.userClone}
                    permissionSelected={permissionSelected}
                    setPermissionSelected={setPermissionSelected}
                    saveUser={handleSaveUser}
                />
            </div>
        </div>
    );
}
