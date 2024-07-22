import React from "react";
import PropTypes from 'prop-types';
import { SortBy } from './SortBy';
import { Search } from "./Search";

export const GroupedTableHeader = ({formData, view, onSearchChange}) => {

    const GroupTitle = () => {
        if (formData?.opcion === "INSP-RIS"){
            return "Grupo Risaralda";
        } else if (formData?.opcion === "INSP-CALDAS"){
            return "Grupo Caldas";
        } else if (formData?.opcion === "both"){
            return "Eje Cafetero";
        }
    }

    const displayTitle = GroupTitle();

    return (
        <div className="accordion-top">
            <div className="left-options-accor">
                <div className="left-1-accor">
                    <p>Equipo Inspectores {displayTitle}</p>
                </div>
                <div className="left-2-accor">
                    <SortBy view={view} formData={formData}/>
                </div>
            </div> 
            <div className="right-options-accor">
                <Search view={view} onSearchChange={onSearchChange}/>
            </div> 
        </div>
    )
}

GroupedTableHeader.propTypes = {
    formData: PropTypes.object.isRequired,
    onSearchChange: PropTypes.func.isRequired // PropType para la función de búsqueda
};
