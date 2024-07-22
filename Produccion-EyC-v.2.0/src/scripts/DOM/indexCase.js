import { showBackground, hideBackground } from "../helpers/backgroundHandler";

export async function indexCase(){
    $('.row').show();
    $('.row').css({ 'height': '80vh' });

    $('#left-container').show();
    $('#right-container').show();

    $('#blur-background').hide();
    $('#profile-content').hide();
    $('#edit-user-info').hide();

    $('#sections-content').empty();
    $('#sections-content').hide();

    $('#bi-index').empty();
    $('#bi-index').hide();

    $('#login-content').empty();
    $('#login-content').hide();

    $("#main-deco-container").show();
    await showBackground("#title-container");
}