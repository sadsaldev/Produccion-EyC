import React, {useState, useEffect, useRef, useContext} from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavContext } from '../../context/NavContext';
import { getNetworks } from '../../api/getNetworks';
import { NetworksForm } from './NetworksForm';
import { NetworksContent } from './NetworksContent';
import { calculateNetCounts } from '../../helpers/netCount';
import { exportNetExcel } from '../../api/exportNetExcel';

export const Networks = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null); 
    const [isDownload, setIsDownload] = useState(false);
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    useEffect(() => {
        registerSectionRef('/queries/networks', mainRef);

        // Recuperar los datos del formulario almacenados en localStorage
        const storedFormData = localStorage.getItem('formData');
        if (storedFormData) {
            setFormData(JSON.parse(storedFormData));
        }
    }, []);

    const onSubmit = async (formData, download = false) => {
        setIsLoading(true);
        setFormData(formData);
        setIsDownload(download);

        // Guardar los datos del formulario en localStorage
        localStorage.setItem('formData', JSON.stringify(formData));

        const { contracts, fecha_inicio, opcion } = formData;
        console.log('Datos del formulario: ', formData);

        try {
            const response = await getNetworks(contracts, fecha_inicio, opcion);
            if (response) {
                setError(null);
                console.log('Respuesta del servidor: ', response.data);

                if (download) {
                    const counts = calculateNetCounts(response.data, formData);
                    await exportNetExcel(response.data, counts);
                    setIsSubmitted(false); 
                } else {
                    setData(response.data);
                    setIsSubmitted(true);
                }
            } else {
                setError('No se recibieron datos de la API.');
            }
        } catch (error) {
            setError('Error al obtener la información para Redes Nuevas. Vuelve a Iniciar Sesión e inténtalo de nuevo.');
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main ref={mainRef} className="container mt-0 mb-0">
            <div id="sections-content">
                <div className="networks-section">
                    <section className="row align-items-center">
                        <div className="col-md-3">
                            <NetworksForm onSubmit={onSubmit} user={user} initialData={formData} />
                        </div>
                        <div className="col-md-8">
                            <NetworksContent
                                user={user}
                                isSubmitted={isSubmitted}
                                isLoading={isLoading}
                                error={error}
                                data={data}
                                formData={formData}
                            />
                        </div>
                    </section>
                </div>
            </div> 
        </main>
    );
}