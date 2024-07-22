// FloatingSectionWrapper.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavContext } from '../../context/NavContext';

export const FloatingSectionWrapper = ({ children, sectionName }) => {
    const { clonedContent, navigationHistory, sectionRegistry } = useContext(NavContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [backgroundContent, setBackgroundContent] = useState(null); // Estado local para el contenido de fondo

    useEffect(() => {
        let title = 'Producción E&C';
        if (sectionName === 'Perfil') {
            title = 'Producción E&C | Perfil';
        } else if (sectionName === 'Consultas') {
            title = 'Producción E&C | Consultas';
        }
        document.title = title;
        window.history.replaceState(null, '', location.pathname);
    }, [sectionName, location.pathname]);

    useEffect(() => {
        // Recupera el contenido del fondo desde localStorage si no hay un historial válido
        const previousRoute = navigationHistory[navigationHistory.length - 2];
        if (!previousRoute || ['/profile', '/queries'].includes(previousRoute)) {
            const storedContent = localStorage.getItem('backgroundContent');
            if (storedContent) {
                setBackgroundContent(storedContent);
            }
        } else {
            setBackgroundContent(clonedContent);
        }
    }, [clonedContent, navigationHistory]);

    const navigatePrevSection = () => {
        const previousRoute = navigationHistory[navigationHistory.length - 2] || '/';
        navigate(previousRoute);
    };

    const getBackgroundContent = () => {
        const previousRoute = navigationHistory[navigationHistory.length - 2];

        // Si la sección anterior es "Perfil" o "Consultas", recuperar desde localStorage si no hay sección válida antes en el historial
        if (['/profile', '/queries'].includes(previousRoute)) {
            const priorValidRoute = navigationHistory.slice(0, -2).reverse().find(route => !['/profile', '/queries'].includes(route));
            if (priorValidRoute && sectionRegistry[priorValidRoute]?.current) {
                return sectionRegistry[priorValidRoute].current.innerHTML;
            } else {
                return backgroundContent;
            }
        }

        // Si la sección anterior no es "Perfil" ni "Consultas", clonar el contenido actual
        if (previousRoute) {
            return clonedContent;
        }

        return backgroundContent;
    };

    return (
        <div className="floating-section-wrapper">
            {backgroundContent && (
                <div className="background-content" onClick={navigatePrevSection}>
                    <div className="inner-content" dangerouslySetInnerHTML={{ __html: getBackgroundContent() }} />
                </div>
            )}
            <div className="foreground-content">
                {children}
            </div>
        </div>
    );
};
