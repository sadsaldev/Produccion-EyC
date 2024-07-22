import { profileEvents } from "./profileEvents"; 
import { mainLogout } from "./logoutMain";
import { loginUser } from "./sessionManager";

export function loginAuth(){

    const regex = /^\d+$/;

    $(document).on('input', '.login-container #cedula', function(e){
        let cedula = $(this).val();

        if (!regex.test(cedula)){
            $('#loginResult').show().html("La cédula solo puede contener números.");
            $('#sub-login').prop('disabled', true);
        } else {
            $('#sub-login').prop('disabled', false);
            $('#loginResult').hide();
        }
    });
    
    $(document).off('click', '.login-container #sub-login').on('click', '.login-container #sub-login', async function(e){
        console.log('submit login button clicked');
        e.preventDefault();

        let cedula = $('.login-container #cedula').val();
        let password = $('.login-container #password').val();

        if(cedula === '' || password === ''){
            $('#loginResult').show().html('Debes completar todos los campos del formulario.');
            return; //salir de la función si algún campo está vacío
        }

        if (!regex.test(cedula)) {
            $('#loginResult').show().html("La cédula solo puede contener números.");
            return;
        }

        let hashedPassword = sha256(password);
        let loginSuccessful = await loginUser(cedula, hashedPassword);
        if (loginSuccessful) {
            profileEvents();
            mainLogout();

            $('.navelement#index-link').click();
        }
    });
};