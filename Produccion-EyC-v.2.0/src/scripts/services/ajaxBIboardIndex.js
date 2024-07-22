import { showBackground, hideBackground } from "../helpers/backgroundHandler";

export async function ajaxBIboardIndex(){
    try {
        let response = await $.ajax({
            method: 'POST',
            url: 'http://localhost:4000/api',
            data: { action: 'BIboardIndex'},
            xhrFields: {
                withCredentials: true
            },
        });

        $('#left-container').hide();
        $('#right-container').hide();

        $('#blur-background').hide();
        $('#profile-content').hide();
        $('#edit-user-info').hide();

        $('#title-container').hide();
        $('#main-deco-container').hide();
        $('#login-content').hide();

        $('#sections-content').empty();
        $('#sections-content').hide();

        $('#bi-index').html(response);
        await showBackground("#bi-index");

    } catch (error) {
        console.error('Error al cargar el Tablero de PowerBi: ', error);
    }
}