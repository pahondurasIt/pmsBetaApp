import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


import "./LoginPageStyle.css";
const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/");
    };

    return (
        <div className="wrapper">
            <div className="container">
                <div className="col-left">
                    <div className="login-text">
                        <h2>Bienvenido</h2>
                        <h2>Logo</h2>
                        
                    </div>
                </div>
                <div className="col-right">
                    <div className="login-form">
                        <h2>Login</h2>
                        <form>
                            <p>
                                <input type="text" placeholder="Username" />
                            </p>
                            <p>
                                <input type="password" placeholder="Password" />
                            </p>
                            <p>
                                <input className="btn" onClick={handleLogin} value="Iniciar Sesión" />
                            </p>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
