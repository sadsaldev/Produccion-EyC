// NavContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const NavContext = createContext();

export const NavProvider = ({ children }) => {
    const location = useLocation();
    const [navigationHistory, setNavigationHistory] = useState([]);
    const [pageTitle, setPageTitle] = useState('Producción E&C');
    const [sectionRegistry, setSectionRegistry] = useState({});
    const [clonedContent, setClonedContent] = useState(null); // Estado para el contenido clonado
    const clonedContentRef = useRef(null);

    useEffect(() => {
        const currentPath = location.pathname;
        
        setNavigationHistory((prevHistory) => {
            const newHistory = [...prevHistory];
            // Evitar duplicar la ruta si es la misma que la anterior
            if (newHistory[newHistory.length - 1] !== currentPath) {
                newHistory.push(currentPath);
            }
            return newHistory;
        });

        // Actualiza el título de la página
        const titles = {
            '/index': 'Producción E&C | Inicio',
            '/queries': 'Producción E&C | Consultas',
            '/queries/efective': 'Producción E&C | Consultas',
            '/queries/networks': 'Producción E&C | Consultas',
            '/dashboard': 'Producción E&C | Tablero BI',
            '/login': 'Producción E&C | Log In',
            '/signup': 'Producción E&C | Sign Up',
            '/profile': 'Producción E&C | Perfil',
            '/profile/edit': 'Producción E&C | Perfil',
            '/profile/admin': 'Producción E&C | Admin'
        };

        setPageTitle(titles[currentPath] || 'Producción E&C');
        document.title = titles[currentPath] || 'Producción E&C';

        // Clona el contenido de la sección actual antes de cambiar la ruta, excepto para Perfil y Consultas
        const activeRoute = navigationHistory[navigationHistory.length - 1];
        if (!['/profile', '/queries'].includes(activeRoute)) {
            const mainRef = sectionRegistry[activeRoute]?.current;
            if (mainRef) {
                const mainContent = mainRef.innerHTML;
                if (mainContent) {
                    setClonedContent(mainContent); // Actualiza el estado de clonedContent
                    localStorage.setItem('backgroundContent', mainContent); // Almacena en localStorage
                    clonedContentRef.current = mainContent;
                } else {
                    console.log('No se encontró contenido principal para clonar.');
                }
            } else {
                console.log(`No se encontró el main para la ruta activa ${activeRoute}`);
            }
        }
    }, [location.pathname, sectionRegistry]);

    const registerSectionRef = (route, ref) => {
        setSectionRegistry(prevRegistry => ({
            ...prevRegistry,
            [route]: ref,
        }));
    };

    return (
        <NavContext.Provider value={{ 
            navigationHistory, 
            sectionRegistry, 
            clonedContent, 
            registerSectionRef, 
            setNavigationHistory
        }}>
            {children}
        </NavContext.Provider>
    );
};
