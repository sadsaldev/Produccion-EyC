// QueriesEfective.js

import { cacheQueryData, getCachedQueryData } from '../../../server/services/cache';
import { useAuth } from '../../context/AuthContext';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { NavContext } from '../../context/NavContext';
import { fetchInspections } from '../../api/fetchInspections'; // Ajusta la importación según sea necesario
import { QueriesEfectiveForm } from './QueriesEfectiveForm';
import { QueriesEfectiveContent } from './QueriesEfectiveContent';

export const QueriesEfective = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [view, setView] = useState('');
    const mainRef = useRef(null);
    const { registerSectionRef } = useContext(NavContext);

    const onSubmit = async (formData, selectedView) => {
        setIsSubmitted(true);
        setIsLoading(true);
        setFormData(formData);
        setView(selectedView);

        const { fecha_inicio, fecha_final, opcion } = formData;
        const userID = user.userID;
        try {
            const cachedData = getCachedQueryData(userID, formData);
            if (cachedData) {
                setData(cachedData);
                setError(null);
            } else {
                const response = await fetchInspections(userID, formData);
                setData(response.data);
                setError(null);
                cacheQueryData(userID, formData, response.data);
            }
        } catch (err) {
            setError("Error al obtener la data para mainTable: " + err.message);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        registerSectionRef('/queries/efective', mainRef);
    }, []);

    return (
        <main ref={mainRef} className="container mt-0 mb-0">
            <div id="sections-content">
                <div className="queries-section">
                    <section className="row align-items-center">
                        <div className="col-md-3">
                            <QueriesEfectiveForm onSubmit={onSubmit} user={user} />
                        </div>
                        <div className="col-md-8">
                            <QueriesEfectiveContent
                                user={user}
                                isSubmitted={isSubmitted}
                                isLoading={isLoading}
                                error={error}
                                data={data}
                                formData={formData}
                                view={view}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

