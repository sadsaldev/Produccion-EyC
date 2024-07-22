import React, { useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { RowColors } from "./RowColors";

export const MainTableContent = ({ mainData, formData, view }) => {
    const [showColors, setShowColors] = useState(false);
    const [getColorClass, setGetColorClass] = useState(() => () => '');

    const handleColorToggle = useCallback((newShowColors) => {
        setShowColors(newShowColors);
    }, []);

    const handleGetColorClass = useCallback((getColorClassFn) => {
        setGetColorClass(() => getColorClassFn);
    }, []);

    return (
        <div className="flex-end-table-container">
            <div className="main-table">
                <div className="top-table-opc">
                    <RowColors 
                        onToggle={handleColorToggle}
                        onGetColorClass={handleGetColorClass}
                        showColors={showColors}
                    />
                </div>
                <div className="table-overflow-container">
                    <table className="table1">
                        <thead>
                            <tr>
                                <th>#</th>
                                {formData?.opcion === 'both' && 
                                <th data-sort="Grupo">Grupo</th>} 
                                <th data-sort="Direccion">Dirección</th>
                                <th data-sort="FechaRealInicio">Fecha Inicio</th>
                                <th data-sort="FechaRealFin">Fecha Final</th>
                                <th data-sort="NroOperario">Cédula</th>
                                <th data-sort="NombreOperario">Nombre</th>
                                <th data-sort="NroSitio">Contrato</th>
                                <th data-sort="TipoTarea">Tarea</th>
                                <th data-sort="Prioridad">Prioridad</th>
                                <th data-sort="Cierre3">Cierre</th>
                                <th data-sort="duracion">Duración</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mainData.length > 0 ? (
                                mainData.map((item, index) => (
                                    <tr key={index}
                                        className={showColors ? getColorClass(item.Prioridad) : ''}
                                    >
                                        <td>{index + 1}</td>
                                        {formData?.opcion === 'both' && 
                                        <td data-sort="Grupo">{item.Grupo || ''}</td>} 
                                        <td data-sort="Direccion">
                                            <textarea 
                                                className={`main-textarea ${showColors ? 'black' : ''}`}>
                                                    {item.Direccion || ''}
                                            </textarea>
                                        </td>
                                        <td data-sort="FechaRealInicio">{item.FechaRealInicio ? new Date(item.FechaRealInicio).toLocaleString() : ''}</td>
                                        <td data-sort="FechaRealFin">{item.FechaRealFin ? new Date(item.FechaRealFin).toLocaleString() : ''}</td>
                                        <td data-sort="NroOperario">{item.NroOperario || ''}</td>
                                        <td data-sort="NombreOperario">{item.NombreOperario || ''}</td>
                                        <td data-sort="NroSitio">{item.NroSitio || ''}</td>
                                        <td data-sort="TipoTarea">{item.TipoTarea || ''}</td>
                                        <td data-sort="Prioridad">{item.Prioridad || ''}</td>
                                        <td data-sort="Cierre3">{item.Cierre3 || ''}</td>
                                        <td data-sort="duracion">{item.duracion || ''}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">No hay datos disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

MainTableContent.propTypes = {
    mainData: PropTypes.array.isRequired,
    formData: PropTypes.object.isRequired
};
