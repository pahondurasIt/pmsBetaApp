import { useEffect, useRef, useState } from 'react'
import { FormPermisson } from './FormPermisson'
import { Alert, Button } from '@mui/material';
import useCustomNavigate from '../../../../hooks/useCustomNavigate';
import { useToast } from "../../../../context/ToastContext";
import PersonIcon from '@mui/icons-material/Person';
import '../../../css/PermissionSupervisor.css';
import { apipms } from '../../../../service/apipms';
const PermissonSupervisor = () => {
    const { goMenu } = useCustomNavigate();
    const [visible, setVisible] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [employeesList, setEmployeesList] = useState([]);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        employeeID: null,
        permissionType: '',
        date: new Date(),
        exitTime: new Date(),
        entryTime: new Date(),
        comment: '',
    });

    useEffect(() => {
        // Verificar si ya existe una sesión guardada al cargar el componente
        const savedAuth = localStorage.getItem('supervisorAuth');
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
                        setVisible(false);
                        setUsername(authData.username || '');
                    } else {
                        // Token expirado, limpiar localStorage
                        localStorage.removeItem('supervisorAuth');
                    }
                }
            } catch (error) {
                console.error('Error parsing saved auth:', error);
                localStorage.removeItem('supervisorAuth');
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
                    // Guardar información de autenticación en localStorage
                    const authData = {
                        token: response.data.token || 'authenticated', // Usar el token real si lo devuelve el backend
                        username: username.trim(),
                        timestamp: new Date().getTime()
                    };

                    localStorage.setItem('supervisorAuth', JSON.stringify(authData));

                    // Establecer header de autorización para futuras peticiones
                    if (response.data.token) {
                        apipms.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    }

                    setVisible(false);
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
        let saveData = {
            employeeID: formData.employeeID.employeeID,
            date: formData.date,
            permissionType: formData.permissionType,
            exitTimePermission: formData.exitTime,
            entryTimePermission: formData.entryTime,
            exitPermission: null,
            entryPermission: null,
            comment: formData.comment || null,
            isPaid: false,
            status: true,
            isApproved: false,
        };

        await apipms.post('/permission', { ...saveData }).then(() => {
            showToast("success", "Permiso autorizado correctamente");
            // Resetear el formulario
            setFormData({
                employeeID: null,
                permissionType: '',
                date: new Date(),
                comment: '',
                exitTime: new Date(),
                entryTime: new Date(),
            });
        }).catch(error => {
            console.error('Error al autorizar permiso:', error);
            showToast("error", error.response?.data?.message);
        });
    };

    const handleLogout = () => {
        // Limpiar localStorage
        localStorage.removeItem('supervisorAuth');

        // Limpiar header de autorización
        delete apipms.defaults.headers.common['Authorization'];

        // Resetear estados
        setVisible(true);
        setUsername('');
        setPassword('');
        setError('');

        showToast("info", "Sesión cerrada correctamente");
    };

    return (
        <div className='background-container'>
            <div className='btn-volver'>
                <Button onClick={() => { goMenu(); handleLogout(); }}>Volver</Button>
            </div>

            {!visible &&
                <div className='formPermisson'>
                    {username && (
                        <Button
                            onClick={handleLogout}
                            className='logout-button'
                            variant="contained"
                            size='small'
                            startIcon={<PersonIcon />}
                        >
                            {username} | Cerrar Sesión
                        </Button>
                    )}
                    <FormPermisson
                        showToast={showToast}
                        employeesList={employeesList}
                        formData={formData}
                        setFormData={setFormData}
                        savePermission={savePermission}
                    />
                </div>
            }

            {visible &&
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
