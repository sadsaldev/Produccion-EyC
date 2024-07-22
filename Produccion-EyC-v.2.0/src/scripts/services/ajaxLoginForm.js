import { showBackground, hideBackground } from "../helpers/backgroundHandler";
import { loginAuth } from "../sessions/loginAuth";

export async function ajaxLogin() {
    try {
        let response = await $.ajax({
            method: 'POST',
            url: 'http://localhost:4000/api',
            data: { action: 'loginForm' }
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

        $('#main-deco-container').show();

        $('#login-content').html(response);
        await showBackground("#login-content");
        loginAuth();

    } catch (error) {
        console.log('Error loading login form:', error);
    }
}
    