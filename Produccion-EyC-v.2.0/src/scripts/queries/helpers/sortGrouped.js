export function sortGrouped(){
    $(document).ready(function() {

        sortInspectors('NombreOperario', 'asc');

        $(document).off('change', '.accordion-container #sort2').on('change', '.accordion-container #sort2', function(e){
            let selectedOption = $(this).val();
            let direction = 'asc';
            $('.sortAsc2').addClass('active');
            $('.sortDesc2').removeClass('active');
            sortInspectors(selectedOption, direction);
        });

        $(document).off('click', '.accordion-container .sortAsc2').on('click', '.accordion-container .sortAsc2', function(e){
            $(this).addClass('active');
            $('.sortDesc2').removeClass('active');
            let selectedOption = $('#sort2').val();
            sortInspectors(selectedOption, 'asc'); // Orden ascendente
        });

        $(document).off('click', '.accordion-container .sortDesc2').on('click', '.accordion-container .sortDesc2', function(e){
            $(this).addClass('active');
            $('.sortAsc2').removeClass('active');
            let selectedOption = $('#sort2').val();
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