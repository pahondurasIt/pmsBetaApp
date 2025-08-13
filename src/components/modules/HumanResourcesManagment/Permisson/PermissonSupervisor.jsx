import { useEffect, useState } from 'react'
import { FormPermisson } from './FormPermisson'
import { Alert, Button, IconButton } from '@mui/material';
import useCustomNavigate from '../../../../hooks/useCustomNavigate';
import { useToast } from "../../../../context/ToastContext";
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../css/PermissionSupervisor.css';
import { apipms } from '../../../../service/apipms';
import { MenuPermission } from './MenuPermission';
import { isValidText } from '../../../../helpers/validator';
import { ApprovedPermission } from './ApprovedPermission';
import dayjs from 'dayjs';
const PermissonSupervisor = () => {
    const { goMenu } = useCustomNavigate();
    const [visibleLogin, setVisibleLogin] = useState(true);
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleDiferidos, setVisibleDiferidos] = useState(false);
    const [visibleSolicitudes, setVisibleSolicitudes] = useState(false);
    const [visibleAprobaciones, setVisibleAprobaciones] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [employeesList, setEmployeesList] = useState([]);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        employeeID: null,
        permissionTypeID: '',
        date: new Date(),
        exitTime: dayjs(),
        comment: '',
    });

    useEffect(() => {
        // Verificar si ya existe una sesión guardada al cargar el componente
        const savedAuth = sessionStorage.getItem('supervisorAuth');
        if (savedAuth) {
            try {
                const authData = JSON.parse(savedAuth);
                // Verificar si el token aún es válido (opcional)
                if (authData.token && authData.timestamp) {
                    // Verificar si el token no ha expirado (ejemplo: 24 horas)
                    const currentTime = new Date().getTime();
                    const tokenAge = currentTime - authData.timestamp;
                    const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

                    if (tokenAge < maxAge) {
                        // Restaurar el header de autorización
                        apipms.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
                        setVisibleLogin(false);
                        setVisibleMenu(true);
                        setUsername(authData.username || '');
                    } else {
                        // Token expirado, limpiar sessionStorage
                        sessionStorage.removeItem('supervisorAuth');
                    }
                }
            } catch (error) {
                console.error('Error parsing saved auth:', error);
                sessionStorage.removeItem('supervisorAuth');
            }
        }

        // Cargar empleados
        apipms.get('/employee/actives')
            .then((response) => {
                setEmployeesList(response.data || []);
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
                showToast("error", error.response?.data?.message);
            });
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        // Validaciones básicas
        if (!username.trim() || !password.trim()) {
            setError('Por favor, completa todos los campos');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // Realizar petición de autenticación al backend
            await apipms.post('/auth', {
                username: username.trim(),
                password: password.trim()
            })
                .then((response) => {
                    // Guardar información de autenticación en sessionStorage
                    const authData = {
                        token: response.data.token || 'authenticated', // Usar el token real si lo devuelve el backend
                        username: username.trim(),
                        timestamp: new Date().getTime()
                    };

                    sessionStorage.setItem('supervisorAuth', JSON.stringify(authData));

                    // Establecer header de autorización para futuras peticiones
                    if (response.data.token) {
                        apipms.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    }

                    setVisibleLogin(false);
                    setVisibleMenu(true);
                    showToast("success", "Sesión iniciada correctamente");
                });

        } catch (err) {
            console.error("Error de login:", err);

            // Manejar diferentes tipos de errores
            let errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';

            if (err.response) {
                // Error de respuesta del servidor
                switch (err.response.status) {
                    case 401:
                        errorMessage = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
                        break;
                    case 403:
                        errorMessage = 'Acceso denegado. Tu cuenta puede estar desactivada.';
                        break;
                    case 500:
                        errorMessage = 'Error del servidor. Intenta más tarde.';
                        break;
                    default:
                        errorMessage = err.response.data?.message || errorMessage;
                }
            } else if (err.request) {
                // Error de red
                errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
            } else {
                // Error personalizado
                errorMessage = err.message || errorMessage;
            }

            setError(errorMessage);

            // Limpiar header de autorización en caso de error
            delete apipms.defaults.headers.common['Authorization'];

        } finally {
            setIsLoading(false);
        }
    };

    const savePermission = async () => {
        let saveData = {};
        if (visibleDiferidos) {
            saveData = {
                employeeID: formData.employeeID.employeeID,
                date: formData.date,
                permissionTypeID: formData.permissionTypeID,
                exitTimePermission: null,
                entryTimePermission: null,
                exitPermission: null,
                entryPermission: null,
                comment: formData.comment || null,
                request: false,
                isPaid: false,
                status: false,
                isApproved: false,
            };
        } else if (visibleSolicitudes) {
            saveData = {
                employeeID: formData.employeeID.employeeID,
                date: formData.date,
                permissionTypeID: formData.permissionTypeID,
                exitTimePermission: formData.exitTime,
                entryTimePermission: null,
                exitPermission: null,
                entryPermission: null,
                comment: formData.comment || null,
                request: true,
                isPaid: false,
                status: false,
                isApproved: false,
            };
        } else {
            saveData = {
                employeeID: formData.employeeID.employeeID,
                date: formData.date,
                permissionTypeID: formData.permissionTypeID,
                exitTimePermission: formData.exitTime,
                entryTimePermission: formData.entryTime,
                exitPermission: null,
                entryPermission: null,
                comment: formData.comment || null,
                request: true,
                isPaid: false,
                status: false,
                isApproved: false,
            };
        }

        await apipms.post('/permission', { ...saveData }).then((res) => {
            showToast("success", res.data.message);
            // Resetear el formulario
            setFormData({
                employeeID: null,
                permissionTypeID: '',
                date: new Date(),
                comment: '',
                exitTime: new Date(),
            });
        }).catch(error => {
            console.error('Error al autorizar permiso:', error);
            showToast("error", error.response?.data?.message);
        });
    };

    const handleLogout = () => {
        // Limpiar sessionStorage
        sessionStorage.removeItem('supervisorAuth');

        // Limpiar header de autorización
        delete apipms.defaults.headers.common['Authorization'];

        // Resetear estados
        setVisibleLogin(true);
        setVisibleDiferidos(false);
        setVisibleSolicitudes(false);
        setVisibleAprobaciones(false);
        setVisibleMenu(false);
        setUsername('');
        setPassword('');
        setError('');
        showToast("info", "Sesión cerrada correctamente");
    };

    const backToMenu = () => {
        setVisibleDiferidos(false);
        setVisibleSolicitudes(false);
        setVisibleAprobaciones(false);
        setVisibleMenu(true);
    };

    return (
        <div className='background-container'>
            <div className='btn-volver'>
                <Button onClick={() => { goMenu(); handleLogout(); }}>Volver</Button>
            </div>

            {(visibleDiferidos || visibleSolicitudes || visibleAprobaciones) && (
                <div className='formPermisson'>
                    {visibleDiferidos && <h3>Permisos diferidos</h3>}
                    {visibleSolicitudes && <h3>Solicitud de Permisos</h3>}
                    {visibleAprobaciones && <h3>Permisos pendientes por aprobar</h3>}
                    {username && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <IconButton aria-label="delete" onClick={backToMenu}>
                                <ArrowBackIcon fontSize='large' />
                            </IconButton>
                            <div>
                                <h6>{username}</h6>
                                <Button
                                    onClick={handleLogout}
                                    className='logout-button'
                                    variant="contained"
                                    size='small'
                                >
                                    Cerrar Sesión
                                </Button>
                            </div>

                        </div>
                    )}
                    {(visibleDiferidos || visibleSolicitudes) && (
                        <FormPermisson
                            showToast={showToast}
                            employeesList={employeesList}
                            formData={formData}
                            setFormData={setFormData}
                            savePermission={savePermission}
                            visibleDiferidos={visibleDiferidos}
                        />
                    )}
                    {
                        visibleAprobaciones && (
                            <ApprovedPermission />
                        )
                    }
                </div>
            )}
            {visibleMenu && (
                <MenuPermission
                    setVisibleDiferidos={setVisibleDiferidos}
                    setVisibleSolicitudes={setVisibleSolicitudes}
                    setVisibleAprobaciones={setVisibleAprobaciones}
                    setVisibleMenu={setVisibleMenu}
                />
            )}

            {visibleLogin &&
                <div>
                    <form id="login-form" className='form-login' onSubmit={handleLogin}>
                        {/* Campo de usuario */}
                        <h2>Iniciar Sesión</h2>
                        <div className="input-field">
                            <label>Username<span className="required">*</span></label>
                            <input
                                className="inp1"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                                autoComplete="username"
                            />
                        </div>

                        {/* Campo de contraseña */}
                        <div className="input-field">
                            <label>Password<span className="required">*</span></label>
                            <input
                                className="inp1"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Mostrar errores */}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Botón de submit */}
                        <div className="input-field">
                            <input
                                className="btn"
                                type="submit"
                                value={isLoading ? "INICIANDO SESIÓN..." : "LOGIN"}
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}
export default PermissonSupervisor
