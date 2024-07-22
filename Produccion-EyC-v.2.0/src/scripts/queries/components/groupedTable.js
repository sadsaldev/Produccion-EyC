import { globalState } from "../../helpers/global";
import { sortGrouped } from "../helpers/sortGrouped";
import { RowColorsGrouped } from "../helpers/RowColorsGrouped";
import { accordionToggle } from "../helpers/accordionToggle";
import { hideBackground, showBackground } from "../../helpers/backgroundHandler";
import { getDate } from "../../helpers/getDate";
import { updateRecords } from "./autoUpdateGroupedTable";
import { startInterval, stopInterval } from "../helpers/intervalManager";
import { changeSection } from "../helpers/changeSection";
import { isSameDate } from "../helpers/isSameDate";

export function loadGroupedTable(){

    $(document).off('click', '.queries-section #view-grouped-table').on('click', '.queries-section #view-grouped-table', async function(e){
        if(!globalState.user){
            window.alert("No hay una sesión activa");
            return;
        }
        
        e.preventDefault();
        changeSection('groupedTable'); 

        $('.table-container > :not(.loader-container)').hide();
        $('.loader-container').show();

        let fecha_inicio = $('#fecha_inicio').val();
        let fecha_final = $('#fecha_final').val();
        let opcion = $('#opc').val();
        let lastQueryTime = getDate();

        try {
            let html_response = await $.ajax({
                type: 'POST',
                url: 'http://localhost:4000/api',
                data: {
                    fecha_inicio: fecha_inicio, 
                    fecha_final: fecha_final, 
                    opcion: opcion,
                    ajax: true,
                    action: 'groupedTable' 
                },
                dataType: 'html',
                xhrFields: {
                    withCredentials: true
                },
            });

            $('.grouped-container').html(html_response);
            $('.loader-container').hide();
            await showBackground('.grouped-container');

            
            if (isSameDate(fecha_final, lastQueryTime)){
                const updateCallback = async () => {
                    if (globalState.currentSection === 'groupedTable') {
                        lastQueryTime = await updateRecords(opcion, lastQueryTime);
                        sortGrouped();
                        RowColorsGrouped();
                        accordionToggle();
                    }
                };
                startInterval(updateCallback, 60000);
            } else {
                console.log("No se ejecuta el intervalo porque la fecha final no coincide con la fecha actual.");
            }

            sortGrouped();
            RowColorsGrouped();
            accordionToggle();

        } catch (error) {
            console.error("Error al cargar la tabla agrupada por inspector: ", error);
            $('.loader-container').hide();
        }
    });
}