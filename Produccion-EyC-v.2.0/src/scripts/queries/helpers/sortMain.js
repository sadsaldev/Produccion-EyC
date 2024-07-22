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
            let selectedDepartment = $('.queries-viewer-container #opc').val(); 

            if (selectedDepartment === 'both') {
                let tableRows = $('.table3 tbody tr').get();
                tableRows.sort(function (a, b) {
                    let valueA = $(a).find(`td[data-sort="${option}"]`).text();
                    let valueB = $(b).find(`td[data-sort="${option}"]`).text();
                    
                    if (option === 'NroOperario' || option === 'NroSitio'){
                        valueA = parseInt(valueA);
                        valueB = parseInt(valueB);
                        
                        return direction === "asc" ? valueA - valueB : valueB - valueA;
                    } else {
                        return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    }
                });

                $('.table3 tbody').empty().append(tableRows);
                resetRowNumbers('.table3'); //reiniciar enumeración para .table3
            } else {
                
                let tableRows = $('.table1 tbody tr').get();
                tableRows.sort(function (a, b) {
                    let valueA = $(a).find(`td[data-sort="${option}"]`).text();
                    let valueB = $(b).find(`td[data-sort="${option}"]`).text();

                    if (option === 'NroOperario' || option === 'NroSitio'){
                        valueA = parseInt(valueA);
                        valueB = parseInt(valueB);

                        return direction === "asc" ? valueA - valueB : valueB - valueA;
                    } else {
                        return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    }
                });

                $('.table1 tbody').empty().append(tableRows);
                resetRowNumbers('.table1'); //reiniciar enumeración para .table1
            }
        }
    });
}
