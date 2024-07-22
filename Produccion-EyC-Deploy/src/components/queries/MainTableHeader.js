import React from 'react';
import PropTypes from 'prop-types';
import { SortBy } from './SortBy';
import { Search } from './Search';

export const MainTableHeader = ({mainData, formData, view, onSearchChange}) => {

    //Realizar conteos filtrados y totales
    const countRisaralda = mainData.filter(item => item.Grupo === 'INSP-RIS').length;
    const countCaldas = mainData.filter(item => item.Grupo === 'INSP-CALDAS').length;
    const totalCount = mainData.length;

    return (
        <div className="main-table-top-options">
            <div className="left-options">
                <div className="left-1">
                    {formData?.opcion === 'both' ? (
                        <>
                        <div className="count-container1"><p id="total-count-caldas">Caldas: {countCaldas}</p></div>
                        <div className="count-container2"><p id="total-count-ris">Risaralda: {countRisaralda}</p></div>
                        <div className="count-container3"><p id="total-count-both">Total: {totalCount}</p></div>
                        </>
                    ):(
                        <>
                        <div className="count-container">
                            <p className="count-records">El número total de registros para el filtro aplicado es: {totalCount}</p>
                        </div>
                        </>
                    )}
                </div>
                <div className="left-2">
                    <SortBy view={view} formData={formData}/>
                </div>
            </div> 
            <div className="right-options">
                <Search view={view} onSearchChange={onSearchChange}/>
            </div>
        </div>
    );
}

MainTableHeader.propTypes = {
    mainData: PropTypes.array.isRequired,
    formData: PropTypes.object.isRequired,
    onSearchChange: PropTypes.func.isRequired // PropType para la función de búsqueda
};