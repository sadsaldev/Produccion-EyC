import React, {useState}from 'react';
import PropTypes from 'prop-types';
import { accordionToggle } from '../../helpers/accordionToggle';
import { GroupedTableHeader } from './GroupedTableHeader';
import { GroupedTableContent } from './GroupedTableContent';
import { filterDataByQuery } from '../../helpers/searchHandler';

export const GroupedTable = ({data, formData, view}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (query) => {
        setSearchQuery(query);
    }

    // Obtener los datos agrupados y filtrados
    const groupedData = filterDataByQuery(data, searchQuery, view);
    accordionToggle();


    return (
        <div className="accordion-container">
           <GroupedTableHeader 
                data={data} 
                formData={formData} 
                view={view} 
                onSearchChange={handleSearchChange}
            /> 
           <GroupedTableContent 
                groupedData={groupedData} 
                formData={formData} 
                view={view} 
            />
        </div>
    )
}

GroupedTable.propTypes = {
    data: PropTypes.array.isRequired,
    formData: PropTypes.object.isRequired
};
