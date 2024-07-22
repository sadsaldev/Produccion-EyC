export function RowColorsMain(){
    $(document).ready(function(){

        $(document).off('change', '#toggle-colors').on('change', '#toggle-colors', function(e) {
            toggleRowColors(this.checked);
        });

        function toggleRowColors(shouldShowColors) {
            $('table tbody tr').each(function() {
                let $row = $(this);
                let prioridad = $row.find('td[data-sort="Prioridad"]').text().trim();
                let tipoTarea = $row.find('td[data-sort="TipoTarea"]').text().trim();
                
                $row.removeClass('yellow red green dark-green purple brown');
                
                if (!shouldShowColors) {
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