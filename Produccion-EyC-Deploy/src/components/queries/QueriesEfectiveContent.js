import React from 'react';
import { MainTable } from './MainTable';
import { GroupedTable } from './GroupedTable';

export const QueriesEfectiveContent = ({ user, isSubmitted, isLoading, error, data, formData, view }) => {
    return (
        <div className="table-container">
            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : !isSubmitted ? (
                <div className="index-placeholder">
                    <div className="placeholder-img">
                        <img src="/produccion-EyC-deploy/public/assets/img/info-icon-blue.png" alt="Info Icon" />
                    </div>
                    <div className="placeholder-info">
                        {user ? (
                            <p>Completa la información solicitada en el formulario para visualizar o exportar en formato de Excel las inspecciones efectivas realizadas según el rango de fecha y departamento(s) establecidos.</p>
                        ) : (
                            <p>Inicia Sesión o Regístrate para visualizar o exportar en formato de Excel las inspecciones efectivas realizadas según el rango de fecha y departamento(s) establecidos.</p>
                        )}
                    </div>
                </div>
            ) : error ? (
                <div className="index-placeholder">
                    <div className="placeholder-img">
                        <img src="/produccion-EyC-deploy/public/assets/img/info-icon.png" alt="Info Icon" />
                    </div>
                    <div className="placeholder-info">
                        <p>{error}</p>
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="index-placeholder">
                    <div className="placeholder-img">
                        <img src="/produccion-EyC-deploy/public/assets/img/info-icon.png" alt="Info Icon" />
                    </div>
                    <div className="placeholder-info">
                        <p>No hay inspecciones para mostrar dentro del rango de fecha y departamento(s) seleccionados.</p>
                    </div>
                </div>
            ) : view === 'table' ? (
                <div className="main-table-container">
                    <MainTable data={data} formData={formData} view={view}/>
                </div>    
            ) : (
                <div className="grouped-container">
                    <GroupedTable data={data} formData={formData} view={view}/>
                </div>
            )}
        </div>
    );
};
