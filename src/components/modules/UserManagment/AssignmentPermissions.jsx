import { useEffect, useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import { Box, Button, Checkbox, Divider, FormControlLabel } from '@mui/material';
import { apipms } from '../../../service/apipms';
import { usePermissionContext } from '../../../context/permissionContext';

export const AssignmentPermissions = () => {
    const [permissionList, setPermissionList] = useState([]);
    const [moduleList, setModuleList] = useState([]);
    const [screenList, setScreenList] = useState([]);
    const [permissionSelected, setPermissionSelected] = useState([]);

    const { userScreens } = usePermissionContext();

    useEffect(() => {
        fetchdata();
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

    return (
        <>
            <h2>Assignment Permissions</h2>
            {moduleList && moduleList.length > 0 &&
                <TabView>
                    {moduleList.map((module) =>
                        <TabPanel key={module.moduleID} header={module.moduleName}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                                {/* Crear permisos por pantallas */}
                                {screenList && screenList.filter(screen => screen.moduleID === module.moduleID).map((screen) => (
                                    <div key={screen.screenID}>
                                        <FormControlLabel
                                            label={(screen.screenName).toUpperCase()}
                                             sx={{ color: '#000000' }}
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
                                        <Box sx={{ display: 'flex', flexDirection: 'row', ml: 3 }}>
                                            {
                                                permissionList.filter(permission => permission.screenID === screen.screenID)
                                                    .map((permission) => (
                                                        <>
                                                            <FormControlLabel
                                                                key={permission.permissionScreenID}
                                                                label={permission.permissionName}
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
                                                            <br />
                                                            <br />
                                                        </>
                                                    ))}
                                        </Box>
                                    </div>
                                ))}
                            </Box>
                        </TabPanel>
                    )}
                </TabView>}
            <div>

            </div>
            <Button
                variant="contained"
                className="addButton"
                size='small'
                onClick={() => {
                    console.log('Permisos seleccionados:', permissionSelected);
                    console.log('Lista de permisos:', permissionList);
                }}>
                Guardar
            </Button>
        </>
    )
}
