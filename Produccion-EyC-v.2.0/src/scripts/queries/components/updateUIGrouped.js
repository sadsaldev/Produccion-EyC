//Función para actualizar el UI del acordeón
export function updateUI(newRecords){
    //Obtener la referencia al acordeón
    const accordion = document.getElementById('accordionExample');
    newRecords.forEach(record => {
        const inspectorName = record.NombreOperario;
        const inspectorID = record.NroOperario;
        const inspectorKey = `${inspectorName.replace(/ /g, '_')}_${inspectorID}`;
        const panelID = `collapse${inspectorKey}`;
        const btnID = `btn${inspectorKey}`;
        const inspectorInfo = `${inspectorName}, ${inspectorID}, 1`;

        //Buscar si ya existe un panel para este inspector
        let panelExists = document.querySelector(`.accordion-item[data-inspector-info*="${inspectorName}, ${inspectorID}"]`);

        if(!panelExists){
            //Crear un nuevo panel
            panelExists = document.createElement('div');
            panelExists.classList.add('accordion-item');
            panelExists.setAttribute('data-inspector-info', inspectorInfo);

            //Crear el botón del acordeón
            const buttonHTML = `
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" id="${btnID}" type="button" data-bs-toggle="collapse" data-bs-target="#${panelID}" aria-expanded="false" aria-controls="${panelID}">
                        <p class="insp-data">${inspectorName} - ${inspectorID}</p>
                        <p class="each-counter">(0)</p><p></p>
                    </button>
                </h2>
            `;

            panelExists.innerHTML = buttonHTML;

            //Crear el cuerpo del acordeón
            const accordionBody = document.createElement('div');
            accordionBody.classList.add('accordion-collapse', 'collapse');
            accordionBody.id = panelID;
            accordionBody.setAttribute('data-bs-parent', '#accordionExample');

            const tableHTML = `
                <div class="accordion-body">
                    <table class="table2">
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
                        <tbody></tbody>
                    </table>
                </div>
            `;

            accordionBody.innerHTML = tableHTML;
            //Añadir el cuerpo al panel
            panelExists.appendChild(accordionBody);
            //Añadir el panel al acordeón
            accordion.appendChild(panelExists);
        }

        //Verificar si la inspección ya existe en el panel
        const tbody = panelExists.querySelector('tbody');
        const existingRows = Array.from(tbody.querySelectorAll('tr'));
        const isInspectionExist = existingRows.some(row => {
            const cells = row.querySelectorAll('td');
            return cells[3]?.innerText === record.FechaRealFin && 
                   cells[4]?.innerText === record.NroSitio;
        });

        if (!isInspectionExist){
            //Crear una nueva fila de inspección
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td data-counter="${existingRows.length + 1}">${existingRows.length + 1}</td>
                <td data-sort="Direccion">${record.Direccion}</td>
                <td data-sort="FechaRealInicio">${record.FechaRealInicio}</td>
                <td data-sort="FechaRealFin">${record.FechaRealFin}</td>
                <td data-sort="NroSitio">${record.NroSitio}</td>
                <td data-sort="TipoTarea">${record.TipoTarea}</td>
                <td data-sort="Prioridad">${record.Prioridad}</td>
                <td data-sort="Cierre3">${record.Cierre3}</td>
                <td data-sort="duracion">${record.duracion}</td>
            `;

            //Añadir la nueva fila al tbody
            tbody.appendChild(newRow);

            //Actualizar el contador de inspecciones
            const counter = panelExists.querySelector('.each-counter');
            if (counter){
                const currentCount = parseInt(counter.innerText.replace(/[()]/g, '')) || 0;
                counter.innerText = `(${currentCount + 1})`;
            } else {
                console.error(`No se encontró el contador para el inspector ${inspectorName}`);
            }
        }
    });
}