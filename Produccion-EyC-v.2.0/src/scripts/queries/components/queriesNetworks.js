import { hideBackground, showBackground } from "../../helpers/backgroundHandler";
import { globalState } from "../../helpers/global";
import { changeSection } from "../helpers/changeSection";

export async function queriesNetworks(){
    if (globalState.user){
        try {
            let response = await $.ajax({
                method : 'POST',
                url : 'http://localhost:4000/api',
                data : { action: 'networksIndex'},
                xhrFields: {
                    withCredentials: true
                },
            });

            changeSection(null);

            $('#sections-content').html(response);
            await showBackground('#sections-content');

            let currentDate = new Date().toISOString().split('T')[0];
            $('#fecha_recibido').val(currentDate);

            addRow();
            deleteRow();
            clearForm();

        } catch {
            console.error("Error al cargar la interfaz de Consultas para Redes Nuevas: ", error);
        }
    }
} 

function addRow() {
    $(document).off('click','#add-row').on('click','#add-row', function(e){
        e.preventDefault();
        
        let rowCount = $('.networks-input-table tbody tr').length;
        if (rowCount < 20){
            let newRow = '<tr><td><input type="number" class="form-control contract"></td><td><input type="number" class="form-control request"></td></tr>';
            $('.networks-input-table tbody').append(newRow);
        } else {
            window.alert('No se pueden agregar más filas, el límite es de 20.');
        }
    });
}

function deleteRow(){
    $(document).off('click', '#delete-row').on('click', '#delete-row', function(e){
        e.preventDefault();

        let rowCount = $('.networks-input-table tbody tr').length;
        if (rowCount > 1) {
            $('.networks-input-table tbody tr:last').remove();
        } else {
            window.alert('Debe haber por lo menos una fila.');
        }
    });
}

function clearForm(){
    $(document).off('click', '#clear-rows-content').on('click', '#clear-rows-content', function(e){
        e.preventDefault();

        $('.networks-input-table tbody tr').each(function(e){
            $(this).find('input').val('');
        });
    });
}