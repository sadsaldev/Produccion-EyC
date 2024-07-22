import { setCookie, deleteCookie } from "../helpers/cookiesHandler";
import { generateUniqueId } from "../helpers/uniqueID";
import { globalState } from "../helpers/global";

export async function checkSession(){
    try {
        let data = await $.ajax({
            url : 'http://localhost:4000/api',
            type : 'POST',
            data : { action: 'checkSession' },
            xhrFields: {
                withCredentials: true
            },
        });

        let userData = JSON.parse(data);

        if(userData.session_active){

            let sessionToken = userData.session_token;
            let sessionID = userData.session_id;
            let userID = userData.session_userid;
            let userRole = userData.session_role;

            globalState.user = {
                sessionToken: sessionToken,
                sessionID: sessionID,
                userID: userID,
                userRole: userRole
            };

            console.log("Datos del usuario:", globalState.user);

            setCookie('session_token', sessionToken, 1);
            sessionStorage.setItem('sessionActive', 'true');
            sessionStorage.setItem('sessionToken', sessionToken);

            $('.flex-navbar-menu #login-navelement').hide();
            $('.flex-navbar-menu #signup-navelement').hide();
        
            $('.navbar-menu #login-navelement').hide();
            $('.navbar-menu #signup-navelement').hide();
            
            $('.flex-navbar-menu #profile-navelement').show();
            $('.navbar-menu #profile-navelement').show();

            console.log('Sesión activa');
            
         } else {
            logoutUser();
        }
    } catch (error){
        console.error('Error al verificar la sesión: ', error);
    }
}


export async function loginUser(cedula, hashedPassword){
    try {
        console.log("Iniciando sesión con cédula: ", cedula);
        let html_response = await $.ajax({
            method: 'POST',
            url: 'http://localhost:4000/api',
            data: {
                cedula: cedula,
                password: hashedPassword,
                action: 'loginUser' 
            },
            xhrFields: {
                withCredentials: true
            },
        });

        console.log("Respuesta del servidor: ", html_response);

        $('#loginResult').show().html(html_response);
                
        if(html_response === 'Inicio de sesión exitoso.'){

            await checkSession();

            let tabID = generateUniqueId();
            sessionStorage.setItem('tabID', tabID);
            localStorage.setItem('activeTabID', tabID);
    
            return true;
                
        } else {
            $('#loginResult').show().html(html_response);
            return false;
        }

    } catch (error){
        console.error('Error en el proceso de inicio de sesión:', error);
        $('#loginResult').show().html("Error al iniciar sesión, inténtalo de nuevo.");
        return false;
    }
}

export async function logoutUser() {
    try {
        let response = await $.ajax({
            url: 'http://localhost:4000/api',
            type: 'POST',
            data: { action: 'logOutUser' },
            xhrFields: {
                withCredentials: true
            },
        });

        globalState.user = null;

        deleteCookie('session_token');

        sessionStorage.removeItem('sessionActive');
        sessionStorage.removeItem('sessionToken');

        sessionStorage.removeItem('tabID');
        localStorage.removeItem('activeTabID');

        localStorage.removeItem('initialSessionStarted');
        localStorage.setItem('logoutEvent', Date.now());
        
        console.log('Sesión cerrada con éxito: ', response);

    } catch (error) {
        console.log('Error al cerrar sesión:', error);
    }

    $('.flex-navbar-menu #login-navelement').show();
    $('.flex-navbar-menu #signup-navelement').show();

    $('.navbar-menu #login-navelement').show();
    $('.navbar-menu #signup-navelement').show();
              
    $('.flex-navbar-menu #profile-navelement').hide();
    $('.navbar-menu #profile-navelement').hide();
}