import { useEffect, useState } from 'react'
import { Box, Button, Checkbox, Tabs, Tab, FormControlLabel } from '@mui/material';
import { apipms } from '../../../service/apipms';

export const AssignmentPermissions = () => {
    const [permissionList, setPermissionList] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [screenList, setScreenList] = useState([]);
    const [permissionSelected, setPermissionSelected] = useState([]);
    const [activeTab, setActiveTab] = useState(0); // Estado para manejar el tab activo
    const [userPermissions, setUserPermissions] = useState([]); // Nuevo estado para permisos del usuario
    const [selectedUserId, setSelectedUserId] = useState(3); // ID del usuario seleccionado (ejemplo)

    useEffect(() => {
        fetchdata();
        // if (selectedUserId) {
        //     loadUserPermissions(selectedUserId);
        // }
    }, [])

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

    const loadUserPermissions = async (userId) => {
        try {
            const response = await apipms.get(`/usuarios/permissionsByUser/${userId}`);
            const userPerms = response.data || [];
            setUserPermissions(userPerms);

            // Extraer los IDs de permisos que están marcados como checked: 1
            const checkedPermissions = userPerms
                .filter(perm => perm.checked === 1)
                .map(perm => perm.permissionScreenID);

            setPermissionSelected(checkedPermissions);
            console.log('Permisos cargados para usuario:', userId, checkedPermissions);
        } catch (error) {
            console.error('Error al cargar permisos del usuario:', error);
        }
    };

    const saveUserPermissions = async () => {
        // Preparar los datos para enviar al servidor
        if (permissionSelected.length === 0) {
            alert('No se han seleccionado permisos para guardar.');
            return;
        }
        console.log('Guardando permisos:', permissionSelected);

        await apipms.post('/usuarios/userProfile', { userId: 2, permissions: permissionSelected })
            .then((res) => {
                alert(res.data.message || 'Permisos guardados exitosamente');
            })
            .catch((error) => {
                console.error('Error al guardar permisos:', error);
                alert(error.response?.data?.message || 'Error al guardar permisos');
            });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <>
            <h3>Assignment Permissions</h3>
            <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => {
                    loadUserPermissions(selectedUserId);
                }}
            >
                Consultar Permisos Usuario {selectedUserId}
            </Button>
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

            <Box sx={{ mt: 3, mb: 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    size="medium"
                    onClick={saveUserPermissions}
                    sx={{ mr: 2 }}
                >
                    Guardar Permisos
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    onClick={() => {
                        console.log('Permisos seleccionados:', permissionSelected);
                        console.log('Lista de permisos completa:', permissionList);
                        console.log('Permisos del usuario:', userPermissions);
                    }}
                >
                    Info
                </Button>
            </Box>
        </>
    )
}
