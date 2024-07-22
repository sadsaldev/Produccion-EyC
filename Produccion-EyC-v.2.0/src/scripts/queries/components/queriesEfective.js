import { globalState } from "../../helpers/global";
import { loadMainTable, goBacktoMain } from "./mainTable";
import { loadGroupedTable } from "./groupedTable";
import { exportExcel } from "./exportExcel";
import { getDate } from "../../helpers/getDate";
import { hideBackground, showBackground } from "../../helpers/backgroundHandler";

export async function queriesEfective() {

    if (globalState.user){
        try {
            let response = await $.ajax({
                method : 'POST',
                url : 'http://localhost:4000/api',
                data : { action: 'queriesIndex' },
                xhrFields: {
                    withCredentials: true
                },
            });

            $('#sections-content').html(response);
            await showBackground('#sections-content');

            let currentDate = getDate();

            $('#fecha_inicio').val(currentDate);
            $('#fecha_final').val(currentDate);

            exportExcel();
            loadMainTable();
            loadGroupedTable();
            goBacktoMain();

        } catch(error) {
            console.error("Error al cargar la interfaz de Consultas Efectivas: ", error);
        }
    } 
}