import { logoutUser } from "./sessionManager";
import { deleteCookie } from "../helpers/cookiesHandler";
import { stopInterval } from "../queries/helpers/intervalManager";

export function manualLogout() {
    $('#profile-content').off('click', '#log-out').on('click', '#log-out', async function(e){
        e.preventDefault();

        $('#blur-background').hide();
        $('.profile-container').hide();

        await logoutUser();
        window.location.reload();
    });
}

export function immediateLogoutOnClose(){
    window.addEventListener('unload', function(event){
        if (sessionStorage.getItem('sessionActive') === 'true'){
            navigator.sendBeacon('http://localhost:4000/api', new URLSearchParams({action : 'logOutUser'}));
            deleteCookie('session_token');
            sessionStorage.removeItem('sessionActive');
            sessionStorage.removeItem('sessionToken');
        }
    });
}

export function reloadLogout() {
    window.addEventListener('beforeunload', async function(event) {
        if (sessionStorage.getItem('sessionActive') === 'true') {

            //Solicitud síncrona para evento beforeunload
            navigator.sendBeacon('http://localhost:4000/api', new URLSearchParams({ action : 'logOutUser'}));
            
            deleteCookie('session_token');
            sessionStorage.removeItem('sessionActive');
            sessionStorage.removeItem('sessionToken');

            stopInterval();
        }
    });
}

export function inactivityLogout() {
    let inactivityTimer;
    let visibilityTimer;

    function resetInactivityTimer(){
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(async function(){
            if (sessionStorage.getItem('sessionActive') === 'true') {
                 await logoutUser();
                window.location.reload();
            }
        }, 20 * 60 * 1000);
    }

    function clearVisibilityTimer(){
        clearTimeout(visibilityTimer);
    }

    $(document).on('mousemove keypress', resetInactivityTimer);

    document.addEventListener('visibilitychange', async function() {
        if (document.visibilityState === 'hidden') {
            visibilityTimer = setTimeout(async function(){
                if (sessionStorage.getItem('sessionActive') === 'true') {
                    await logoutUser();
                    window.location.reload();
                }
            }, 20 * 60 * 1000);
        } else {
            clearVisibilityTimer();
        }
    });

    resetInactivityTimer();
}

export function duplicateLogout() {
    window.addEventListener('storage', async function(event){
        if (event.key === 'activeTabID') {
            let currentTabID = sessionStorage.getItem('tabID');
            if (event.newValue !== currentTabID) {
                await logoutUser();
                window.location.reload();
            }
        }
    });
}

