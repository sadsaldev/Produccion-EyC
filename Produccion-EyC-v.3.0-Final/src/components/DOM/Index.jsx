// Index.jsx
import React, { useEffect, useRef, useContext } from 'react';
import { NavContext } from '../../context/NavContext';

export const Index = () => {
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    useEffect(() => {
        registerSectionRef('/', mainRef);
    }, []);

    return (
        <main ref={mainRef} className="container mt-0 mb-0" id="contenedor">
            <div id="index-content">
                <section className="row align-items-center">
                    <div className="col-md-6" id="left-container">
                        <div id="main-deco-container"><img className="main-deco" src="/assets/img/main-deco.svg" alt ="main-deco"/></div> 
                    </div>
                    <div className="col-md-6" id="right-container">
                        <div id="title-container">
                            <div className="main-title-container"><h1 className = "title-right">Análisis de Producción</h1></div>
                            <div className ="sub-cont">
                                <div className="subtitle-container">
                                    <h2><b>E&C INGENIERÍA S.A.S</b></h2>
                                </div>
                            </div> 
                        </div>    
                    </div>
                </section>
            </div>
        </main>
    );
};
