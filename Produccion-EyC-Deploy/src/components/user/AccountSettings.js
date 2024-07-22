import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AccountSettings = () => {
    const navigate = useNavigate();

    const handleProfileEdit = () => {
    navigate('/profile/edit');
    }

    return (
        <div className="profile-card-option">
            <button className="card-button" onClick={handleProfileEdit}><img src="/produccion-EyC-deploy/public/assets/img/edit.svg" alt="user-manual"/></button>
            <p id='account-settings'>Ajustes de la Cuenta</p>
        </div>
    );
}