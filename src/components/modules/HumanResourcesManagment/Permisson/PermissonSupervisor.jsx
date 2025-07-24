import { useRef, useState } from 'react'
import { FormPermisson } from './FormPermisson'
import { Toast } from 'primereact/toast';
import { Alert, Button } from '@mui/material';
import useCustomNavigate from '../../../../hooks/useCustomNavigate';
import '../../../css/PermissionSupervisor.css';
import { apipms } from '../../../../service/apipms';
const PermissonSupervisor = () => {
    const { goMenu } = useCustomNavigate();
    const [visible, setVisible] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                    setVisible(false);
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

    const toast = useRef(null);
    return (
        <div className='background-container'>
            <div className='btn-volver'>
                <Button onClick={goMenu}>Volver</Button>
            </div>
            <Toast ref={toast} />
            {!visible &&
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    maxWidth: '800px',
                }}>
                    <FormPermisson toast={toast} />
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
