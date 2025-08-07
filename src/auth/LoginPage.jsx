// LoginPage.jsx - Página de inicio de sesión con loader personalizado integrado
// Este componente maneja todo el proceso de autenticación del usuario con feedback visual mejorado
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';
import "../components/css/LoginPageStyle.css";
import logo from '/logpms.png';
import { useState, useEffect } from "react";
import { apipms } from '../service/apipms';
import { useAuth } from '../context/AuthContext';
import GridLoader from '../components/common/GridLoader'; // Importar el loader personalizado
import { usePermissionContext } from "../context/permissionContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
     const { setUserPermissions, setUserScreens, setUserModules } = usePermissionContext();

    // Usar el contexto de autenticación
    const { login, isAuthenticated } = useAuth();

    // Obtener la ruta desde donde vino el usuario y mensaje si existe
    const from = location.state?.from?.pathname || '/app';
    const redirectMessage = location.state?.message;

    // Estados para el formulario de login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para el diálogo de selección de ubicación
    const [showLocationDialog, setShowLocationDialog] = useState(false);
    const [associatedLocations, setAssociatedLocations] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [currentCompanies, setCurrentCompanies] = useState([]);

    // Estados para notificaciones y loader personalizado
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showLoginLoader, setShowLoginLoader] = useState(false); // Estado para el loader personalizado
    const [loaderText, setLoaderText] = useState(''); // Texto dinámico del loader

    // Efecto para redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated()) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    // Efecto para mostrar mensaje de redirección si existe
    useEffect(() => {
        if (redirectMessage) {
            setError(redirectMessage);
            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => setError(''), 5000);
        }
    }, [redirectMessage]);

    // Función para volver a la página anterior
    const handleGoBack = () => {
        navigate('/');
    };

    // Función principal de login
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
            const response = await apipms.post('/auth', {
                username: username.trim(),
                password
            });

            const { token, user: userData, permissions, screens } = response.data;
            setUserPermissions(permissions);
            setUserScreens(screens);
            

            // Validar respuesta del servidor
            if (!token || !userData) {
                throw new Error('Respuesta inválida del servidor');
            }

            // // Configurar el header de autorización para futuras peticiones
            // apipms.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Manejar selección de ubicación según las ubicaciones asociadas
            if (userData.associatedLocations && userData.associatedLocations.length > 1) {
                // Múltiples ubicaciones: mostrar diálogo de selección
                setAssociatedLocations(userData.associatedLocations);
                setShowLocationDialog(true);

                // Guardar temporalmente los datos para usar después de la selección
                sessionStorage.setItem('tempToken', token);
                sessionStorage.setItem('tempUserData', JSON.stringify(userData));

            } else if (userData.associatedLocations && userData.associatedLocations.length === 1) {
                // Una sola ubicación: seleccionar automáticamente
                const country = userData.associatedLocations[0];
                const company = country.companies && country.companies.length > 0 ? country.companies[0] : null;

                if (company) {
                    await completeLogin(userData, token, country, company);
                } else {
                    throw new Error('No se encontraron compañías para su ubicación. Contacte al administrador.');
                }
            } else {
                // Sin ubicaciones asociadas
                throw new Error('No se encontraron ubicaciones asociadas para este usuario. Contacte al administrador.');
            }

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

    // Función auxiliar para completar el login con ubicación seleccionada
    const completeLogin = async (userData, token, country, company) => {
        try {
            // Activar el loader de login al inicio del proceso de completado del login
            setShowLoginLoader(true);
            setLoaderText(`¡Bienvenido, ${userData.username}!`);
            // Crear userData completo con ubicación seleccionada
            const completeUserData = {
                ...userData,
                selectedCountry: country,
                selectedCompany: company
            };

            // Guardar ubicación seleccionada en sessionStorage para persistencia
            sessionStorage.setItem('selectedCountry', JSON.stringify(country));
            sessionStorage.setItem('selectedCompany', JSON.stringify(company));

            // Usar el contexto para hacer login
            await login(completeUserData, token, country, company);

            // Secuencia de mensajes en el loader para mejor experiencia
            // Hemos ajustado los tiempos para que el loader sea más visible y la transición más suave
            setTimeout(() => {
                setLoaderText("Configurando tu sesión...");
            }, 1500); // Antes 2000ms

            // Navegar a la ruta de destino después del loader
            setTimeout(() => {
                setShowLoginLoader(false);
                navigate(from, { replace: true });
            }, 2000); // Antes 8000ms - Total de loader: 6 segundos

        } catch (error) {
            console.error('Error al completar el login:', error);
            setError('Error al completar el inicio de sesión. Intenta nuevamente.');
            setShowLoginLoader(false); // Ocultar loader en caso de error
        }
    };

    // Función para manejar selección de país
    const handleCountrySelect = (countryId) => {
        setSelectedCountry(countryId);
        const country = associatedLocations.find(loc => loc.countryID === countryId);
        if (country) {
            setCurrentCompanies(country.companies || []);
            setSelectedCompany(''); // Resetear la selección de compañía
        }
    };

    // Función para manejar selección de compañía
    const handleCompanySelect = (companyId) => {
        setSelectedCompany(companyId);
    };

    // Función para obtener URL de bandera del país
    const getFlagUrl = (countryName) => {
        // Mapeo de nombres de países a códigos ISO
        const countryCodeMap = {
            'Honduras': 'HN',
            'United States of America': 'US',
            'Estados Unidos': 'US',
            'Mexico': 'MX',
            'México': 'MX',
            'Canada': 'CA',
            'Canadá': 'CA',
            'Guatemala': 'GT',
            'El Salvador': 'SV',
            'Nicaragua': 'NI',
            'Costa Rica': 'CR',
            'Panama': 'PA',
            'Panamá': 'PA'
        };

        const countryCode = countryCodeMap[countryName] || 'HN';
        return `https://flagsapi.com/${countryCode}/flat/64.png`;
    };

    // Función para confirmar selección de ubicación
    const handleLocationSelectionConfirm = async () => {
        if (!selectedCountry || !selectedCompany) {
            setError('Por favor, selecciona un país y una compañía.');
            return;
        }

        try {
            // Ocultar el diálogo de ubicación antes de mostrar el loader
            setShowLocationDialog(false);

            // Obtener datos seleccionados
            const countryData = associatedLocations.find(loc => loc.countryID === selectedCountry);
            const companyData = currentCompanies.find(comp => comp.companyID === selectedCompany);

            // Recuperar datos temporales
            const tempToken = sessionStorage.getItem('tempToken');
            const tempUserData = JSON.parse(sessionStorage.getItem('tempUserData'));

            if (!tempToken || !tempUserData) {
                throw new Error('Datos de sesión perdidos. Intenta iniciar sesión nuevamente.');
            }

            // Limpiar datos temporales
            sessionStorage.removeItem('tempToken');
            sessionStorage.removeItem('tempUserData');

            // Completar el login (esto activará el loader)
            await completeLogin(tempUserData, tempToken, countryData, companyData);

        } catch (error) {
            console.error('Error al confirmar selección de ubicación:', error);
            setError(error.message || 'Error al procesar la selección. Intenta nuevamente.');
            // En caso de error, si el diálogo se cerró, es posible que no se vea el error.
            // Considerar reabrir el diálogo con el error o mostrarlo en un Snackbar.
        }
    };

    // Función para cerrar diálogo de ubicación
    const handleLocationDialogClose = () => {
        // Limpiar datos temporales si el usuario cierra el diálogo
        sessionStorage.removeItem('tempToken');
        sessionStorage.removeItem('tempUserData');
        setShowLocationDialog(false);
        setError('');
        setSelectedCountry('');
        setSelectedCompany('');
        setCurrentCompanies([]);
    };

    return (
        <>
            {/* **LOADER PERSONALIZADO**: Se muestra después del login exitoso */}
            <GridLoader
                isVisible={showLoginLoader}
                text={loaderText}
                type="login"
            />

            <div className="wrapper">
                {/* Botón para volver */}
                <div className='btn-volver'>
                    <Button onClick={handleGoBack}>Volver</Button>
                </div>

                {/* Contenedor principal del formulario */}
                <div className="forms-container">
                    <div className="signin-signup">
                        {/* Header con logo y título */}
                        <div className="header-container">
                            <img src={logo} alt="Logo Powers Athletics" className="form-logo" />
                            <h2 className="form-title">PMS LOGIN</h2>
                        </div>

                        {/* Formulario de login */}
                        <form className="sign-in-form" id="login-form" onSubmit={handleLogin}>
                            {/* Campo de usuario */}
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
                </div>

                {/* Diálogo de selección de ubicación */}
                <Dialog
                    open={showLocationDialog}
                    onClose={handleLocationDialogClose}
                    maxWidth="md"
                    fullWidth
                    className="location-dialog"
                    disableEscapeKeyDown={true} // Prevenir cierre accidental
                >
                    <DialogTitle className="dialog-title">
                        Selecciona tu Ubicación
                    </DialogTitle>
                    <DialogContent className="dialog-content">
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Panel de dos columnas para selección */}
                        <div className="location-selection-container">

                            {/* Columna izquierda: Países */}
                            <div className="countries-section">
                                <div className="section-header">
                                    <h3>Countries</h3>
                                </div>
                                <div className="countries-list">
                                    {associatedLocations.map((location) => (
                                        <div
                                            key={location.countryID}
                                            className={`country-item ${selectedCountry === location.countryID ? 'selected' : ''}`}
                                            onClick={() => handleCountrySelect(location.countryID)}
                                        >
                                            {/* Bandera del país */}
                                            <div className="country-flag">
                                                <img
                                                    src={getFlagUrl(location.countryName)}
                                                    alt={`Bandera de ${location.countryName}`}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                {/* Fallback si la bandera no carga */}
                                                <div className="country-circle-fallback" style={{ display: 'none' }}>
                                                    {location.countryName.slice(0, 2).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="country-info">
                                                <span className="country-name">{location.countryName}</span>
                                            </div>
                                            {/* Indicador de selección */}
                                            <div className="selection-indicator">
                                                <div className={`radio-button ${selectedCountry === location.countryID ? 'checked' : ''}`}>
                                                    {selectedCountry === location.countryID && <div className="radio-dot"></div>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Separador visual */}
                            <div className="column-separator"></div>

                            {/* Columna derecha: Compañías */}
                            <div className="companies-section">
                                <div className="section-header">
                                    <h3>Companies</h3>
                                </div>
                                <div className="companies-list">
                                    {selectedCountry ? (
                                        currentCompanies.length > 0 ? (
                                            currentCompanies.map((company) => (
                                                <div
                                                    key={company.companyID}
                                                    className={`company-item ${selectedCompany === company.companyID ? 'selected' : ''}`}
                                                    onClick={() => handleCompanySelect(company.companyID)}
                                                >
                                                    {/* Checkbox para compañías */}
                                                    <div className="company-checkbox">
                                                        <div className={`checkbox ${selectedCompany === company.companyID ? 'checked' : ''}`}>
                                                            {selectedCompany === company.companyID && (
                                                                <svg className="checkmark" viewBox="0 0 24 24">
                                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="company-info">
                                                        <span className="company-name">{company.companyName}</span>
                                                        <span className="company-location">
                                                            {associatedLocations.find(loc => loc.countryID === selectedCountry)?.countryName}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-companies-message">
                                                No hay compañías disponibles para este país
                                            </div>
                                        )
                                    ) : (
                                        <div className="select-country-message">
                                            Selecciona un país para ver las compañías disponibles
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="dialog-actions">
                        <Button
                            onClick={handleLocationSelectionConfirm}
                            disabled={!selectedCountry || !selectedCompany}
                            className="confirm-button"
                            variant="contained"
                        >
                            CONFIRMAR
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar para mensajes de éxito (opcional, ya que ahora usamos el loader) */}
                <Snackbar
                    open={showSuccessMessage}
                    autoHideDuration={3000}
                    onClose={() => setShowSuccessMessage(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setShowSuccessMessage(false)}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        {successMessage}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
};

export default LoginPage;