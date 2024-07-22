import { globalState } from "../../helpers/global";
import { sortMain } from "../helpers/sortMain";
import { RowColorsMain } from "../helpers/RowColorsMain";
import { hideBackground, showBackground } from "../../helpers/backgroundHandler";
import { getDate } from "../../helpers/getDate";
import { updateRecords } from "./autoUpdateMainTable";
import { startInterval, stopInterval } from "../helpers/intervalManager";
import { changeSection } from "../helpers/changeSection";
import { isSameDate } from "../helpers/isSameDate";

export function loadMainTable(){
    $(document).off('click', '.queries-section #update').on('click', '.queries-section #update', async function(e){
        if(!globalState.user){
            window.alert("No hay una sesión activa");
            return;
        }

        e.preventDefault();
        changeSection('mainTable'); 

        globalState.currentSection = 'mainTable';

        $('.table-container > :not(.loader-container)').hide();
        $('.loader-container').show();

        let fecha_inicio = $('#fecha_inicio').val();
        let fecha_final  = $('#fecha_final').val();
        let opcion       = $('#opc').val();
        let lastQueryTime = getDate();

        if (fecha_inicio && fecha_final && opcion){
            // Validar que la fecha de inicio no sea mayor que la fecha final
            if (fecha_inicio > fecha_final) {
                window.alert('La fecha inicial no puede ser mayor a la fecha final. Por favor selecciona un rango válido.');
                return;
            } else {
                try {
                    let html_response = await $.ajax({
                        type: 'POST',
                        url: 'http://localhost:4000/api',
                        data: {
                            fecha_inicio: fecha_inicio, 
                            fecha_final: fecha_final, 
                            opcion: opcion,
                            action: 'mainTable',
                            ajax: true
                        },
                        dataType: 'html',
                        xhrFields: {
                            withCredentials: true
                        },
                    });

                    $('.main-table-container').html(html_response);
                    $('.loader-container').hide();
                    await showBackground('.main-table-container');

                    if (isSameDate(fecha_final, lastQueryTime)){
                        const updateCallback = async () => {
                            if (globalState.currentSection === 'mainTable') {
                                lastQueryTime = await updateRecords(opcion, lastQueryTime);
                                sortMain();
                                RowColorsMain();
                            }
                        };
                        startInterval(updateCallback, 60000);
                    } else {
                        console.log("No se ejecuta el intervalo porque la fecha final no coincide con la fecha actual.");
                    }

                    sortMain();
                    RowColorsMain();

                } catch (error){
                    console.error("Error al cargar la tabla de inspecciones: ", error);
                    $('.loader-container').hide();
                    await showBackground('.index-placeholder');
                } 
            }

        } else {
            window.alert("Por favor completa todos los campos del formulario.");
            return;
        }

    });
}

export function goBacktoMain(){
    $(document).off('click', '.queries-section #go-back').on('click', '.queries-section #go-back', function(e){
        changeSection(null);
        loadMainTable();
    });
}