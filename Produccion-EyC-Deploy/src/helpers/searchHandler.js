// Función para convertir una fecha a string
const formatDateString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString();
};

// Función de búsqueda para la vista "table"
const filterDataByQueryForTable = (data, query) => {
    const lowerCaseQuery = query.toLowerCase();

    const filteredMainData = data.filter(item =>
        item.Grupo.toLowerCase().includes(lowerCaseQuery) ||
        item.Direccion.toLowerCase().includes(lowerCaseQuery) ||
        item.NombreOperario.toLowerCase().includes(lowerCaseQuery) ||
        item.NroOperario.toString().includes(lowerCaseQuery) ||
        formatDateString(item.FechaRealInicio).toLowerCase().includes(lowerCaseQuery) ||
        formatDateString(item.FechaRealFin).toLowerCase().includes(lowerCaseQuery) ||
        item.NroSitio.toString().toLowerCase().includes(lowerCaseQuery) ||
        item.TipoTarea.toLowerCase().includes(lowerCaseQuery) ||
        item.Prioridad.toLowerCase().includes(lowerCaseQuery) ||
        item.Cierre3.toLowerCase().includes(lowerCaseQuery) ||
        item.duracion.toLowerCase().includes(lowerCaseQuery)
    );

    return filteredMainData;
};

// Función de búsqueda para la vista "accordion"
const filterDataByQueryForAccordion = (data, query) => {
    const lowerCaseQuery = query.toLowerCase();

    const groupByInspector = (data) => {
        return data.reduce((acc, inspection) => {
            const { NombreOperario, NroOperario } = inspection;

            if (!acc[NroOperario]) {
                acc[NroOperario] = {
                    NombreOperario,
                    NroOperario,
                    inspections: []
                };
            }
            acc[NroOperario].inspections.push(inspection);
            return acc;
        }, {});
    };

    const groupedData = groupByInspector(data);

    const filteredGroupedData = Object.keys(groupedData).filter(key => {
        const inspector = groupedData[key];
        const totalInspections = inspector.inspections.length;
        return (
            inspector.NombreOperario.toLowerCase().includes(lowerCaseQuery) ||
            inspector.NroOperario.toString().includes(lowerCaseQuery) ||
            totalInspections.toString().includes(lowerCaseQuery)
        );
    }).map(key => groupedData[key]);


    return filteredGroupedData;
};

// Función principal para la búsqueda
export const filterDataByQuery = (data, query, view) => {
    if (view === 'table') {
        return filterDataByQueryForTable(data, query);
    } else if (view === 'accordion') {
        return filterDataByQueryForAccordion(data, query);
    }
    return data;
};
