import React, { useEffect, useState } from 'react'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField, Tooltip, Typography } from '@mui/material';
import { apipms } from '../../../../service/apipms';
import useEmployeePhoto from '../../../../hooks/usePhotoUrl';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import dayjs from 'dayjs';
import { formatearHora } from '../../../../helpers/formatDate';
import { useToast } from '../../../../context/ToastContext';

export const ApprovedPermission = () => {
    const [listPermissions, setListPermissions] = useState([]);
    const { getEmployeePhoto } = useEmployeePhoto();
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchPermissions();
    }, [])

    const fetchPermissions = () => {
        apipms.get(`/permission/permissionsWithoutApproval`)
            .then((response) => {
                console.log(response.data);
                
                setListPermissions(response.data || []);
            })
            .catch((error) => {
                console.error('Error fetching approved permissions:', error);
            });
    }

    const approvedPermission = (permissionID) => {
        apipms.put(`/permission/approvedPermission/${permissionID}`, { isApproved: true })
            .then((res) => {
                fetchPermissions();
                console.log(res.data);

                showToast("success", res.data.message);
                if (res.data.errorPrint) {
                    showToast("error", res.data.errorPrint);
                }
            })
            .catch((error) => {
                console.error('Error al aprobar el permiso:', error);
                showToast("error", error.response?.data?.message);
            });
    }

    const filterPermissions = listPermissions.filter(permission => {
        return permission.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            {
                listPermissions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No hay permisos pendientes de aprobación.
                    </Typography>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                label="Buscar empleado"
                                size='small'
                                variant="standard"
                                sx={{ mb: 2, width: '70%' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <List
                            dense={true}
                            sx={{
                                width: '100%',
                                maxHeight: '500px', // o el alto que quieras
                                bgcolor: 'background.paper',
                                fontSize: '2rem',
                                color: '#000',
                                overflowY: 'scroll',
                                scrollbarWidth: 'thin', // Firefox
                                '&::-webkit-scrollbar': { width: '6px' }, // Chrome/Safari
                                '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '3px' }
                            }}>
                            {filterPermissions.map((permission) => (
                                <ListItem alignItems="flex-start"
                                    key={permission.permissionID}
                                    secondaryAction={
                                        <Tooltip title="Aprobar">
                                            <IconButton edge="end" aria-label="delete" onClick={(e) => {
                                                e.stopPropagation();
                                                approvedPermission(permission.permissionID);
                                            }}>
                                                <VerifiedUserIcon color='success' />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar alt={permission.fullName} src={getEmployeePhoto(permission.photoUrl || '')} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography component="span" variant="body1">
                                                {permission.fullName}
                                            </Typography>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ color: 'text.primary', display: 'inline' }}
                                                >
                                                    {permission.permissionTypeName} <span style={{ color: permission.request ? '#4a8605' : '#cc0404' }}>{permission.request ? '(Solicitud)' : '(Diferido)'}</span>
                                                </Typography>
                                                {
                                                    ` — ${dayjs(permission.date).format('DD/MM/YYYY')} ${permission.request ? formatearHora(permission.exitTimePermission) : ''}`
                                                }

                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>

                )
            }

        </div>
    )
}

