import { useEffect, useState } from 'react'
import { Box, Button, Checkbox, Tabs, Tab, FormControlLabel, Divider } from '@mui/material';
import { apipms } from '../../../service/apipms';

export const AssignmentPermissions = ({ userToClone, userID }) => {
    const [permissionList, setPermissionList] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [screenList, setScreenList] = useState([]);
    const [permissionSelected, setPermissionSelected] = useState([]);
    const [activeTab, setActiveTab] = useState(0); // Estado para manejar el tab activo

    useEffect(() => {
        fetchdata();
    }, [])

    useEffect(() => {
        if (userToClone && userToClone !== null) {
            console.log('Cargando permisos para usuario:', userToClone);
            loadUserPermissions();
        } else {
            // Si no hay usuario seleccionado, limpiar permisos
            setPermissionSelected([]);
        }
    }, [userToClone])

    const fetchdata = async () => {
        try {
            const [res] = await Promise.all([
                apipms.get(`/usuarios/permissions`),
            ]);
            setModuleList(res.data.modules || []);
            setPermissionList(res.data.permissions || []);
            setScreenList(res.data.screens || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const loadUserPermissions = async () => {
        if (!userToClone) {
            console.log('No hay usuario seleccionado para cargar permisos');
            return;
        }

        

        try {
            console.log(`Cargando permisos para usuario ID: ${userToClone}`);
            const response = await apipms.get(`/usuarios/permissionsByUser/${userToClone}`);
            const userPerms = response.data || [];

            console.log('Permisos recibidos:', userPerms);

            // Extraer los IDs de permisos que están marcados como checked: 1
            const checkedPermissions = userPerms
                .filter(perm => perm.checked === 1)
                .map(perm => perm.permissionScreenID);

            console.log('Permisos seleccionados:', checkedPermissions);
            setPermissionSelected(checkedPermissions);
        } catch (error) {
            console.error('Error al cargar permisos del usuario:', error);
            // Limpiar permisos en caso de error
            setPermissionSelected([]);
        }
    };

    const saveUserPermissions = async () => {
        // Validar que hay un usuario seleccionado
        if (!userToClone) {
            alert('No hay usuario seleccionado para guardar permisos.');
            return;
        }

        // Preparar los datos para enviar al servidor
        if (permissionSelected.length === 0) {
            alert('No se han seleccionado permisos para guardar.');
            return;
        }

        console.log(`Guardando permisos para usuario ID: ${userToClone}`, permissionSelected);

        try {
            const response = await apipms.post('/usuarios/userProfile', {
                userId: userToClone,
                permissions: permissionSelected
            });
            alert(response.data.message || 'Permisos guardados exitosamente');
        } catch (error) {
            console.error('Error al guardar permisos:', error);
            alert(error.response?.data?.message || 'Error al guardar permisos');
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 className="titlecontrol">Asignación de Permisos</h2>
                    <label>
                        Esta sección permite gestionar los permisos de los usuarios en el sistema.
                        {userToClone && (
                            <span style={{ fontWeight: 'bold', color: '#1976d2' }}>
                                {" "}Usuario seleccionado: ID {userToClone}
                            </span>
                        )}
                    </label>
                </div>
            </div>
            <br />
            <>
                {moduleList && moduleList.length > 0 && (
                    <>
                        {/* Tabs de navegación */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                aria-label="permission modules tabs"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                {moduleList.map((module, index) => (
                                    <Tab
                                        key={module.moduleID}
                                        label={module.moduleName}
                                        id={`module-tab-${index}`}
                                        aria-controls={`module-tabpanel-${index}`}
                                    />
                                ))}
                            </Tabs>
                        </Box>

                        {/* Contenido de los tabs */}
                        {moduleList.map((module, index) => (
                            <div
                                key={module.moduleID}
                                role="tabpanel"
                                hidden={activeTab !== index}
                                id={`module-tabpanel-${index}`}
                                aria-labelledby={`module-tab-${index}`}
                            >
                                {activeTab === index && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, p: 2 }}>
                                        {/* Crear permisos por pantallas */}
                                        {screenList && screenList.filter(screen => screen.moduleID === module.moduleID).map((screen) => (
                                            <div key={screen.screenID} style={{ marginBottom: '20px' }}>
                                                <FormControlLabel
                                                    label={(screen.screenName).toUpperCase()}
                                                    sx={{
                                                        color: '#000000',
                                                        fontWeight: 'bold',
                                                        '& .MuiFormControlLabel-label': {
                                                            fontSize: '1.1rem'
                                                        }
                                                    }}
                                                    control={
                                                        <Checkbox
                                                            checked={permissionList
                                                                .filter(p => p.screenID === screen.screenID)
                                                                .every(p => permissionSelected.includes(p.permissionScreenID)) &&
                                                                permissionList.filter(p => p.screenID === screen.screenID).length > 0}
                                                            indeterminate={
                                                                permissionList
                                                                    .filter(p => p.screenID === screen.screenID)
                                                                    .some(p => permissionSelected.includes(p.permissionScreenID)) &&
                                                                !permissionList
                                                                    .filter(p => p.screenID === screen.screenID)
                                                                    .every(p => permissionSelected.includes(p.permissionScreenID))
                                                            }
                                                            onChange={(e) => {
                                                                const screenPermissions = permissionList.filter(p => p.screenID === screen.screenID);
                                                                if (e.target.checked) {
                                                                    // Seleccionar todos los permisos de esta pantalla
                                                                    const newSelected = [...new Set([...permissionSelected, ...screenPermissions.map(p => p.permissionScreenID)])];
                                                                    setPermissionSelected(newSelected);
                                                                } else {
                                                                    // Deseleccionar todos los permisos de esta pantalla
                                                                    const screenPermissionIds = screenPermissions.map(p => p.permissionScreenID);
                                                                    setPermissionSelected(permissionSelected.filter(id => !screenPermissionIds.includes(id)));
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                                {/* Listas de permisos según el id de pantalla */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    ml: 4,
                                                    gap: 2
                                                }}>
                                                    {
                                                        permissionList.filter(permission => permission.screenID === screen.screenID)
                                                            .map((permission) => (
                                                                <FormControlLabel
                                                                    key={permission.permissionScreenID}
                                                                    label={`${permission.permissionName} ${permission.permissionScreenID}`}
                                                                    control={
                                                                        <Checkbox
                                                                            checked={permissionSelected.includes(permission.permissionScreenID)}
                                                                            id={permission.permissionScreenID.toString()}
                                                                            value={permission.permissionScreenID}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setPermissionSelected([...permissionSelected, permission.permissionScreenID]);
                                                                                } else {
                                                                                    setPermissionSelected(permissionSelected.filter(id => id !== permission.permissionScreenID));
                                                                                }
                                                                            }}
                                                                        />
                                                                    }
                                                                />
                                                            ))
                                                    }
                                                </Box>
                                            </div>
                                        ))}
                                    </Box>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </>
        </>
    )
}
