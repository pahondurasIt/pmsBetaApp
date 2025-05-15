import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPageStyle.css";
import logo from '../assets/logpms.png';



const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/");
    };

    return (
        <div className="wrapper" >
           <div className="forms-container">
                <div className="signin-signup">
                    <div className="header-container">
                        <img src={logo} alt="Logo Powers Athletics" className="form-logo" /> 
                        <h2 className="form-title">PMS LOGIN</h2>
                    </div>
                        <form className="sign-in-form" id="login-form">
                            <div className="input-field">
                                <label>Username<span className="required">*</span></label>
                                <input className="inp1" type="text" placeholder="Username" />
                            </div>
                            <div className="input-field">
                                <label>Password<span className="required">*</span></label>
                                <input className="inp1" type="password" placeholder="Password" />
                            </div>
                            <div className="input-field">
                                <input className="btn" type="button" onClick={handleLogin} value="LOGIN" />
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
