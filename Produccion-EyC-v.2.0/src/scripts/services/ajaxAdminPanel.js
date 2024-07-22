import { hideBackground, showBackground } from "../helpers/backgroundHandler";

export async function ajaxAdminPanel(){
    try {
        let response = await $.ajax({
            url: 'http://localhost:4000/api',
            type: 'POST',
            data: { action : 'adminPanel'},
            xhrFields: {
                withCredentials: true
            },
        });

        await hideBackground('#profile-content .profile-container');
        $('#profile-content .pop-ups-container').show();
        $('#profile-content .admin-panel-container').html(response);
        await showBackground('#profile-content .admin-panel-container');

    } catch (error) {
        console.log('Error al cargar el panel de administrador: ', error);
    }
}