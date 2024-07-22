import React, {createContext, useState, useEffect, useContext} from "react";
import { checkSession } from "../api/authUser";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        console.log('Login User:', userData);
        setUser(userData);
    };

    const logout = () => {
        console.log('Logout');
        setUser(null);
    };

    const updateUser = (updatedData) => {
        setUser(prevUser => ({...prevUser, ...updatedData}));
    };

    useEffect(() => {
        const verifySession = async() => {
            const user = await checkSession();
            if (user){
                setUser(user);
            } else {
                setUser(null);
            }
        };
        verifySession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
};

//Hook personalizado para usar el contexto
export const useAuth = () => {
    return useContext(AuthContext);
}