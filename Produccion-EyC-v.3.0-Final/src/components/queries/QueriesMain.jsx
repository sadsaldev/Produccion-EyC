import React, {useContext, useEffect, useRef} from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavContext } from '../../context/NavContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { FloatingSectionWrapper } from '../DOM/FloatingSectionWrapper';

export const QueriesMain = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    useEffect(() => {
        registerSectionRef('/queries', mainRef);
    }, []);

    const handleSearchEfective = () => {
        navigate('/queries/efective');
    }

    const handleNetworks = () => {
        navigate('/queries/networks');
    }
   
        return (
            <main ref={mainRef} className="container mt-0 mb-0">
                <div className="queries-container">
                    <FloatingSectionWrapper sectionName="Consultas">
                        <div id="profile-content">
                            <div className="queries-pop-up-container">
                                <div className='queries-pop-up'>
                                    <div className='queries-pop-up-options'>
                                        { user ? (
                                            <div className="queries-options-menu">
                                                <div className="search-inspec-father" onClick={handleSearchEfective}>
                                                    <img className="search-inspections-img" src="assets/img/search-inspections.svg" />
                                                    <p id='search-inspections'>Consultar Efectivas</p>
                                                </div>
                                                <div className="new-networks-father" onClick={handleNetworks}>
                                                    <img className="generate-rn-img" src="assets/img/new-networks.svg" />
                                                    <p id='generate-rn'>Comité Redes Nuevas</p>
                                                </div>
                                            </div>
                                            ) : (
                                                <>
                                                <p id='queries-placeholder'>Inicia sesión o regístrate para poder acceder a la sección de Consultas.</p>
                                                <div className="placeholder-popup-img"><img src="assets/img/info-icon-blue.png" alt="Info Icon"/></div>
                                                </>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FloatingSectionWrapper>
                </div> 
            </main>
        );  
    
    }
    
