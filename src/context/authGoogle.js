import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../services/firebaseConfig";
import { Navigate } from "react-router-dom";
const provider = new GoogleAuthProvider();

export const AuthGoogleContext = createContext({})

export const AuthGoogleProvider = ({children}) => {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadStoreAuth = () => {
            const sessionToken = sessionStorage.getItem("@AuthFirebase:token")
            const sessionUser = sessionStorage.getItem("@AuthFirebase:user")
            if (sessionToken && sessionUser){
                setUser(JSON.parse(sessionUser));
            }
        };
        loadStoreAuth();
    }, [])

    const signInGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                // Verificar se o email do usuário está na lista permitida
                const allowedEmails = ['eficazpush@gmail.com', 'rafavilelaf55@gmail.com'];
                if (allowedEmails.includes(user.email)) {
                    setUser(user);
                    sessionStorage.setItem("@AuthFirebase:token", token);
                    sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));
                } else {
                    // Se o email não estiver na lista permitida, fazer o logout
                    auth.signOut();
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    };

    function signOut () {
        sessionStorage.clear()
        setUser(null);
        return <Navigate to="/" />
    }

    return (
        <AuthGoogleContext.Provider value={{signInGoogle, signed: !!user, user, signOut}}>
            {children}
        </AuthGoogleContext.Provider>
    )
};
