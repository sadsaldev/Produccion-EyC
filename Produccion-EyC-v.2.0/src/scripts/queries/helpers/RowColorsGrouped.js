export function RowColorsGrouped(){
    $(document).ready(function(){

        $(document).off('change', '#toggle-colors-g').on('change', '#toggle-colors-g', function(e) {
            let shouldShowColors = this.checked;
            applyColorsToAccordionTables(shouldShowColors);
        });

        $(document).on('shown.bs.collapse', '.accordion-collapse', function() {
            let shouldShowColors = $('#toggle-colors-g').is(':checked');
            applyColorsToAccordionTables(shouldShowColors);
        });

        function applyColorsToAccordionTables(shouldShowColors) {
            $('.accordion .accordion-body .table2 tbody tr').each(function(){
                let $row = $(this);
                let prioridad = $row.find('td[data-sort="Prioridad"]').text().trim();
                let tipoTarea = $row.find('td[data-sort="TipoTarea"]').text().trim();

                $row.removeClass('yellow red green purple brown');

                if (!shouldShowColors){
                    return;
                }
                
                if (prioridad === "Media") {
                    $row.toggleClass('yellow');
                } else if (prioridad === "Alta") {
                    $row.toggleClass('red');
                } else if (prioridad === "Baja") {
                    $row.toggleClass('green');
                } else if (prioridad === "N MASIVA") {
                    $row.toggleClass('dark-green');
                } else if (prioridad === "Prioridad") {
                    $row.toggleClass('brown');
                } else if (prioridad === "60 Meses"){
                    $row.toggleClass('purple');
                } else if (prioridad === "2da visita"){
                    $row.toggleClass('peach');
                }
            });
        }      
    });
}