import React from 'react';
import { NetworksTable } from './NetworksTable';

export const NetworksContent = ({ user, isSubmitted, isLoading, error, data, formData }) => {
    return (
        <div className="table-container">
            {isLoading ? (
                <div className="loader-container">
                    <div className="loader-blue"></div>
                </div>
            ) : !isSubmitted ? (
                <div className="networks-placeholder">
                    <div className="networks-placeholder-img">
                        <img src="/assets/img/info-icon-blue.png" alt="Info Icon" />
                    </div>
                    <div className="networks-placeholder-info">
                        {user ? (
                            <p>Completa la información solicitada en el formulario para visualizar o exportar en formato de Excel el Comité para Redes Nuevas. Nota: solo se mostrarán contratos recientes.</p>
                        ) : (
                            <p>Inicia sesión o regístrate para visualizar o exportar en formato de Excel el Comité para Redes Nuevas.</p>
                        )}
                    </div>
                </div>
            ) : error ? (
                <div className="networks-placeholder">
                    <div className="networks-placeholder-img">
                        <img src="/assets/img/info-icon-blue.png" alt="Info Icon" />
                    </div>
                    <div className="networks-placeholder-info">
                        <p>{error}</p>
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="networks-placeholder">
                    <div className="networks-placeholder-img">
                        <img src="/assets/img/info-icon.png" alt="Info Icon" />
                    </div>
                    <div className="networks-placeholder-info">
                        <p>No hay inspecciones para mostrar dentro del rango de fecha y departamento(s) seleccionados.</p>
                    </div>
                </div>
            ) : (
                <div className="main-table-container">
                    <NetworksTable data={data} formData={formData} />
                </div>
            )}
        </div>
    );
};