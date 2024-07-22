import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../api/authUser';
import { checkSession } from '../../api/authUser';

export const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleAutoLogout = async () => {
        const response = await logoutUser();
        if (response.code === '03_success') {
            await checkSession();
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="profile-card-option">
            <button onClick={handleAutoLogout} className="card-button"><img src="/assets/img/log-out.svg" className="logout" alt="log-out"/></button>
            <p id='log-out'>Cerrar Sesión</p>
        </div>
    );
}