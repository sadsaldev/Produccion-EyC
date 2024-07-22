import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminPanel = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    const {userRole} = user;

    const handleAdminPanel = () => {
        if (userRole === 'super_user'){
            navigate('/profile/admin');
        }
    }
    
    return (
        <div className="admin-panel-opc">
            <div className="profile-card-option">
                <button className="card-button"><img src="/produccion-EyC-deploy/public/assets/img/tool.svg" alt="user-manual" onClick={handleAdminPanel}/></button>
                <p id='admin-panel'>Panel de Administración</p>
            </div>
        </div>
    );
}