import React, {useState, useCallback} from "react";
import PropTypes from 'prop-types';
import { RowColors } from "./RowColors";

export const GroupedTableContent = ({formData, view, groupedData}) => {
    const [showColors, setShowColors] = useState(false);
    const [getColorClass, setGetColorClass] = useState (() => () => '');

    const handleColorToggle = useCallback((newShowColors) => {
        setShowColors(newShowColors);
    }, []);

    const handleGetColorClass = useCallback((getColorClassFn) => {
        setGetColorClass(() => getColorClassFn);
    }, []);

    //Realizar conteos filtrados y totales
    let totalCount = 0;

    groupedData.forEach(inspector => {
        totalCount += inspector.inspections.length;
    })

    let countRisaralda = 0;
    let countCaldas = 0;

    groupedData.forEach(inspector => {
        inspector.inspections.forEach(inspeccion => {
            if (inspeccion.Grupo === 'INSP-RIS'){
                countRisaralda++;
            } else if (inspeccion.Grupo === 'INSP-CALDAS'){
                countCaldas++;
            }
        });
    });

    console.log(groupedData);

    return (
        <div className="flex-end-table-container">
            <div className="grouped-table">
                <div className="top-table-opc-g">
                    <div className="count-detail-g">
                        {formData?.opcion === 'both' ? (
                            <>
                            <p>Risaralda: {countRisaralda}</p>
                            <p>Caldas: {countCaldas}</p> 
                            <p>Total: {totalCount}</p>
                            </>
                        ):(
                            <p>Total: {totalCount}</p>  
                        )}
                    </div>
                    <RowColors 
                        onToggle={handleColorToggle}
                        onGetColorClass={handleGetColorClass}
                        showColors={showColors}
                    /> 
                </div>
                <div className="table-overflow-container">
                    <div className="accordion" id="accordionExample">
                        {groupedData.map((group, index) => {
                            const { NombreOperario, NroOperario, inspections } = group;
                            const totalInspections = inspections.length;
                            const panelID = `collapse${NombreOperario.replace(/\s+/g, '_')}_${NroOperario}`;
                            return (
                                <div key={`${NroOperario}_${NombreOperario}`} className="accordion-item" data-inspector-info={`${NombreOperario}, ${NroOperario}, ${totalInspections}`}>
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#${panelID}`}
                                            aria-expanded="false"
                                            aria-controls={panelID}
                                        >
                                            <p className="insp-data">{NombreOperario} - {NroOperario}</p>
                                            <p className="each-counter">({totalInspections})</p>
                                        </button>
                                    </h2>
                                    <div id={panelID} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <table className="table2">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th data-sort="Direccion">Dirección</th>
                                                        <th data-sort="FechaRealInicio">Fecha Inicio</th>
                                                        <th data-sort="FechaRealFin">Fecha Final</th>
                                                        <th data-sort="NroSitio">Contrato</th>
                                                        <th data-sort="TipoTarea">Tarea</th>
                                                        <th data-sort="Prioridad">Prioridad</th>
                                                        <th data-sort="Cierre3">Cierre</th>
                                                        <th data-sort="duracion">Duración</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {inspections.map((inspection, i) => (
                                                    <tr key={i}
                                                        className={showColors ? getColorClass(inspection.Prioridad) : ''}
                                                    >
                                                        <td data-counter={i + 1}>{i + 1}</td>
                                                        <td data-sort="Direccion">
                                                            <textarea 
                                                                className={`grouped-textarea ${showColors ? 'black' : ''}`}>
                                                                {inspection.Direccion || ''}
                                                            </textarea>
                                                        </td>
                                                        <td data-sort="FechaRealInicio">{inspection.FechaRealInicio ? new Date(inspection.FechaRealInicio).toLocaleString() : ''}</td>
                                                        <td data-sort="FechaRealFin">{inspection.FechaRealFin ? new Date(inspection.FechaRealFin).toLocaleString() : ''}</td>
                                                        <td data-sort="NroSitio">{inspection.NroSitio || ''}</td>
                                                        <td data-sort="TipoTarea">{inspection.TipoTarea || ''}</td>
                                                        <td data-sort="Prioridad">{inspection.Prioridad || ''}</td>
                                                        <td data-sort="Cierre3">{inspection.Cierre3 || ''}</td>
                                                        <td data-sort="duracion">{inspection.duracion || ''}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>     
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

GroupedTableContent.propTypes = {
    formData: PropTypes.object.isRequired
};
