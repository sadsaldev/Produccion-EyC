import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { MainTableHeader } from './MainTableHeader';
import { MainTableContent } from './MainTableContent';
import { filterDataByQuery } from '../../helpers/searchHandler';

export const MainTable = ({data, formData, view}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Función para actualizar el estado del input de búsqueda
    const handleSearchChange = (query) => {
        setSearchQuery(query);
    };

    // Filtrar los datos utilizando el helper
    const mainData = filterDataByQuery(data, searchQuery, view);

    return (
        <div className="main-table-content">
            <MainTableHeader 
                mainData={mainData} 
                formData={formData} 
                view={view} 
                onSearchChange={handleSearchChange}
            />
            <MainTableContent 
                mainData={mainData} 
                formData={formData} 
                view={view} 
            />
        </div>
    );
}

MainTable.propTypes = {
    data: PropTypes.array.isRequired,
    formData: PropTypes.object.isRequired
};
