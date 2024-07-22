import React, { useState, useEffect } from 'react';

export const ThemeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('Page Theme') === 'Dark';
    });

    useEffect(() => {
        const appyTheme = () => {
            const newSrcImg = isDarkMode ?  '/assets/img/dark-mode-blue.svg' : '/assets/img/light-mode-blue.svg';
            const newSrcStyle = isDarkMode ? '/assets/css/style-dark.css' : '/assets/css/style-light.css';

            const themeImg = document.querySelector('.switch-theme-img');
            if(themeImg){
                themeImg.src = newSrcImg;
                themeImg.alt = isDarkMode ? 'Modo Oscuro' : 'Modo Claro';
                themeImg.title = isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro';
            }

            const newLogo = isDarkMode ? '/assets/img/logo-white.png' : '/assets/img/logo.png';
            const logo = document.querySelector('.logo-img');

            if (logo){
                logo.src = newLogo;
            }

            const currentStylesheet = document.getElementById('current-stylesheet');
            if (currentStylesheet){
                const newStylesheet = document.createElement('link');
                newStylesheet.rel = 'stylesheet';
                newStylesheet.href = newSrcStyle;
                newStylesheet.id = 'new-stylesheet';
                document.head.appendChild(newStylesheet);
                
                newStylesheet.onload = () => {
                    currentStylesheet.remove();
                    newStylesheet.id = 'current-stylesheet';
                };
            }

            localStorage.setItem('Page Theme', isDarkMode ? 'Dark' : 'Light');
        };

        appyTheme();
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <button className="switch-theme" onClick={toggleTheme}>
            <img className="switch-theme-img" src="" alt="Cambiar tema" title="Cambiar tema" />
        </button>
    );
};