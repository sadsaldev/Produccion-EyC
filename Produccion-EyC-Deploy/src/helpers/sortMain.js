export function sortMain(){
    $(document).ready(function() {
        
        $(document).off('change', '.main-table-content #sort').on('change', '.main-table-content #sort', function(e){
            let selectedOption = $(this).val();
            let currentDirection = 'asc';
            $('.sortAsc').addClass('active');
            $('.sortDesc').removeClass('active');
            sortData(selectedOption, currentDirection);
        });

        $(document).off('click', '.main-table-content .sortAsc').on('click', '.main-table-content .sortAsc', function(e){
            $(this).addClass('active');
            $('.sortDesc').removeClass('active');
            let selectedOption = $('#sort').val();
            sortData(selectedOption, 'asc');
        });

        $(document).off('click', '.main-table-content .sortDesc').on('click', '.main-table-content .sortDesc', function(e){
            $(this).addClass('active');
            $('.sortAsc').removeClass('active');
            let selectedOption = $('#sort').val();
            sortData(selectedOption, 'desc');
        });

        function resetRowNumbers(tableSelector){
            $(tableSelector).find('tbody tr').each(function(index){
                $(this).find('td:first').text(index + 1);
            });
        }

        function sortData(option, direction){
            let tableRows = $('.table1 tbody tr').get();
        
            // Función para convertir una cadena de fecha en formato DD/MM/YYYY, HH:MM:SS a un objeto Date
            function parseDate(dateString) {
                // Dividir la fecha y hora
                let [datePart, timePart] = dateString.split(', ');
                // Dividir la parte de la fecha
                let [day, month, year] = datePart.split('/').map(Number);
                // Dividir la parte de la hora
                let [hours, minutes, seconds] = timePart.split(':').map(Number);
                // Crear y devolver el objeto Date
                return new Date(year, month - 1, day, hours, minutes, seconds);
            }
        
            tableRows.sort(function (a, b) {
                let valueA = $(a).find(`td[data-sort="${option}"]`).text();
                let valueB = $(b).find(`td[data-sort="${option}"]`).text();
        
                if (option === 'NroOperario' || option === 'NroSitio') {
                    // Ordenar por número
                    valueA = parseInt(valueA);
                    valueB = parseInt(valueB);
                    return direction === "asc" ? valueA - valueB : valueB - valueA;
                } else if (option === 'FechaRealInicio' || option === 'FechaRealFin') {
                    // Ordenar por fecha
                    valueA = parseDate(valueA);
                    valueB = parseDate(valueB);
                    return direction === "asc" ? valueA - valueB : valueB - valueA;
                } else {
                    // Ordenar por texto
                    return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                }
            });
        
            $('.table1 tbody').empty().append(tableRows);
            resetRowNumbers('.table1'); // Reiniciar enumeración para .table1
        }
        
    });
}
