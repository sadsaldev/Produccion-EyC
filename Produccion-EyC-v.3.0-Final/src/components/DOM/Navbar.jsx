import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { NavContext } from '../../context/NavContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [isFloatingMenu, setIsFloatingMenu] = useState(false);
    const { activeRoute } = useContext(NavContext);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleIndex = () => {
        navigate('/');
    }

    return (
        <>
            <header>
                <nav className="navbar">
                    <div className="logo">
                        <img className="logo-img" src="/assets/img/logo-white.png" alt="logo E&C" title="E&C Ingeniería" onClick={handleIndex} />
                        {activeRoute !== '/' && (
                            <p className="page-title-navbar">| &nbsp; Análisis de Producción</p>
                        )}
                    </div>
                    <div className="flex-end-navbar-items">
                        <div className="flex-navbar-menu">
                        {!isFloatingMenu && (
                            <ul className="menu-flex" id="navbar-menu-flex">
                                <li><NavLink className={`navelement ${activeRoute === '/' ? 'active' : ''}`} to="/">Inicio</NavLink></li>
                                <li><NavLink className={`navelement ${activeRoute === '/queries' ? 'active' : ''}`} to="/queries">Consultas</NavLink></li>
                                <li><NavLink className={`navelement ${activeRoute === '/dashboard' ? 'active' : ''}`} to="/dashboard">Tablero BI</NavLink></li>
                                {user ? (
                                    <li><NavLink className={`navelement ${activeRoute === '/profile' ? 'active' : ''}`} to="/profile">Perfil</NavLink></li>
                                ) : (
                                    <>
                                        <li><NavLink className={`navelement ${activeRoute === '/login' ? 'active' : ''}`} to="/login">Log In</NavLink></li>
                                        <li><NavLink className={`navelement ${activeRoute === '/signup' ? 'active' : ''}`} to="/signup">Sign Up</NavLink></li>
                                    </>
                                )}
                            </ul>
                        )}
                        </div>
                        <ThemeSwitcher />
                        <button className="menu-toggle" id="menu-toggle" onClick={() => setIsFloatingMenu(!isFloatingMenu)}>&#9776;</button>
                    </div>
                </nav>
                {isFloatingMenu && (
                    <div className="aside-menu-container visible">
                        <div className="aside-menu">
                            <div className="aside-menu-deco"></div>
                            <div className="navbar-menu">
                                <ul className="menu" id="navbar-menu">
                                    <li><NavLink className={`navelement ${activeRoute === '/' ? 'active' : ''}`} to="/" onClick={() => setIsFloatingMenu(!isFloatingMenu)}>Inicio</NavLink></li>
                                    <li><NavLink className={`navelement ${activeRoute === '/queries' ? 'active' : ''}`} to="/queries" onClick={() => setIsFloatingMenu(!isFloatingMenu)}>Consultas</NavLink></li>
                                    <li><NavLink className={`navelement ${activeRoute === '/dashboard' ? 'active' : ''}`} to="/dashboard" onClick={() => setIsFloatingMenu(!isFloatingMenu)}>Tablero BI</NavLink></li>
                                    {user ? (
                                        <li><NavLink className={`navelement ${activeRoute === '/profile' ? 'active' : ''}`} to="/profile" onClick={() => setIsFloatingMenu(!isFloatingMenu)}>Perfil</NavLink></li>
                                    ) : (
                                        <>
                                            <li><NavLink className={`navelement ${activeRoute === '/login' ? 'active' : ''}`} to="/login" onClick={() => setIsFloatingMenu(!isFloatingMenu)}>Log In</NavLink></li>
                                            <li><NavLink className={`navelement ${activeRoute === '/signup' ? 'active' : ''}`} to="/signup" onClick={() => setIsFloatingMenu(!isFloatingMenu)}>Sign Up</NavLink></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};
