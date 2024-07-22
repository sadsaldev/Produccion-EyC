import React, {createContext, useState, useContext } from 'react';

const SectionContext = createContext();

export const SectionProvider = ({children}) => {
    const [previousSection, setPreviousSection] = useState(null);
    const [currentSection, setCurrentSection] = useState(null);

    const changeSection = (newSection) => {
        setPreviousSection(currentSection);
        setCurrentSection(newSection);
    };

    const setManualPreviousSection = (manualSection) => {
        setPreviousSection(manualSection);
    };

    return (
        <SectionContext.Provider value={{previousSection, currentSection, changeSection, setManualPreviousSection}}>
            {children}
        </SectionContext.Provider>
    );
};

export const useSection = () => useContext(SectionContext);