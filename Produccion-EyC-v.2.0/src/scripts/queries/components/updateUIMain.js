export function updateUISingleOpc(newRecords, tableBody, existingIDs, initialCount, counter, newRecordCount) {
    tableBody = document.querySelector('.table1 tbody');
    existingIDs = new Set();
    initialCount = document.querySelectorAll('.table1 tbody tr').length;
    counter = initialCount;

    document.querySelectorAll('.table1 tbody tr').forEach(row => {
        const nroSitioCell = row.querySelector('td[data-sort="NroSitio"]');
        const fechaRealFinCell = row.querySelector('td[data-sort="FechaRealFin"]');
        if (nroSitioCell && fechaRealFinCell) {
            const combinedID = `${nroSitioCell.textContent.trim().toLowerCase()}-${fechaRealFinCell.textContent.trim().toLowerCase()}`;
            existingIDs.add(combinedID);
        }
    });

    newRecords.forEach(record => {
        const recordID = `${record.NroSitio.trim().toLowerCase()}-${record.FechaRealFin.trim().toLowerCase()}`;

        if (!existingIDs.has(recordID)) {
            existingIDs.add(recordID);
            counter++;
            newRecordCount++; // Incrementar el contador de nuevos registros

            const row = document.createElement('tr');
            const fields = {
                '#': counter,
                'Direccion': record.Direccion,
                'FechaRealInicio': record.FechaRealInicio,
                'FechaRealFin': record.FechaRealFin,
                'NroOperario': record.NroOperario,
                'NombreOperario': record.NombreOperario,
                'NroSitio': record.NroSitio,
                'TipoTarea': record.TipoTarea,
                'Prioridad': record.Prioridad,
                'Cierre3': record.Cierre3,
                'duracion': record.duracion
            };

            for (const [key, value] of Object.entries(fields)) {
                const cell = document.createElement('td');
                if (key === '#') {
                    cell.textContent = value;
                } else {
                    cell.setAttribute('data-sort', key);
                    cell.textContent = value;
                }
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        }
    });

    if (newRecordCount > 0){
        const totalRecords = initialCount + newRecordCount;
        document.querySelector('.count-records').textContent = `El número total de inspecciones para el filtro aplicado es: ${totalRecords}`;
    }
}

export function updateUIBothOpc(newRecords, tableBody, existingIDs, initialCount, counter, newRecordCount) {
    tableBody = document.querySelector('.table3 tbody');
    existingIDs = new Set();
    initialCount = document.querySelectorAll('.table3 tbody tr').length;
    counter = initialCount;

    let allRows = Array.from(document.querySelectorAll('.table3 tbody tr'));

    console.log(`Initial count of rows: ${allRows.length}`);

    document.querySelectorAll('.table3 tbody tr').forEach(row => {
        const nroSitioCell = row.querySelector('td[data-sort="NroSitio"]');
        const fechaRealFinCell = row.querySelector('td[data-sort="FechaRealFin"]');
        if (nroSitioCell && fechaRealFinCell) {
            const combinedID = `${nroSitioCell.textContent.trim().toLowerCase()}-${fechaRealFinCell.textContent.trim().toLowerCase()}`;
            existingIDs.add(combinedID);
        }
    });

    newRecords.forEach(record => {
        const recordID = `${record.NroSitio.trim().toLowerCase()}-${record.FechaRealFin.trim().toLowerCase()}`;

        if (!existingIDs.has(recordID)) {
            existingIDs.add(recordID);
            counter++;
            newRecordCount++; // Incrementar el contador de nuevos registros

            const row = document.createElement('tr');
            const fields = {
                '#': counter,
                'Grupo': record.Grupo,
                'Direccion': record.Direccion,
                'FechaRealInicio': record.FechaRealInicio,
                'FechaRealFin': record.FechaRealFin,
                'NroOperario': record.NroOperario,
                'NombreOperario': record.NombreOperario,
                'NroSitio': record.NroSitio,
                'TipoTarea': record.TipoTarea,
                'Prioridad': record.Prioridad,
                'Cierre3': record.Cierre3,
                'duracion': record.duracion
            };

            for (const [key, value] of Object.entries(fields)) {
                const cell = document.createElement('td');
                if (key === '#') {
                    cell.textContent = value;
                } else {
                    cell.setAttribute('data-sort', key);
                    cell.textContent = value;
                }
                row.appendChild(cell);
            }
            tableBody.appendChild(row);

            //Añadir fila nueva a la lista de todas las filas
            allRows.push(row);
        }
    });

    console.log(`Total count of rows in allRows after insertion: ${allRows.length}`);

    if (newRecordCount > 0){
        const totalRecords = initialCount + newRecordCount;
        document.querySelector('#total-count-both').textContent = `Total: ${totalRecords}`;
    }
    
    updateIndividualCounts(allRows);
}

function updateIndividualCounts(allRows) {
    let countRis = 0;
    let countCaldas = 0;

    
    allRows.forEach(row => {
        const grupoCell = row.querySelector('td[data-sort="Grupo"]');
        if (grupoCell) {
            const grupoText = grupoCell.textContent.trim().toUpperCase();
            if (grupoText === "INSP-RIS") {
                countRis++;
            } else if (grupoText === "INSP-CALDAS") {
                countCaldas++;
            }
        }
    });

    document.querySelector('#total-count-ris').textContent = `Risaralda: ${countRis}`;
    document.querySelector('#total-count-caldas').textContent = `Caldas: ${countCaldas}`;

    console.log("Total Risaralda: ", countRis);
    console.log("Total Caldas: ", countCaldas);
}