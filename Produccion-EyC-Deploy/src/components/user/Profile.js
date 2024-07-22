import React, { useState, useEffect, useContext, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavContext } from '../../context/NavContext';
import { Logout } from './Logout';
import { UserManual } from './UserManual';
import { AdminPanel } from './AdminPanel';
import { AccountSettings } from './AccountSettings';
import { FloatingSectionWrapper } from '../DOM/FloatingSectionWrapper';

export const Profile = () => {
    const {user} = useAuth();
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    useEffect(() => {
        registerSectionRef('/profile', mainRef);
    }, []);

    if (!user) {
        return (
            <main ref={mainRef} className='container mt-0 mb-0'>
                <FloatingSectionWrapper sectionName="Perfil">
                    <div id="profile-content">
                        <div className="profile-menu-container">
                            <div className='profile-container'>
                                <div className='profile-container-header'>
                                    <img className='user-default-picture' src='/produccion-EyC-deploy/public/assets/img/user-icon.svg' alt='user-picture' />
                                    <div className='header-username-display'>
                                        <h2 id='user-name'>Cargando...</h2>
                                        <p id="profile-hold">Por favor espera mientras cargamos tu perfil.</p>
                                    </div> 
                                </div>
                                <div className='profile-container-options'>
                                    <div className='loading-profile'><div className="loader"></div></div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </FloatingSectionWrapper>
            </main>
        );
    }

    const {userID, userRole, userName} = user;

    return (
        <main ref={mainRef} className='container mt-0 mb-0'>
            <FloatingSectionWrapper sectionName="Perfil">
                <div id="profile-content">
                    <div className="profile-menu-container">
                        <div className='profile-container'>
                            <div className='profile-container-header'>
                                <img className='user-default-picture' src='/produccion-EyC-deploy/public/assets/img/user-icon.svg' alt='user-picture' />
                                <div className='header-username-display'>
                                    <h2 id='user-name'>{userName}</h2>
                                    <p>{userID}</p>
                                </div> 
                            </div>
                            <div className='profile-container-options'>
                                <AccountSettings />
                                {userRole === 'super_user' && (<AdminPanel />)}
                                <UserManual />
                                <Logout />
                            </div>
                        </div> 
                    </div>
                </div>
            </FloatingSectionWrapper>
        </main>
    );
}