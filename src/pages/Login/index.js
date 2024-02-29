import { useContext } from "react";
import { AuthGoogleContext } from "../../context/authGoogle";
import { Navigate } from "react-router-dom";
import './styles_login.css';

export const Login = () => {
    const { signInGoogle, signed, user } = useContext(AuthGoogleContext);

    async function loginGoogle() {
        await signInGoogle();
    }
    if (!signed) {
        return (
            <div id="login-container">
                <h1>Bem-vindo ao gerenciador de RH</h1>
                <p>Faça login para continuar</p>
                <button onClick={() => signInGoogle()}>Login</button>
            </div>
        )
    } else {
        return <Navigate to="/home" />
    }

};