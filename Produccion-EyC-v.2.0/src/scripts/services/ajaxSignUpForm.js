import { showBackground, hideBackground } from "../helpers/backgroundHandler";
import { signUpAuth } from "../sessions/signUpAuth";

export async function ajaxSignUp(){
    try {
        let response = await $.ajax({
            method: 'POST',
            url: 'http://localhost:4000/api',
            data: {action: 'signUpForm'}
        });

        $('#left-container').show();
        $('#right-container').show();

        $('#title-container').hide();

        $('#blur-background').hide();
        $('#profile-content').hide();
        $('#edit-user-info').hide();
       
        $('#sections-content').empty();
        $('#sections-content').hide();

        $('.bi-section').empty();
        $('.bi-section').hide();
        
        $('#login-content').html(response);
        await showBackground("#login-content");
        signUpAuth();

    } catch(error) {
        console.error('Error al cargar el formulario de Registro: ', error);
    }
}