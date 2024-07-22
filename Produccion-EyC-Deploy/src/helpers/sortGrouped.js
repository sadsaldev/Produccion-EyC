export function sortGrouped(){
    $(document).ready(function() {

        sortInspectors('NombreOperario', 'asc');

        $(document).off('change', '.accordion-container #sort').on('change', '.accordion-container #sort', function(e){
            let selectedOption = $(this).val();
            let direction = 'asc';
            $('.sortAsc').addClass('active');
            $('.sortDesc').removeClass('active');
            sortInspectors(selectedOption, direction);
        });

        $(document).off('click', '.accordion-container .sortAsc').on('click', '.accordion-container .sortAsc', function(e){
            console.log('sortAsc clicked');
            $(this).addClass('active');
            $('.sortDesc').removeClass('active');
            let selectedOption = $('#sort').val();
            sortInspectors(selectedOption, 'asc'); // Orden ascendente
        });

        $(document).off('click', '.accordion-container .sortDesc').on('click', '.accordion-container .sortDesc', function(e){
            console.log('sortDesc clicked');
            $(this).addClass('active');
            $('.sortAsc').removeClass('active');
            let selectedOption = $('#sort').val();
            sortInspectors(selectedOption, 'desc'); // Orden descendente
        });

        function sortInspectors(option, direction){
            $('.accordion-item').sort(function(a, b){
                let aValue = $(a).data('inspector-info');
                let bValue = $(b).data('inspector-info');

                // Separar los valores
                let aValues = aValue.split(',');
                let bValues = bValue.split(',');

                // Obtener los valores específicos según la opción seleccionada
                let aComparable = getComparableValue(aValues, option);
                let bComparable = getComparableValue(bValues, option);

                if (typeof aComparable === 'string' && typeof bComparable === 'string'){
                    if (direction === 'asc'){
                        return aComparable.localeCompare(bComparable);
                    } else {
                        return bComparable.localeCompare(aComparable);
                    }
                } else {
                    if (direction === 'asc'){
                        return aComparable - bComparable;
                    } else {
                        return bComparable - aComparable;
                    }
                }
            }).appendTo('.accordion');
        }

        function getComparableValue(values, option){
            if(option === 'NombreOperario'){
                return values[0];
            } else if (option === 'NroOperario'){
                return parseInt(values[1]);
            } else if (option === 'totalInspections'){
                return parseInt (values[2]);
            } else {
                return '';
            }
        }
    });
}