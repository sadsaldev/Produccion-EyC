import React, {useState, useEffect, useRef, useContext} from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavContext } from '../../context/NavContext';

export const Dashboard = () => {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    useEffect(() => {
        registerSectionRef('/dashboard', mainRef);
    }, []);

    const handleIframeLoad = () => {
        setIsLoading(false);
    }

    return (
        <main ref={mainRef} className="container mt-0 mb-0">
             <section className="row align-items-center">
                <div id="bi-index">
                    <div className="bi-section"> 
                        <div className="col-md-12">
                            { user ? (
                                <>
                                    {isLoading && (
                                        <div className="loader-container-biboard">                                          
                                            <div className="loader"></div>
                                        </div>
                                    )}

                                    <div className="biboard-container">
                                        <iframe 
                                            title="Tablero de Producción" 
                                            width="80%" 
                                            height="100%" 
                                            src="https://app.powerbi.com/view?r=eyJrIjoiM2Y4YjhlYzEtYWQ5ZC00OGIxLWE5MzYtM2YxODBkOGMxZDdiIiwidCI6ImU5YTMxM2RlLTkxMTYtNDFmZS1iYTJjLTk4M2I5NmZlN2M0MyJ9" 
                                            frameBorder="0" 
                                            allowFullScreen={true}
                                            onLoad={handleIframeLoad}>
                                        </iframe>
                                    </div>
                                </>  
                            ):(
                                <div className="bi-temp-placeholder">
                                    <div className="bi-temp-img">
                                        <img src="assets/img/flask-chemistry-blue.svg" alt="in construction..."/>
                                    </div>
                                    <div className="bi-temp-info">
                                        <p>Inicia sesión o regístrate para poder ver e interactuar con el tablero de PowerBi que contiene toda la información relacionada a la Producción de la empresa para la sede del Eje Cafetero.</p> 
                                    </div>
                                </div>  
                            )}
                        </div> 
                    </div>
                </div> 
            </section>
        </main>
    );
}