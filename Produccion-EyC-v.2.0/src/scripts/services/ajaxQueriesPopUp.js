import { queriesMain } from "../queries/components/queriesMain";
import { hideBackground, showBackground } from "../helpers/backgroundHandler";

export async function ajaxQueriesPopUp(){
    try {
        let response = await $.ajax({
            method: 'POST',
            url: 'http://localhost:4000/api',
            data: { action: 'queriesPopUp' },
            xhrFields: {
                withCredentials: true
            },
        });

        await hideBackground('#blur-background-2');
        $('#profile-content').html(response);
        await showBackground('#blur-background');
        $('#profile-content').show();

        queriesMain();

    } catch(error) {
        console.error('Error al cargar la ventana de Consultas: ', error);
    }
}